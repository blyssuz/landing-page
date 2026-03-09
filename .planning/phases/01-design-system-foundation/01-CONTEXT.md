# Phase 1: Design System Foundation - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a complete library of reusable, Tailwind-only UI primitives and a consistent typography/color system that every subsequent component builds on. No existing pages are modified — this phase is purely additive foundation work.

Requirements: DS-01 through DS-11, AR-02, AR-03, AR-04, IX-04

</domain>

<decisions>
## Implementation Decisions

### Color & Warmth
- Use Tailwind's `stone-*` palette as the warm neutral foundation (yellow-undertone grays, replacing cold `gray-*`)
- Page background: OKLCH warm off-white (`oklch(98.5% 0.005 80)`) — not pure white, not beige. Cards float on top in white
- Warm-tinted shadows using OKLCH (hue 60 = yellow-orange tint) for cards and elevated elements
- Remove all `dark:` utility classes during rebuild — light mode only
- Per-tenant `--primary` CSS variable system preserved — all brand-colored elements use `var(--primary)`, never hardcoded hex
- Star ratings: `amber-400` (warm gold)
- Success states: `emerald-500`
- Borders/dividers: `stone-200` / `stone-100`

### Typography
- Switch from Geist to **DM Sans** via `next/font/google` — warmer geometric curves, better fit for salon/beauty context
- Verify Cyrillic support (Russian locale is primary) — `latin-ext` subset should cover, but verify at build time
- Headings: `font-semibold` / `font-bold` with `tracking-tight` — premium, confident feel
- Body text: minimum 16px on mobile, `leading-relaxed` (1.625) for warm spacing
- Use `text-balance` on headings to prevent orphan words
- Type scale: constrained set from research (hero 3xl-5xl, section 2xl-3xl, card title lg, body base, small sm, caption xs)

### Component Inventory (Full Set)
Build all of these in `app/components/ui/`:
- **Button** — refactor existing with primary, secondary, ghost, outline variants + sizes
- **Card** — consistent padding (`p-4` to `p-6`), `rounded-2xl`, warm shadow, hover shadow-lift
- **Badge** — for metadata display (rating, status, distance), `rounded-lg`
- **Avatar** — image support with gradient-initial fallback when no photo
- **Modal** — scroll lock, focus trap, escape-to-close, click-outside-to-close, `rounded-2xl`
- **Skeleton** — CSS shimmer animation (1.5-2s cycle) using `stone-200` → `stone-100` gradient, not Motion
- **StarRating** — refactor existing for both display and interactive input modes
- **SectionHeading** — consistent section title component with type scale
- **Input** — styled text input for search/forms, `rounded-xl`
- **PillButton** — keep existing pattern, restyle to match warm system

### Animation Feel
- **Subtle, restrained** — Airbnb-like restraint, not playful/bouncy
- Three spring presets defined in `lib/animations.ts`: gentle (most UI), snappy (buttons/chips), soft (panels/sheets)
- 7 animation types: fade-up, fade-in, scale-in, slide-up, stagger-children, layout, exit
- Duration: 200-350ms for most transitions, never > 500ms
- Scroll-reveal: `whileInView` with `once: true`, small y offset (12-20px)
- Respect `prefers-reduced-motion` via `useReducedMotion()` hook
- CSS `@keyframes` only for infinite loops (skeleton shimmer)
- Motion library for everything interactive

### Claude's Discretion
- Exact spacing values for each component's internal padding
- Whether to upgrade TailwindCSS to 4.2 (research recommended for `taupe` palette, but `stone` is sufficient)
- Exact OKLCH values for custom warm background/foreground colors
- Whether to remove `react-spinners` package in this phase or defer
- Internal component API design (prop names, variant names)
- Whether to create a shared TypeScript types file for business data interfaces

</decisions>

<specifics>
## Specific Ideas

- Warm, inviting Airbnb/Booksy aesthetic — the design should feel like a premium salon experience, not a tech product
- Cards should follow the Airbnb card pattern: no visible border, elevation via warm shadow, rounded-2xl, image-first
- Bottom sheet pattern for mobile overlays (rounded-t-3xl, drag handle)
- More whitespace = more premium — generous section spacing (py-12 to py-16)
- Border radius system: cards rounded-2xl, inner images rounded-xl, buttons rounded-full (pill), inputs rounded-xl, badges rounded-lg

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/ui/Button.tsx`: Exists with forwardRef pattern, variant/size props, className extension — refactor to match new design system
- `app/components/ui/PillButton.tsx`: Pill-shaped button variant — restyle to warm system
- `app/components/ui/StarRating.tsx`: Exists — refactor for both display and input modes
- `lib/translations.ts`: Global translation system with `{ ru, uz }` pattern
- `lib/locale-context.tsx`: `useLocale()` hook for client components
- `app/globals.css`: CSS custom properties (`--primary`, `--background`, `--foreground`), custom animations

### Established Patterns
- UI components use `React.forwardRef` with `displayName`
- Named exports (not default) for non-page components
- `className` prop accepted for style extension
- Path alias `@/` for imports
- Mobile-first responsive with `md:`, `lg:` breakpoints

### Integration Points
- `app/layout.tsx`: Font setup (currently Geist) — switch to DM Sans here
- `app/globals.css`: Color system, animation keyframes, theme variables — redefine here
- `app/components/ui/`: All new primitives go here
- New `lib/animations.ts` for shared Motion presets

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-design-system-foundation*
*Context gathered: 2026-03-09*
