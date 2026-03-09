# Technology Stack: Warm Booking UI Rebuild

**Project:** BLYSS Landing Page UI Rebuild
**Researched:** 2026-03-09
**Focus:** Design techniques, patterns, and tools for warm, Airbnb/Booksy-quality booking UI

## Executive Decision

Keep the existing stack (Next.js 16, React 19, TailwindCSS 4, Motion 12, lucide-react). No new frameworks. The quality gap is not a tooling problem -- it is a technique and design system problem. This document prescribes the specific Tailwind patterns, color system, typography, animation vocabulary, and component patterns that produce professional, warm booking UI with the tools already in the project.

---

## Recommended Stack

### Core Framework (Unchanged)

| Technology | Current Version | Purpose | Action |
|------------|----------------|---------|--------|
| Next.js | 16.1.6 | App Router, SSR, Image optimization | Keep as-is |
| React | 19.2.3 | UI rendering | Keep as-is |
| TailwindCSS | 4.1.18 | Styling | **Upgrade to 4.2.x** |
| Motion | 12.34.0 | Animations | Keep as-is |
| lucide-react | 0.563.0 | Icons | Keep as-is |

### Upgrade: TailwindCSS 4.1 -> 4.2

**Why:** TailwindCSS 4.2 adds four new neutral color palettes: **Mauve, Olive, Mist, and Taupe**. The `taupe` palette is a warm brownish-gray in OKLCH with chroma peaking at 0.031-0.034 -- exactly the warm neutral tone needed for salon/beauty UI. This eliminates the need to hand-craft a warm neutral scale. It also includes text shadow utilities and performance improvements for Next.js via a new webpack plugin.

**Confidence:** HIGH -- Tailwind 4.2.1 is latest stable (published late February 2026). Non-breaking upgrade from 4.1.

```bash
npm install tailwindcss@^4.2 @tailwindcss/postcss@^4.2
```

### Typography: Switch from Geist to DM Sans

| Technology | Purpose | Why |
|------------|---------|-----|
| DM Sans (via `next/font/google`) | Primary typeface | Geometric, warm, high readability at all sizes. Geist is clinical/developer-focused -- DM Sans signals contemporary sophistication with softer geometry that fits salon/beauty. Variable font, supports 100-900 weights. |

**Confidence:** HIGH -- DM Sans is one of the top 3 UI fonts for 2025/2026 per multiple design publications. Available in `next/font/google` with full variable font support. Self-hosted automatically by Next.js (no Google requests at runtime).

**Why not Inter?** Inter optimizes for legibility in technical contexts. DM Sans shares the geometric DNA but pushes toward visual warmth with optically-corrected curves and low stroke contrast -- better for a personal-service booking experience.

**Why not Plus Jakarta Sans?** Heavier weight at the same sizes, less refined at small sizes. DM Sans has better optical balance for both headings and body text.

**Implementation:**

```typescript
// app/layout.tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
});
```

```css
/* globals.css */
@theme inline {
  --font-sans: var(--font-dm-sans);
}
```

---

## Color System

### Foundation: Warm Neutrals with Tenant Accent

The current color system uses cold grays (`#f8f8f8` background, `gray-*` utilities) and a single `--primary` CSS variable. The rebuild needs a warm foundation that works with any tenant's brand color.

**Strategy:** Use Tailwind's built-in `stone` palette (warm gray with a yellow undertone) as the neutral base. Keep the per-tenant `--primary` CSS variable system. Optionally upgrade to Tailwind 4.2 to also access `taupe` for an even warmer secondary neutral.

**Confidence:** HIGH -- stone is built into Tailwind, no custom OKLCH authoring needed.

### Color Architecture

```css
/* globals.css */
@import "tailwindcss";

:root {
  /* Tenant brand color (set dynamically via JS) */
  --primary: #088395;

  /* Warm background tones */
  --background: oklch(98.5% 0.005 80);      /* Warm off-white, not cold #f8f8f8 */
  --background-alt: oklch(96% 0.008 80);     /* Slightly deeper warm for cards/sections */
  --foreground: oklch(20% 0.01 60);           /* Warm near-black, not pure #171717 */
  --foreground-muted: oklch(55% 0.01 60);    /* Warm muted text */
}

@theme inline {
  --color-background: var(--background);
  --color-background-alt: var(--background-alt);
  --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted);
  --color-primary: var(--primary);
  --font-sans: var(--font-dm-sans);
}
```

### Color Palette Usage Map

| Element | Color | Tailwind Class | Why |
|---------|-------|----------------|-----|
| Page background | Warm off-white | `bg-background` | Warmth immediately, not cold white |
| Card background | White | `bg-white` | Cards float above warm background |
| Card hover | Stone 50 | `bg-stone-50` | Subtle warmth on interaction |
| Section alternate bg | Stone 50/100 | `bg-stone-50` | Warm section breaks |
| Primary text | Warm near-black | `text-foreground` | Not harsh pure black |
| Secondary text | Stone 500 | `text-stone-500` | Warm muted, not gray-500 |
| Tertiary text | Stone 400 | `text-stone-400` | Light labels, timestamps |
| Borders | Stone 200 | `border-stone-200` | Warm, subtle borders |
| Dividers | Stone 100 | `divide-stone-100` | Barely visible warm lines |
| CTA buttons | Tenant primary | `bg-primary text-white` | Brand-colored actions |
| Star ratings | Amber 400 | `text-amber-400` | Warm gold, industry standard |
| Success states | Emerald 500 | `text-emerald-500` | Universally understood |
| Skeleton loading | Stone 200 -> Stone 100 | Animated gradient | Warm shimmer, not cold gray |

### What NOT to Do with Colors

| Anti-Pattern | Why | Do Instead |
|--------------|-----|------------|
| Pure `#000000` text | Harsh, clinical, jarring against warm backgrounds | Use `text-foreground` (warm near-black) |
| `gray-*` utilities for backgrounds | Cold blue-undertone grays fight the warm aesthetic | Use `stone-*` (warm yellow undertone) |
| Pure `#ffffff` page background | Feels sterile, like a medical form | Use warm off-white `bg-background` |
| `dark:` variants everywhere | Out of scope (light-only), adds dead CSS weight | Remove all `dark:` classes during rebuild |
| Hardcoded hex colors in components | Breaks tenant theming, inconsistent | Use CSS variables and Tailwind utilities |
| Too many accent colors | Busy, unprofessional, confusing | One tenant `--primary` + warm neutrals + amber/emerald for states |

---

## Typography System

### Type Scale

Use Tailwind's built-in `text-*` utilities with a constrained set. Do not use arbitrary sizes.

| Role | Class | Size | Weight | Use Case |
|------|-------|------|--------|----------|
| Hero heading | `text-3xl md:text-4xl lg:text-5xl` | 30/36/48px | `font-bold` | Main page title only |
| Section heading | `text-2xl md:text-3xl` | 24/30px | `font-semibold` | "Services", "Reviews" etc. |
| Card title | `text-lg` | 18px | `font-semibold` | Business name, service name |
| Body | `text-base` | 16px | `font-normal` | Descriptions, reviews |
| Small body | `text-sm` | 14px | `font-normal` | Addresses, secondary info |
| Caption | `text-xs` | 12px | `font-medium` | Labels, badges, timestamps |
| Price | `text-lg` or `text-xl` | 18/20px | `font-semibold` | Prices should feel confident |

### Typography Rules

1. **Minimum 16px body text on mobile** -- anything smaller causes readability issues and triggers browser zoom on iOS input focus
2. **Line-height: Use `leading-relaxed` (1.625) for body text** -- warm, spacious feel; `leading-tight` (1.25) for headings only
3. **Letter spacing: `tracking-tight` on headings** -- tightens DM Sans headings for a premium feel; never use on body text
4. **Font weight contrast: Bold headings (600-700), regular body (400)** -- clear hierarchy. Never use weight 300 (thin) on screen
5. **`text-balance` on headings** -- prevents orphan words on headings. Tailwind 4 supports `text-balance` utility

---

## Spacing System

### The 4/8pt Grid

Use Tailwind's default spacing scale strictly. All spacing should be multiples of 4px (Tailwind's `1` = 4px).

| Context | Spacing | Tailwind | Notes |
|---------|---------|----------|-------|
| Inside compact elements | 4-8px | `p-1` to `p-2` | Badges, chips |
| Inside cards | 16-24px | `p-4` to `p-6` | Card padding |
| Between card elements | 8-12px | `gap-2` to `gap-3` | Title/subtitle/meta spacing |
| Between sections | 48-64px | `py-12` to `py-16` | Generous section spacing = premium feel |
| Page horizontal padding | 16-24px | `px-4 md:px-6` | Mobile breathing room |
| Max content width | 448px on mobile | `max-w-md` or custom | Booking flows should not stretch wide |

### Critical Spacing Rule

**More whitespace = more premium.** The current site crams content. The Airbnb aesthetic comes from generous spacing between sections (`py-12` to `py-16`), not from colors or fonts. This is the single most impactful change.

---

## Animation System (Motion 12)

### Animation Vocabulary

Define a small, consistent set of animation presets. Do not invent new animations per component.

| Animation | Config | Use Case | Confidence |
|-----------|--------|----------|------------|
| **Fade up** | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` | Sections entering viewport | HIGH |
| **Fade in** | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` | Overlays, modals backdrop | HIGH |
| **Scale in** | `initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}` | Modals, popovers, toasts | HIGH |
| **Slide up** | `initial={{ y: '100%' }} animate={{ y: 0 }}` | Bottom sheets, booking panel | HIGH |
| **Stagger children** | `transition={{ staggerChildren: 0.05 }}` | Lists (services, employees, reviews) | HIGH |
| **Layout** | `layout` prop | Expanding/collapsing content, tab switches | HIGH |
| **Exit** | `exit={{ opacity: 0, y: 10 }}` with `AnimatePresence` | Removing items, closing panels | HIGH |

### Spring Configurations

Use spring physics for physical properties (x, y, scale). Use tween for visual properties (opacity, color).

```typescript
// lib/animations.ts -- shared animation presets

export const springs = {
  // Gentle, warm feel -- for most UI transitions
  gentle: { type: 'spring' as const, stiffness: 200, damping: 20, mass: 1 },

  // Snappy -- for small interactions (button press, chip toggle)
  snappy: { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.8 },

  // Soft -- for large layout transitions (panel open, page transition)
  soft: { type: 'spring' as const, stiffness: 150, damping: 20, mass: 1.2 },
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: springs.gentle,
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
```

### Scroll-Triggered Animations

Use `whileInView` for reveal animations. Set `once: true` to prevent re-triggering.

```tsx
<motion.section
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={springs.gentle}
>
  {/* Section content */}
</motion.section>
```

### Accessibility: Reduced Motion

**Must implement.** Use `useReducedMotion()` from `motion/react` to respect system preferences.

```tsx
import { useReducedMotion } from 'motion/react';

function AnimatedSection({ children }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
```

### Animation Anti-Patterns

| Anti-Pattern | Why | Do Instead |
|--------------|-----|------------|
| Animating `width`, `height`, `top`, `left` | Layout thrashing, drops below 60fps, janky on mobile | Animate `transform` and `opacity` only |
| CSS `@keyframes` for interactive animations | Cannot interrupt, no spring physics, no gestures | Use Motion for everything interactive; CSS only for infinite loops (skeleton shimmer) |
| Animation on every element | Overwhelming, feels cheap, "template site" aesthetic | Animate sections entering viewport + micro-interactions only |
| Duration > 500ms | Feels sluggish, blocks user | 200-350ms for most transitions |
| `delay` on interactive animations | User taps button, nothing happens for 200ms -- feels broken | Only delay stagger children, never primary actions |
| No `AnimatePresence` for exit | Elements vanish abruptly without transition | Always wrap conditionally rendered animated elements |
| `hover:scale-105` on cards | Whole card scaling looks cheap and amateurish | Scale the image inside the card, change shadow on card |

---

## Component Patterns

### Card Pattern (Airbnb-style)

The Airbnb card is the gold standard for booking UI. Key characteristics:

- **No visible border** -- elevation via subtle shadow or background contrast
- **Rounded corners**: `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for inner images
- **Image-first**: 3:2 or 4:3 aspect ratio image at top
- **Compact info below**: Name, rating, one line of meta (address/price)
- **Hover: subtle shadow lift** `hover:shadow-md transition-shadow` -- and scale on the image inside, not the card

```tsx
<div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
  <div className="relative aspect-[3/2] overflow-hidden">
    <Image fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>
  <div className="p-4 space-y-1.5">
    <h3 className="font-semibold text-foreground">{name}</h3>
    <p className="text-sm text-stone-500">{address}</p>
  </div>
</div>
```

### Bottom Sheet Pattern

Mobile booking flows should use bottom sheets, not full-page navigations.

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={springs.soft}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-stone-300 rounded-full" />
        </div>
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Skeleton Loading Pattern

Use CSS animation (not Motion) for skeleton shimmer -- it is an infinite loop that should not be interruptible.

```css
/* globals.css */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-stone-200) 25%,
    var(--color-stone-100) 50%,
    var(--color-stone-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}
```

### Sticky Booking Bar

Always-visible booking CTA on tenant pages. Both Airbnb and Booksy use this pattern.

```tsx
<motion.div
  className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-stone-200 px-4 py-3 z-30 safe-area-bottom"
  initial={{ y: 100 }}
  animate={{ y: 0 }}
  transition={springs.snappy}
>
  <div className="flex items-center justify-between max-w-md mx-auto">
    <div>
      <p className="text-sm text-stone-500">from</p>
      <p className="text-lg font-semibold">{lowestPrice} sum</p>
    </div>
    <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold">
      Book now
    </button>
  </div>
</motion.div>
```

---

## Image Optimization

### Next.js Image Component Patterns

| Scenario | Props | Notes |
|----------|-------|-------|
| Hero/cover image | `priority, fill, sizes="100vw"` | LCP image, must load first |
| Gallery thumbnail | `fill, sizes="(max-width: 768px) 50vw, 33vw"` | Responsive sizing |
| Employee avatar | `width={64} height={64}` | Fixed small size |
| Business avatar | `width={80} height={80}` | Slightly larger |

### Image Loading Pattern

```tsx
<div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-stone-200">
  <Image
    src={url}
    alt={alt}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

Use `bg-stone-200` as the fallback color on the container -- warm gray placeholder while image loads. Do not use the current cold gray gradient on `img` elements in globals.css.

---

## Border Radius System

Consistent radii create a cohesive, soft feel.

| Element | Radius | Class | Notes |
|---------|--------|-------|-------|
| Cards | 16px | `rounded-2xl` | Primary container rounding |
| Images inside cards | 12px | `rounded-xl` | Slightly tighter than parent |
| Buttons (primary CTA) | Full pill | `rounded-full` | Keep existing pill buttons |
| Input fields | 12px | `rounded-xl` | Match card inner elements |
| Badges/chips | 8px | `rounded-lg` | Small elements, tighter rounding |
| Bottom sheets | 24px top | `rounded-t-3xl` | Generous rounding on sheets |
| Modal | 20px | `rounded-2xl` | Matches card feel |

---

## Shadow System

Shadows create depth and warmth. Use warm-tinted shadows, not default cold gray.

```css
/* globals.css */
@theme {
  --shadow-card: 0 1px 3px oklch(25% 0.01 60 / 0.08);
  --shadow-card-hover: 0 4px 12px oklch(25% 0.01 60 / 0.1), 0 1px 3px oklch(25% 0.01 60 / 0.06);
  --shadow-sheet: 0 -4px 24px oklch(25% 0.01 60 / 0.1);
}
```

The shadows use a slightly warm hue (60 degrees in OKLCH = yellow-orange) instead of pure black. This is a subtle but meaningful detail that prevents shadows from looking cold against the warm palette.

---

## Dependencies to Remove

| Package | Why Remove |
|---------|-----------|
| `react-spinners` | Replace with Tailwind-only skeleton/shimmer patterns. One less dependency, consistent with "Tailwind-only components" constraint |

**Confidence:** HIGH -- react-spinners provides generic loading spinners. Custom skeleton screens are better UX (they preview the layout shape) and align with the Tailwind-only constraint.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Neutral palette | `stone` (built-in) | Hand-crafted OKLCH warm grays | Extra work, stone already has the right yellow undertone |
| Typeface | DM Sans | Geist (current) | Geist is clinical/developer-focused, wrong personality for salon booking |
| Typeface | DM Sans | Inter | Inter optimizes for technical legibility, not warmth |
| Typeface | DM Sans | Plus Jakarta Sans | Heavier at same sizes, less refined at small text |
| Animation lib | Motion (keep) | CSS-only animations | Motion provides spring physics, gesture support, AnimatePresence -- CSS cannot replicate |
| Component lib | Custom Tailwind | shadcn/ui | Out of scope per project constraints, would add Radix + class-variance-authority |
| Icons | lucide-react (keep) | Heroicons, Phosphor | Already integrated, lucide has excellent salon-relevant icons (Scissors, Calendar, Star, MapPin) |
| Color format | OKLCH (Tailwind 4 native) | HSL, hex | OKLCH is perceptually uniform -- shades feel equally bright across hues. Tailwind 4 default. |
| State management | React useState | Zustand/Jotai | Overkill -- state is section-local after decomposition, no global state needed |

---

## Installation / Upgrade Commands

```bash
# Upgrade Tailwind to 4.2 for taupe palette and webpack perf improvements
npm install tailwindcss@^4.2 @tailwindcss/postcss@^4.2

# Remove react-spinners (replace with custom skeletons)
npm uninstall react-spinners
```

No other package changes needed. The quality comes from technique, not dependencies.

---

## Sources

### Official Documentation (HIGH confidence)
- [TailwindCSS 4 Theme Variables](https://tailwindcss.com/docs/theme) -- @theme syntax, CSS custom properties, namespace system
- [TailwindCSS 4 Colors](https://tailwindcss.com/docs/colors) -- OKLCH palette, stone/neutral scales
- [TailwindCSS 4.1 Release](https://tailwindcss.com/blog/tailwindcss-v4-1) -- Text shadows, mask utilities, pointer variants
- [TailwindCSS 4.2 New Palettes](https://superhighway.dev/tailwind-v4-2-new-palettes) -- Mauve, Olive, Mist, Taupe additions
- [Motion for React](https://motion.dev/docs/react) -- Animation library documentation
- [Motion Transitions](https://motion.dev/docs/react-transitions) -- Spring configs, easing, transition types
- [Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations) -- whileInView, useScroll, viewport options
- [Motion useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) -- Accessibility hook
- [Motion Layout Animations](https://motion.dev/docs/react-layout-animations) -- FLIP animations, shared elements
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/google, self-hosting

### Design Research (MEDIUM confidence)
- [Airbnb UI Patterns](https://medium.com/design-bootcamp/airbnbs-secret-to-seamless-ux-f7caf7cc9b23) -- Shared element transitions, progressive disclosure
- [Color Psychology in Salon Design](https://keller4salon.com/blogs/keller-international-blog/the-psychology-of-color-in-salon-reception-area-design) -- Warm neutrals for comfort and trust
- [4-Point Grid System](https://www.thedesignership.com/blog/the-ultimate-spacing-guide-for-ui-designers) -- Spatial consistency in UI design
- [Typography in Design Systems](https://www.designsystems.com/typography-guides/) -- Type scale, hierarchy, spacing rules
- [Mobile Typography Best Practices](https://www.toptal.com/designers/typography/typography-for-mobile-apps) -- 16px minimum, readability standards
- [Best Fonts for UI Design 2025](https://shakuro.com/blog/best-fonts-for-web-design) -- DM Sans, Inter, font pairing guidance
- [Fresha vs Booksy UX Comparison](https://www.goodcall.com/appointment-scheduling-software/fresha-vs-booksy) -- Booking platform UX patterns

---

*Stack analysis: 2026-03-09*
