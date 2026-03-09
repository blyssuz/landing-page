# Phase 01: Design System Foundation - Research

**Researched:** 2026-03-09
**Domain:** UI component library, CSS design system, typography, animation
**Confidence:** HIGH

## Summary

This phase builds a complete library of reusable UI primitives (Button, Card, Modal, Badge, Avatar, Skeleton, StarRating, SectionHeading, Input, PillButton) with a warm visual language using Tailwind CSS v4, a new font, and Motion for animations. The existing codebase has three components to refactor (Button, PillButton, StarRating) and seven to create from scratch. The project runs Next.js 16.1.6, Tailwind CSS 4.1.18, and Motion 12.34.0 -- all current versions.

**CRITICAL FINDING: DM Sans does NOT support Cyrillic.** The `next/font/google` type definitions confirm DM Sans only offers `latin` and `latin-ext` subsets. Since Russian is the primary locale, DM Sans cannot be used. The recommended replacement is **Nunito Sans** -- a warm, rounded geometric sans-serif with full `cyrillic` and `cyrillic-ext` subsets, variable font support (200-1000 weight), and optical size axis. Alternative options are Manrope (more geometric/modern) or Rubik (more rounded/playful).

The existing `--primary` CSS variable pattern is already established across the codebase (TenantPage, BookingPage, RatingPage all set it via inline styles). The design system work primarily involves replacing cold `gray-*`/`zinc-*` with warm `stone-*`, defining the OKLCH warm background, creating the animation presets in `lib/animations.ts`, and building all ten UI components in `app/components/ui/`.

**Primary recommendation:** Use Nunito Sans (not DM Sans) for Cyrillic support, build all components with `stone-*` palette and `--primary` CSS variable, use native `<dialog>` element for Modal with fixed-body scroll lock for iOS Safari compatibility.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use Tailwind's `stone-*` palette as the warm neutral foundation (yellow-undertone grays, replacing cold `gray-*`)
- Page background: OKLCH warm off-white (`oklch(98.5% 0.005 80)`) -- not pure white, not beige. Cards float on top in white
- Warm-tinted shadows using OKLCH (hue 60 = yellow-orange tint) for cards and elevated elements
- Remove all `dark:` utility classes during rebuild -- light mode only
- Per-tenant `--primary` CSS variable system preserved -- all brand-colored elements use `var(--primary)`, never hardcoded hex
- Star ratings: `amber-400` (warm gold)
- Success states: `emerald-500`
- Borders/dividers: `stone-200` / `stone-100`
- Switch from Geist to **DM Sans** via `next/font/google` [**BLOCKED: see research finding below**]
- Headings: `font-semibold` / `font-bold` with `tracking-tight`
- Body text: minimum 16px on mobile, `leading-relaxed` (1.625)
- Use `text-balance` on headings
- Type scale: hero 3xl-5xl, section 2xl-3xl, card title lg, body base, small sm, caption xs
- Component inventory: Button, Card, Badge, Avatar, Modal, Skeleton, StarRating, SectionHeading, Input, PillButton
- Animation feel: subtle, restrained (Airbnb-like)
- Three spring presets in `lib/animations.ts`: gentle, snappy, soft
- 7 animation types: fade-up, fade-in, scale-in, slide-up, stagger-children, layout, exit
- Duration: 200-350ms, never > 500ms
- CSS `@keyframes` only for infinite loops (skeleton shimmer)
- Motion library for everything interactive
- Border radius system: cards rounded-2xl, inner images rounded-xl, buttons rounded-full, inputs rounded-xl, badges rounded-lg
- Generous whitespace (py-12 to py-16)

### Claude's Discretion
- Exact spacing values for each component's internal padding
- Whether to upgrade TailwindCSS to 4.2 (research: NOT recommended -- taupe palette not in 4.1.18, stone is sufficient per user decision)
- Exact OKLCH values for custom warm background/foreground colors
- Whether to remove `react-spinners` package in this phase or defer
- Internal component API design (prop names, variant names)
- Whether to create a shared TypeScript types file for business data interfaces

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DS-01 | Button with primary, secondary, ghost, outline variants | Existing Button.tsx has primary/outline/ghost -- add secondary variant, restyle with stone-* palette and --primary |
| DS-02 | Card with consistent padding, rounded corners, soft shadow | New component; use rounded-2xl, warm OKLCH shadow, stone-* borders |
| DS-03 | Modal with scroll lock, focus trap, escape-to-close, click-outside | Use native `<dialog>` + showModal() for focus trap + inert; fixed-body technique for iOS scroll lock |
| DS-04 | Badge for metadata display | New component; rounded-lg per user decision |
| DS-05 | Avatar with image and gradient-initial fallback | New component; gradient fallback when no photo |
| DS-06 | Skeleton with shimmer animation | New component; CSS @keyframes shimmer with stone-200 to stone-100 gradient |
| DS-07 | StarRating display and interactive input | Existing StarRating.tsx -- refactor to add input mode, replace gray-300 with stone-300 |
| DS-08 | SectionHeading with consistent typography | New component; uses type scale (2xl-3xl), tracking-tight, text-balance |
| DS-09 | Typography system with type scale | Define in globals.css @theme; type scale from CONTEXT.md; font switch to Nunito Sans |
| DS-10 | CSS custom properties with --primary theming | Already established pattern; extend with warm background/foreground OKLCH values |
| DS-11 | Warm visual language | Stone palette, OKLCH shadows, rounded corners, generous whitespace -- all per locked decisions |
| AR-02 | Components in co-located directories with _lib/ | All UI primitives in app/components/ui/, shared utilities in app/components/ui/_lib/ |
| AR-03 | Single responsive markup per component | No duplicate mobile/desktop rendering; use Tailwind responsive prefixes (md:, lg:) |
| AR-04 | All user-facing strings use translation system | Components that render text must accept translated strings via props or use useLocale() + translations |
| IX-04 | Mobile-first responsive design | All components designed phone-first with responsive scaling via md:/lg: breakpoints |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App framework, font optimization | Already installed; next/font/google for font loading |
| Tailwind CSS | 4.1.18 | Utility CSS, design tokens via @theme | Already installed; v4 CSS-first with OKLCH colors |
| Motion | 12.34.0 | Spring animations, gesture handling | Already installed; import from `motion/react` |
| lucide-react | 0.563.0 | Icons (Star, etc.) | Already installed; used in existing StarRating |
| React | 19.2.3 | UI library | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/font/google | (bundled) | Nunito Sans font loading | Replace Geist in app/layout.tsx |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Nunito Sans | Manrope | Manrope is more geometric/modern but less warm -- Nunito Sans has softer curves better suited for salon/beauty. Both have Cyrillic. |
| Nunito Sans | Rubik | Rubik is more rounded/playful with squared ovals -- good for casual brands but less premium feel. Has full Cyrillic. |
| Native `<dialog>` for Modal | react-focus-lock + body-scroll-lock | External deps add ~5KB; native dialog handles focus trap via inert attribute automatically in modern browsers |

**No new packages to install.** All dependencies are already in place.

## Architecture Patterns

### Recommended Project Structure
```
app/
├── components/
│   └── ui/
│       ├── _lib/
│       │   └── cn.ts              # className merge utility (simple template literal joiner)
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Button.tsx             # refactor existing
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── PillButton.tsx         # refactor existing
│       ├── SectionHeading.tsx
│       ├── Skeleton.tsx
│       └── StarRating.tsx         # refactor existing
├── globals.css                    # @theme, @keyframes shimmer, OKLCH colors, stone palette overrides
└── layout.tsx                     # Nunito Sans font setup
lib/
└── animations.ts                  # Spring presets, animation variants for Motion
```

### Pattern 1: Component API Convention
**What:** All UI components follow the existing forwardRef + displayName pattern with className extension
**When to use:** Every component in this phase
**Example:**
```typescript
// Source: Existing Button.tsx pattern
'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat';
  padding?: 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', ...props }, ref) => {
    // Build class string from variant/padding
    const finalClassName = `${baseClasses} ${variantClasses} ${paddingClasses} ${className}`.trim();
    return <div className={finalClassName} ref={ref} {...props} />;
  }
);

Card.displayName = 'Card';

export { Card };
```

### Pattern 2: CSS Custom Property Theming
**What:** Per-tenant brand color set via inline style, consumed by Tailwind via @theme inline
**When to use:** Any component that needs brand-colored elements
**Example:**
```css
/* globals.css */
@import "tailwindcss";

:root {
  --primary: #088395;
  --background: oklch(98.5% 0.005 80);
  --foreground: oklch(21.6% 0.006 56.043); /* stone-900 equivalent */
}

@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-nunito-sans);
}
```
```tsx
// Usage in tenant page (existing pattern):
<div style={{ '--primary': business.primaryColor } as React.CSSProperties}>
  <Button variant="primary">Book Now</Button>
</div>
```

### Pattern 3: Motion Animation Presets
**What:** Centralized spring configs and animation variants in `lib/animations.ts`
**When to use:** All animated interactions
**Example:**
```typescript
// lib/animations.ts
import type { Transition, Variants } from 'motion/react';

// Spring presets
export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 20 } as Transition,
  snappy: { type: 'spring', stiffness: 300, damping: 25 } as Transition,
  soft:   { type: 'spring', stiffness: 80,  damping: 18 } as Transition,
} as const;

// Reusable animation variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springs.snappy },
};

export const staggerChildren = (staggerMs = 0.05) => ({
  visible: { transition: { staggerChildren: staggerMs } },
});
```

### Pattern 4: Native Dialog Modal
**What:** Use HTML `<dialog>` element with `showModal()` for accessible modal
**When to use:** Modal component
**Example:**
```typescript
// Simplified Modal pattern
'use client';

import React, { useRef, useEffect, useCallback } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
  ({ open, onClose, children, className = '' }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDialogElement>) || dialogRef;

    useEffect(() => {
      const dialog = resolvedRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        // Save scroll position and lock body (iOS Safari fix)
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }, [open, resolvedRef]);

    // Handle Escape key (native dialog handles this)
    // Handle click-outside via ::backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
      if (e.target === resolvedRef.current) onClose();
    }, [onClose, resolvedRef]);

    return (
      <dialog
        ref={resolvedRef}
        className={`rounded-2xl backdrop:bg-black/50 ${className}`}
        onClick={handleBackdropClick}
        onCancel={(e) => { e.preventDefault(); onClose(); }}
      >
        {children}
      </dialog>
    );
  }
);
```

### Anti-Patterns to Avoid
- **Hardcoded hex for brand colors:** Always use `var(--primary)` or `bg-primary` (via @theme inline). The color changes per tenant.
- **Duplicate mobile/desktop rendering:** Never render two versions of a component and toggle visibility. Use responsive Tailwind classes on a single element tree.
- **`dark:` utility classes:** Light mode only per user decision. Remove any `dark:` prefixes.
- **Using `gray-*` or `zinc-*`:** Replace with `stone-*` throughout all components for warm neutral tone.
- **Framer Motion for infinite loops:** Use CSS `@keyframes` for skeleton shimmer. Motion is for interactive/finite animations only.
- **Custom focus trap JS for Modal:** The native `<dialog>` + `showModal()` handles focus trapping via the `inert` attribute on background content automatically.
- **Using `className` concatenation without handling conflicts:** Keep the simple template literal join pattern (no need for `clsx` or `cn` utility for this phase -- the existing pattern works).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trapping in Modal | Custom JS focus trap with tabindex management | Native `<dialog>` + `showModal()` | Browser handles focus trap via inert attribute; cross-browser since 2023 |
| Font loading/optimization | Manual @font-face with preload | `next/font/google` Nunito_Sans | Handles subsetting, preloading, font-display swap, CLS prevention |
| Icon system | SVG sprite or custom icon components | `lucide-react` (already installed) | 1000+ consistent icons, tree-shakeable, React-native API |
| Spring physics | Custom easing curves | `motion/react` spring transitions | Physically accurate spring simulation with configurable stiffness/damping |
| Reduced motion detection | Custom matchMedia listener | `useReducedMotion` from `motion/react` | Handles SSR, re-renders on change, ~1KB |
| CSS utility merging | Template literal concatenation with conflicts | Keep simple concat (existing pattern) | This project's components are simple enough; no tailwind-merge needed yet |

**Key insight:** The native `<dialog>` element eliminates the two biggest Modal complexities (focus trap and inert background). The remaining challenge is iOS Safari scroll lock, which requires the fixed-body technique but is straightforward to implement.

## Common Pitfalls

### Pitfall 1: DM Sans Has No Cyrillic Support
**What goes wrong:** Text renders in fallback system font for Russian (primary locale), creating an inconsistent visual experience
**Why it happens:** DM Sans only supports `latin` and `latin-ext` subsets. The Google Fonts API and next/font/google type definitions both confirm this -- no `cyrillic` or `cyrillic-ext` option exists.
**How to avoid:** Use **Nunito Sans** instead. Verified via next/font/google types: `subsets?: Array<'cyrillic' | 'cyrillic-ext' | 'latin' | 'latin-ext' | 'vietnamese'>`. Import as `Nunito_Sans` from `next/font/google`. Variable font with weight range 200-1000 and optical size axis.
**Warning signs:** Russian text appearing in a different font weight/style than Latin text on the same page

### Pitfall 2: iOS Safari Modal Scroll Lock
**What goes wrong:** Background content scrolls behind an open modal on iOS Safari despite `overflow: hidden` on body
**Why it happens:** iOS Safari ignores `overflow: hidden` for touch-based scrolling. The `overscroll-behavior: contain` CSS property helps on desktop browsers but doesn't solve iOS.
**How to avoid:** Use the fixed-body technique: save `window.scrollY`, set `body { position: fixed; top: -${scrollY}px; width: 100%; }` on open, restore on close. This is the most reliable cross-browser solution.
**Warning signs:** Users can scroll the page content visible through the modal backdrop on iPhone/iPad

### Pitfall 3: Tailwind v4 @theme vs @theme inline for CSS Variables
**What goes wrong:** CSS variable references resolve incorrectly when using `@theme` instead of `@theme inline` for variables that reference other variables
**Why it happens:** In Tailwind v4, `@theme` creates a CSS custom property that references another custom property. Due to CSS scoping, `var(--font-sans)` resolves where it's *defined*, not where it's *used*. If `--font-nunito-sans` isn't defined at the `:root` scope yet, it falls through.
**How to avoid:** Use `@theme inline` when the value references another CSS variable: `@theme inline { --font-sans: var(--font-nunito-sans); --color-primary: var(--primary); }`
**Warning signs:** Font or color not applying despite being defined in @theme block

### Pitfall 4: Warm Shadow OKLCH Browser Compatibility
**What goes wrong:** OKLCH color values in `box-shadow` don't render in older browsers
**Why it happens:** OKLCH is supported in all modern browsers (Chrome 111+, Safari 15.4+, Firefox 113+), but some Android WebView versions lag behind
**How to avoid:** For box-shadow specifically, provide a fallback with rgba: `shadow-[0_2px_12px_rgba(120,100,70,0.08)]` or use Tailwind's shadow utilities with custom theme values. OKLCH in shadow values has full support in all major browsers as of late 2024.
**Warning signs:** No shadow visible on certain Android devices or older browser versions

### Pitfall 5: Dialog ::backdrop Styling Limitations
**What goes wrong:** The `::backdrop` pseudo-element of `<dialog>` cannot be animated with CSS transitions or Motion
**Why it happens:** `::backdrop` is a pseudo-element that exists outside the normal DOM and cannot be targeted by JS animation libraries
**How to avoid:** Use a separate overlay `<div>` inside the dialog for animated backdrop effects, or accept that the backdrop appears/disappears instantly. For this project, a simple `backdrop:bg-black/50` with no animation is sufficient for the Airbnb-like restrained feel.
**Warning signs:** Attempts to animate backdrop opacity via Motion will silently fail

### Pitfall 6: next/font Google Font Data Staleness
**What goes wrong:** The Nunito_Sans import from `next/font/google` might reference slightly outdated font data
**Why it happens:** Next.js bundles a snapshot of Google Fonts metadata. The `next/font/google` font data has been reported as sometimes outdated (vercel/next.js#53506).
**How to avoid:** Test font rendering at build time. Verify Cyrillic glyphs render correctly by checking a page with Russian text. If the font fails to load, fall back to system fonts. The `next/font/google` configuration accepts a `fallback` option.
**Warning signs:** Build warnings about font, or Russian text rendering in a different font

## Code Examples

Verified patterns from official sources and project conventions:

### Nunito Sans Font Setup (replacing Geist)
```typescript
// app/layout.tsx
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.setAttribute('data-color-scheme','light')` }} />
      </head>
      <body className={`${nunitoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### Warm Color System in globals.css
```css
/* globals.css */
@import "tailwindcss";

:root {
  --primary: #088395;
  --background: oklch(98.5% 0.005 80);
  --foreground: oklch(21.6% 0.006 56.043);
}

@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-nunito-sans);
}

/* Warm shadow utilities */
@theme {
  --shadow-warm-sm: 0 1px 3px oklch(75% 0.02 60 / 0.08);
  --shadow-warm: 0 2px 8px oklch(75% 0.02 60 / 0.08), 0 1px 3px oklch(75% 0.02 60 / 0.04);
  --shadow-warm-md: 0 4px 16px oklch(75% 0.02 60 / 0.10), 0 2px 4px oklch(75% 0.02 60 / 0.06);
  --shadow-warm-lg: 0 8px 32px oklch(75% 0.02 60 / 0.12), 0 4px 8px oklch(75% 0.02 60 / 0.06);
}

/* Skeleton shimmer -- CSS-only infinite loop */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Skeleton Component with CSS Shimmer
```typescript
// app/components/ui/Skeleton.tsx
'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', variant = 'text', width, height, style, ...props }, ref) => {
    const variantClasses =
      variant === 'circular' ? 'rounded-full' :
      variant === 'rectangular' ? 'rounded-2xl' :
      'rounded-md'; // text

    return (
      <div
        ref={ref}
        className={`bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] ${variantClasses} ${className}`}
        style={{ width, height, ...style }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
```

### useReducedMotion Usage
```typescript
// Import from motion/react (re-exports framer-motion)
import { useReducedMotion } from 'motion/react';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : springs.gentle}
    />
  );
}
```

### Avatar with Gradient-Initial Fallback
```typescript
// Gradient generation from initials
function getGradientFromName(name: string): string {
  const gradients = [
    'from-rose-400 to-orange-300',
    'from-violet-400 to-purple-300',
    'from-cyan-400 to-blue-300',
    'from-emerald-400 to-teal-300',
    'from-amber-400 to-yellow-300',
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | @theme in globals.css | Tailwind v4 (Jan 2025) | All design tokens in CSS, no JS config file |
| framer-motion package | motion package | Motion v12 (2025) | Import from `motion/react`, same API, unified package |
| Custom focus trap JS | Native `<dialog>` + `showModal()` | Dialog + inert widely supported 2023+ | No library needed for focus management |
| body-scroll-lock npm | Fixed-body technique + overscroll-behavior | body-scroll-lock unmaintained since 2019 | Lighter, no dependency, handles iOS Safari |
| RGB/HSL colors | OKLCH colors | Tailwind v4 default | Perceptually uniform, wider gamut, better for palette generation |
| Geist font | Nunito Sans | This phase | Cyrillic support required for Russian-primary locale |

**Deprecated/outdated:**
- `body-scroll-lock` npm package: Unmaintained since 2019. Use the fixed-body CSS technique instead.
- `tailwind.config.js` / `tailwind.config.ts`: Not used in Tailwind v4. All configuration via `@theme` in CSS.
- `@custom-variant dark`: Will be removed from globals.css in this phase (light mode only).

## Open Questions

1. **Font choice: Nunito Sans vs alternatives**
   - What we know: DM Sans lacks Cyrillic (confirmed). Nunito Sans, Manrope, and Rubik all have full Cyrillic support via next/font/google.
   - What's unclear: Whether the user strongly prefers the DM Sans aesthetic and wants the closest visual match (Nunito Sans) or is open to alternatives (Manrope for more geometric, Rubik for more playful).
   - Recommendation: Use Nunito Sans as the closest DM Sans replacement -- warm, geometric, slightly rounded. If the user objects, Manrope is the next choice. Flag this to user early since it contradicts a locked decision.

2. **react-spinners removal timing**
   - What we know: The package is installed but the Skeleton component replaces loading spinners. ThemeProvider is trivial.
   - What's unclear: Whether other components outside this phase's scope use react-spinners.
   - Recommendation: Defer removal to a later phase to avoid breaking existing pages. Mark for cleanup.

3. **Shared business data TypeScript interfaces**
   - What we know: TenantPage.tsx has inline interface definitions (MultilingualText, Service, Employee, Photo, etc.) that will be needed by multiple components in Phase 2+.
   - What's unclear: Whether to extract these now or in Phase 2 when the TenantPage decomposition happens.
   - Recommendation: Defer to Phase 2. Design system components should accept generic props (string, number, ReactNode), not business-specific types.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No test framework detected |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (type checking + build validation) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DS-01 | Button renders all 4 variants + 3 sizes | manual-only | Build succeeds with TypeScript | n/a |
| DS-02 | Card renders with padding/shadow/radius | manual-only | Build succeeds with TypeScript | n/a |
| DS-03 | Modal scroll lock, focus trap, escape, click-outside | manual-only | Build succeeds; requires real browser testing on iOS | n/a |
| DS-04 | Badge renders metadata variants | manual-only | Build succeeds with TypeScript | n/a |
| DS-05 | Avatar renders image and gradient fallback | manual-only | Build succeeds with TypeScript | n/a |
| DS-06 | Skeleton shimmer animation renders | manual-only | Build succeeds; CSS animation visual check | n/a |
| DS-07 | StarRating display + input modes | manual-only | Build succeeds with TypeScript | n/a |
| DS-08 | SectionHeading renders with type scale | manual-only | Build succeeds with TypeScript | n/a |
| DS-09 | Typography system consistent | manual-only | Build succeeds; visual consistency check | n/a |
| DS-10 | --primary CSS variable used throughout | smoke | `grep -r "hardcoded hex" check` | n/a |
| DS-11 | Warm visual language applied | manual-only | Visual review | n/a |
| AR-02 | Components in ui/ with _lib/ | smoke | Directory structure check | n/a |
| AR-03 | Single responsive markup | smoke | `grep -r "hidden lg:block" + "lg:hidden"` in ui/ should be minimal | n/a |
| AR-04 | Translation-ready strings | smoke | Component props accept strings (no hardcoded Russian/Uzbek in ui/) | n/a |
| IX-04 | Mobile-first responsive | manual-only | Visual check at mobile breakpoints | n/a |

**Justification for manual-only:** This is a UI component library phase. The project has no test framework installed. The most valuable validation is `npm run build` (catches TypeScript errors and build failures) and `npm run lint` (catches code quality issues). Visual validation requires browser rendering. Installing a test framework (Vitest + Testing Library) would add scope to this foundation phase without proportional value, since the components are stateless presentational primitives.

### Sampling Rate
- **Per task commit:** `npm run build`
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Full build + lint green, visual review of all components

### Wave 0 Gaps
- No test framework installed -- acceptable for this phase (presentational components)
- Validation relies on TypeScript compilation (`npm run build`) and visual inspection
- A smoke test script could be added to grep for anti-patterns (hardcoded hex, `dark:` classes, `gray-*` usage in ui/)

## Sources

### Primary (HIGH confidence)
- `next/font/google` type definitions (node_modules) -- DM_Sans subsets confirmed as `latin | latin-ext` only; Nunito_Sans confirmed as `cyrillic | cyrillic-ext | latin | latin-ext | vietnamese`
- Google Fonts CSS API (fonts.googleapis.com) -- DM Sans unicode-range verified as Latin-only; Nunito Sans verified with U+0400-045F (Cyrillic)
- Tailwind CSS v4 theme.css (node_modules) -- stone palette confirmed; taupe NOT available in v4.1.18
- Motion package.json + type definitions (node_modules) -- v12.34.0, `motion/react` export path, `useReducedMotion` exported
- [Tailwind CSS Theme Documentation](https://tailwindcss.com/docs/theme) -- @theme vs @theme inline pattern
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors) -- stone palette OKLCH values

### Secondary (MEDIUM confidence)
- [Frontend Masters: Scroll-Locked Dialogs](https://frontendmasters.com/blog/scroll-locked-dialogs/) -- `body:has(dialog[open]) { overflow: hidden }` pattern
- [CSS-Tricks: No Need to Trap Focus on Dialog Element](https://css-tricks.com/there-is-no-need-to-trap-focus-on-a-dialog-element/) -- Native dialog focus management
- [PQINA: Prevent Scrolling iOS Safari](https://pqina.nl/blog/how-to-prevent-scrolling-the-page-on-ios-safari/) -- Fixed-body technique for iOS scroll lock
- [Motion useReducedMotion docs](https://motion.dev/docs/react-use-reduced-motion) -- Hook API (page structure couldn't be fully extracted but API confirmed via package exports)

### Tertiary (LOW confidence)
- [vercel/next.js#53506](https://github.com/vercel/next.js/issues/53506) -- Google Fonts data staleness issue reported (may or may not affect Nunito Sans)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and verified in node_modules
- Architecture: HIGH -- existing patterns (forwardRef, displayName, className extension) clearly established in codebase
- Typography/Font: HIGH -- DM Sans Cyrillic gap definitively confirmed via three independent sources; Nunito Sans replacement verified
- Modal implementation: MEDIUM -- native dialog focus trap is well-documented but iOS scroll lock requires real-device testing
- Animation presets: MEDIUM -- spring values (stiffness/damping) will need tuning during implementation; initial values are reasonable starting points
- Pitfalls: HIGH -- all pitfalls verified against official docs or actual source code

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- no fast-moving dependencies)
