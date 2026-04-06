# Glow & Gradient UI Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the cyan→violet glow & gradient design system across all LimeL8 pages and components to make the app feel energetic and vibrant.

**Architecture:** Pure visual changes only — CSS class and inline style updates via Tailwind. Two new CSS custom properties added to `globals.css` for the violet accent. No new files, no new dependencies, no logic changes. Implementation order follows spec: global shell first (highest leverage), then page by page.

**Tech Stack:** Next.js 16, Tailwind CSS v4, React. No new packages.

---

## Glow Reference (copy-paste these throughout)

```
Level 2 cyan (cards at rest):
  border: border-cyan-500/[0.27]
  shadow: shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]

Level 3 cyan (hover/focus):
  border: border-cyan-500/[0.4]
  shadow: shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16),0_0_40px_rgba(34,211,238,0.06)]

Level 2 violet (physical cards at rest):
  border: border-violet-400/[0.27]
  shadow: shadow-[0_0_0_1px_rgba(167,139,250,0.13),0_0_20px_rgba(167,139,250,0.13),0_0_40px_rgba(167,139,250,0.05)]

Level 3 violet (hover):
  border: border-violet-400/[0.4]
  shadow: shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_20px_rgba(167,139,250,0.16),0_0_40px_rgba(167,139,250,0.06)]

Gradient button:
  className="bg-gradient-to-r from-cyan-400 to-violet-400 text-zinc-950 font-bold"
  shadow: shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]

Gradient text:
  className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
```

---

### Task 1: Add violet CSS variable and background blooms to globals.css + root layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add violet accent variable to globals.css**

Open `app/globals.css`. In the `:root` block, add two lines after the `--accent-muted` line:

```css
  /* Accent — Violet */
  --violet:        #a78bfa;
  --violet-subtle: #1e1b4b;
```

- [ ] **Step 2: Add background bloom pseudo-elements to root layout**

Open `app/layout.tsx`. Replace the entire file with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LimeL8",
  description: "Connect, collaborate, and sell your art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="relative min-h-full flex flex-col bg-zinc-950 text-white overflow-x-hidden">
        {/* Cyan bloom — top-left */}
        <div
          className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] -translate-x-1/3 -translate-y-1/3"
          style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.04) 0%, transparent 70%)" }}
        />
        {/* Violet bloom — bottom-right */}
        <div
          className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[600px] translate-x-1/3 translate-y-1/3"
          style={{ background: "radial-gradient(ellipse at center, rgba(167,139,250,0.04) 0%, transparent 70%)" }}
        />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add violet accent var and background blooms to root layout"
```

---

### Task 2: Navbar — gradient logo + glow search

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Apply gradient logo and glow search input**

Replace the entire file content with:

```tsx
import Link from "next/link";

type Profile = { id: string; name: string; avatarUrl?: string | null };

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="bg-zinc-900 border-b border-cyan-500/10 px-6 py-3 flex items-center gap-4">
      <Link
        href="/feed"
        className="font-bold text-lg text-white cursor-pointer shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Lime<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">L8</span>
      </Link>
      <form method="get" action="/search" className="flex-1 max-w-md">
        <input
          name="query"
          type="text"
          placeholder="Search artists..."
          className="w-full bg-zinc-800 border border-cyan-500/[0.27] rounded-lg px-3 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
        />
      </form>
      <Link
        href="/messages"
        className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-colors duration-200 cursor-pointer"
        aria-label="Messages"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </Link>
      {profile && (
        <Link
          href={`/profile/p_${profile.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-sm font-semibold shadow-[0_0_8px_rgba(34,211,238,0.2)]">
              {profile.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: gradient logo and glow search input in Navbar"
```

---

### Task 3: Sidebar — active glow indicator

**Files:**
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Add active glow state to sidebar nav items**

The sidebar has no way to know the active route without a client component. We'll make it a client component using `usePathname`. Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Profile = { id: string };

const NAV_LINKS = [
  {
    href: "/feed",
    label: "Feed",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Discover",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Messages",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: "/settings/subscription",
    label: "Subscription",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-cyan-500/10 bg-zinc-900 p-3 space-y-1">
      {NAV_LINKS.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
              isActive
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-cyan-400 rounded-r shadow-[0_0_6px_#22d3ee]" />
            )}
            {icon}
            {label}
          </Link>
        );
      })}
      {profile && (
        <>
          <Link
            href={`/profile/p_${profile.id}`}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
              pathname.startsWith("/profile")
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
          >
            {pathname.startsWith("/profile") && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-cyan-400 rounded-r shadow-[0_0_6px_#22d3ee]" />
            )}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            My Profile
          </Link>
          <Link
            href="/settings/profile"
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
              pathname === "/settings/profile"
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
          >
            {pathname === "/settings/profile" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-cyan-400 rounded-r shadow-[0_0_6px_#22d3ee]" />
            )}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </Link>
        </>
      )}
    </aside>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/layout/Sidebar.tsx
git commit -m "feat: active glow indicator and gradient border on sidebar nav"
```

---

### Task 4: Register page — glow card + gradient button

**Files:**
- Modify: `app/(auth)/register/page.tsx`

- [ ] **Step 1: Apply glow card, gradient button, gradient logo**

Replace the return JSX (keep all logic unchanged — only the JSX return block changes):

```tsx
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Create your <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">LimeL8</span> account
          </h1>
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
          {error && (
            <div className="mb-4 rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/register/page.tsx"
git commit -m "feat: glow card and gradient button on register page"
```

---

### Task 5: Login page — glow card + gradient button

**Files:**
- Modify: `app/(auth)/login/page.tsx`

The login page already has animations from the previous task. Now apply the glow card border and gradient button, keeping all animations intact.

- [ ] **Step 1: Update card border and button**

The card div currently has `className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8"`.

Change the card div className to:
```
w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]
```
(keep the existing `style={{ animation: ... }}` prop unchanged)

Change the submit button className to:
```
w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]
```

Update all three input classNames to:
```
mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/login/page.tsx"
git commit -m "feat: glow card border and gradient button on login page"
```

---

### Task 6: ListingCard — type-aware glow

**Files:**
- Modify: `components/marketplace/ListingCard.tsx`

- [ ] **Step 1: Apply type-aware glow — cyan for digital, violet for physical**

Replace the entire file with:

```tsx
import Link from "next/link";
import Image from "next/image";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number | { toString(): string };
    type: "digital" | "physical";
    status: string;
    previewMediaUrls?: string[] | null;
    seller: {
      name: string;
      avatarUrl?: string | null;
    };
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const previewImage = listing.previewMediaUrls?.[0] ?? null;
  const priceDisplay =
    typeof listing.price === "object"
      ? listing.price.toString()
      : listing.price.toFixed(2);

  const isDigital = listing.type === "digital";

  const cardGlow = isDigital
    ? "border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)] hover:border-cyan-500/[0.4] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16),0_0_40px_rgba(34,211,238,0.06)]"
    : "border-violet-400/[0.27] shadow-[0_0_0_1px_rgba(167,139,250,0.13),0_0_20px_rgba(167,139,250,0.13),0_0_40px_rgba(167,139,250,0.05)] hover:border-violet-400/[0.4] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_20px_rgba(167,139,250,0.16),0_0_40px_rgba(167,139,250,0.06)]";

  const priceColor = isDigital ? "text-cyan-400" : "text-violet-400";

  const badgeClass = isDigital
    ? "bg-cyan-950 text-cyan-400 border-cyan-500/25"
    : "bg-violet-950/60 text-violet-400 border-violet-400/25";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`block rounded-xl border bg-zinc-800 overflow-hidden hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${cardGlow}`}
    >
      <div className="aspect-square w-full bg-zinc-700 relative">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
            No preview
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white truncate">{listing.title}</h3>
        <p className="text-sm text-zinc-500 truncate mt-0.5">{listing.seller.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-base font-bold ${priceColor}`}>${priceDisplay}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${badgeClass}`}>
            {isDigital ? "Digital" : "Physical"}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/marketplace/ListingCard.tsx
git commit -m "feat: type-aware cyan/violet glow on ListingCard"
```

---

### Task 7: Marketplace browse page + listings page — gradient heading + gradient button

**Files:**
- Modify: `app/(main)/marketplace/page.tsx`
- Modify: `app/(main)/listings/page.tsx`

- [ ] **Step 1: Update marketplace/page.tsx**

Replace the return JSX with:

```tsx
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          Marketplace
        </h1>
        <Link
          href="/marketplace/new"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:opacity-90 transition-opacity"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="py-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 60%)", width: 400, height: 400 }} />
          </div>
          <p className="relative text-zinc-400">No listings yet. Be the first to list something!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing: (typeof listings)[number]) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {listings.length === 24 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/marketplace?cursor=${listings[listings.length - 1].id}`}
            className="rounded-lg border border-cyan-500/[0.27] px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-cyan-500/[0.4] shadow-[0_0_0_1px_rgba(34,211,238,0.13)] transition-all"
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
```

Keep all imports and the `searchParams` prop unchanged.

- [ ] **Step 2: Update listings/page.tsx**

Replace the return JSX with:

```tsx
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-6" style={{ fontFamily: "var(--font-heading)" }}>
        Marketplace
      </h1>

      {listings.length === 0 ? (
        <div className="py-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 60%)", width: 400, height: 400 }} />
          </div>
          <p className="relative text-zinc-400">No listings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
```

Keep all imports unchanged.

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/marketplace/page.tsx" "app/(main)/listings/page.tsx"
git commit -m "feat: gradient heading and button on marketplace browse pages"
```

---

### Task 8: Listing detail page — gradient price + glow images + gradient buy button

**Files:**
- Modify: `app/(main)/listings/[id]/page.tsx`

- [ ] **Step 1: Update listing detail JSX**

The file is a server component. Update only the JSX return. Replace everything from `return (` to the end of the file with:

```tsx
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4">
        <Link href="/marketplace" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          &larr; Back to Marketplace
        </Link>
      </div>

      {listing.previewMediaUrls.length > 0 && (
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {listing.previewMediaUrls.map((url: string, i: number) => (
            <div key={i} className="relative aspect-square w-full bg-zinc-800 rounded-lg overflow-hidden border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]">
              <Image src={url} alt={`${listing.title} preview ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{listing.title}</h1>
          <span
            className={`shrink-0 text-sm px-2.5 py-1 rounded-full font-medium border ${
              listing.type === "digital"
                ? "bg-cyan-950 text-cyan-400 border-cyan-500/25 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                : "bg-violet-950/60 text-violet-400 border-violet-400/25 shadow-[0_0_8px_rgba(167,139,250,0.2)]"
            }`}
          >
            {listing.type === "digital" ? "Digital" : "Physical"}
          </span>
        </div>

        <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
          ${priceDisplay}
        </p>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          {listing.seller.avatarUrl && (
            <Image
              src={listing.seller.avatarUrl}
              alt={listing.seller.name}
              width={24}
              height={24}
              className="rounded-full border border-cyan-500/40"
            />
          )}
          <span>Sold by <strong className="text-white">{listing.seller.name}</strong></span>
        </div>

        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{listing.description}</p>

        {listing.type === "digital" && (
          <p className="text-sm text-cyan-400 font-medium">Digital download — delivered instantly</p>
        )}

        {listing.type === "physical" && listing.stockQuantity != null && (
          <p className="text-sm text-zinc-400">
            {listing.stockQuantity > 0
              ? `${listing.stockQuantity} in stock`
              : "Out of stock"}
          </p>
        )}

        {listing.status === "active" && (
          <BuyButton listingId={listing.id} />
        )}

        {listing.status === "sold" && (
          <p className="text-sm font-medium text-zinc-500">This listing has been sold.</p>
        )}

        {listing.status === "draft" && (
          isSellerWithNoBankAccount ? (
            <ConnectStripeButton />
          ) : (
            <p className="text-sm font-medium text-zinc-500">This listing is not yet published.</p>
          )
        )}
      </div>
    </main>
  );
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/listings/[id]/page.tsx"
git commit -m "feat: gradient price, glow images, glow type badge on listing detail"
```

---

### Task 9: ListingForm — glow card + glow inputs + gradient button

**Files:**
- Modify: `components/marketplace/ListingForm.tsx`

- [ ] **Step 1: Apply glow card wrapper and gradient button**

Replace the return JSX only (keep all logic/state):

```tsx
  return (
    <div className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-zinc-300">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-zinc-300">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as "digital" | "physical")}
            className={`mt-1 block w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none cursor-pointer transition-all ${
              type === "digital"
                ? "border-cyan-500/[0.4] shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_12px_rgba(34,211,238,0.13)]"
                : "border-violet-400/[0.4] shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_12px_rgba(167,139,250,0.13)]"
            }`}
          >
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        {type === "physical" && (
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-zinc-300">
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              className="mt-1 block w-full rounded-lg border border-violet-400/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-400/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(167,139,250,0.13),0_0_12px_rgba(167,139,250,0.08)] focus:shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_20px_rgba(167,139,250,0.16)]"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/marketplace/ListingForm.tsx
git commit -m "feat: glow card and gradient button on ListingForm"
```

---

### Task 10: Feed page + PostCard + PostComposer

**Files:**
- Modify: `app/(main)/feed/page.tsx`
- Modify: `components/feed/PostCard.tsx`
- Modify: `components/feed/PostComposer.tsx`

- [ ] **Step 1: Update feed/page.tsx heading**

In `app/(main)/feed/page.tsx`, change:

```tsx
<h1 className="mb-6 text-2xl font-bold text-gray-900">Your Feed</h1>
```

To:

```tsx
<h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>Your Feed</h1>
```

Also change the empty state:

```tsx
<p className="text-center text-gray-500">
  No posts yet. Follow some profiles or groups to see their posts here.
</p>
```

To:

```tsx
<p className="text-center text-zinc-500">
  No posts yet. Follow some profiles or groups to see their posts here.
</p>
```

- [ ] **Step 2: Update PostCard**

Replace the entire `components/feed/PostCard.tsx` with:

```tsx
type PostCardProps = {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    mediaUrls?: string[] | null;
    profile?: { name: string; avatarUrl?: string | null } | null;
    group?: { name: string } | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const authorName = post.profile?.name ?? post.group?.name ?? "Unknown";
  const avatarUrl = post.profile?.avatarUrl;

  return (
    <article className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <div className="mb-3 flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={authorName}
            className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/40 text-sm font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{authorName}</p>
          <time className="text-xs text-zinc-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">{post.content}</p>
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {post.mediaUrls.map((url: string, index: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full rounded-lg object-cover border border-cyan-500/[0.27]"
            />
          ))}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 3: Update PostComposer**

Replace the return JSX only (keep all logic/state):

```tsx
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are you working on?"
        rows={3}
        className="w-full resize-none rounded-lg border border-cyan-500/[0.27] bg-zinc-800 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
        disabled={loading}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 transition-opacity cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]"
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
```

- [ ] **Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/feed/page.tsx" components/feed/PostCard.tsx components/feed/PostComposer.tsx
git commit -m "feat: glow cards and gradient buttons on feed components"
```

---

### Task 11: Messages — glow conversation list + dark send form

**Files:**
- Modify: `components/messaging/ConversationList.tsx`
- Modify: `app/(main)/messages/page.tsx`
- Modify: `app/(main)/messages/[profileId]/page.tsx`

- [ ] **Step 1: Update ConversationList**

Replace the entire file with:

```tsx
import Link from "next/link";

interface Conversation {
  id: string;
  content: string;
  createdAt: string | Date;
  sender: { id: string; name: string; avatarUrl?: string | null };
  recipient: { id: string; name: string; avatarUrl?: string | null };
}

interface ConversationListProps {
  conversations: Conversation[];
  currentProfileId: string;
}

export function ConversationList({ conversations, currentProfileId }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <p className="py-16 text-center text-zinc-500">
        No conversations yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-800 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 overflow-hidden shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      {conversations.map((convo) => {
        const otherProfile =
          convo.sender.id === currentProfileId ? convo.recipient : convo.sender;

        return (
          <li key={convo.id}>
            <Link
              href={`/messages/${otherProfile.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
            >
              {otherProfile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={otherProfile.avatarUrl}
                  alt={otherProfile.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.15)]"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/40 text-sm font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.15)]">
                  {otherProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white text-sm">{otherProfile.name}</p>
                <p className="truncate text-sm text-zinc-500">{convo.content}</p>
              </div>
              <p className="text-xs text-zinc-600">
                {new Date(convo.createdAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Update messages/page.tsx heading**

In `app/(main)/messages/page.tsx`, change:

```tsx
<h1 className="mb-6 text-2xl font-bold text-gray-900">Messages</h1>
```

To:

```tsx
<h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>Messages</h1>
```

- [ ] **Step 3: Update conversation page send form**

In `app/(main)/messages/[profileId]/page.tsx`, update the empty state and send form at the bottom. Change:

```tsx
<p className="py-8 text-center text-gray-500">
  No messages yet. Say hello!
</p>
```

To:

```tsx
<p className="py-8 text-center text-zinc-500">
  No messages yet. Say hello!
</p>
```

And change the send form at the bottom:

```tsx
<form onSubmit={handleSend} className="flex gap-2 border-t border-gray-200 pt-4">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    disabled={sending}
  />
  <button
    type="submit"
    disabled={sending || !newMessage.trim()}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
  >
    Send
  </button>
</form>
```

To:

```tsx
<form onSubmit={handleSend} className="flex gap-2 border-t border-cyan-500/10 pt-4">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
    disabled={sending}
  />
  <button
    type="submit"
    disabled={sending || !newMessage.trim()}
    className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-[0_0_12px_rgba(34,211,238,0.2)]"
  >
    Send
  </button>
</form>
```

- [ ] **Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add components/messaging/ConversationList.tsx "app/(main)/messages/page.tsx" "app/(main)/messages/[profileId]/page.tsx"
git commit -m "feat: glow conversation list and dark send form on messages"
```

---

### Task 12: ProfileCard + IndividualProfileView + AvailabilityBadge

**Files:**
- Modify: `components/search/ProfileCard.tsx`
- Modify: `components/profiles/IndividualProfileView.tsx`
- Modify: `components/profiles/AvailabilityBadge.tsx`

- [ ] **Step 1: Update ProfileCard**

Replace the entire file with:

```tsx
import Link from "next/link";
import { AvailabilityBadge } from "@/components/profiles/AvailabilityBadge";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    artistType?: string | null;
    location?: string | null;
    availabilityStatus: string;
    avatarUrl?: string | null;
  };
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link
      href={`/profile/p_${profile.id}`}
      className="block rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 hover:border-cyan-500/[0.4] hover:-translate-y-0.5 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16),0_0_40px_rgba(34,211,238,0.06)] transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-14 w-14 rounded-full object-cover flex-shrink-0 border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            <span className="text-xl font-semibold text-cyan-400">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{profile.name}</h3>
          {profile.artistType && (
            <p className="text-sm text-zinc-400 truncate mt-0.5">{profile.artistType}</p>
          )}
          {profile.location && (
            <p className="text-sm text-zinc-500 truncate">{profile.location}</p>
          )}
          <div className="mt-2">
            <AvailabilityBadge status={profile.availabilityStatus} />
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Update AvailabilityBadge with glow**

Replace the entire file with:

```tsx
const LABELS: Record<string, string> = {
  available_for_hire: "Available for Hire",
  open_to_collab: "Open to Collab",
  open_to_join: "Open to Join",
  not_available: "Not Available",
};

const COLORS: Record<string, string> = {
  available_for_hire: "bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_6px_rgba(34,211,238,0.2)]",
  open_to_collab:     "bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_6px_rgba(34,211,238,0.2)]",
  open_to_join:       "bg-violet-950/60 text-violet-400 border border-violet-400/40 shadow-[0_0_6px_rgba(167,139,250,0.2)]",
  not_available:      "bg-zinc-800 text-zinc-500 border border-zinc-700",
};

export function AvailabilityBadge({ status }: { status: string }) {
  const label = LABELS[status] ?? status;
  const colorClass = COLORS[status] ?? "bg-zinc-800 text-zinc-500 border border-zinc-700";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 3: Update IndividualProfileView — glow listing cards + gradient edit button**

In `components/profiles/IndividualProfileView.tsx`, make these targeted changes:

Change the "Edit Profile" link className from:
```
text-xs font-medium text-zinc-400 hover:text-white border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer
```
To:
```
text-xs font-medium text-zinc-950 bg-gradient-to-r from-cyan-400 to-violet-400 px-3 py-1 rounded-lg transition-opacity hover:opacity-90 cursor-pointer font-bold shadow-[0_0_8px_rgba(34,211,238,0.2)]
```

Change each listing `<li>` className from:
```
border border-zinc-700 bg-zinc-800 rounded-xl p-3 space-y-1
```
To:
```
border border-cyan-500/[0.27] bg-zinc-900 rounded-xl p-3 space-y-1 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]
```

Change each post `<li>` className from:
```
border border-zinc-700 bg-zinc-800 rounded-xl p-4
```
To:
```
border border-cyan-500/[0.27] bg-zinc-900 rounded-xl p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]
```

Change social link `<a>` className from:
```
text-xs font-medium text-cyan-400 hover:text-cyan-300 border border-zinc-700 bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer
```
To:
```
text-xs font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-500/[0.27] bg-zinc-900 px-3 py-1.5 rounded-lg shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_8px_rgba(34,211,238,0.08)] transition-colors duration-200 cursor-pointer
```

- [ ] **Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add components/search/ProfileCard.tsx components/profiles/IndividualProfileView.tsx components/profiles/AvailabilityBadge.tsx
git commit -m "feat: glow borders and gradient edit button on profile components"
```

---

### Task 13: Push to Vercel

- [ ] **Step 1: Final type check**

Run: `npx tsc --noEmit`
Expected: no output (zero errors)

- [ ] **Step 2: Push**

```bash
git push origin main
```

Expected: `main -> main` push confirmation. Vercel deploys automatically.
