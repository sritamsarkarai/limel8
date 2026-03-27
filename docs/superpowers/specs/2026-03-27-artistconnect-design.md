# ArtistConnect — Design Spec

**Date:** 2026-03-27
**Status:** Draft

---

## Overview

ArtistConnect is a web-based social media platform for artists and musicians to connect, collaborate, showcase their work, and sell their art. Users create an individual profile, can create/join groups, search for collaborators, list work for sale (digital or physical), and signal their availability for hire, collaboration, or joining groups.

---

## Architecture

**Stack:**
- **Frontend + API:** Next.js 14 (App Router) — SSR for SEO on artist/profile pages, API routes for backend logic
- **Database:** PostgreSQL via Supabase; RLS enabled on sensitive tables
- **ORM:** Prisma with `@next-auth/prisma-adapter`
- **Auth:** NextAuth.js (database session strategy) — email/password + Google/Facebook OAuth
- **File Storage:** Cloudinary — signed upload presets; digital download files stored as `authenticated` resource type (private)
- **Real-time Messaging:** Supabase JS client Realtime — subscribes to `messages` table using anon key + NextAuth session JWT as Supabase auth token. RLS on `messages` ensures users can only receive their own messages. Prisma handles all writes.
- **Payments:** Stripe Connect (Express accounts) — seller onboarding, payouts, platform fee collection
- **Email:** Resend — transactional emails
- **Background Jobs:** Vercel Cron Jobs — daily job to auto-complete shipped orders older than 7 days
- **Deployment:** Vercel (Next.js app + cron) + Supabase (database + realtime)

**Architecture style:** Modular monolith — single Next.js codebase with clean internal module boundaries.

**Internal modules:**
- `auth` — registration, login, sessions
- `profiles` — individual and group pages, availability status
- `feed` — posts, follows, activity
- `marketplace` — listings, orders, physical/digital items
- `messaging` — direct messages between users
- `search` — artist/group discovery, collab search

---

## Data Models

**User** (NextAuth-managed via `@next-auth/prisma-adapter`)
- email, password hash, OAuth provider/account info
- owns exactly one `Profile` (created at registration)
- Standard NextAuth tables: `Account`, `Session`, `VerificationToken`

**Profile**
- linked 1:1 to User
- name, bio, artist type (musician, painter, photographer, digital artist, etc.)
- avatar (max 5MB, images only), banner image
- location: free-text string (e.g. "New York, USA")
- availability status: `available_for_hire | open_to_collab | open_to_join | not_available`
- social links: Instagram, Spotify, SoundCloud, YouTube, personal website (5 nullable string columns)
- `stripe_account_id` (nullable) — set after Stripe Express Connect onboarding

**Group**
- name, description, banner image
- admin: Profile (FK)
- members: many-to-many join table (Profile ↔ Group)
- Created by an existing user (creator becomes admin); not a separate account type
- A user can admin/be a member of multiple groups

**Post**
- polymorphic author: `profile_id` (nullable FK → Profile) + `group_id` (nullable FK → Group), CHECK constraint ensures exactly one is non-null
- content text, media attachments (images max 5MB, audio max 50MB), timestamp

**Listing**
- seller: Profile (FK) — only individual profiles can sell in v1
- title, description, price
- type: `digital | physical`
- preview media (images max 5MB, audio max 50MB)
- `cloudinary_download_id` (nullable string) — Cloudinary `authenticated` resource ID; only for `digital` type; max 200MB; download URL is generated on-demand at request time, never stored
- stock quantity (nullable integer) — only for `physical` type
- status: `active | sold | draft`
- constraint: cannot be set to `active` unless seller's `stripe_account_id` is non-null

**Order**
- buyer: Profile (FK)
- listing: Listing (FK)
- amount (total paid by buyer)
- platform\_fee (10% of amount — `PLATFORM_FEE_PERCENT` constant)
- seller\_payout (amount − platform\_fee)
- stripe\_payment\_intent\_id
- shipping\_address: JSON (collected at Stripe Checkout; required for `physical` type only)
- status: `pending | paid | shipped | complete | refunded`

**Order Status State Machine:**

| Transition | Trigger | Actor |
|---|---|---|
| → `pending` | Order record created at checkout start | System |
| `pending` → `paid` | Stripe `payment_intent.succeeded` webhook | System (webhook) |
| `paid` → `shipped` | Seller marks as shipped (physical only) | Seller |
| `shipped` → `complete` | Buyer confirms OR Vercel Cron auto-completes after 7 days | Buyer / Cron |
| `paid` → `complete` | Digital order — auto-completes immediately on payment | System (webhook) |
| any → `refunded` | Admin or Stripe refund | Admin |

**Stock decrement rule (physical listings):**
- Stock is decremented within a DB transaction on the `payment_intent.succeeded` webhook
- Transaction checks `stock_quantity > 0` before decrement; rejects and triggers refund if not
- Listing auto-set to `sold` when `stock_quantity` reaches 0

**Message**
- sender: Profile (FK)
- recipient: Profile (FK)
- content text, timestamp
- read: boolean — set `true` when recipient opens the conversation thread
- RLS policy: users can only select rows where `sender_id = auth.uid()` OR `recipient_id = auth.uid()`

**Follow**
- follower: Profile (FK)
- polymorphic followed: `followed_profile_id` (nullable FK → Profile) + `followed_group_id` (nullable FK → Group), CHECK constraint ensures exactly one is non-null

---

## Routing

Profile and Group pages share the `/profile/[id]` route using a type-prefixed ID:
- Individual profiles: `/profile/p_<uuid>`
- Groups: `/profile/g_<uuid>`

The page parses the prefix to determine entity type and renders `IndividualProfileView` or `GroupProfileView`.

---

## Key User Flows

**Onboarding**
Sign up (email or OAuth) → individual Profile always created first → fill out profile (artist type, bio, location, availability status) → land on feed. Groups are created later from the user's profile dashboard.

**Feed**
Chronological Posts from followed Profiles and Groups. No algorithm for MVP.

**Discovery & Collab Search**
Search by name, artist type, availability status, or location (free-text match). Filter by `open_to_collab`, `available_for_hire`, `open_to_join`. Returns individual profiles only in v1.

**Availability & Collaboration (MVP scope)**
Availability is a status badge on a profile. "Collaboration" at MVP means: (a) setting an availability status, and (b) being discoverable via search. No join-request mechanic — users connect via direct messaging.

**Marketplace — Selling**
Seller completes Stripe Express onboarding (prompted on first publish attempt) → create listing → upload preview media and (for digital) download file → set price and type → publish.

**Marketplace — Buying**
Browse listing → Stripe Checkout (shipping address collected for physical) → Order created as `pending` → Stripe webhook fires → Order moves to `paid` → digital: auto-completes, buyer sees freshly-signed download link on confirmation page and receives email; physical: seller notified via email.

**Digital Download Access**
Signed Cloudinary URL generated on-demand from `cloudinary_download_id` on the Order. Available on the order confirmation page and emailed to buyer. Regenerable from the buyer's order history for 30 days post-purchase.

**Messaging**
Initiated from any profile page. Real-time delivery via Supabase Realtime (RLS-secured subscription). Inbox shows conversation threads sorted by latest message. Messages marked `read = true` when recipient opens the thread.

**Profile Pages**
- `IndividualProfileView`: bio, artist type, location, availability status, social links, posts, listings
- `GroupProfileView`: name, description, member list, admin, posts (groups do not sell in v1)

---

## Email Triggers (via Resend)

| Event | Recipient |
|---|---|
| Order placed | Buyer (confirmation), Seller (new order notification) |
| Digital order paid | Buyer (download link) |
| Physical order shipped | Buyer (shipping notification) |
| New direct message | Recipient (always; no presence detection in v1) |

---

## Project Structure

```
limel8/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, register pages
│   ├── (main)/                 # Authenticated app shell
│   │   ├── feed/               # Home feed
│   │   ├── search/             # Artist/collab discovery
│   │   ├── profile/[id]/       # Individual & group profiles (p_ / g_ prefix)
│   │   ├── marketplace/        # Browse listings
│   │   ├── listings/[id]/      # Single listing page
│   │   └── messages/           # Inbox + conversations
│   └── api/                    # API routes
│       ├── auth/               # NextAuth handlers
│       ├── profiles/
│       ├── posts/
│       ├── listings/
│       ├── orders/
│       │   └── webhook/        # Stripe webhook handler
│       ├── messages/
│       ├── search/
│       └── cron/
│           └── auto-complete-orders/   # Vercel Cron — daily, auto-completes 7-day+ shipped orders
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # NextAuth config + prisma adapter
│   ├── stripe.ts               # Stripe client; PLATFORM_FEE_PERCENT = 10
│   ├── cloudinary.ts           # Signed upload presets; on-demand download URL generation
│   ├── supabase.ts             # Supabase Realtime client (messaging only)
│   └── resend.ts               # Email helpers
├── modules/
│   ├── auth/
│   ├── profiles/
│   ├── feed/
│   ├── marketplace/
│   ├── messaging/
│   └── search/
├── components/                 # Shared UI components
├── prisma/
│   └── schema.prisma
└── public/
```

---

## Monetization

Platform takes **10%** of each sale via Stripe Connect Express (deducted at payout). Fee percentage exported as `PLATFORM_FEE_PERCENT` constant from `lib/stripe.ts`.

---

## Implementation Notes (resolve before touching affected modules)

1. **Supabase Realtime + NextAuth JWT:** NextAuth JWTs are not Supabase JWTs. Before building the messaging module, decide the bridge strategy — either sign Supabase JWTs using the same secret as NextAuth, or exchange the session for a Supabase JWT server-side before passing to the client.
2. **Digital download 30-day window:** Enforce in the `/api/orders/[id]/download` API route. Return 403 if `order.createdAt` is older than 30 days. Cloudinary signed URL TTL should be set shorter than 30 days (e.g., 1 hour) to prevent link sharing.
3. **Cron security:** Secure `/api/cron/auto-complete-orders` with a `CRON_SECRET` env var checked against the `Authorization` header per Vercel's recommended pattern.
4. **Profile/Group ID prefix:** Store a `entityType: 'profile' | 'group'` discriminator on the URL — compose the `p_` / `g_` prefix at the API/render layer from the DB UUID + discriminator. Do not store the prefix in the database.
5. **Password hashing:** Use `bcryptjs` in the NextAuth Credentials provider. Hash on registration, compare on login. The `@next-auth/prisma-adapter` does not handle this.

---

## Out of Scope (MVP)

- Video upload/streaming
- Mobile app
- Algorithm-based feed ranking
- Analytics dashboard
- Premium/subscription tiers
- Collaboration workspaces or join-request flows
- Group search or group marketplace (v1: individual profiles only in search and selling)
- Real-time presence / online status indicators
