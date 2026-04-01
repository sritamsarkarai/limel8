# LimeL8 UI Upgrade — Design Spec

**Date:** 2026-04-01  
**Approach:** CSS variables + targeted Tailwind class sweep (Option A)  
**Scope:** Landing page, Feed/Dashboard, Marketplace, Profile pages

---

## 1. Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Theme | Dark Charcoal (Zinc) | User selected; professional, versatile, artist-forward |
| Accent | Cyan `#06b6d4` | Unique on zinc, sharp and modern, ties to "tech" feel |
| Implementation | CSS vars + class sweep | No new deps, no architecture changes, reversible |
| Typography | Outfit (headings) + Rubik (body) | Bold/modern headings, friendly readable body |

---

## 2. Design Token System

All tokens defined in `app/globals.css` under `@theme inline`. Existing hardcoded Tailwind classes replaced with these throughout all components.

### Colors

```css
/* Backgrounds */
--color-bg-base:    #09090b;   /* Page background */
--color-bg-surface: #18181b;   /* Navbar, sidebar */
--color-bg-card:    #27272a;   /* Cards, panels, composer */
--color-bg-input:   #3f3f46;   /* Input fields, media placeholders */

/* Borders */
--color-border:     #3f3f46;   /* All borders */
--color-border-subtle: #27272a; /* Dividers */

/* Accent (Cyan) */
--color-accent:        #06b6d4;  /* Primary CTA, links, active states */
--color-accent-hover:  #0891b2;  /* Hover state */
--color-accent-subtle: #083344;  /* Badge backgrounds, tinted panels */
--color-accent-border: #06b6d440; /* Accent-tinted borders */
--color-accent-text:   #cffafe;  /* Light cyan for text on dark accent bg */

/* Text */
--color-text-primary: #fafafa;   /* Headlines, names, prices */
--color-text-muted:   #a1a1aa;   /* Body, descriptions, post content */
--color-text-subtle:  #71717a;   /* Timestamps, meta, placeholders */
--color-text-faint:   #52525b;   /* Disabled, placeholder text */

/* Status */
--color-success:        #4ade80;  /* Physical badge text */
--color-success-subtle: #052e16;  /* Physical badge background */
```

### Typography

```css
/* Google Fonts import in globals.css */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Rubik:wght@300;400;500;600;700&display=swap');

--font-heading: 'Outfit', system-ui, sans-serif;
--font-body:    'Rubik', system-ui, sans-serif;
```

Font usage:
- `font-heading`: Logo, page titles (h1/h2), section headings, card titles, prices
- `font-body`: All body copy, labels, nav links, form inputs, badges

### Spacing & Shape

- Border radius: `rounded-lg` (8px) for inputs/buttons, `rounded-xl` (12px) for cards, `rounded-2xl` (16px) for profile banner
- Transitions: `transition-colors duration-200` on all interactive elements
- Card hover: `hover:-translate-y-0.5 hover:border-cyan-500/50`

---

## 3. Component-by-Component Changes

### `app/globals.css`
- Replace current `:root` and `@theme inline` block with full token set above
- Add Google Fonts import
- Add `color-scheme: dark` to `:root`
- Set `body { background: var(--color-bg-base); color: var(--color-text-primary); font-family: var(--font-body); }`

### `components/Navbar.tsx`
- Background: `bg-zinc-900` (was `bg-white`)
- Border: `border-zinc-700` (was `border-gray-200`)
- Logo text: `text-white font-heading`, accent on last char: `text-cyan-400`
- Search bar: `bg-zinc-800 border-zinc-700 text-zinc-400 placeholder:text-zinc-600`
- Nav links: `text-zinc-400 hover:text-white`
- Primary button: `bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-600`
- Outline button: `border-zinc-700 text-zinc-400 hover:text-white`
- Icons: `bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white`
- Avatar ring: `border-cyan-500/40`

### `components/Sidebar.tsx`
- Background: `bg-zinc-900 border-zinc-700`
- Inactive items: `text-zinc-400 hover:bg-zinc-800 hover:text-white`
- Active item: `bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400`
- Section labels: `text-zinc-600 text-xs uppercase tracking-wider`

### `components/PostCard.tsx`
- Card: `bg-zinc-800 border-zinc-700`
- Author name: `text-white font-semibold`
- Timestamp/meta: `text-zinc-500`
- Body text: `text-zinc-400`
- Media placeholder: `bg-zinc-700`
- Action buttons: `text-zinc-500 hover:text-cyan-400`
- Available badge: `bg-cyan-950 text-cyan-400 border border-cyan-500/25`

### `components/PostComposer.tsx`
- Wrapper: `bg-zinc-800 border-zinc-700`
- Input: `bg-zinc-700 border-zinc-600 text-zinc-300 placeholder:text-zinc-600`
- Submit: `bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-600`

### `components/ListingCard.tsx`
- Card: `bg-zinc-800 border-zinc-700 hover:-translate-y-0.5 hover:border-cyan-500/50`
- Image area: `bg-zinc-700`
- Title: `text-white font-semibold`
- Seller: `text-zinc-500`
- Price: `text-cyan-400 font-bold`
- Digital badge: `bg-cyan-950 text-cyan-400 border border-cyan-500/25`
- Physical badge: `bg-green-950 text-green-400 border border-green-500/25`

### `components/ProfileCard.tsx` (search results)
- Card: `bg-zinc-800 border-zinc-700 hover:border-cyan-500/50`
- Name: `text-white font-semibold`
- Type/location: `text-zinc-500`
- Available badge: cyan variant (same as PostCard)
- Follow button: `border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10`

### `components/IndividualProfileView.tsx` + `GroupProfileView.tsx`
- Banner: keep image; fallback gradient `from-cyan-950 via-sky-900 to-cyan-900`
- Avatar ring: `border-zinc-950` (3px, to cut out from banner)
- Name: `text-white font-heading font-bold text-2xl`
- Available badge: cyan variant
- Bio: `text-zinc-400`
- Stats: muted label, white value
- Social icon buttons: `bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white`
- Tabs: inactive `text-zinc-500`, active `text-cyan-400 border-b-2 border-cyan-400`
- Follow CTA: `bg-cyan-500 text-zinc-950 font-bold`
- Message: ghost variant

### `components/ConversationList.tsx` + `MessageBubble.tsx`
- List bg: `bg-zinc-900 border-zinc-700`
- Active conversation: `bg-zinc-800`
- Own message bubbles: `bg-cyan-500 text-zinc-950`
- Other message bubbles: `bg-zinc-800 text-zinc-200`

### Auth pages (`/login`, `/register`)
- Page bg: `bg-zinc-950`
- Card: `bg-zinc-900 border border-zinc-800`
- Inputs: `bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20`
- Submit: `bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-600`
- OAuth buttons: `bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700`
- Links: `text-cyan-400 hover:text-cyan-300`
- Divider text: `text-zinc-600`

### Landing page (`app/page.tsx`)
- Full dark zinc treatment per mockup
- Hero badge: `bg-cyan-950 border border-cyan-500/25 text-cyan-400`
- Hero h1 accent: `text-cyan-400`
- Stats bar: `bg-zinc-900 border-zinc-800`
- Feature card icons: `bg-cyan-950 border border-cyan-500/25` with cyan SVG stroke
- Feature cards: `bg-zinc-800 border-zinc-700`

---

## 4. Files to Modify

| File | Change type |
|---|---|
| `app/globals.css` | Full rewrite of tokens + font import |
| `app/layout.tsx` | Add Google Fonts `<link>` preconnect + stylesheet |
| `app/page.tsx` | Full dark theme class sweep |
| `app/(auth)/login/page.tsx` | Dark auth card sweep |
| `app/(auth)/register/page.tsx` | Dark auth card sweep |
| `app/(main)/feed/page.tsx` | Dark layout sweep |
| `app/(main)/search/page.tsx` | Dark layout + filter bar |
| `app/(main)/marketplace/page.tsx` | Dark layout + filter bar |
| `app/(main)/messages/page.tsx` | Dark layout |
| `app/(main)/messages/[profileId]/page.tsx` | Dark message thread |
| `app/(main)/profile/[id]/page.tsx` | Dark profile layout |
| `app/(main)/listings/[id]/page.tsx` | Dark listing detail |
| `components/Navbar.tsx` | Dark navbar |
| `components/Sidebar.tsx` | Dark sidebar + active state |
| `components/PostCard.tsx` | Dark card |
| `components/PostComposer.tsx` | Dark composer |
| `components/ListingCard.tsx` | Dark card + hover |
| `components/ListingForm.tsx` | Dark form |
| `components/BuyButton.tsx` | Cyan CTA button |
| `components/ProfileCard.tsx` | Dark card |
| `components/IndividualProfileView.tsx` | Dark profile |
| `components/GroupProfileView.tsx` | Dark profile |
| `components/AvailabilityBadge.tsx` | Cyan badge |
| `components/ConversationList.tsx` | Dark list |
| `components/MessageBubble.tsx` | Dark + cyan bubbles |

---

## 5. What We Are NOT Changing

- All business logic, API calls, Supabase queries, Stripe integration
- Data models, server actions, route handlers
- Auth flow logic (only visual treatment changes)
- Component prop interfaces
- Test files

---

## 6. Pre-Delivery Checklist

- [ ] No emojis used as icons (all SVG)
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states with `transition-colors duration-200`
- [ ] Text contrast meets 4.5:1 minimum (`#a1a1aa` on `#27272a` = ~5.5:1 ✓)
- [ ] Focus states visible for keyboard nav (`focus:ring-cyan-500/20`)
- [ ] `prefers-reduced-motion` respected on any animations
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] No content hidden behind fixed navbar (padding-top accounts for navbar height)
