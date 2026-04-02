# Login Page Motion — Staggered Fade-Up

**Date:** 2026-04-02  
**Scope:** `app/(auth)/login/page.tsx` only  
**Approach:** Staggered Fade-Up (CSS keyframe animations)  
**Dependencies:** None — pure CSS via Tailwind arbitrary values + a `<style>` block  

---

## Goal

Add an entrance animation to the login page so it feels alive on load. Each element fades up in sequence, giving the page a polished, intentional feel that matches the energetic vibe of the overall design direction.

---

## Animation Spec

### Keyframe

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, soft landing (spring-like without a library).

### Sequence

| Element | Delay | Duration |
|---------|-------|----------|
| Logo + subtitle | 0ms | 500ms |
| Card container | 100ms | 500ms |
| Email field | 200ms | 400ms |
| Password field | 300ms | 400ms |
| Sign in button | 400ms | 400ms |
| Social buttons + divider | 500ms | 400ms |
| Footer link | 580ms | 400ms |

All animations use `animation-fill-mode: both` so elements start invisible and stay visible after the animation completes.

### Background Bloom

A fixed radial cyan bloom behind the page fades in at `0ms` over `900ms` with a scale from `0.8 → 1.0`. This is additive to the stagger — the backdrop comes alive while the elements arrive.

```css
@keyframes bloomIn {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
```

---

## Implementation

### Approach

The login page is already a `"use client"` component. Add a `<style>` tag inside the JSX (or a CSS module) defining the `fadeUp` and `bloomIn` keyframes. Apply animation classes to each element via `className`.

No state or JS needed — pure CSS declarative animations.

### Element Grouping

- **Logo wrapper div** — `animate-logo` (0ms delay)
- **Card div** — `animate-card` (100ms delay)  
- **Email field div** — `animate-field-1` (200ms delay)
- **Password field div** — `animate-field-2` (300ms delay)
- **Submit button** — `animate-field-3` (400ms delay)
- **Divider + social buttons wrapper** — `animate-field-4` (500ms delay)
- **Footer paragraph** — `animate-field-5` (580ms delay)
- **Bloom div** — fixed, `inset-0`, `pointer-events-none`, `animate-bloom`

### Error state

The error alert (`{error && ...}`) appears dynamically after submission — it should NOT be part of the entrance animation. It renders at full opacity immediately when shown (default behavior, no change needed).

---

## What Does NOT Change

- Component logic (signIn, form state, error handling)
- Layout structure
- All existing class names on inputs, buttons, labels
- The register page (separate spec if needed)
