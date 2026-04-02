# Login Page Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a staggered fade-up entrance animation to the login page so each element arrives on screen sequentially with a spring-like easing.

**Architecture:** A `<style>` JSX tag inside `login/page.tsx` defines two CSS keyframes (`fadeUp`, `bloomIn`). A fixed bloom div is added behind the page. Each form section gets an inline `style` prop with the appropriate `animation` shorthand. No new files, no new dependencies.

**Tech Stack:** Next.js 16 (App Router), React (`"use client"`), pure CSS keyframes

---

### Task 1: Add keyframes and bloom div

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Add the `<style>` block and bloom div**

Open `app/(auth)/login/page.tsx`. After the opening `<div className="flex min-h-screen ...">`, add a fixed bloom div and a `<style>` tag. Replace the outer return JSX wrapper as shown:

```tsx
return (
  <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes bloomIn {
        from { opacity: 0; transform: scale(0.8); }
        to   { opacity: 1; transform: scale(1); }
      }
    `}</style>

    {/* Background bloom */}
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.08) 0%, transparent 60%)",
        animation: "bloomIn 900ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    />

    {/* rest of existing content below — unchanged for now */}
```

- [ ] **Step 2: Verify the page still renders without errors**

Run: `npx tsc --noEmit`  
Expected: no output (zero errors)

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/login/page.tsx"
git commit -m "feat: add fadeUp/bloomIn keyframes and bloom bg to login page"
```

---

### Task 2: Animate the logo

**Files:**
- Modify: `app/(auth)/login/page.tsx`

The logo `<h1>` currently has no wrapper. Wrap it in a div and apply the logo animation.

- [ ] **Step 1: Wrap the h1 in an animated div**

Find this in the JSX:

```tsx
<div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
  <h1
    className="mb-6 text-2xl font-bold text-white"
    style={{ fontFamily: "var(--font-heading)" }}
  >
    Sign in to Lime<span className="text-cyan-400">L8</span>
  </h1>
```

Replace with:

```tsx
<div
  style={{ animation: "fadeUp 500ms cubic-bezier(0.16,1,0.3,1) 0ms both" }}
>
  <h1
    className="mb-6 text-2xl font-bold text-white"
    style={{ fontFamily: "var(--font-heading)" }}
  >
    Sign in to Lime<span className="text-cyan-400">L8</span>
  </h1>
</div>
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`  
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/login/page.tsx"
git commit -m "feat: animate logo on login page load"
```

---

### Task 3: Animate the card container

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Add animation to the card div**

Find:

```tsx
<div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
```

Replace with:

```tsx
<div
  className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8"
  style={{ animation: "fadeUp 500ms cubic-bezier(0.16,1,0.3,1) 100ms both" }}
>
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`  
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/login/page.tsx"
git commit -m "feat: animate card container on login page load"
```

---

### Task 4: Stagger the form fields

**Files:**
- Modify: `app/(auth)/login/page.tsx`

Apply staggered animations to each field div and the submit button inside the form. The error alert is left untouched (renders at full opacity immediately).

- [ ] **Step 1: Wrap each field and button in an animated div**

Inside the `<form>` element, the current structure is:

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div>  {/* email field */}
  <div>  {/* password field */}
  <button type="submit" ...>
```

Add `style` animation props to each:

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 200ms both" }}>
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

  <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 300ms both" }}>
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

  <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 400ms both" }}>
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {loading ? "Signing in…" : "Sign in"}
    </button>
  </div>
</form>
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`  
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/login/page.tsx"
git commit -m "feat: stagger form fields on login page load"
```

---

### Task 5: Animate social buttons and footer

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Wrap the divider+social section and the footer paragraph**

Find the divider section (after the `</form>`):

```tsx
<div className="my-6 flex items-center gap-3">
```

Wrap the divider + both social buttons together in one animated div:

```tsx
<div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 500ms both" }}>
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
</div>

<p
  className="mt-6 text-center text-sm text-zinc-500"
  style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 580ms both" }}
>
  Don&apos;t have an account?{" "}
  <a href="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
    Create one
  </a>
</p>
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`  
Expected: no output

- [ ] **Step 3: Verify final file structure is correct**

The complete animated structure inside the outer div should be, in order:
1. `<style>` block with keyframes
2. Bloom `<div>` (fixed, pointer-events-none)
3. Logo wrapper div (0ms)
4. Card div (100ms) containing:
   - Animated logo h1 wrapper (0ms — relative to page, not card)
   - Error alert (no animation)
   - Form with three animated divs (200ms, 300ms, 400ms)
   - Animated social section (500ms)
   - Animated footer p (580ms)

- [ ] **Step 4: Commit**

```bash
git add "app/(auth)/login/page.tsx"
git commit -m "feat: animate social buttons and footer on login page load"
```

---

### Task 6: Push to Vercel

- [ ] **Step 1: Push**

```bash
git push origin main
```

Expected: `main -> main` push confirmation. Vercel deploys automatically.
