# Organizations + Bookings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Organizations feature where users can create pages for studios, dance schools, vocal schools etc., define services, and accept booking requests (paid or free) from other users.

**Architecture:** Organizations are linked to a user's Profile (like Facebook Pages — one profile can own many orgs). Each org has Services. Visitors submit Booking requests for a service; the org owner confirms or declines from a dashboard. Paid services use Stripe Checkout; free services confirm immediately with an in-app message.

**Tech Stack:** Next.js 16 App Router, Prisma 7 + PostgreSQL (Supabase), NextAuth v4 JWT, Stripe SDK v21 (API version `2026-03-25.dahlia`), Tailwind v4, TypeScript.

---

## Codebase Conventions (read before touching any file)

- All `modules/` files start with `import "server-only";`
- API route params: `{ params }: { params: Promise<{ id: string }> }` — always `await params`
- Auth in API routes: `getServerSession(authOptions)` from `@/lib/auth`
- Get current user's profile: `getProfileByUserId(session.user.id)` from `@/modules/profiles/queries`
- Stripe: `getStripe()` from `@/lib/stripe` — API version `"2026-03-25.dahlia"`
- Glow design: `border border-cyan-500/[0.27] bg-zinc-900 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]`
- Gradient heading: `bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent` + `style={{ fontFamily: "var(--font-heading)" }}`
- Input class: `mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20`
- `prisma db push` requires DATABASE_URL: `set -a && source .env.local && set +a && npx prisma db push`
- After schema change: `set -a && source .env.local && set +a && npx prisma generate`

---

## File Map

### New files
- `prisma/schema.prisma` — add `Organization`, `Service`, `Booking` models + `BookingStatus` enum
- `modules/organizations/queries.ts` — read-only DB queries
- `modules/organizations/mutations.ts` — write DB operations
- `app/api/organizations/route.ts` — POST create org, GET list own orgs
- `app/api/organizations/[id]/route.ts` — GET org by id, PATCH update, DELETE
- `app/api/organizations/[id]/services/route.ts` — POST create service, GET list services
- `app/api/organizations/[id]/services/[serviceId]/route.ts` — PATCH update, DELETE service
- `app/api/organizations/[id]/bookings/route.ts` — GET list bookings for org (owner only)
- `app/api/bookings/route.ts` — POST create booking (visitor submits request)
- `app/api/bookings/[id]/route.ts` — PATCH confirm/decline/cancel booking
- `app/api/bookings/[id]/checkout/route.ts` — POST create Stripe Checkout session for paid booking
- `app/api/bookings/webhook/route.ts` — POST Stripe webhook: checkout.session.completed → confirmed
- `app/(main)/orgs/page.tsx` — dashboard: user's owned orgs list + create button
- `app/(main)/orgs/new/page.tsx` — create org form page
- `app/(main)/orgs/[id]/page.tsx` — org owner dashboard (edit, services, bookings)
- `app/(main)/orgs/[id]/edit/page.tsx` — edit org details
- `app/(main)/org/[slug]/page.tsx` — public org page
- `app/(main)/org/[slug]/book/[serviceId]/page.tsx` — booking request form
- `components/organizations/OrgCard.tsx` — org preview card (used in listings + search)
- `components/organizations/OrgForm.tsx` — create/edit org form (client component)
- `components/organizations/ServiceForm.tsx` — add/edit service form (client component)
- `components/organizations/BookingRequestForm.tsx` — booking request form (client component)
- `components/organizations/BookingList.tsx` — owner's booking management list (client component)

### Modified files
- `components/layout/Sidebar.tsx` — add "Organizations" nav link
- `app/(main)/settings/page.tsx` — no change needed (orgs is its own nav section)

---

## Task 1: Prisma schema — Organization, Service, Booking models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add models to schema**

Open `prisma/schema.prisma`. After the `Message` model at the end, add:

```prisma
enum BookingStatus {
  pending
  confirmed
  declined
  cancelled
}

enum OrgCategory {
  studio
  dance_school
  vocal_school
  music_school
  photography_studio
  recording_studio
  rehearsal_space
  event_venue
  other
}

model Organization {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  category    OrgCategory
  description String?     @db.Text
  avatarUrl   String?
  bannerUrl   String?
  ownerId     String
  owner       Profile     @relation("ownedOrgs", fields: [ownerId], references: [id], onDelete: Cascade)
  services    Service[]
  bookings    Booking[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([ownerId])
}

model Service {
  id           String       @id @default(cuid())
  orgId        String
  org          Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  name         String
  description  String?      @db.Text
  price        Decimal?     @db.Decimal(10, 2)
  duration     String?
  bookings     Booking[]
  createdAt    DateTime     @default(now())

  @@index([orgId])
}

model Booking {
  id                    String        @id @default(cuid())
  serviceId             String
  service               Service       @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  orgId                 String
  org                   Organization  @relation(fields: [orgId], references: [id], onDelete: Cascade)
  customerId            String
  customer              Profile       @relation("bookingsAsCustomer", fields: [customerId], references: [id], onDelete: Cascade)
  requestedDate         String
  message               String?       @db.Text
  status                BookingStatus @default(pending)
  stripePaymentIntentId String?
  stripeCheckoutSessionId String?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@index([orgId, status])
  @@index([customerId])
}
```

Also add relations to `Profile` model (inside the Profile model block, after existing relations):

```prisma
  ownedOrgs        Organization[]   @relation("ownedOrgs")
  bookingsAsCustomer Booking[]      @relation("bookingsAsCustomer")
```

- [ ] **Step 2: Run migration**

```bash
set -a && source .env.local && set +a && npx prisma db push
```

Expected output: `✔ Your database is now in sync with your Prisma schema.`

- [ ] **Step 3: Regenerate Prisma client**

```bash
set -a && source .env.local && set +a && npx prisma generate
```

Expected: `✔ Generated Prisma Client`

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add Organization, Service, Booking models"
```

---

## Task 2: Module — organizations queries + mutations

**Files:**
- Create: `modules/organizations/queries.ts`
- Create: `modules/organizations/mutations.ts`

- [ ] **Step 1: Create queries**

Create `modules/organizations/queries.ts`:

```typescript
import "server-only";
import { db } from "@/lib/db";

export async function getOrgBySlug(slug: string) {
  return db.organization.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      services: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getOrgById(id: string) {
  return db.organization.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      services: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getOrgsByOwner(ownerId: string) {
  return db.organization.findMany({
    where: { ownerId },
    include: { services: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingsForOrg(orgId: string) {
  return db.booking.findMany({
    where: { orgId },
    include: {
      service: { select: { id: true, name: true, price: true } },
      customer: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingById(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      service: true,
      org: { select: { id: true, name: true, ownerId: true } },
      customer: { select: { id: true, name: true } },
    },
  });
}
```

- [ ] **Step 2: Create mutations**

Create `modules/organizations/mutations.ts`:

```typescript
import "server-only";
import { db } from "@/lib/db";
import { BookingStatus, OrgCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function createOrg(data: {
  slug: string;
  name: string;
  category: OrgCategory;
  description?: string;
  ownerId: string;
}) {
  return db.organization.create({ data });
}

export async function updateOrg(
  id: string,
  data: {
    name?: string;
    category?: OrgCategory;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
  }
) {
  return db.organization.update({ where: { id }, data });
}

export async function deleteOrg(id: string) {
  return db.organization.delete({ where: { id } });
}

export async function createService(data: {
  orgId: string;
  name: string;
  description?: string;
  price?: number | null;
  duration?: string;
}) {
  return db.service.create({
    data: {
      ...data,
      price: data.price != null ? new Decimal(data.price) : null,
    },
  });
}

export async function updateService(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number | null;
    duration?: string;
  }
) {
  return db.service.update({
    where: { id },
    data: {
      ...data,
      price: data.price != null ? new Decimal(data.price) : null,
    },
  });
}

export async function deleteService(id: string) {
  return db.service.delete({ where: { id } });
}

export async function createBooking(data: {
  serviceId: string;
  orgId: string;
  customerId: string;
  requestedDate: string;
  message?: string;
}) {
  return db.booking.create({ data });
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  extra?: { stripePaymentIntentId?: string; stripeCheckoutSessionId?: string }
) {
  return db.booking.update({ where: { id }, data: { status, ...extra } });
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add modules/organizations/
git commit -m "feat(orgs): add organizations queries and mutations"
```

---

## Task 3: API — organizations CRUD

**Files:**
- Create: `app/api/organizations/route.ts`
- Create: `app/api/organizations/[id]/route.ts`

- [ ] **Step 1: Create `app/api/organizations/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgsByOwner } from "@/modules/organizations/queries";
import { createOrg } from "@/modules/organizations/mutations";
import { OrgCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const orgs = await getOrgsByOwner(profile.id);
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await req.json();
  const { name, slug, category, description } = body;

  if (!name || !slug || !category) {
    return NextResponse.json({ error: "name, slug, and category are required" }, { status: 400 });
  }

  const validCategories = Object.values(OrgCategory);
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  // Validate slug: lowercase letters, numbers, hyphens only
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug may only contain lowercase letters, numbers, and hyphens" }, { status: 400 });
  }

  try {
    const org = await createOrg({ name, slug, category, description, ownerId: profile.id });
    return NextResponse.json(org, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "That slug is already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `app/api/organizations/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById } from "@/modules/organizations/queries";
import { updateOrg, deleteOrg } from "@/modules/organizations/mutations";
import { OrgCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const org = await getOrgById(id);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(org);
}

async function requireOwner(orgId: string, userId: string) {
  const [org, profile] = await Promise.all([
    getOrgById(orgId),
    getProfileByUserId(userId),
  ]);
  if (!org) return { error: "Not found", status: 404 } as const;
  if (!profile || org.ownerId !== profile.id) return { error: "Forbidden", status: 403 } as const;
  return { org, profile };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const check = await requireOwner(id, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = await req.json();
  const { name, category, description, avatarUrl, bannerUrl } = body;
  if (category && !Object.values(OrgCategory).includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const updated = await updateOrg(id, { name, category, description, avatarUrl, bannerUrl });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const check = await requireOwner(id, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });
  await deleteOrg(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/organizations/
git commit -m "feat(orgs): organization CRUD API routes"
```

---

## Task 4: API — services CRUD

**Files:**
- Create: `app/api/organizations/[id]/services/route.ts`
- Create: `app/api/organizations/[id]/services/[serviceId]/route.ts`

- [ ] **Step 1: Create `app/api/organizations/[id]/services/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById } from "@/modules/organizations/queries";
import { createService } from "@/modules/organizations/mutations";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [org, profile] = await Promise.all([
    getOrgById(id),
    getProfileByUserId(session.user.id),
  ]);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!profile || org.ownerId !== profile.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, description, price, duration } = body;
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const service = await createService({
    orgId: id,
    name,
    description,
    price: price != null ? Number(price) : null,
    duration,
  });
  return NextResponse.json(service, { status: 201 });
}
```

- [ ] **Step 2: Create `app/api/organizations/[id]/services/[serviceId]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById } from "@/modules/organizations/queries";
import { updateService, deleteService } from "@/modules/organizations/mutations";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireServiceOwner(orgId: string, serviceId: string, userId: string) {
  const [org, profile, service] = await Promise.all([
    getOrgById(orgId),
    getProfileByUserId(userId),
    db.service.findUnique({ where: { id: serviceId } }),
  ]);
  if (!org || !service || service.orgId !== orgId) return { error: "Not found", status: 404 } as const;
  if (!profile || org.ownerId !== profile.id) return { error: "Forbidden", status: 403 } as const;
  return { org, service, profile };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, serviceId } = await params;
  const check = await requireServiceOwner(id, serviceId, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = await req.json();
  const { name, description, price, duration } = body;
  const updated = await updateService(serviceId, {
    name,
    description,
    price: price != null ? Number(price) : null,
    duration,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, serviceId } = await params;
  const check = await requireServiceOwner(id, serviceId, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  await deleteService(serviceId);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/api/organizations/
git commit -m "feat(orgs): services CRUD API routes"
```

---

## Task 5: API — bookings (create + manage + webhook)

**Files:**
- Create: `app/api/bookings/route.ts`
- Create: `app/api/bookings/[id]/route.ts`
- Create: `app/api/bookings/[id]/checkout/route.ts`
- Create: `app/api/bookings/webhook/route.ts`
- Create: `app/api/organizations/[id]/bookings/route.ts`

- [ ] **Step 1: Create `app/api/bookings/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { createBooking } from "@/modules/organizations/mutations";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await req.json();
  const { serviceId, requestedDate, message } = body;
  if (!serviceId || !requestedDate) {
    return NextResponse.json({ error: "serviceId and requestedDate are required" }, { status: 400 });
  }

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  // Prevent booking own org's service
  const org = await db.organization.findUnique({ where: { id: service.orgId } });
  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  if (org.ownerId === profile.id) {
    return NextResponse.json({ error: "Cannot book your own organization" }, { status: 400 });
  }

  const booking = await createBooking({
    serviceId,
    orgId: service.orgId,
    customerId: profile.id,
    requestedDate,
    message,
  });
  return NextResponse.json(booking, { status: 201 });
}
```

- [ ] **Step 2: Create `app/api/bookings/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getBookingById } from "@/modules/organizations/queries";
import { updateBookingStatus } from "@/modules/organizations/mutations";
import { BookingStatus } from "@prisma/client";
import { createMessage } from "@/modules/messaging/mutations";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { status } = body as { status: BookingStatus };

  const isOwner = booking.org.ownerId === profile.id;
  const isCustomer = booking.customerId === profile.id;

  // Owner can confirm or decline; customer can cancel
  if (status === "confirmed" || status === "declined") {
    if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else if (status === "cancelled") {
    if (!isCustomer && !isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateBookingStatus(id, status);

  // Send in-app message notification
  const messageContent =
    status === "confirmed"
      ? `Your booking for "${booking.service.name}" has been confirmed! Requested date: ${booking.requestedDate}`
      : status === "declined"
      ? `Your booking request for "${booking.service.name}" was declined.`
      : `Booking for "${booking.service.name}" has been cancelled.`;

  if (status === "confirmed" || status === "declined") {
    await createMessage({
      senderId: profile.id,
      recipientId: booking.customerId,
      content: messageContent,
    });
  }

  return NextResponse.json(updated);
}
```

- [ ] **Step 3: Create `app/api/bookings/[id]/checkout/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getBookingById } from "@/modules/organizations/queries";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only org owner can initiate checkout (after confirming the request)
  if (booking.org.ownerId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!booking.service.price) {
    return NextResponse.json({ error: "This service is free" }, { status: 400 });
  }

  const stripe = getStripe();
  const session_ = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.service.name },
          unit_amount: Math.round(Number(booking.service.price) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id },
    success_url: `${process.env.NEXTAUTH_URL}/orgs/${booking.orgId}?booking=paid`,
    cancel_url: `${process.env.NEXTAUTH_URL}/orgs/${booking.orgId}`,
  });

  return NextResponse.json({ url: session_.url });
}
```

- [ ] **Step 4: Create `app/api/bookings/webhook/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateBookingStatus } from "@/modules/organizations/mutations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_BOOKING_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await updateBookingStatus(bookingId, "confirmed", {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      });
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 5: Create `app/api/organizations/[id]/bookings/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById, getBookingsForOrg } from "@/modules/organizations/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [org, profile] = await Promise.all([
    getOrgById(id),
    getProfileByUserId(session.user.id),
  ]);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!profile || org.ownerId !== profile.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const bookings = await getBookingsForOrg(id);
  return NextResponse.json(bookings);
}
```

- [ ] **Step 6: Check that `createMessage` exists in messaging mutations**

Open `modules/messaging/mutations.ts`. It should export `createMessage({ senderId, recipientId, content })`. If not, add:

```typescript
export async function createMessage(data: {
  senderId: string;
  recipientId: string;
  content: string;
}) {
  return db.message.create({ data });
}
```

- [ ] **Step 7: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add app/api/bookings/ app/api/organizations/
git commit -m "feat(orgs): bookings API — create, confirm/decline, Stripe checkout, webhook"
```

---

## Task 6: UI components — OrgCard, OrgForm, ServiceForm

**Files:**
- Create: `components/organizations/OrgCard.tsx`
- Create: `components/organizations/OrgForm.tsx`
- Create: `components/organizations/ServiceForm.tsx`

- [ ] **Step 1: Create `components/organizations/OrgCard.tsx`**

```tsx
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  studio: "Studio",
  dance_school: "Dance School",
  vocal_school: "Vocal School",
  music_school: "Music School",
  photography_studio: "Photography Studio",
  recording_studio: "Recording Studio",
  rehearsal_space: "Rehearsal Space",
  event_venue: "Event Venue",
  other: "Other",
};

type OrgCardProps = {
  org: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description?: string | null;
    avatarUrl?: string | null;
    services: { id: string }[];
  };
};

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link
      href={`/org/${org.slug}`}
      className="flex items-start gap-3 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.13)] hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group"
    >
      {org.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={org.avatarUrl} alt={org.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-700" />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/[0.27] flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-cyan-400">{org.name[0].toUpperCase()}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate group-hover:text-cyan-400 transition-colors">{org.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{CATEGORY_LABELS[org.category] ?? org.category}</p>
        {org.description && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{org.description}</p>
        )}
        <p className="text-xs text-zinc-600 mt-1">{org.services.length} service{org.services.length !== 1 ? "s" : ""}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create `components/organizations/OrgForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "studio", label: "Studio" },
  { value: "dance_school", label: "Dance School" },
  { value: "vocal_school", label: "Vocal School" },
  { value: "music_school", label: "Music School" },
  { value: "photography_studio", label: "Photography Studio" },
  { value: "recording_studio", label: "Recording Studio" },
  { value: "rehearsal_space", label: "Rehearsal Space" },
  { value: "event_venue", label: "Event Venue" },
  { value: "other", label: "Other" },
];

type OrgFormProps = {
  mode: "create";
} | {
  mode: "edit";
  orgId: string;
  initial: { name: string; category: string; description?: string | null };
};

export function OrgForm(props: OrgFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.initial : null;
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(initial?.category ?? "studio");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function autoSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (props.mode === "create") {
        const res = await fetch("/api/organizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), slug: slug.trim(), category, description: description.trim() || null }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed"); return; }
        router.push(`/orgs/${data.id}`);
        router.refresh();
      } else {
        const res = await fetch(`/api/organizations/${props.orgId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), category, description: description.trim() || null }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed"); return; }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-medium text-zinc-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>}
      <div>
        <label className={labelClass}>Organization Name <span className="text-red-400">*</span></label>
        <input
          required
          value={name}
          onChange={(e) => { setName(e.target.value); if (props.mode === "create") setSlug(autoSlug(e.target.value)); }}
          className={inputClass}
          placeholder="My Dance Studio"
        />
      </div>
      {props.mode === "create" && (
        <div>
          <label className={labelClass}>URL Slug <span className="text-red-400">*</span></label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            placeholder="my-dance-studio"
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
          />
          <p className="mt-1 text-xs text-zinc-500">Your page will be at /org/{slug || "your-slug"}</p>
        </div>
      )}
      <div>
        <label className={labelClass}>Category <span className="text-red-400">*</span></label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass + " cursor-pointer"}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="Tell people about your organization..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
      >
        {loading ? "Saving…" : props.mode === "create" ? "Create Organization" : "Save Changes"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create `components/organizations/ServiceForm.tsx`**

```tsx
"use client";

import { useState } from "react";

type ServiceFormProps = {
  orgId: string;
  onCreated: (service: { id: string; name: string; price: string | null; duration: string | null }) => void;
};

export function ServiceForm({ orgId, onCreated }: ServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/organizations/${orgId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: price ? parseFloat(price) : null,
          duration: duration.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed"); return; }
      onCreated(data);
      setName(""); setDescription(""); setPrice(""); setDuration("");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-medium text-zinc-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)]">
      <h3 className="text-sm font-semibold text-white">Add Service</h3>
      {error && <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>}
      <div>
        <label className={labelClass}>Service Name <span className="text-red-400">*</span></label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="1hr Studio Session" />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="What's included?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Price (USD)</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="Leave empty for free" />
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="e.g. 1 hour" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 cursor-pointer hover:bg-cyan-400 transition-colors">
        {loading ? "Adding…" : "Add Service"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/organizations/
git commit -m "feat(orgs): OrgCard, OrgForm, ServiceForm components"
```

---

## Task 7: UI components — BookingRequestForm + BookingList

**Files:**
- Create: `components/organizations/BookingRequestForm.tsx`
- Create: `components/organizations/BookingList.tsx`

- [ ] **Step 1: Create `components/organizations/BookingRequestForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingRequestFormProps = {
  serviceId: string;
  serviceName: string;
  servicePrice: string | null;
  orgSlug: string;
};

export function BookingRequestForm({ serviceId, serviceName, servicePrice, orgSlug }: BookingRequestFormProps) {
  const router = useRouter();
  const [requestedDate, setRequestedDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, requestedDate: requestedDate.trim(), message: message.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed"); return; }
      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";

  if (success) {
    return (
      <div className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-6 text-center space-y-2">
        <p className="text-white font-semibold">Booking request sent!</p>
        <p className="text-sm text-zinc-400">The organization will confirm or decline your request. You'll receive a message when they respond.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <div>
        <p className="text-sm font-medium text-zinc-300">Service</p>
        <p className="text-white font-semibold">{serviceName}</p>
        {servicePrice && <p className="text-cyan-400 text-sm font-bold">${servicePrice}</p>}
        {!servicePrice && <p className="text-green-400 text-sm font-bold">Free</p>}
      </div>
      {error && <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-zinc-300">Preferred Date / Time <span className="text-red-400">*</span></label>
        <input
          required
          value={requestedDate}
          onChange={(e) => setRequestedDate(e.target.value)}
          className={inputClass}
          placeholder="e.g. Monday 14 April, 2pm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="Any details the organization should know..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 cursor-pointer transition-opacity"
      >
        {loading ? "Sending…" : "Send Booking Request"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `components/organizations/BookingList.tsx`**

```tsx
"use client";

import { useState } from "react";

type Booking = {
  id: string;
  requestedDate: string;
  message?: string | null;
  status: string;
  createdAt: string;
  service: { id: string; name: string; price: string | null };
  customer: { id: string; name: string; avatarUrl?: string | null };
};

export function BookingList({ bookings, orgId }: { bookings: Booking[]; orgId: string }) {
  const [list, setList] = useState(bookings);
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(bookingId: string, status: "confirmed" | "declined") {
    setLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setList((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
      }
    } finally {
      setLoading(null);
    }
  }

  async function initiateCheckout(bookingId: string) {
    setLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/checkout`, { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-950 border-yellow-800",
    confirmed: "text-green-400 bg-green-950 border-green-800",
    declined: "text-red-400 bg-red-950 border-red-800",
    cancelled: "text-zinc-400 bg-zinc-800 border-zinc-700",
  };

  if (!list.length) return <p className="text-sm text-zinc-500">No bookings yet.</p>;

  return (
    <div className="space-y-3">
      {list.map((booking) => (
        <div key={booking.id} className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)]">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {booking.customer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={booking.customer.avatarUrl} alt={booking.customer.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {booking.customer.name[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{booking.customer.name}</p>
                <p className="text-xs text-zinc-500">{booking.service.name}{booking.service.price ? ` — $${booking.service.price}` : " — Free"}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[booking.status] ?? ""}`}>
              {booking.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">Requested: {booking.requestedDate}</p>
          {booking.message && <p className="mt-1 text-xs text-zinc-500 italic">"{booking.message}"</p>}
          {booking.status === "pending" && (
            <div className="mt-3 flex gap-2">
              {booking.service.price ? (
                <button
                  onClick={() => initiateCheckout(booking.id)}
                  disabled={loading === booking.id}
                  className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-3 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-50 cursor-pointer"
                >
                  {loading === booking.id ? "…" : "Confirm & Request Payment"}
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(booking.id, "confirmed")}
                  disabled={loading === booking.id}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer hover:bg-green-500 transition-colors"
                >
                  {loading === booking.id ? "…" : "Confirm"}
                </button>
              )}
              <button
                onClick={() => updateStatus(booking.id, "declined")}
                disabled={loading === booking.id}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 cursor-pointer transition-colors"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/organizations/
git commit -m "feat(orgs): BookingRequestForm and BookingList components"
```

---

## Task 8: Pages — org dashboard (owner) + create org

**Files:**
- Create: `app/(main)/orgs/page.tsx`
- Create: `app/(main)/orgs/new/page.tsx`
- Create: `app/(main)/orgs/[id]/page.tsx`

- [ ] **Step 1: Create `app/(main)/orgs/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgsByOwner } from "@/modules/organizations/queries";
import { OrgCard } from "@/components/organizations/OrgCard";
import Link from "next/link";

export default async function OrgsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  const orgs = await getOrgsByOwner(profile.id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          My Organizations
        </h1>
        <Link
          href="/orgs/new"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          + Create
        </Link>
      </div>
      {orgs.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-400 mb-4">You haven't created any organizations yet.</p>
          <Link href="/orgs/new" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
            Create your first organization →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => <OrgCard key={org.id} org={org} />)}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Create `app/(main)/orgs/new/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrgForm } from "@/components/organizations/OrgForm";

export default async function NewOrgPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
        Create Organization
      </h1>
      <div className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <OrgForm mode="create" />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create `app/(main)/orgs/[id]/page.tsx`** (owner dashboard)

```tsx
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById, getBookingsForOrg } from "@/modules/organizations/queries";
import { OrgForm } from "@/components/organizations/OrgForm";
import { ServiceForm } from "@/components/organizations/ServiceForm";
import { BookingList } from "@/components/organizations/BookingList";
import Link from "next/link";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  const org = await getOrgById(id);
  if (!org) return notFound();
  if (org.ownerId !== profile.id) redirect("/orgs");

  const bookings = await getBookingsForOrg(id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          {org.name}
        </h1>
        <Link href={`/org/${org.slug}`} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          View public page →
        </Link>
      </div>

      {/* Edit org details */}
      <section className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Organization Details</h2>
        <OrgForm
          mode="edit"
          orgId={org.id}
          initial={{ name: org.name, category: org.category, description: org.description }}
        />
      </section>

      {/* Services */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Services</h2>
        {org.services.length > 0 && (
          <div className="space-y-2">
            {org.services.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{service.name}</p>
                  <p className="text-xs text-zinc-500">
                    {service.price ? `$${service.price}` : "Free"}
                    {service.duration ? ` · ${service.duration}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <ServiceForm orgId={org.id} onCreated={() => {}} />
      </section>

      {/* Bookings */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Bookings</h2>
        <BookingList bookings={bookings.map(b => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
          service: { ...b.service, price: b.service.price?.toString() ?? null },
        }))} orgId={org.id} />
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/orgs/"
git commit -m "feat(orgs): org dashboard, create org pages"
```

---

## Task 9: Pages — public org page + booking request page

**Files:**
- Create: `app/(main)/org/[slug]/page.tsx`
- Create: `app/(main)/org/[slug]/book/[serviceId]/page.tsx`

- [ ] **Step 1: Create `app/(main)/org/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrgBySlug } from "@/modules/organizations/queries";
import { getProfileByUserId } from "@/modules/profiles/queries";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  studio: "Studio",
  dance_school: "Dance School",
  vocal_school: "Vocal School",
  music_school: "Music School",
  photography_studio: "Photography Studio",
  recording_studio: "Recording Studio",
  rehearsal_space: "Rehearsal Space",
  event_venue: "Event Venue",
  other: "Other",
};

export default async function PublicOrgPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [org, session] = await Promise.all([
    getOrgBySlug(slug),
    getServerSession(authOptions),
  ]);
  if (!org) return notFound();

  const currentProfile = session?.user?.id
    ? await getProfileByUserId(session.user.id)
    : null;

  const isOwner = currentProfile?.id === org.ownerId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-violet-950">
        {org.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={org.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Avatar + info */}
      <div className="flex items-start gap-4 -mt-10 px-2">
        {org.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={org.avatarUrl} alt={org.name} className="w-20 h-20 rounded-xl object-cover border-4 border-zinc-950 shadow-lg shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-cyan-950 border-4 border-zinc-950 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-cyan-400">{org.name[0].toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 mt-10 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{org.name}</h1>
            {isOwner && (
              <Link
                href={`/orgs/${org.id}`}
                className="text-xs font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-violet-400 px-3 py-1 rounded-lg hover:opacity-90 cursor-pointer"
              >
                Manage
              </Link>
            )}
          </div>
          <p className="text-sm text-zinc-400">{CATEGORY_LABELS[org.category] ?? org.category}</p>
          <p className="text-xs text-zinc-500">by {org.owner.name}</p>
        </div>
      </div>

      {/* Description */}
      {org.description && (
        <div>
          <h2 className="text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>About</h2>
          <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{org.description}</p>
        </div>
      )}

      {/* Services */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Services</h2>
        {org.services.length === 0 ? (
          <p className="text-sm text-zinc-500">No services listed yet.</p>
        ) : (
          <div className="space-y-3">
            {org.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-xl border border-cyan-500/[0.27] bg-zinc-900 px-4 py-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)]"
              >
                <div>
                  <p className="font-semibold text-white text-sm">{service.name}</p>
                  {service.description && <p className="text-xs text-zinc-500 mt-0.5">{service.description}</p>}
                  <p className="text-xs mt-1">
                    {service.price
                      ? <span className="text-cyan-400 font-bold">${String(service.price)}</span>
                      : <span className="text-green-400 font-bold">Free</span>}
                    {service.duration && <span className="text-zinc-500"> · {service.duration}</span>}
                  </p>
                </div>
                {!isOwner && currentProfile && (
                  <Link
                    href={`/org/${slug}/book/${service.id}`}
                    className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 cursor-pointer hover:opacity-90 transition-opacity shrink-0 ml-4"
                  >
                    Book
                  </Link>
                )}
                {!currentProfile && (
                  <Link href="/login" className="rounded-lg border border-cyan-500/[0.27] px-4 py-2 text-sm font-medium text-cyan-400 cursor-pointer hover:bg-cyan-950/40 transition-colors shrink-0 ml-4">
                    Sign in to book
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/(main)/org/[slug]/book/[serviceId]/page.tsx`**

```tsx
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrgBySlug } from "@/modules/organizations/queries";
import { BookingRequestForm } from "@/components/organizations/BookingRequestForm";
import Link from "next/link";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string; serviceId: string }>;
}) {
  const { slug, serviceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const org = await getOrgBySlug(slug);
  if (!org) return notFound();

  const service = org.services.find((s) => s.id === serviceId);
  if (!service) return notFound();

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <div className="mb-6">
        <Link href={`/org/${slug}`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to {org.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          Book a Session
        </h1>
      </div>
      <BookingRequestForm
        serviceId={service.id}
        serviceName={service.name}
        servicePrice={service.price?.toString() ?? null}
        orgSlug={slug}
      />
    </main>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/org/"
git commit -m "feat(orgs): public org page and booking request page"
```

---

## Task 10: Sidebar link + env var + deploy

**Files:**
- Modify: `components/layout/Sidebar.tsx`
- Modify: `.env.local.example`

- [ ] **Step 1: Add Organizations link to Sidebar**

Open `components/layout/Sidebar.tsx`. In the `MAIN_LINKS` array, add after the Messages entry:

```typescript
{
  href: "/orgs",
  label: "Organizations",
  icon: (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>
      <rect x="9" y="2" width="6" height="6"/>
    </svg>
  ),
  iconActive: (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
},
```

- [ ] **Step 2: Add env var to example file**

Open `.env.local.example`. Add after `STRIPE_BILLING_WEBHOOK_SECRET`:

```
STRIPE_BOOKING_WEBHOOK_SECRET=
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit and deploy**

```bash
git add components/layout/Sidebar.tsx .env.local.example
git commit -m "feat(orgs): add Organizations sidebar link"
git push origin main
vercel --prod
```

- [ ] **Step 5: Add STRIPE_BOOKING_WEBHOOK_SECRET to Vercel**

In Vercel dashboard → Settings → Environment Variables, add:
- `STRIPE_BOOKING_WEBHOOK_SECRET` — the webhook secret from your Stripe dashboard for the `/api/bookings/webhook` endpoint

- [ ] **Step 6: Manual smoke test**

1. Go to `/orgs/new` → create an organization
2. Go to `/org/[your-slug]` → verify public page shows
3. Sign in as a different user → click Book → submit a booking request
4. Sign back in as owner → go to `/orgs/[id]` → confirm or decline booking
5. Verify in-app message arrives for the customer

---

## Self-Review

**Spec coverage check:**
- ✅ Organization page at `/org/[slug]` — Task 9
- ✅ Services list with Book button — Task 9
- ✅ Booking request form — Task 7, 9
- ✅ Owner dashboard at `/orgs/[id]` — Task 8
- ✅ Confirm/decline bookings — Task 5, 7
- ✅ Paid services → Stripe Checkout — Task 5, 7
- ✅ Free services → direct confirm — Task 5, 7
- ✅ In-app message on confirm/decline — Task 5
- ✅ Stripe webhook → mark confirmed — Task 5
- ✅ Sidebar nav link — Task 10
- ✅ Org categories: studio, dance school, vocal school, etc. — Task 6

**Placeholder scan:** None found.

**Type consistency:**
- `createBooking` defined in Task 2, used in Task 5 ✅
- `getBookingById` defined in Task 2, used in Task 5 ✅
- `updateBookingStatus` defined in Task 2, used in Task 5 ✅
- `OrgForm mode="edit"` props defined in Task 6, used in Task 8 ✅
- `BookingList` takes `bookings` with `service.price` as `string | null` — Task 7 and Task 8 both use `.toString()` ✅
