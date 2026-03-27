# ArtistConnect — Design Spec

**Date:** 2026-03-27
**Status:** Approved

---

## Overview

ArtistConnect is a web-based social media platform for artists and musicians to connect, collaborate, showcase their work, and sell their art. Users can create individual or group profiles, search for collaborators, list work for sale (digital or physical), and signal their availability for hire, collaboration, or joining groups.

---

## Architecture

**Stack:**
- **Frontend + API:** Next.js 14 (App Router) — SSR for SEO on artist/profile pages, API routes for backend logic
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js — email/password + Google/Facebook OAuth
- **File Storage:** Cloudinary (images, audio, digital files)
- **Real-time Messaging:** Socket.io
- **Payments:** Stripe Connect — handles seller payouts and platform transaction fees
- **Deployment:** Vercel (frontend/API) + Supabase or Railway (PostgreSQL)

**Architecture style:** Modular monolith — single Next.js codebase with clean internal module boundaries. Services can be extracted later if scale demands it.

**Internal modules:**
- `auth` — registration, login, sessions
- `profiles` — individual and group pages, availability status
- `feed` — posts, follows, activity
- `marketplace` — listings, orders, physical/digital items
- `messaging` — direct messages between users
- `search` — artist/group discovery, collab search

---

## Data Models

**User**
- email, password hash, OAuth provider, role (`individual | group_admin | member`)

**Profile**
- linked to User; name, bio, artist type (musician, painter, photographer, etc.), avatar, banner
- availability status: `available_for_hire | open_to_collab | open_to_join | not_available`
- social links

**Group**
- name, description, members (many-to-many with Profile), admin

**Post**
- author (Profile), content text, media attachments, timestamp
- drives the home feed

**Listing**
- seller (Profile), title, description, price
- type: `digital | physical`
- media files, stock quantity (physical), download file (digital)
- status: `active | sold | draft`

**Order**
- buyer, listing, amount, platform fee, Stripe payment intent ID
- status: `pending | paid | shipped | complete | refunded`

**Message**
- sender, recipient, content, timestamp, read flag

**Follow**
- follower Profile → followed Profile or Group

---

## Key User Flows

**Onboarding**
Sign up (email or OAuth) → choose profile type (individual or group) → fill out profile (artist type, bio, availability status) → land on feed.

**Feed**
Chronological feed of followed accounts. Artists post updates, new listings, or media. No algorithm for MVP.

**Discovery & Collab Search**
Search by artist type, name, availability status, or location. Filter by `open_to_collab`, `available_for_hire`, `open_to_join`. Profile cards show key info at a glance.

**Marketplace — Selling**
Create listing → upload media/files → set price and type (digital or physical) → publish.
- Digital listings auto-deliver download link on payment.
- Physical listings require seller to mark as shipped.

**Marketplace — Buying**
Browse or land on a listing → Stripe Checkout → order created.
- Digital: instant download link delivered.
- Physical: seller notified, ships item, marks complete.
- Platform fee deducted via Stripe Connect on payout.

**Messaging**
Initiated from any profile page. Real-time via Socket.io. Inbox shows conversation threads.

---

## Project Structure

```
limel8/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, register pages
│   ├── (main)/                 # Authenticated app shell
│   │   ├── feed/               # Home feed
│   │   ├── search/             # Artist/collab discovery
│   │   ├── profile/[id]/       # Individual & group profiles
│   │   ├── marketplace/        # Browse listings
│   │   ├── listings/[id]/      # Single listing page
│   │   └── messages/           # Inbox + conversations
│   └── api/                    # API routes
│       ├── auth/               # NextAuth handlers
│       ├── profiles/
│       ├── posts/
│       ├── listings/
│       ├── orders/
│       ├── messages/
│       └── search/
├── lib/                        # Shared utilities
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # NextAuth config
│   ├── stripe.ts               # Stripe client
│   └── cloudinary.ts           # File upload helpers
├── modules/                    # Business logic by domain
│   ├── auth/
│   ├── profiles/
│   ├── feed/
│   ├── marketplace/
│   ├── messaging/
│   └── search/
├── components/                 # Shared UI components
├── prisma/
│   └── schema.prisma           # DB schema
└── public/
```

---

## Monetization

eBay-style transaction fee model: platform takes a percentage cut of each sale via Stripe Connect. Exact fee percentage to be determined. Additional monetization (subscriptions, featured listings) deferred to a later version.

---

## Out of Scope (MVP)

- Video upload/streaming
- Mobile app
- Algorithm-based feed ranking
- Analytics dashboard
- Premium/subscription tiers
