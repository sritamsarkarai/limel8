# LimeL8 UI Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme the entire LimeL8 UI from a plain white/gray palette to a dark zinc + cyan design system without touching any business logic.

**Architecture:** CSS variables + Tailwind class sweep. All design tokens are defined once in `app/globals.css` under `@theme inline`. Each component file then has its hardcoded light-mode Tailwind classes replaced with dark zinc/cyan equivalents. No new dependencies, no structural changes.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, TypeScript. Google Fonts loaded via `<link>` in `app/layout.tsx`.

---

## File Map

| File | Change |
|---|---|
| `app/globals.css` | Full rewrite — dark tokens + Google Fonts import |
| `app/layout.tsx` | Add Google Fonts preconnect + stylesheet `<link>` tags; remove Geist font imports |
| `app/page.tsx` | Full dark landing page rewrite |
| `app/(auth)/login/page.tsx` | Dark auth card sweep |
| `app/(auth)/register/page.tsx` | Dark auth card sweep |
| `components/layout/Navbar.tsx` | Dark navbar |
| `components/layout/Sidebar.tsx` | Dark sidebar + active state |
| `components/feed/PostCard.tsx` | Dark card |
| `components/feed/PostComposer.tsx` | Dark composer |
| `components/marketplace/ListingCard.tsx` | Dark card + hover lift |
| `components/marketplace/ListingForm.tsx` | Dark form |
| `components/marketplace/BuyButton.tsx` | Cyan CTA button |
| `components/profiles/AvailabilityBadge.tsx` | Cyan/dark badges |
| `components/profiles/IndividualProfileView.tsx` | Dark profile view |
| `components/search/ProfileCard.tsx` | Dark card |
| `components/messaging/ConversationList.tsx` | Dark list |
| `components/messaging/MessageBubble.tsx` | Dark + cyan bubbles |

---

### Task 1: Design Tokens + Fonts (globals.css + layout.tsx)

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/globals.css`**

Replace the entire file contents with:

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Rubik:wght@300;400;500;600;700&display=swap');

:root {
  color-scheme: dark;

  /* Backgrounds */
  --background: #09090b;
  --surface:    #18181b;
  --card:       #27272a;
  --input:      #3f3f46;

  /* Borders */
  --border:        #3f3f46;
  --border-subtle: #27272a;

  /* Accent — Cyan */
  --accent:        #06b6d4;
  --accent-hover:  #0891b2;
  --accent-subtle: #083344;
  --accent-muted:  rgba(6,182,212,0.25);

  /* Text */
  --text-primary: #fafafa;
  --text-muted:   #a1a1aa;
  --text-subtle:  #71717a;
  --text-faint:   #52525b;

  /* Status */
  --success:        #4ade80;
  --success-subtle: #052e16;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--text-primary);
  --font-sans: 'Rubik', system-ui, sans-serif;
  --font-heading: 'Outfit', system-ui, sans-serif;
}

body {
  background: var(--background);
  color: var(--text-primary);
  font-family: var(--font-sans);
}
```

- [ ] **Step 2: Update `app/layout.tsx`**

Replace the entire file with:

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
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Start the dev server and verify no build errors**

```bash
cd C:/Users/C5182688/Documents/limel8
npm run dev
```

Expected: server starts on http://localhost:3000 with no TypeScript errors in the terminal.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add dark zinc + cyan design tokens and Google Fonts"
```

---

### Task 2: Landing Page (app/page.tsx)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

Replace the entire file with:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900">
        <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Lime<span className="text-cyan-400">L8</span>
        </span>
        <div className="flex gap-3 items-center">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-bold text-zinc-950 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors cursor-pointer"
          >
            Sign up free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-950 border border-cyan-500/25">
          Now in open beta — free to join
        </div>
        <h1
          className="text-5xl sm:text-6xl font-extrabold text-white max-w-3xl leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Where artists{" "}
          <span className="text-cyan-400">connect &amp; create</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed">
          Discover collaborators, share your work, and sell your art — all in one place built for creatives.
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            href="/register"
            className="px-7 py-3 text-base font-bold text-zinc-950 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors cursor-pointer"
          >
            Get started free
          </Link>
          <Link
            href="/marketplace"
            className="px-7 py-3 text-base font-semibold text-zinc-300 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            Browse marketplace
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-t border-b border-zinc-800 bg-zinc-900 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {[
            { number: "12,400+", label: "Artists joined" },
            { number: "$0", label: "Fees on sales under $200" },
            { number: "8", label: "Creative disciplines" },
            { number: "Real-time", label: "Messaging & collabs" },
          ].map(({ number, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-cyan-400" style={{ fontFamily: "var(--font-heading)" }}>
                {number}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Everything for creatives
          </h2>
          <p className="mt-3 text-zinc-500">Tools built around how artists actually work and collaborate.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Discover Artists",
              desc: "Find collaborators by discipline, location, and availability. Filter to exactly who you need.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              ),
            },
            {
              title: "Sell Your Work",
              desc: "List digital downloads or physical pieces. Zero fees on sales under $200.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              ),
            },
            {
              title: "Real-time Messaging",
              desc: "DM artists directly. Pitch collaborations, discuss projects, build your network.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
            },
            {
              title: "Artist Feed",
              desc: "Share updates, works-in-progress, and announcements. Follow the artists you love.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
            },
            {
              title: "Artist Groups",
              desc: "Create or join collectives. Manage group profiles, shared listings, and projects.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
              ),
            },
            {
              title: "Availability Status",
              desc: "Let collaborators know when you're open for new projects, commissions, or gigs.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                {icon}
              </div>
              <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t border-zinc-800 bg-zinc-900">
        <h2
          className="text-4xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to <span className="text-cyan-400">create</span>?
        </h2>
        <p className="mt-4 text-zinc-400 max-w-md mx-auto">
          Join thousands of artists already connecting and selling on LimeL8.
        </p>
        <Link
          href="/register"
          className="inline-block mt-8 px-8 py-4 text-base font-bold text-zinc-950 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors cursor-pointer"
        >
          Start for free — no credit card
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-zinc-600 border-t border-zinc-800 bg-zinc-900">
        &copy; {new Date().getFullYear()} LimeL8. Built for artists.
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000. Expected: dark zinc background, cyan accents, white text, no horizontal scroll.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: dark zinc + cyan landing page"
```

---

### Task 3: Auth Pages (login + register)

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/register/page.tsx`

- [ ] **Step 1: Update `app/(auth)/login/page.tsx`**

Replace only the JSX return value (the `return (...)` block). Keep all state/handler logic above unchanged. Replace from line 31 to end of file:

```tsx
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
        <h1
          className="mb-6 text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Sign in to Lime<span className="text-cyan-400">L8</span>
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-zinc-800" />
          <span className="text-sm text-zinc-600">or</span>
          <div className="flex-1 border-t border-zinc-800" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/feed" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/feed" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="#1877F2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.024 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.532-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.097 24 18.1 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
```

- [ ] **Step 2: Update `app/(auth)/register/page.tsx`**

Replace only the `return (...)` block (from line 35 to end of file):

```tsx
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
        <h1
          className="mb-6 text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Create your account
        </h1>

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
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
  );
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/login and http://localhost:3000/register. Expected: dark zinc card, cyan inputs on focus, cyan submit button, no white backgrounds.

- [ ] **Step 4: Commit**

```bash
git add app/\(auth\)/login/page.tsx app/\(auth\)/register/page.tsx
git commit -m "feat: dark zinc auth pages (login + register)"
```

---

### Task 4: Navbar + Sidebar

**Files:**
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Replace `components/layout/Navbar.tsx`**

```tsx
import Link from "next/link";

type Profile = { id: string; name: string; avatarUrl?: string | null };

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-700 px-6 py-3 flex items-center gap-4">
      <Link
        href="/feed"
        className="font-bold text-lg text-white cursor-pointer"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Lime<span className="text-cyan-400">L8</span>
      </Link>
      <form method="get" action="/search" className="flex-1 max-w-md">
        <input
          name="query"
          type="text"
          placeholder="Search artists..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
        />
      </form>
      <Link
        href="/messages"
        className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
              className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/40"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-sm font-semibold">
              {profile.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Replace `components/layout/Sidebar.tsx`**

```tsx
import Link from "next/link";

type Profile = { id: string };

const NAV_LINKS = [
  {
    href: "/feed",
    label: "Feed",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Discover",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Messages",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: "/settings/subscription",
    label: "Subscription",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  return (
    <aside className="w-56 border-r border-zinc-700 bg-zinc-900 p-3 space-y-1">
      {NAV_LINKS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          {icon}
          {label}
        </Link>
      ))}
      {profile && (
        <Link
          href={`/profile/p_${profile.id}`}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          My Profile
        </Link>
      )}
    </aside>
  );
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/feed (if logged in). Expected: dark zinc navbar, sidebar with icons, no white backgrounds, messages link is an SVG icon not an emoji.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Navbar.tsx components/layout/Sidebar.tsx
git commit -m "feat: dark zinc navbar and sidebar with SVG icons"
```

---

### Task 5: Feed Components (PostCard + PostComposer)

**Files:**
- Modify: `components/feed/PostCard.tsx`
- Modify: `components/feed/PostComposer.tsx`

- [ ] **Step 1: Replace `components/feed/PostCard.tsx`**

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
    <article className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
      <div className="mb-3 flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={authorName}
            className="h-10 w-10 rounded-full object-cover border-2 border-zinc-600"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/25 text-sm font-semibold text-cyan-400">
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
              className="w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Replace `components/feed/PostComposer.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PostComposer() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create post");
        return;
      }

      setContent("");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are you working on?"
        rows={3}
        className="w-full resize-none rounded-lg border border-zinc-600 bg-zinc-700 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
        disabled={loading}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Verify in browser**

Open the feed page. Expected: dark zinc post cards, cyan avatar initials, zinc textarea with cyan focus ring.

- [ ] **Step 4: Commit**

```bash
git add components/feed/PostCard.tsx components/feed/PostComposer.tsx
git commit -m "feat: dark zinc feed components (PostCard + PostComposer)"
```

---

### Task 6: Marketplace Components (ListingCard + ListingForm + BuyButton)

**Files:**
- Modify: `components/marketplace/ListingCard.tsx`
- Modify: `components/marketplace/ListingForm.tsx`
- Modify: `components/marketplace/BuyButton.tsx`

- [ ] **Step 1: Replace `components/marketplace/ListingCard.tsx`**

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

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-xl border border-zinc-700 bg-zinc-800 overflow-hidden hover:-translate-y-0.5 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer"
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
          <span className="text-base font-bold text-cyan-400">${priceDisplay}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
              listing.type === "digital"
                ? "bg-cyan-950 text-cyan-400 border-cyan-500/25"
                : "bg-green-950 text-green-400 border-green-500/25"
            }`}
          >
            {listing.type === "digital" ? "Digital" : "Physical"}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Replace `components/marketplace/BuyButton.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
    >
      {loading ? "Redirecting..." : "Buy Now"}
    </button>
  );
}
```

- [ ] **Step 3: Replace `components/marketplace/ListingForm.tsx`**

Replace the JSX in the `return` block only (keep all state and handler logic above unchanged). Replace from the `return (` at line 54 to end of file:

```tsx
  return (
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
          className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
          className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
          className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
          className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
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
            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {loading ? "Creating..." : "Create Listing"}
      </button>
    </form>
  );
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:3000/marketplace. Expected: dark cards with cyan prices, badges with proper colors, hover lift effect.

- [ ] **Step 5: Commit**

```bash
git add components/marketplace/ListingCard.tsx components/marketplace/BuyButton.tsx components/marketplace/ListingForm.tsx
git commit -m "feat: dark zinc marketplace components"
```

---

### Task 7: Profile Components (AvailabilityBadge + ProfileCard + IndividualProfileView)

**Files:**
- Modify: `components/profiles/AvailabilityBadge.tsx`
- Modify: `components/search/ProfileCard.tsx`
- Modify: `components/profiles/IndividualProfileView.tsx`

- [ ] **Step 1: Replace `components/profiles/AvailabilityBadge.tsx`**

```tsx
const LABELS: Record<string, string> = {
  available_for_hire: "Available for Hire",
  open_to_collab: "Open to Collab",
  open_to_join: "Open to Join",
  not_available: "Not Available",
};

const COLORS: Record<string, string> = {
  available_for_hire: "bg-cyan-950 text-cyan-400 border border-cyan-500/25",
  open_to_collab:     "bg-cyan-950 text-cyan-400 border border-cyan-500/25",
  open_to_join:       "bg-cyan-950 text-cyan-400 border border-cyan-500/25",
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

- [ ] **Step 2: Replace `components/search/ProfileCard.tsx`**

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
      className="block rounded-xl border border-zinc-700 bg-zinc-800 p-4 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-14 w-14 rounded-full object-cover flex-shrink-0 border-2 border-zinc-600"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-cyan-950 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
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

- [ ] **Step 3: Replace `components/profiles/IndividualProfileView.tsx`**

```tsx
import { AvailabilityBadge } from "./AvailabilityBadge";

type SocialLinks = {
  instagramUrl?: string | null;
  spotifyUrl?: string | null;
  soundcloudUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
};

type Listing = {
  id: string;
  title: string;
  price: { toString(): string };
  type: string;
  status: string;
};

type Post = {
  id: string;
  content: string;
  createdAt: Date;
};

type Profile = {
  id: string;
  name: string;
  bio?: string | null;
  artistType?: string | null;
  location?: string | null;
  availabilityStatus: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  listings: Listing[];
  posts?: Post[];
} & SocialLinks;

export function IndividualProfileView({ profile }: { profile: Profile }) {
  const socialLinks = [
    { label: "Instagram", url: profile.instagramUrl },
    { label: "Spotify", url: profile.spotifyUrl },
    { label: "SoundCloud", url: profile.soundcloudUrl },
    { label: "YouTube", url: profile.youtubeUrl },
    { label: "Website", url: profile.websiteUrl },
  ].filter((l) => l.url);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Banner */}
      <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-cyan-900">
        {profile.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.bannerUrl}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar + info */}
      <div className="flex items-start gap-4 -mt-10 px-2">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-zinc-950 shadow-lg flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-cyan-950 border-4 border-zinc-950 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-cyan-400">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 space-y-1 mt-10">
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {profile.name}
          </h1>
          {profile.artistType && (
            <p className="text-sm text-zinc-400">{profile.artistType}</p>
          )}
          {profile.location && (
            <p className="text-sm text-zinc-500">{profile.location}</p>
          )}
          <div className="pt-1">
            <AvailabilityBadge status={profile.availabilityStatus} />
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div>
          <h2 className="text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Bio</h2>
          <p className="text-zinc-400 whitespace-pre-wrap text-sm leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Links</h2>
          <ul className="flex flex-wrap gap-2">
            {socialLinks.map(({ label, url }) => (
              <li key={label}>
                <a
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 border border-zinc-700 bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Listings */}
      {profile.listings.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Listings</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.listings.map((listing) => (
              <li
                key={listing.id}
                className="border border-zinc-700 bg-zinc-800 rounded-xl p-3 space-y-1"
              >
                <p className="font-medium text-white text-sm">{listing.title}</p>
                <p className="text-xs text-zinc-500 capitalize">{listing.type}</p>
                <p className="text-sm font-bold text-cyan-400">${listing.price.toString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Posts */}
      {profile.posts && profile.posts.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Posts</h2>
          <ul className="space-y-3">
            {profile.posts.map((post) => (
              <li key={post.id} className="border border-zinc-700 bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser**

Open any artist profile. Expected: dark zinc cards, cyan availability badges, cyan social link buttons, banner with fallback gradient.

- [ ] **Step 4b: Replace `components/profiles/GroupProfileView.tsx`**

```tsx
type Profile = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type Member = {
  profileId: string;
  profile: Profile;
  joinedAt: Date;
};

type Post = {
  id: string;
  content: string;
  createdAt: Date;
};

type Group = {
  id: string;
  name: string;
  description?: string | null;
  bannerUrl?: string | null;
  adminId: string;
  admin: Profile;
  members: Member[];
  posts: Post[];
};

export function GroupProfileView({ group }: { group: Group }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Banner */}
      <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-cyan-900">
        {group.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={group.bannerUrl}
            alt="Group banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {group.name}
        </h1>
        {group.description && (
          <p className="text-zinc-400 mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {group.description}
          </p>
        )}
      </div>

      <div>
        <h2
          className="text-base font-semibold text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Members ({group.members.length})
        </h2>
        <ul className="space-y-2">
          {group.members.map((member) => (
            <li key={member.profileId} className="flex items-center gap-3">
              {member.profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.profile.avatarUrl}
                  alt={member.profile.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/25 flex items-center justify-center text-xs font-semibold text-cyan-400">
                  {member.profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-zinc-300">{member.profile.name}</span>
              {member.profileId === group.adminId && (
                <span className="text-xs bg-zinc-700 text-zinc-300 border border-zinc-600 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {group.posts.length > 0 && (
        <div>
          <h2
            className="text-base font-semibold text-white mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Posts
          </h2>
          <ul className="space-y-3">
            {group.posts.map((post) => (
              <li key={post.id} className="border border-zinc-700 bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/profiles/AvailabilityBadge.tsx components/search/ProfileCard.tsx components/profiles/IndividualProfileView.tsx components/profiles/GroupProfileView.tsx
git commit -m "feat: dark zinc profile components (badges, cards, individual + group views)"
```

---

### Task 8: Messaging Components (ConversationList + MessageBubble)

**Files:**
- Modify: `components/messaging/ConversationList.tsx`
- Modify: `components/messaging/MessageBubble.tsx`

- [ ] **Step 1: Replace `components/messaging/ConversationList.tsx`**

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
    <ul className="divide-y divide-zinc-800">
      {conversations.map((convo) => {
        const otherProfile =
          convo.sender.id === currentProfileId ? convo.recipient : convo.sender;

        return (
          <li key={convo.id}>
            <Link
              href={`/messages/${otherProfile.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {otherProfile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={otherProfile.avatarUrl}
                  alt={otherProfile.name}
                  className="h-10 w-10 rounded-full object-cover border border-zinc-600"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/25 text-sm font-semibold text-cyan-400">
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

- [ ] **Step 2: Replace `components/messaging/MessageBubble.tsx`**

```tsx
interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    createdAt: string | Date;
    senderId: string;
  };
  currentProfileId: string;
}

export function MessageBubble({ message, currentProfileId }: MessageBubbleProps) {
  const isSent = message.senderId === currentProfileId;
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${
          isSent
            ? "bg-cyan-500 text-zinc-950"
            : "bg-zinc-800 text-zinc-200 border border-zinc-700"
        }`}
      >
        <p>{message.content}</p>
        <p className={`mt-1 text-xs ${isSent ? "text-cyan-900" : "text-zinc-500"}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/messages. Expected: dark zinc conversation list, cyan avatars, sent messages in cyan, received in zinc-800.

- [ ] **Step 4: Commit**

```bash
git add components/messaging/ConversationList.tsx components/messaging/MessageBubble.tsx
git commit -m "feat: dark zinc messaging components"
```

---

### Task 9: Final check + .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .superpowers to .gitignore**

```bash
cd C:/Users/C5182688/Documents/limel8
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 2: Verify no TypeScript errors across the project**

```bash
npx tsc --noEmit
```

Expected: no errors output. If errors appear, fix the reported type issues before proceeding.

- [ ] **Step 3: Visual smoke test — visit all pages**

With the dev server running (http://localhost:3000), check each route:
- `/` — dark landing page, cyan CTAs
- `/login` — dark card, cyan inputs/button
- `/register` — dark card, cyan inputs/button
- `/feed` — dark navbar + sidebar, zinc post cards
- `/search` — dark profile cards with cyan badges
- `/marketplace` — dark listing grid, cyan prices
- `/messages` — dark conversation list
- Any profile page — dark banner/avatar, cyan badges

Expected: consistent dark zinc + cyan across all pages, no white flash, no broken layouts.

- [ ] **Step 4: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to .gitignore"
```
