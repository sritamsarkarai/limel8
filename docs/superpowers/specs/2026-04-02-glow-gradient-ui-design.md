# Glow & Gradient UI Enhancement — LimeL8

**Date:** 2026-04-02  
**Scope:** Full app — all pages and components  
**Approach:** Glow & Gradient (Option A)  
**Dependencies:** None — pure Tailwind CSS utility classes  

---

## Goal

Make LimeL8 feel energetic and vibrant. The current UI is functional but lifeless — especially forms and interactions. This design pass adds a cyan→violet glow system on top of the existing zinc/cyan palette to create an "alive" feeling without changing layout or adding dependencies.

---

## Design Token System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `zinc-950` | `#09090b` | Page background |
| `zinc-900` | `#18181b` | Card/panel background |
| `zinc-800` | `#27272a` | Input background |
| `cyan-400` | `#22d3ee` | Primary accent (digital items, default glow) |
| `violet-400` | `#a78bfa` | Secondary accent (physical items, CTAs) |
| cyan→violet gradient | `linear-gradient(135deg, #22d3ee, #a78bfa)` | Buttons, logo, gradient text |

### Glow Levels

**Level 2 is the default resting state for all cards and interactive surfaces.**

| Level | Usage | CSS |
|-------|-------|-----|
| Level 1 — Subtle | Inactive supporting elements | `border: 1px solid #22d3ee33; box-shadow: 0 0 12px #22d3ee18` |
| Level 2 — Active | Cards at rest, inputs at rest | `border: 1px solid #22d3ee44; box-shadow: 0 0 0 1px #22d3ee22, 0 0 20px #22d3ee22, 0 0 40px #22d3ee0c` |
| Level 3 — Highlight | Hover states, focus states, active nav | `border: 1px solid #22d3ee66; box-shadow: 0 0 0 1px #22d3ee44, 0 0 20px #22d3ee28, 0 0 40px #22d3ee10` |

Violet variant: same structure, replace `#22d3ee` with `#a78bfa`. Used for physical listing cards and CTA buttons.

### Background Blooms

Fixed radial gradient pseudo-elements on the root layout. No performance impact.

- Cyan bloom: top-left, `radial-gradient(ellipse at top left, #22d3ee0a 0%, transparent 60%)`
- Violet bloom: bottom-right, `radial-gradient(ellipse at bottom right, #a78bfa0a 0%, transparent 60%)`

---

## Component Changes

### Global Shell (`app/layout.tsx`, `app/(main)/layout.tsx`)

- Add bloom pseudo-elements via a wrapper div with `relative overflow-hidden` and two fixed `pointer-events-none` divs
- No structural changes

### Navbar (`components/layout/Navbar.tsx`)

- Logo: "L8" text gets `bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent`
- Search input: Level 2 glow at rest, Level 3 on focus
- Bottom border: `border-zinc-700` → `border-cyan-500/10`
- Avatar ring: `border-cyan-500/40` (already exists) — keep

### Sidebar (`components/layout/Sidebar.tsx`)

- Active nav item: add cyan left-bar indicator (`before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-3/5 before:bg-cyan-400 before:rounded-r before:shadow-[0_0_6px_#22d3ee]`), tinted bg (`bg-cyan-950/40`), Level 2 glow border
- Inactive items: unchanged

### ListingCard (`components/marketplace/ListingCard.tsx`)

- Digital cards: Level 2 cyan glow at rest, Level 3 on hover + `translate-y-[-2px]`
- Physical cards: Level 2 violet glow at rest, Level 3 violet on hover
- Price text: cyan-400 (digital) or violet-400 (physical)
- Type badge: matching color scheme

### ListingForm (`components/marketplace/ListingForm.tsx`)

- Form wrapper: Level 2 glow card container
- All inputs/textarea/select: Level 2 glow at rest, Level 3 on focus
- Type select: when "digital" selected → cyan highlight; "physical" → violet highlight
- Submit button: gradient fill (`bg-gradient-to-r from-cyan-400 to-violet-400`) + glow shadow

### Auth Pages (`app/(auth)/login/page.tsx`, `register/page.tsx`)

- Page bg: `bg-zinc-950` with cyan radial bloom top-center
- Form card: Level 2 glow border + `bg-zinc-900`
- Logo above card: gradient text
- All inputs: Level 3 glow on focus
- Submit button: gradient fill + glow shadow

### Marketplace Pages (`/marketplace`, `/listings`)

- Page title: gradient text (`bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent`)
- "New Listing" button: gradient fill, replaces `bg-blue-600`
- Empty state: centered with subtle cyan bloom behind text
- Pagination "Load more": Level 2 glow border button

### Listing Detail (`app/(main)/listings/[id]/page.tsx`)

- Price: gradient text
- Type badge: cyan (digital) or violet (physical) glow pill
- Preview images: Level 2 glow border on each image wrapper
- Buy button: gradient fill + glow shadow
- "Back to Marketplace" link: cyan hover color

### Feed (`components/feed/PostCard.tsx`, `PostComposer.tsx`)

- Post cards: Level 2 cyan glow at rest
- Composer textarea: Level 3 glow on focus
- Post/Submit button: gradient fill
- Avatar images: cyan glow ring

### Messages (`components/messaging/`)

- Sent message bubbles: cyan tint background + subtle glow
- Active conversation in `ConversationList`: cyan left-bar indicator
- Message input: Level 3 glow on focus
- Send button: gradient fill

### Profile Components (`components/profiles/`)

- Profile card borders: Level 2 glow
- Availability badge: color-appropriate glow
- Edit/CTA buttons: gradient fill

---

## What Does NOT Change

- Layout structure (sidebar + navbar shell)
- Component logic or data fetching
- zinc-950/900/800 base color usage
- Any TypeScript types or API contracts
- Routing or page structure

---

## Implementation Order

1. Design tokens / global bloom (layout files)
2. Navbar + Sidebar (global shell — highest impact)
3. Auth pages (login, register)
4. ListingCard + ListingForm (marketplace core)
5. Marketplace browse pages + listing detail
6. Feed components
7. Messages components
8. Profile components
