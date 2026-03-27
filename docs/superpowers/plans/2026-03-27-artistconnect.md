# ArtistConnect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a social + marketplace web platform for artists and musicians — profiles, groups, feed, collab search, direct messaging, and an eBay-style marketplace with subscription fee waivers.

**Architecture:** Modular monolith — Next.js 14 App Router with API routes as the backend. Clean module boundaries under `modules/` with shared infrastructure in `lib/`. Database via Supabase (PostgreSQL + Realtime), Prisma as ORM.

**Tech Stack:** Next.js 14, TypeScript, Prisma, Supabase (PostgreSQL + Realtime), NextAuth.js + `@next-auth/prisma-adapter`, Stripe Connect (Express) + Stripe Billing, Cloudinary, Resend, bcryptjs, Tailwind CSS, Vercel (deployment + cron)

---

## File Map

### Infrastructure / Config
- Create: `prisma/schema.prisma` — full DB schema (all models)
- Create: `lib/db.ts` — singleton Prisma client
- Create: `lib/auth.ts` — NextAuth config, Credentials + Google + Facebook providers, prisma adapter
- Create: `lib/stripe.ts` — Stripe client, `MARKETPLACE_FEE_PERCENT = 10`, `MARKETPLACE_FEE_THRESHOLD = 200`
- Create: `lib/cloudinary.ts` — signed upload preset helper, on-demand authenticated download URL generator
- Create: `lib/supabase.ts` — Supabase Realtime client (messaging subscriptions only)
- Create: `lib/resend.ts` — typed email send helpers
- Create: `.env.local.example` — all required env vars documented
- Create: `vercel.json` — cron job config

### Auth Module
- Create: `modules/auth/register.ts` — create User + Profile in a transaction, hash password with bcryptjs
- Create: `app/(auth)/register/page.tsx` — registration form
- Create: `app/(auth)/login/page.tsx` — login form
- Create: `app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- Create: `app/api/auth/register/route.ts` — POST /api/auth/register

### Profiles Module
- Create: `modules/profiles/queries.ts` — getProfileById, getProfileByUserId
- Create: `modules/profiles/mutations.ts` — updateProfile, createGroup, addGroupMember
- Create: `app/(main)/profile/[id]/page.tsx` — renders IndividualProfileView or GroupProfileView based on `p_` / `g_` prefix
- Create: `components/profiles/IndividualProfileView.tsx`
- Create: `components/profiles/GroupProfileView.tsx`
- Create: `components/profiles/AvailabilityBadge.tsx`
- Create: `app/api/profiles/[id]/route.ts` — GET, PATCH
- Create: `app/api/groups/route.ts` — POST (create group)
- Create: `app/api/groups/[id]/members/route.ts` — POST (join), DELETE (leave)

### Feed Module
- Create: `modules/feed/queries.ts` — getFeedForUser (posts from followed profiles + groups, chronological)
- Create: `modules/feed/mutations.ts` — createPost, deletePost
- Create: `app/(main)/feed/page.tsx` — home feed
- Create: `components/feed/PostCard.tsx`
- Create: `components/feed/PostComposer.tsx`
- Create: `app/api/posts/route.ts` — POST (create)
- Create: `app/api/posts/[id]/route.ts` — DELETE
- Create: `app/api/follows/route.ts` — POST (follow), DELETE (unfollow)

### Search Module
- Create: `modules/search/queries.ts` — searchProfiles (name, artist type, availability, location — free-text)
- Create: `app/(main)/search/page.tsx` — search UI with filters
- Create: `components/search/ProfileCard.tsx`
- Create: `app/api/search/route.ts` — GET with query params

### Marketplace Module
- Create: `modules/marketplace/fee.ts` — `calculateFee(price, isSubscribed): number`
- Create: `modules/marketplace/queries.ts` — getListing, getListings, getOrdersForBuyer, getOrdersForSeller
- Create: `modules/marketplace/mutations.ts` — createListing, updateListing, createOrder
- Create: `modules/marketplace/webhook.ts` — handle Stripe webhook events
- Create: `app/(main)/marketplace/page.tsx` — browse listings
- Create: `app/(main)/listings/[id]/page.tsx` — single listing
- Create: `components/marketplace/ListingCard.tsx`
- Create: `components/marketplace/ListingForm.tsx`
- Create: `app/api/listings/route.ts` — GET (browse), POST (create)
- Create: `app/api/listings/[id]/route.ts` — GET, PATCH, DELETE
- Create: `app/api/listings/[id]/upload-url/route.ts` — GET signed Cloudinary upload URL
- Create: `app/api/orders/route.ts` — POST (create checkout session)
- Create: `app/api/orders/[id]/route.ts` — GET
- Create: `app/api/orders/[id]/download/route.ts` — GET signed download URL (enforces 30-day window)
- Create: `app/api/orders/[id]/ship/route.ts` — POST (seller marks shipped)
- Create: `app/api/orders/[id]/complete/route.ts` — POST (buyer confirms complete)
- Create: `app/api/orders/webhook/route.ts` — Stripe webhook receiver
- Create: `app/api/cron/auto-complete-orders/route.ts` — Vercel Cron, auto-completes shipped orders >7 days

### Subscription Module
- Create: `modules/subscription/mutations.ts` — createSubscription, cancelSubscription, handleWebhook
- Create: `app/api/subscriptions/route.ts` — POST (create Stripe Billing checkout)
- Create: `app/api/subscriptions/webhook/route.ts` — Stripe Billing webhook (update profile subscription_status)
- Create: `app/(main)/settings/subscription/page.tsx` — manage subscription

### Messaging Module
- Create: `modules/messaging/queries.ts` — getConversations, getMessages
- Create: `modules/messaging/mutations.ts` — sendMessage, markThreadRead
- Create: `app/(main)/messages/page.tsx` — inbox
- Create: `app/(main)/messages/[profileId]/page.tsx` — conversation thread
- Create: `components/messaging/MessageBubble.tsx`
- Create: `components/messaging/ConversationList.tsx`
- Create: `app/api/messages/route.ts` — POST (send message)
- Create: `app/api/messages/[profileId]/route.ts` — GET conversation, PATCH (mark read)

---

## Task 1: Project Scaffold & Dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd /path/to/limel8
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Expected: project scaffold with `app/`, `components/`, `public/`, `package.json`, `tsconfig.json`

- [ ] **Step 2: Install dependencies**

```bash
npm install prisma @prisma/client @next-auth/prisma-adapter next-auth \
  @supabase/supabase-js stripe @stripe/stripe-js \
  cloudinary resend bcryptjs
npm install --save-dev @types/bcryptjs
```

- [ ] **Step 3: Create `.env.local.example`**

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_BILLING_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_ANNUAL_PRICE_ID=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@artistconnect.com

# Cron
CRON_SECRET=
```

- [ ] **Step 4: Create `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-complete-orders",
      "schedule": "0 2 * * *"
    }
  ]
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with dependencies"
```

---

## Task 2: Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

- [ ] **Step 2: Write schema**

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─── NextAuth tables ───────────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Core models ───────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  passwordHash  String?
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      Session[]
  profile       Profile?
}

model Profile {
  id                 String             @id @default(cuid())
  userId             String             @unique
  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  name               String
  bio                String?            @db.Text
  artistType         String?
  avatarUrl          String?
  bannerUrl          String?
  location           String?
  availabilityStatus AvailabilityStatus @default(not_available)
  // Social links
  instagramUrl       String?
  spotifyUrl         String?
  soundcloudUrl      String?
  youtubeUrl         String?
  websiteUrl         String?
  // Stripe
  stripeAccountId    String?
  // Subscription
  subscriptionStatus SubscriptionStatus @default(free)
  subscriptionTier   SubscriptionTier?
  stripeCustomerId   String?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  posts            Post[]
  listings         Listing[]
  ordersAsBuyer    Order[]          @relation("buyer")
  ordersAsSeller   Order[]          @relation("seller")
  messagesSent     Message[]        @relation("sender")
  messagesReceived Message[]        @relation("recipient")
  groupsAdmin      Group[]          @relation("admin")
  groupMemberships GroupMember[]
  following        Follow[]         @relation("follower")
  followedBy       Follow[]         @relation("followedProfile")
}

enum AvailabilityStatus {
  available_for_hire
  open_to_collab
  open_to_join
  not_available
}

enum SubscriptionStatus {
  free
  active
}

enum SubscriptionTier {
  monthly
  annual
}

model Group {
  id          String        @id @default(cuid())
  name        String
  description String?       @db.Text
  bannerUrl   String?
  adminId     String
  admin       Profile       @relation("admin", fields: [adminId], references: [id])
  members     GroupMember[]
  posts       Post[]
  followedBy  Follow[]      @relation("followedGroup")
  createdAt   DateTime      @default(now())
}

model GroupMember {
  profileId String
  groupId   String
  joinedAt  DateTime @default(now())
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@id([profileId, groupId])
}

model Post {
  id          String      @id @default(cuid())
  profileId   String?
  groupId     String?
  profile     Profile?    @relation(fields: [profileId], references: [id], onDelete: Cascade)
  group       Group?      @relation(fields: [groupId], references: [id], onDelete: Cascade)
  content     String      @db.Text
  mediaUrls   String[]
  createdAt   DateTime    @default(now())

  @@check(name: "post_author_check", constraint: "(profile_id IS NOT NULL)::int + (group_id IS NOT NULL)::int = 1")
}

model Follow {
  followerId        String
  followedProfileId String?
  followedGroupId   String?
  createdAt         DateTime @default(now())
  follower          Profile  @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  followedProfile   Profile? @relation("followedProfile", fields: [followedProfileId], references: [id], onDelete: Cascade)
  followedGroup     Group?   @relation("followedGroup", fields: [followedGroupId], references: [id], onDelete: Cascade)

  @@id([followerId, followedProfileId, followedGroupId])
  @@check(name: "follow_target_check", constraint: "(followed_profile_id IS NOT NULL)::int + (followed_group_id IS NOT NULL)::int = 1")
}

model Listing {
  id                    String        @id @default(cuid())
  sellerId              String
  seller                Profile       @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  title                 String
  description           String        @db.Text
  price                 Decimal       @db.Decimal(10, 2)
  type                  ListingType
  previewMediaUrls      String[]
  cloudinaryDownloadId  String?
  stockQuantity         Int?
  status                ListingStatus @default(draft)
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
  orders                Order[]
}

enum ListingType {
  digital
  physical
}

enum ListingStatus {
  draft
  active
  sold
}

model Order {
  id                   String      @id @default(cuid())
  buyerId              String
  sellerId             String
  listingId            String
  buyer                Profile     @relation("buyer", fields: [buyerId], references: [id])
  seller               Profile     @relation("seller", fields: [sellerId], references: [id])
  listing              Listing     @relation(fields: [listingId], references: [id])
  amount               Decimal     @db.Decimal(10, 2)
  platformFee          Decimal     @db.Decimal(10, 2)
  sellerPayout         Decimal     @db.Decimal(10, 2)
  stripePaymentIntentId String?    @unique
  shippingAddress      Json?
  status               OrderStatus @default(pending)
  createdAt            DateTime    @default(now())
  updatedAt            DateTime    @updatedAt
}

enum OrderStatus {
  pending
  paid
  shipped
  complete
  refunded
}

model Message {
  id          String   @id @default(cuid())
  senderId    String
  recipientId String
  content     String   @db.Text
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
  sender      Profile  @relation("sender", fields: [senderId], references: [id], onDelete: Cascade)
  recipient   Profile  @relation("recipient", fields: [recipientId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 3: Run migration**

```bash
npx prisma migrate dev --name init
```

Expected: migration file created, tables created in Supabase DB.

- [ ] **Step 4: Generate Prisma client**

```bash
npx prisma generate
```

- [ ] **Step 5: Commit**

```bash
git add prisma/
git commit -m "feat: add Prisma schema with all models"
```

---

## Task 3: Shared Infrastructure (`lib/`)

**Files:**
- Create: `lib/db.ts`
- Create: `lib/auth.ts`
- Create: `lib/stripe.ts`
- Create: `lib/cloudinary.ts`
- Create: `lib/supabase.ts`
- Create: `lib/resend.ts`

- [ ] **Step 1: Create `lib/db.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 2: Create `lib/auth.ts`**

```typescript
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        return valid ? user : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const profile = await db.profile.findUnique({ where: { userId: user.id } });
        (session.user as any).profileId = profile?.id ?? null;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
```

- [ ] **Step 3: Create `lib/stripe.ts`**

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export const MARKETPLACE_FEE_PERCENT = 10;
export const MARKETPLACE_FEE_THRESHOLD = 200; // USD

export function calculatePlatformFee(priceUsd: number, isSubscribed: boolean): number {
  if (isSubscribed) return 0;
  if (priceUsd <= MARKETPLACE_FEE_THRESHOLD) return 0;
  return Math.round((priceUsd * MARKETPLACE_FEE_PERCENT) / 100 * 100) / 100;
}
```

- [ ] **Step 4: Create `lib/cloudinary.ts`**

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getSignedUploadParams(folder: string, resourceType: "image" | "raw" | "video" = "image") {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, resource_type: resourceType },
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
  };
}

// For authenticated (private) resources — digital downloads only
export function getDownloadUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  });
}
```

- [ ] **Step 5: Create `lib/supabase.ts`**

```typescript
import { createClient } from "@supabase/supabase-js";

// Server-side client (service role — never expose to browser)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Browser client for Realtime subscriptions — uses anon key
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 6: Create `lib/resend.ts`**

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL!;

export async function sendOrderConfirmation(to: string, orderId: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Order confirmed — ArtistConnect",
    html: `<p>Your order <strong>${orderId}</strong> has been placed.</p>`,
  });
}

export async function sendDownloadLink(to: string, downloadUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your download is ready — ArtistConnect",
    html: `<p><a href="${downloadUrl}">Click here to download your file</a> (link expires in 1 hour).</p>`,
  });
}

export async function sendSellerNewOrder(to: string, orderId: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You have a new order — ArtistConnect",
    html: `<p>Order <strong>${orderId}</strong> has been placed for one of your listings.</p>`,
  });
}

export async function sendShippingNotification(to: string, orderId: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your order has shipped — ArtistConnect",
    html: `<p>Order <strong>${orderId}</strong> has been marked as shipped.</p>`,
  });
}

export async function sendMessageNotification(to: string, senderName: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `New message from ${senderName} — ArtistConnect`,
    html: `<p>You have a new message from <strong>${senderName}</strong>. Log in to reply.</p>`,
  });
}
```

- [ ] **Step 7: Write tests for `calculatePlatformFee`**

First, set up Jest (needed for all tests in this plan). Install and configure:

```bash
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom
```

Create `jest.config.ts`:

```typescript
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};
```

Then create `__tests__/lib/stripe.test.ts`:

```typescript
import { calculatePlatformFee } from "@/lib/stripe";

describe("calculatePlatformFee", () => {
  it("returns 0 for subscribed sellers regardless of price", () => {
    expect(calculatePlatformFee(500, true)).toBe(0);
  });

  it("returns 0 for listings at or below $200", () => {
    expect(calculatePlatformFee(200, false)).toBe(0);
    expect(calculatePlatformFee(50, false)).toBe(0);
  });

  it("returns 10% for listings above $200", () => {
    expect(calculatePlatformFee(300, false)).toBe(30);
    expect(calculatePlatformFee(500, false)).toBe(50);
  });
});
```

- [ ] **Step 8: Run tests**

```bash
npx jest __tests__/lib/stripe.test.ts
```

Expected: 3 passing

- [ ] **Step 9: Commit**

```bash
git add lib/ __tests__/
git commit -m "feat: add shared lib (db, auth, stripe, cloudinary, supabase, resend)"
```

---

## Task 4: Auth — Register & Login

**Files:**
- Create: `modules/auth/register.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `app/api/auth/register/route.ts`
- Create: `app/(auth)/register/page.tsx`
- Create: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Write failing test for register module**

Create `__tests__/modules/auth/register.test.ts`:

```typescript
import { registerUser } from "@/modules/auth/register";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { user: { findUnique: jest.fn(), create: jest.fn() }, profile: { create: jest.fn() }, $transaction: jest.fn() } }));

describe("registerUser", () => {
  it("throws if email already taken", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing" });
    await expect(registerUser({ email: "a@b.com", password: "pass", name: "Test" }))
      .rejects.toThrow("Email already in use");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/modules/auth/register.test.ts
```

Expected: FAIL — `registerUser` not found

- [ ] **Step 3: Create `modules/auth/register.ts`**

```typescript
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export async function registerUser({ email, password, name }: RegisterInput) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);

  return db.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email, passwordHash } });
    const profile = await tx.profile.create({
      data: { userId: user.id, name },
    });
    return { user, profile };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/modules/auth/register.test.ts
```

Expected: PASS

- [ ] **Step 5: Create `app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 6: Create `app/api/auth/register/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { registerUser } from "@/modules/auth/register";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    await registerUser({ email, password, name });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 409 });
  }
}
```

- [ ] **Step 7: Create register and login pages**

`app/(auth)/register/page.tsx` — form with name, email, password fields that POST to `/api/auth/register` then redirects to `/login`.

`app/(auth)/login/page.tsx` — form that calls `signIn("credentials", { email, password })` from `next-auth/react`. Includes Google and Facebook OAuth buttons calling `signIn("google")` and `signIn("facebook")`.

- [ ] **Step 8: Commit**

```bash
git add modules/auth/ app/api/auth/ app/(auth)/ __tests__/modules/auth/
git commit -m "feat: auth — register and login with credentials + OAuth"
```

---

## Task 5: Profiles & Groups

**Files:**
- Create: `modules/profiles/queries.ts`
- Create: `modules/profiles/mutations.ts`
- Create: `app/api/profiles/[id]/route.ts`
- Create: `app/api/groups/route.ts`
- Create: `app/api/groups/[id]/members/route.ts`
- Create: `components/profiles/IndividualProfileView.tsx`
- Create: `components/profiles/GroupProfileView.tsx`
- Create: `components/profiles/AvailabilityBadge.tsx`
- Create: `app/(main)/profile/[id]/page.tsx`

- [ ] **Step 1: Write failing test for profile query**

Create `__tests__/modules/profiles/queries.test.ts`:

```typescript
import { getProfileById } from "@/modules/profiles/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { profile: { findUnique: jest.fn() } } }));

describe("getProfileById", () => {
  it("returns profile for valid p_ prefixed id", async () => {
    (db.profile.findUnique as jest.Mock).mockResolvedValue({ id: "abc" });
    const result = await getProfileById("p_abc");
    expect(db.profile.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "abc" } }));
    expect(result).toEqual({ type: "profile", data: { id: "abc" } });
  });

  it("returns null for unknown prefix", async () => {
    const result = await getProfileById("x_abc");
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/modules/profiles/queries.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `modules/profiles/queries.ts`**

```typescript
import { db } from "@/lib/db";

export async function getProfileById(prefixedId: string) {
  if (prefixedId.startsWith("p_")) {
    const id = prefixedId.slice(2);
    const data = await db.profile.findUnique({
      where: { id },
      include: { groupsAdmin: true, groupMemberships: { include: { group: true } }, listings: { where: { status: "active" } } },
    });
    return data ? { type: "profile" as const, data } : null;
  }
  if (prefixedId.startsWith("g_")) {
    const id = prefixedId.slice(2);
    const data = await db.group.findUnique({
      where: { id },
      include: { admin: true, members: { include: { profile: true } }, posts: { orderBy: { createdAt: "desc" }, take: 20 } },
    });
    return data ? { type: "group" as const, data } : null;
  }
  return null;
}

export async function getProfileByUserId(userId: string) {
  return db.profile.findUnique({ where: { userId } });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/modules/profiles/queries.test.ts
```

Expected: PASS

- [ ] **Step 5: Create `modules/profiles/mutations.ts`**

```typescript
import { db } from "@/lib/db";
import { AvailabilityStatus } from "@prisma/client";

export async function updateProfile(profileId: string, data: {
  name?: string; bio?: string; artistType?: string; location?: string;
  availabilityStatus?: AvailabilityStatus; avatarUrl?: string; bannerUrl?: string;
  instagramUrl?: string; spotifyUrl?: string; soundcloudUrl?: string;
  youtubeUrl?: string; websiteUrl?: string;
}) {
  return db.profile.update({ where: { id: profileId }, data });
}

export async function createGroup(adminProfileId: string, data: { name: string; description?: string }) {
  return db.group.create({
    data: { ...data, adminId: adminProfileId, members: { create: { profileId: adminProfileId } } },
  });
}

export async function addGroupMember(groupId: string, profileId: string) {
  return db.groupMember.create({ data: { groupId, profileId } });
}

export async function removeGroupMember(groupId: string, profileId: string) {
  return db.groupMember.delete({ where: { profileId_groupId: { profileId, groupId } } });
}
```

- [ ] **Step 6: Create API routes**

`app/api/profiles/[id]/route.ts` — GET calls `getProfileById`, PATCH calls `updateProfile` (auth required, own profile only).

`app/api/groups/route.ts` — POST calls `createGroup` (auth required).

`app/api/groups/[id]/members/route.ts` — POST calls `addGroupMember`, DELETE calls `removeGroupMember` (auth required).

- [ ] **Step 7: Create `components/profiles/AvailabilityBadge.tsx`**

```typescript
const LABELS: Record<string, string> = {
  available_for_hire: "Available for Hire",
  open_to_collab: "Open to Collab",
  open_to_join: "Open to Join",
  not_available: "Not Available",
};

const COLORS: Record<string, string> = {
  available_for_hire: "bg-green-100 text-green-800",
  open_to_collab: "bg-blue-100 text-blue-800",
  open_to_join: "bg-purple-100 text-purple-800",
  not_available: "bg-gray-100 text-gray-500",
};

export function AvailabilityBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${COLORS[status]}`}>
      {LABELS[status]}
    </span>
  );
}
```

- [ ] **Step 8: Create `app/(main)/profile/[id]/page.tsx`**

```typescript
import { getProfileById } from "@/modules/profiles/queries";
import { IndividualProfileView } from "@/components/profiles/IndividualProfileView";
import { GroupProfileView } from "@/components/profiles/GroupProfileView";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const result = await getProfileById(params.id);
  if (!result) return notFound();
  if (result.type === "profile") return <IndividualProfileView profile={result.data} />;
  return <GroupProfileView group={result.data} />;
}
```

- [ ] **Step 9: Commit**

```bash
git add modules/profiles/ app/api/profiles/ app/api/groups/ components/profiles/ app/(main)/profile/ __tests__/modules/profiles/
git commit -m "feat: profiles and groups — pages, API routes, mutations"
```

---

## Task 6: Follow System & Feed

**Files:**
- Create: `modules/feed/queries.ts`
- Create: `modules/feed/mutations.ts`
- Create: `app/api/follows/route.ts`
- Create: `app/api/posts/route.ts`
- Create: `app/api/posts/[id]/route.ts`
- Create: `components/feed/PostCard.tsx`
- Create: `components/feed/PostComposer.tsx`
- Create: `app/(main)/feed/page.tsx`

- [ ] **Step 1: Write failing test for feed query**

Create `__tests__/modules/feed/queries.test.ts`:

```typescript
import { getFeedForUser } from "@/modules/feed/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  db: { follow: { findMany: jest.fn() }, post: { findMany: jest.fn() } }
}));

describe("getFeedForUser", () => {
  it("returns posts from followed profiles and groups", async () => {
    (db.follow.findMany as jest.Mock).mockResolvedValue([
      { followedProfileId: "p1", followedGroupId: null },
      { followedProfileId: null, followedGroupId: "g1" },
    ]);
    (db.post.findMany as jest.Mock).mockResolvedValue([{ id: "post1" }]);

    const result = await getFeedForUser("myProfileId");

    expect(db.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ profileId: { in: ["p1"] } }, { groupId: { in: ["g1"] } }] },
      })
    );
    expect(result).toEqual([{ id: "post1" }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/modules/feed/queries.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `modules/feed/queries.ts`**

```typescript
import { db } from "@/lib/db";

export async function getFeedForUser(profileId: string, cursor?: string) {
  const follows = await db.follow.findMany({ where: { followerId: profileId } });
  const profileIds = follows.filter(f => f.followedProfileId).map(f => f.followedProfileId!);
  const groupIds = follows.filter(f => f.followedGroupId).map(f => f.followedGroupId!);

  return db.post.findMany({
    where: { OR: [{ profileId: { in: profileIds } }, { groupId: { in: groupIds } }] },
    orderBy: { createdAt: "desc" },
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: { profile: true, group: true },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/modules/feed/queries.test.ts
```

Expected: PASS

- [ ] **Step 5: Create `modules/feed/mutations.ts`**

```typescript
import { db } from "@/lib/db";

export async function createPost(data: { profileId?: string; groupId?: string; content: string; mediaUrls?: string[] }) {
  return db.post.create({ data, include: { profile: true, group: true } });
}

export async function deletePost(postId: string, requestorProfileId: string) {
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");
  if (post.profileId !== requestorProfileId) throw new Error("Unauthorized");
  return db.post.delete({ where: { id: postId } });
}

export async function follow(followerId: string, target: { profileId?: string; groupId?: string }) {
  return db.follow.create({
    data: { followerId, followedProfileId: target.profileId ?? null, followedGroupId: target.groupId ?? null },
  });
}

export async function unfollow(followerId: string, target: { profileId?: string; groupId?: string }) {
  return db.follow.deleteMany({
    where: { followerId, followedProfileId: target.profileId ?? null, followedGroupId: target.groupId ?? null },
  });
}
```

- [ ] **Step 6: Create API routes and feed page**

`app/api/posts/route.ts` — POST creates a post (auth required).
`app/api/posts/[id]/route.ts` — DELETE removes a post (auth required, own post only).
`app/api/follows/route.ts` — POST to follow, DELETE to unfollow (auth required).
`app/(main)/feed/page.tsx` — server component that fetches feed for current user, renders `PostCard` list with `PostComposer` at top.

- [ ] **Step 7: Commit**

```bash
git add modules/feed/ app/api/follows/ app/api/posts/ components/feed/ app/(main)/feed/ __tests__/modules/feed/
git commit -m "feat: feed — posts, follow system, home feed page"
```

---

## Task 7: Search

**Files:**
- Create: `modules/search/queries.ts`
- Create: `app/api/search/route.ts`
- Create: `components/search/ProfileCard.tsx`
- Create: `app/(main)/search/page.tsx`

- [ ] **Step 1: Write failing test for search**

Create `__tests__/modules/search/queries.test.ts`:

```typescript
import { searchProfiles } from "@/modules/search/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { profile: { findMany: jest.fn() } } }));

describe("searchProfiles", () => {
  it("filters by availability status when provided", async () => {
    (db.profile.findMany as jest.Mock).mockResolvedValue([]);
    await searchProfiles({ availability: "open_to_collab" });
    expect(db.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ availabilityStatus: "open_to_collab" }),
      })
    );
  });

  it("does full-text search when query provided", async () => {
    (db.profile.findMany as jest.Mock).mockResolvedValue([]);
    await searchProfiles({ query: "jazz" });
    expect(db.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: expect.objectContaining({ contains: "jazz" }) }),
          ]),
        }),
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/modules/search/queries.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `modules/search/queries.ts`**

```typescript
import { db } from "@/lib/db";
import { AvailabilityStatus } from "@prisma/client";

interface SearchParams {
  query?: string;
  artistType?: string;
  availability?: AvailabilityStatus;
  location?: string;
}

export async function searchProfiles({ query, artistType, availability, location }: SearchParams) {
  return db.profile.findMany({
    where: {
      ...(availability ? { availabilityStatus: availability } : {}),
      ...(artistType ? { artistType } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
          { artistType: { contains: query, mode: "insensitive" } },
        ],
      } : {}),
    },
    take: 50,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/modules/search/queries.test.ts
```

Expected: PASS

- [ ] **Step 5: Create API route and search page**

`app/api/search/route.ts` — GET, reads `query`, `artistType`, `availability`, `location` from search params, calls `searchProfiles`.

`app/(main)/search/page.tsx` — search bar + filter dropdowns (artist type, availability status). Renders `ProfileCard` grid.

- [ ] **Step 6: Commit**

```bash
git add modules/search/ app/api/search/ components/search/ app/(main)/search/ __tests__/modules/search/
git commit -m "feat: search — profile discovery with filters"
```

---

## Task 8: Marketplace — Listings

**Files:**
- Create: `modules/marketplace/fee.ts`
- Create: `modules/marketplace/queries.ts`
- Create: `modules/marketplace/mutations.ts`
- Create: `app/api/listings/route.ts`
- Create: `app/api/listings/[id]/route.ts`
- Create: `app/api/listings/[id]/upload-url/route.ts`
- Create: `components/marketplace/ListingCard.tsx`
- Create: `components/marketplace/ListingForm.tsx`
- Create: `app/(main)/marketplace/page.tsx`
- Create: `app/(main)/listings/[id]/page.tsx`

- [ ] **Step 1: Write failing test for listing mutation**

Create `__tests__/modules/marketplace/mutations.test.ts`:

```typescript
import { publishListing } from "@/modules/marketplace/mutations";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { profile: { findUnique: jest.fn() }, listing: { update: jest.fn() } } }));

describe("publishListing", () => {
  it("throws if seller has no stripe account", async () => {
    (db.profile.findUnique as jest.Mock).mockResolvedValue({ stripeAccountId: null });
    await expect(publishListing("listing1", "profile1")).rejects.toThrow("Stripe Connect");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/modules/marketplace/mutations.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `modules/marketplace/mutations.ts`**

```typescript
import { db } from "@/lib/db";
import { ListingType } from "@prisma/client";

export async function createListing(sellerId: string, data: {
  title: string; description: string; price: number; type: ListingType;
  previewMediaUrls?: string[]; cloudinaryDownloadId?: string; stockQuantity?: number;
}) {
  return db.listing.create({ data: { sellerId, ...data } });
}

export async function publishListing(listingId: string, sellerId: string) {
  const seller = await db.profile.findUnique({ where: { id: sellerId } });
  if (!seller?.stripeAccountId) {
    throw new Error("Stripe Connect onboarding required before publishing a listing");
  }
  return db.listing.update({ where: { id: listingId }, data: { status: "active" } });
}

export async function updateListing(listingId: string, data: Partial<{ title: string; description: string; price: number; previewMediaUrls: string[]; stockQuantity: number }>) {
  return db.listing.update({ where: { id: listingId }, data });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/modules/marketplace/mutations.test.ts
```

Expected: PASS

- [ ] **Step 5: Create `modules/marketplace/queries.ts`**

```typescript
import { db } from "@/lib/db";

export async function getListing(id: string) {
  return db.listing.findUnique({ where: { id }, include: { seller: true } });
}

export async function getListings(cursor?: string) {
  return db.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 24,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: { seller: true },
  });
}

export async function getOrdersForBuyer(buyerId: string) {
  return db.order.findMany({ where: { buyerId }, include: { listing: true }, orderBy: { createdAt: "desc" } });
}

export async function getOrdersForSeller(sellerId: string) {
  return db.order.findMany({ where: { sellerId }, include: { listing: true, buyer: true }, orderBy: { createdAt: "desc" } });
}
```

- [ ] **Step 6: Create signed upload URL route**

`app/api/listings/[id]/upload-url/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadParams } from "@/lib/cloudinary";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "download" ? "raw" : "image";
  const folder = type === "raw" ? "downloads" : "listing-previews";

  const uploadParams = await getSignedUploadParams(folder, type);
  return NextResponse.json(uploadParams);
}
```

- [ ] **Step 7: Create listing API routes, marketplace browse page, and single listing page**

`app/api/listings/route.ts` — GET (browse, calls `getListings`), POST (create, auth required).
`app/api/listings/[id]/route.ts` — GET (single), PATCH (update + publish, auth required, own listing only).
`app/(main)/marketplace/page.tsx` — grid of `ListingCard` components with pagination.
`app/(main)/listings/[id]/page.tsx` — full listing detail with Buy button (triggers checkout).

- [ ] **Step 8: Commit**

```bash
git add modules/marketplace/ app/api/listings/ components/marketplace/ app/(main)/marketplace/ app/(main)/listings/ __tests__/modules/marketplace/
git commit -m "feat: marketplace — listing creation, browsing, and signed uploads"
```

---

## Task 9: Marketplace — Orders & Stripe Webhook

**Files:**
- Create: `app/api/orders/route.ts`
- Create: `app/api/orders/[id]/route.ts`
- Create: `app/api/orders/[id]/download/route.ts`
- Create: `app/api/orders/[id]/ship/route.ts`
- Create: `app/api/orders/[id]/complete/route.ts`
- Create: `app/api/orders/webhook/route.ts`
- Create: `modules/marketplace/webhook.ts`

- [ ] **Step 1: Write failing test for fee calculation in order creation**

Create `__tests__/modules/marketplace/order.test.ts`:

```typescript
import { calculatePlatformFee } from "@/lib/stripe";

describe("order fee logic", () => {
  it("charges no fee to subscribed sellers on high-value listings", () => {
    expect(calculatePlatformFee(500, true)).toBe(0);
  });

  it("charges 10% fee to free sellers on listings above $200", () => {
    expect(calculatePlatformFee(400, false)).toBe(40);
  });

  it("charges no fee on listings at exactly $200", () => {
    expect(calculatePlatformFee(200, false)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test**

```bash
npx jest __tests__/modules/marketplace/order.test.ts
```

Expected: PASS (reuses `calculatePlatformFee` from Task 3)

- [ ] **Step 3: Create `app/api/orders/route.ts`** — POST creates a Stripe Checkout Session and an Order record in `pending` status

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, calculatePlatformFee } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await req.json();
  const listing = await db.listing.findUnique({ where: { id: listingId }, include: { seller: true } });
  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "Listing not available" }, { status: 400 });
  }

  const buyerProfile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!buyerProfile) return NextResponse.json({ error: "Profile not found" }, { status: 400 });

  const isSubscribed = listing.seller.subscriptionStatus === "active";
  const priceUsd = Number(listing.price);
  const platformFee = calculatePlatformFee(priceUsd, isSubscribed);
  const sellerPayout = priceUsd - platformFee;

  const order = await db.order.create({
    data: {
      buyerId: buyerProfile.id,
      sellerId: listing.sellerId,
      listingId: listing.id,
      amount: priceUsd,
      platformFee,
      sellerPayout,
      status: "pending",
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_intent_data: {
      application_fee_amount: Math.round(platformFee * 100),
      transfer_data: { destination: listing.seller.stripeAccountId! },
      metadata: { orderId: order.id },
    },
    line_items: [{
      price_data: {
        currency: "usd",
        unit_amount: Math.round(priceUsd * 100),
        product_data: { name: listing.title },
      },
      quantity: 1,
    }],
    ...(listing.type === "physical" ? { shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] } } : {}),
    success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

- [ ] **Step 4: Create `modules/marketplace/webhook.ts`**

```typescript
import { db } from "@/lib/db";
import { getDownloadUrl } from "@/lib/cloudinary";
import { sendOrderConfirmation, sendDownloadLink, sendSellerNewOrder } from "@/lib/resend";
import Stripe from "stripe";

export async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { listing: true, buyer: { include: { user: true } }, seller: { include: { user: true } } },
  });
  if (!order || order.status !== "pending") return;

  // Stock check for physical
  if (order.listing.type === "physical") {
    await db.$transaction(async (tx) => {
      const listing = await tx.listing.findUnique({ where: { id: order.listingId } });
      if (!listing || (listing.stockQuantity !== null && listing.stockQuantity <= 0)) {
        throw new Error("Out of stock");
      }
      const newQty = listing.stockQuantity !== null ? listing.stockQuantity - 1 : null;
      await tx.listing.update({
        where: { id: order.listingId },
        data: { stockQuantity: newQty, ...(newQty === 0 ? { status: "sold" } : {}) },
      });
      await tx.order.update({ where: { id: orderId }, data: { status: "paid" } });
    });
  } else {
    // Digital — auto-complete
    await db.order.update({ where: { id: orderId }, data: { status: "complete" } });
    if (order.listing.cloudinaryDownloadId) {
      const url = getDownloadUrl(order.listing.cloudinaryDownloadId);
      await sendDownloadLink(order.buyer.user.email!, url);
    }
  }

  // Send confirmation emails for ALL order types (digital and physical)
  await sendOrderConfirmation(order.buyer.user.email!, orderId);
  await sendSellerNewOrder(order.seller.user.email!, orderId);
}
```

- [ ] **Step 5: Create `app/api/orders/webhook/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { handlePaymentIntentSucceeded } from "@/modules/marketplace/webhook";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    await handlePaymentIntentSucceeded(event.data.object as any);
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };
```

- [ ] **Step 6: Create remaining order routes**

`app/api/orders/[id]/route.ts` — GET order (auth required, buyer or seller only).

`app/api/orders/[id]/download/route.ts` — GET signed URL; checks `order.status === 'complete'` and `order.createdAt` within 30 days, then calls `getDownloadUrl`.

`app/api/orders/[id]/ship/route.ts` — POST; checks session is seller, updates status to `shipped`, sends shipping email.

`app/api/orders/[id]/complete/route.ts` — POST; checks session is buyer, updates status to `complete`.

- [ ] **Step 7: Create Vercel Cron route**

`app/api/cron/auto-complete-orders/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await db.order.updateMany({
    where: { status: "shipped", updatedAt: { lt: sevenDaysAgo } },
    data: { status: "complete" },
  });

  return NextResponse.json({ completed: result.count });
}
```

- [ ] **Step 8: Commit**

```bash
git add modules/marketplace/ app/api/orders/ __tests__/modules/marketplace/
git commit -m "feat: marketplace — orders, Stripe checkout, webhook, cron auto-complete"
```

---

## Task 10: Subscriptions

**Files:**
- Create: `modules/subscription/mutations.ts`
- Create: `app/api/subscriptions/route.ts`
- Create: `app/api/subscriptions/webhook/route.ts`
- Create: `app/(main)/settings/subscription/page.tsx`

- [ ] **Step 1: Create `modules/subscription/mutations.ts`**

```typescript
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function createSubscriptionCheckout(profileId: string, tier: "monthly" | "annual", userEmail: string) {
  const priceId = tier === "monthly"
    ? process.env.STRIPE_MONTHLY_PRICE_ID!
    : process.env.STRIPE_ANNUAL_PRICE_ID!;

  let profile = await db.profile.findUnique({ where: { id: profileId } });
  let customerId = profile?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email: userEmail, metadata: { profileId } });
    customerId = customer.id;
    await db.profile.update({ where: { id: profileId }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/settings/subscription?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings/subscription`,
  });

  return session.url;
}
```

- [ ] **Step 2: Create `app/api/subscriptions/webhook/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_BILLING_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const subscription = event.data.object as any;
  const customerId = subscription.customer;
  const profile = await db.profile.findFirst({ where: { stripeCustomerId: customerId } });
  if (!profile) return NextResponse.json({ received: true });

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const isActive = subscription.status === "active";
    const tier = subscription.items.data[0]?.price.id === process.env.STRIPE_MONTHLY_PRICE_ID ? "monthly" : "annual";
    await db.profile.update({
      where: { id: profile.id },
      data: { subscriptionStatus: isActive ? "active" : "free", subscriptionTier: isActive ? tier : null },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    await db.profile.update({
      where: { id: profile.id },
      data: { subscriptionStatus: "free", subscriptionTier: null },
    });
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };
```

- [ ] **Step 3: Create subscription API and settings page**

`app/api/subscriptions/route.ts` — POST calls `createSubscriptionCheckout`, returns checkout URL.

`app/(main)/settings/subscription/page.tsx` — shows current subscription status (`free | active`) and tier. Displays pricing: **$30/month** or **$200/year**. Shows upgrade buttons for free users; shows active tier and a cancel button for subscribers. Cancel calls `stripe.subscriptions.cancel` via a DELETE route at `/api/subscriptions/[id]`.

- [ ] **Step 4: Commit**

```bash
git add modules/subscription/ app/api/subscriptions/ app/(main)/settings/
git commit -m "feat: subscriptions — Stripe Billing, fee waiver, webhook"
```

---

## Task 11: Messaging

**Files:**
- Create: `modules/messaging/queries.ts`
- Create: `modules/messaging/mutations.ts`
- Create: `app/api/messages/route.ts`
- Create: `app/api/messages/[profileId]/route.ts`
- Create: `components/messaging/ConversationList.tsx`
- Create: `components/messaging/MessageBubble.tsx`
- Create: `app/(main)/messages/page.tsx`
- Create: `app/(main)/messages/[profileId]/page.tsx`

- [ ] **Step 1: Write failing test for messaging query**

Create `__tests__/modules/messaging/queries.test.ts`:

```typescript
import { getConversations } from "@/modules/messaging/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { message: { findMany: jest.fn() } } }));

describe("getConversations", () => {
  it("queries messages where user is sender or recipient", async () => {
    (db.message.findMany as jest.Mock).mockResolvedValue([]);
    await getConversations("myId");
    expect(db.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ senderId: "myId" }, { recipientId: "myId" }] },
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/modules/messaging/queries.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `modules/messaging/queries.ts`**

```typescript
import { db } from "@/lib/db";

export async function getConversations(profileId: string) {
  // Get the latest message per conversation partner
  return db.message.findMany({
    where: { OR: [{ senderId: profileId }, { recipientId: profileId }] },
    orderBy: { createdAt: "desc" },
    distinct: ["senderId", "recipientId"],
    include: { sender: true, recipient: true },
  });
}

export async function getMessages(profileId: string, otherProfileId: string) {
  return db.message.findMany({
    where: {
      OR: [
        { senderId: profileId, recipientId: otherProfileId },
        { senderId: otherProfileId, recipientId: profileId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/modules/messaging/queries.test.ts
```

Expected: PASS

- [ ] **Step 5: Create `modules/messaging/mutations.ts`**

```typescript
import { db } from "@/lib/db";
import { sendMessageNotification } from "@/lib/resend";

export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const message = await db.message.create({
    data: { senderId, recipientId, content },
    include: { sender: true, recipient: { include: { user: true } } },
  });
  // Send email notification
  await sendMessageNotification(message.recipient.user.email!, message.sender.name);
  return message;
}

export async function markThreadRead(profileId: string, otherProfileId: string) {
  return db.message.updateMany({
    where: { senderId: otherProfileId, recipientId: profileId, read: false },
    data: { read: true },
  });
}
```

- [ ] **Step 6: Resolve Supabase Realtime + NextAuth JWT bridge**

Before wiring up the client subscription, install `jsonwebtoken` to mint custom Supabase JWTs:

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

Create `app/api/messages/realtime-token/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

// Supabase expects a JWT signed with the project JWT secret (Settings > API > JWT Secret)
// Add SUPABASE_JWT_SECRET to .env.local
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });

  const token = jwt.sign(
    {
      sub: profile.id,           // used by RLS: auth.uid() = profile.id
      role: "authenticated",
      iss: "supabase",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    },
    process.env.SUPABASE_JWT_SECRET!
  );

  return NextResponse.json({ token });
}
```

Update `.env.local.example` to include:
```
SUPABASE_JWT_SECRET=   # Supabase project Settings > API > JWT Secret
```

**RLS policy on `messages` table** (run in Supabase SQL editor):
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  USING (auth.uid()::text = sender_id OR auth.uid()::text = recipient_id);
```

In the conversation page client component, fetch the token on mount and authenticate the Supabase client before subscribing:

```typescript
const { token } = await fetch("/api/messages/realtime-token").then(r => r.json());
const supabase = createBrowserSupabaseClient();
supabase.realtime.setAuth(token);
const channel = supabase
  .channel("messages")
  .on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "messages",
    filter: `recipient_id=eq.${currentProfileId}`,
  }, (payload) => {
    setMessages(prev => [...prev, payload.new as Message]);
  })
  .subscribe();
```

- [ ] **Step 7: Create messaging API routes and pages**

`app/api/messages/route.ts` — POST sends a message (auth required).
`app/api/messages/[profileId]/route.ts` — GET fetches conversation, PATCH marks thread read.

`app/(main)/messages/page.tsx` — lists conversations using `ConversationList`.
`app/(main)/messages/[profileId]/page.tsx` — full conversation thread. Client component that subscribes to Supabase Realtime on the `messages` channel filtered by `recipient_id = currentProfileId`. Renders `MessageBubble` per message.

- [ ] **Step 8: Run messaging tests**

```bash
npx jest __tests__/modules/messaging/
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add modules/messaging/ app/api/messages/ components/messaging/ app/(main)/messages/ __tests__/modules/messaging/
git commit -m "feat: messaging — direct messages with Supabase Realtime"
```

---

## Task 12: Stripe Connect Onboarding

**Files:**
- Create: `app/api/connect/onboard/route.ts`
- Create: `app/api/connect/return/route.ts`

- [ ] **Step 1: Create `app/api/connect/onboard/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });

  let accountId = profile.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({ type: "express" });
    accountId = account.id;
    await db.profile.update({ where: { id: profile.id }, data: { stripeAccountId: accountId } });
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/api/connect/onboard`,
    return_url: `${process.env.NEXTAUTH_URL}/api/connect/return`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
```

- [ ] **Step 2: Create `app/api/connect/return/route.ts`**

```typescript
import { redirect } from "next/navigation";

export async function GET() {
  redirect("/settings?connect=success");
}
```

- [ ] **Step 3: Wire onboarding prompt into the listing publish flow**

In `app/(main)/listings/[id]/page.tsx`, if the current user is the seller and has no `stripeAccountId`, show a "Connect Stripe to publish" button that POSTs to `/api/connect/onboard` and redirects to the returned URL.

- [ ] **Step 4: Commit**

```bash
git add app/api/connect/
git commit -m "feat: Stripe Connect Express onboarding flow"
```

---

## Task 13: App Shell & Navigation

**Files:**
- Create: `app/(main)/layout.tsx`
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `app/(main)/layout.tsx`**

Authenticated layout. Uses `getServerSession` — if no session, redirects to `/login`. Renders `Navbar` and `Sidebar` with page content.

- [ ] **Step 2: Create `components/layout/Navbar.tsx`**

Top bar with: logo/home link, search input (navigates to `/search?query=`), messages icon with unread count badge, current user avatar linking to their profile (`/profile/p_<profileId>`).

- [ ] **Step 3: Create `components/layout/Sidebar.tsx`**

Links: Feed, Search, Marketplace, Messages, My Profile, Settings (subscription). Availability status quick-toggle for current user.

- [ ] **Step 4: Commit**

```bash
git add app/(main)/layout.tsx components/layout/
git commit -m "feat: app shell — authenticated layout, navbar, sidebar"
```

---

## Task 14: End-to-End Smoke Tests

**Files:**
- Create: `__tests__/e2e/smoke.test.ts` (or use Playwright if preferred)

- [ ] **Step 1: Install test runner**

```bash
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom
```

Add `jest.config.ts` (if not already added in Task 3):

```typescript
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};
```

- [ ] **Step 2: Run all unit tests**

```bash
npx jest --passWithNoTests
```

Expected: all tests pass

- [ ] **Step 3: Manual smoke test checklist**

- [ ] Register a new account → profile created → redirected to feed
- [ ] Log in with credentials → session established
- [ ] Edit profile (bio, availability status, location)
- [ ] Create a group → shows on `/profile/g_<id>`
- [ ] Create a post → appears in feed after following self
- [ ] Search for a profile by name
- [ ] Create a listing (draft) → publish blocked without Stripe Connect
- [ ] Complete Stripe Connect onboarding (test mode) → publish listing
- [ ] Buy a digital listing → order created, download link received
- [ ] Buy a physical listing → order shows as `paid`, seller marks `shipped`, auto-complete after 7 days (or manually trigger cron)
- [ ] Subscribe ($30/month) → subsequent sale has zero platform fee
- [ ] Send a message → recipient receives it in real-time

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete ArtistConnect MVP"
```
