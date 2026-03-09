# Phase 2: Tenant Page -- Presentation & Layout - Research

**Researched:** 2026-03-09
**Domain:** React component decomposition, photo galleries, layout composition, gesture animations
**Confidence:** HIGH

## Summary

Phase 2 decomposes the existing 1536-line `TenantPage.tsx` monolith into ~20 focused components and rebuilds the presentation layer with the Phase 1 design system primitives. The existing code already implements all the required features (photo gallery, business header, team section, reviews, about section, tab navigation, bottom nav, sidebar) -- this phase is a **refactoring and visual upgrade**, not a greenfield build.

The monolith contains all the data interfaces, utility functions, translation strings, and rendering logic. The decomposition strategy should extract these into shared types, a translations module, utility helpers, and focused presentation components. The Phase 1 primitives (Card, Badge, Avatar, Skeleton, SectionHeading, StarRating, Modal, Button, PillButton, Input) replace hand-coded equivalents throughout.

**Primary recommendation:** Extract types and utilities first, then decompose section-by-section (hero, header, tabs, team, reviews, about/sidebar, bottom nav, gallery lightbox, skeletons) -- each new component replaces its inline equivalent in the monolith. Use Motion layoutId for tab indicators and shared element gallery transitions. Use CSS scroll-snap (already in place) for mobile carousel rather than adding a JS carousel library.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Mobile carousel: full-bleed photos spanning full screen width, no rounded corners at top. Dot indicators overlaid at bottom. Photo counter "1/12" top-right, "See all" button bottom-right
- Desktop: Airbnb-style 5-photo mosaic layout (1 large + 4 small grid)
- Fullscreen lightbox: shared element transition -- tapped photo morphs/scales into fullscreen using Motion layoutId. Backdrop fades in (black 90%). Swipe left/right to browse, swipe down to dismiss (photo shrinks back)
- No pinch-to-zoom -- keeps gestures simple, no conflicts with swipe navigation
- Gallery interactions: swipe left/right for next/prev, swipe down to dismiss, tap to toggle caption/counter
- Empty hero (no photos): warm gradient background using tenant's --primary color at 10% opacity with business Avatar and name centered
- Airbnb-style two-column: content left (~60%), sticky sidebar right (~40%)
- Sidebar is a Card component with position:sticky, contains: rating, open/closed status, working hours (expandable), phone, Instagram, location/distance, and Book Now CTA at bottom
- Book CTA: full-width button inside sidebar card, rounded-full, bg-primary, text-white -- always visible as user scrolls
- On mobile: no sidebar -- business info lives in the About tab section. Bottom nav has Book CTA always visible
- Business header layout: Avatar left (56px, rounded-full), name + tagline + badges to the right
- Name: text-2xl font-bold tracking-tight
- Tagline: text-sm text-stone-500
- Metadata badges row using Badge components: open/closed status, star rating with count, distance
- Open/closed badge: small colored dot (emerald-500 for open, rose-500 for closed) with text like "Open until 21:00" or "Now closed"
- Language switcher: small pill toggle [RU|UZ] in header/nav area top-right. Active: bg-primary text-white. Inactive: stone-200 text-stone-600. text-xs, rounded-full
- Team section: Horizontal scrollable row with snap-x, snap-center. Compact vertical cards ~120px wide, no border/shadow: Avatar (64px circular) + name (text-sm font-medium) + role (text-xs text-stone-500). Uses Avatar component with gradient-initial fallback
- 1-2 members: same card design, centered instead of left-aligned, no scroll indicator
- 0 members: subtle empty state with icon + text
- Reviews: Aggregate rating Airbnb-style -- large number left, 5-to-1 distribution bars right. Bars: rounded-full, h-2, filled bg-primary, empty stone-200
- Individual review cards: Avatar + reviewer name + star rating + relative date + comment text + service tag (Badge showing service name + employee name)
- "Show all reviews": expand in-place. Show first 3, button expands to reveal rest inline. "Show fewer" to collapse
- Empty state (0 reviews): subtle message with star icon, text-stone-400, text-center
- Sticky horizontal tab bar below header on scroll, visible on both mobile and desktop
- Tab order: Services | Team | Reviews | About
- Active indicator: 2px underline in bg-primary that slides between tabs with spring animation (Motion layoutId, snappy spring preset)
- Active tab: text-stone-900. Inactive: text-stone-500
- Tap -> smooth scroll to corresponding section
- IntersectionObserver updates active tab as user scrolls through sections
- Mobile bottom navigation: 3 items: Bookings (left) + Book CTA (center, elevated) + Call (right)
- Book button: elevated (-mt-3), rounded-full, bg-primary, scale animation on tap
- Safe area padding for iPhone notch (pb-safe)
- Working hours: collapsed default shows today's hours with clock icon and chevron. Expand to full weekly schedule. Today's row: font-semibold + primary color. Closed days: text-stone-400
- Per-section skeletons matching actual content layout to prevent CLS
- Uses Skeleton component from Phase 1 with appropriate variants

### Claude's Discretion
- Exact component decomposition strategy (how to split TenantPage.tsx into ~20 components)
- Component file organization within _components/ directories
- TypeScript interface extraction for shared business data types
- Exact scroll behavior tuning (IntersectionObserver rootMargin values)
- Skeleton animation timing details
- Whether to extract UI_TEXT translations inline or into lib/translations.ts

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TH-01 | Hero gallery shows Airbnb-style 5-photo mosaic on desktop | Existing mosaic code in TenantPage.tsx lines 676-746; decompose into HeroMosaic component |
| TH-02 | Hero gallery shows swipeable photo carousel on mobile with dot indicators | Existing carousel code lines 750-795; CSS scroll-snap approach already working, enhance with Phase 1 design |
| TH-03 | Fullscreen gallery lightbox with swipe navigation and swipe-down-to-close | Existing gallery modal lines 1450-1532; rebuild with Motion layoutId shared element transition + drag gestures |
| TH-04 | "See all photos" button opens fullscreen gallery when >5 photos | Existing button line 736-742; move into HeroMosaic component |
| TH-05 | Business header displays name, avatar, tagline with typographic hierarchy | Existing header code lines 800-911; decompose into BusinessHeader using Avatar + typography system |
| TH-06 | Metadata badges row shows open/closed status, star rating, distance | Existing MetadataBadges component lines 574-624; extract and rebuild using Badge component |
| TH-07 | Language switcher (RU/UZ) accessible from header area | Existing LanguageSwitcher lines 545-571; extract to standalone component |
| TR-01 | Team section shows employee cards in horizontal scroll | Existing team section lines 1030-1070; rebuild using Avatar component, snap-x scroll |
| TR-02 | Reviews section shows aggregate star rating with distribution bars | Existing RatingDistribution lines 628-658; extract and rebuild using StarRating + primary-colored bars |
| TR-03 | Individual review cards with avatar, rating, date, comment, service context | Existing review cards lines 1090-1131; rebuild using Card, Avatar, StarRating, Badge |
| TR-04 | "Show all reviews" expand toggle when >3 reviews | Existing toggle lines 1132-1139; add "Show fewer" collapse with height animation |
| TA-01 | About section shows working hours, contact info, location link | Existing about section lines 1261-1385 (mobile) and 1203-1257 (desktop sidebar); decompose |
| TA-02 | Desktop layout uses right sidebar for business info | Existing sidebar lines 1144-1258; rebuild using Card component with position:sticky |
| TA-03 | Sticky tab navigation with IntersectionObserver-driven active state and spring-animated indicator | Existing tab nav lines 836-874; rebuild with Phase 1 design tokens, Motion layoutId |
| TA-04 | Mobile bottom navigation with prominent booking action | Existing BottomNav component; redesign with elevated Book CTA and safe area padding |
| TA-05 | Per-section skeleton loading screens matching actual content layout | Existing loading.tsx skeletons; rebuild using Skeleton component from Phase 1 |
| AR-01 | TenantPage.tsx decomposed from monolith into ~20 focused components | This phase's core task -- extract types, utils, translations, then section-by-section components |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.34.0 | Layout animations, shared element transitions, gestures | Already in project; layoutId for tab indicator and gallery transitions |
| lucide-react | ^0.563.0 | Icon library | Already in project; provides Clock, MapPin, Phone, Star, Instagram, etc. |
| next | ^16.1.6 | Framework | Already in project; app router with standalone output |
| tailwindcss | ^4 | Styling | Already in project; warm design system from Phase 1 |

### Phase 1 Primitives (Use These)
| Component | File | Use In Phase 2 |
|-----------|------|----------------|
| Card | `app/components/ui/Card.tsx` | Sidebar card, review cards, working hours card, contact card |
| Badge | `app/components/ui/Badge.tsx` | Open/closed status, rating badge, distance badge, service tags on reviews |
| Avatar | `app/components/ui/Avatar.tsx` | Business avatar, team member avatars, reviewer avatars |
| Skeleton | `app/components/ui/Skeleton.tsx` | All section-level skeleton screens |
| SectionHeading | `app/components/ui/SectionHeading.tsx` | Section titles for Team, Reviews, About |
| StarRating | `app/components/ui/StarRating.tsx` | Aggregate rating display, per-review ratings |
| Modal | `app/components/ui/Modal.tsx` | Location permission modal (existing pattern) |
| Button | `app/components/ui/Button.tsx` | Book CTA, Show all reviews, Call button |
| PillButton | `app/components/ui/PillButton.tsx` | Category filters (Services section, Phase 3) |
| Input | `app/components/ui/Input.tsx` | Search input (Services section, Phase 3) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS scroll-snap carousel | Swiper.js or Motion+ Carousel | Existing CSS scroll-snap works well, zero bundle cost; don't add dependency |
| Motion drag for gallery swipe | react-swipeable | Motion already installed and supports drag gestures; no need for extra lib |
| Custom lightbox | react-image-lightbox | Motion layoutId gives the exact "morphing" effect user wants; libraries are heavyweight |

**Installation:**
No new dependencies needed. All required libraries already installed.

## Architecture Patterns

### Recommended Component Decomposition

The ~1536-line monolith decomposes into these components:

```
app/[locale]/[tenant]/
  TenantPage.tsx              # Slim orchestrator (~100-150 lines): receives props, passes to sections
  _components/
    HeroGallery/
      HeroMosaic.tsx          # Desktop 5-photo mosaic grid
      HeroCarousel.tsx        # Mobile swipeable carousel with dot indicators
      HeroEmpty.tsx           # Empty state: gradient + avatar + name
      GalleryLightbox.tsx     # Fullscreen gallery with shared element transition
    BusinessHeader.tsx        # Avatar + name + tagline + metadata badges
    MetadataBadges.tsx        # Open/closed, rating, distance badges row
    LanguageSwitcher.tsx      # RU/UZ pill toggle
    TabNavigation.tsx         # Sticky tabs with IO-driven active state + layoutId indicator
    TeamSection.tsx           # Horizontal scrollable team cards
    TeamCard.tsx              # Individual team member card
    ReviewsSection.tsx        # Aggregate rating + review cards list + show all toggle
    RatingDistribution.tsx    # Airbnb-style rating breakdown bars
    ReviewCard.tsx            # Individual review card
    AboutSection.tsx          # Mobile about: map, call, hours, instagram
    DesktopSidebar.tsx        # Desktop sticky sidebar card
    WorkingHours.tsx          # Expandable weekly schedule (shared between mobile/desktop)
    ContactInfo.tsx           # Phone + Instagram links (shared between mobile/desktop)
    BottomNav.tsx             # Redesigned mobile bottom nav with elevated Book CTA
    skeletons/
      HeroSkeleton.tsx        # Photo area shimmer
      HeaderSkeleton.tsx      # Avatar + name + badges shimmer
      TabsSkeleton.tsx        # Tab bar shimmer
      TeamSkeleton.tsx        # Circular avatars row shimmer
      ReviewsSkeleton.tsx     # Card-shaped rectangles shimmer
      SidebarSkeleton.tsx     # Desktop sidebar shimmer
      AboutSkeleton.tsx       # Mobile about section shimmer
  _lib/
    types.ts                  # Extracted interfaces: Business, Employee, Photo, Review, etc.
    utils.ts                  # secondsToTime, getTodayName, isOpenNow, getClosingTime, formatPrice, formatDuration, getRelativeDate
    translations.ts           # UI_TEXT, DAY_NAMES, LOCALE_LABELS extracted from monolith
    use-active-section.ts     # Custom hook wrapping IntersectionObserver for tab tracking
    use-distance.ts           # Custom hook for geolocation distance fetching + caching
```

**Total: ~22 components + 4 lib files + 7 skeleton components**

### Pattern 1: Slim Orchestrator
**What:** TenantPage.tsx becomes a thin wrapper that receives all props from the server component (page.tsx), sets CSS custom properties, and renders section components.
**When to use:** When a monolith has grown unwieldy but all data comes from a single source.

```typescript
// TenantPage.tsx -- slim orchestrator pattern
export function TenantPage({ business, employees, photos, reviews, ...rest }: TenantPageProps) {
  const primaryColor = business.primary_color || '#088395';

  return (
    <div className="min-h-screen bg-background" style={{ '--primary': primaryColor } as React.CSSProperties}>
      {photos.length > 0 ? (
        <HeroGallery photos={photos} business={business} />
      ) : (
        <HeroEmpty business={business} />
      )}
      <BusinessHeader business={business} />
      <TabNavigation locale={rest.locale}>
        <TeamSection employees={employees} locale={rest.locale} />
        <ReviewsSection reviews={reviews} reviewStats={business.review_stats} locale={rest.locale} />
        {/* Services section placeholder for Phase 3 */}
        <AboutSection business={business} locale={rest.locale} />
      </TabNavigation>
      <DesktopSidebar business={business} locale={rest.locale} savedUser={rest.savedUser} />
      <BottomNav locale={rest.locale} business={business} />
    </div>
  );
}
```

### Pattern 2: Shared Types Module
**What:** Extract all TypeScript interfaces from the monolith into a single `_lib/types.ts` that all components import from.
**When to use:** When 5+ components share the same data shapes.

```typescript
// _lib/types.ts
export interface MultilingualText { uz: string; ru: string; }
export interface Business { name: string; bio?: string; /* ... all fields */ }
export interface Employee { id: string; first_name: string | null; /* ... */ }
export interface Photo { id: string; url: string; category: 'interior' | 'exterior'; order: number; }
export interface Review { id: string; customer_name: string; /* ... */ }
export interface ReviewStats { average_rating: number; total_reviews: number; rating_distribution: Record<number, number>; }
```

### Pattern 3: Custom Hook Extraction
**What:** Extract reusable stateful logic (distance fetching, section tracking) into custom hooks.
**When to use:** When state + effects belong together but are used across components.

```typescript
// _lib/use-active-section.ts
export function useActiveSection(sectionRefs: Record<string, React.RefObject<HTMLElement | null>>) {
  const [activeSection, setActiveSection] = useState('services');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = Object.entries(sectionRefs).find(([, ref]) => ref.current === entry.target);
            if (match) setActiveSection(match[0]);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    Object.values(sectionRefs).forEach(ref => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, [sectionRefs]);

  return activeSection;
}
```

### Anti-Patterns to Avoid
- **Prop drilling through 4+ levels:** If a value is needed by deeply nested components (locale, business name), pass it directly rather than threading through intermediate components. Keep nesting shallow -- max 2 levels.
- **Re-rendering the whole page on gallery state change:** Gallery lightbox state should be local to HeroGallery, not lifted to TenantPage. Use the existing pattern of local useState.
- **Duplicating mobile/desktop markup:** AR-03 requires single responsive markup. Use CSS breakpoints (hidden lg:block / lg:hidden) for visibility, not duplicate React trees. Exception: AboutSection vs DesktopSidebar are genuinely different components, not duplicated markup.
- **AnimatePresence + layoutId unmount bugs:** Known issue (#2172, #1619) where elements with layoutId inside AnimatePresence fail to unmount. Workaround: ensure motion elements stay mounted until AnimatePresence exit completes. Use conditional rendering on the AnimatePresence wrapper only, not on inner motion elements.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Photo gallery carousel | Custom touch/swipe handler | CSS scroll-snap (already working) | Native browser performance, momentum scrolling, accessibility |
| Star rating display | Custom star rendering with SVGs | `StarRating` component (Phase 1) | Already handles half-stars, sizing, interactive mode |
| Tab indicator animation | Manual CSS transforms | Motion `layoutId="activeTabIndicator"` | Automatic FLIP calculation between positions |
| Scroll body lock | Custom JS scroll lock | `Modal` component (Phase 1) with fixed-body pattern | Already handles iOS Safari quirks |
| Shimmer loading | Custom CSS animation | `Skeleton` component (Phase 1) | Consistent shimmer keyframe already in globals.css |
| Avatar fallback | Inline gradient-initial rendering | `Avatar` component (Phase 1) | Consistent gradient selection, sizing |
| Relative date formatting | Inline date math | Extract `getRelativeDate` to `_lib/utils.ts` | Shared between review cards and future booking cards |

**Key insight:** This phase is primarily a **decomposition and design upgrade**, not a feature build. Every feature already exists in the monolith. The risk is in introducing regressions during refactoring, not in building new functionality.

## Common Pitfalls

### Pitfall 1: Breaking the Data Flow During Decomposition
**What goes wrong:** Extracting components changes which component owns state, causing bugs in features that depend on cross-component state (e.g., gallery open state + scroll lock, active tab + section refs).
**Why it happens:** The monolith has 15+ useState calls in a single function scope. Splitting means deciding ownership.
**How to avoid:** Map state ownership before extracting. Gallery state stays with HeroGallery. Tab state stays with TabNavigation. Distance state becomes a custom hook. Locale/translations are passed as props.
**Warning signs:** Two components both trying to control document.body.overflow. Stale ref values. IntersectionObserver not detecting sections.

### Pitfall 2: layoutId Conflicts with AnimatePresence
**What goes wrong:** Elements with layoutId inside AnimatePresence fail to unmount properly, causing visual glitches (blinking, stuck elements).
**Why it happens:** Known Motion bug (#2172, #2616) where AnimatePresence exit animations conflict with layoutId's cross-fade behavior.
**How to avoid:** Use layoutId for the tab indicator (simple, no AnimatePresence needed). For the gallery lightbox, use AnimatePresence for the overlay/container but avoid putting layoutId on elements that unmount with AnimatePresence. Instead, animate the gallery entry/exit with simple opacity/scale transitions.
**Warning signs:** Gallery backdrop stays visible after closing. Tab indicator disappears and reappears.

### Pitfall 3: CLS from Skeleton/Content Mismatch
**What goes wrong:** Skeleton dimensions don't match actual content, causing layout shift when real content loads.
**Why it happens:** Skeletons are often designed without measuring actual component dimensions.
**How to avoid:** Each skeleton must mirror the exact structure (grid layout, spacing, aspect ratios) of its corresponding section. Use the same Tailwind classes for container structure.
**Warning signs:** Content jumps when loading completes. Scrollbar position changes between loading and loaded states.

### Pitfall 4: iOS Safari Scroll-Snap Recalculation
**What goes wrong:** After dynamically modifying carousel children or styles, iOS Safari doesn't recalculate snap points.
**Why it happens:** WebKit caches snap point positions during initial layout.
**How to avoid:** Don't dynamically change the number of carousel slides after mount. If gallery filter changes the photo set, re-render the entire carousel container (unmount/remount).
**Warning signs:** Swipe snaps to wrong positions. Carousel "jumps" to unexpected slide.

### Pitfall 5: aboutRef Collision Between Mobile and Desktop
**What goes wrong:** The existing code has `aboutRef` used by both the desktop sidebar and the mobile about section. IntersectionObserver can only observe one element per ref.
**Why it happens:** The monolith uses a single ref for two different elements (one is `lg:hidden`, one is `hidden lg:block`).
**How to avoid:** In the decomposed version, the IntersectionObserver should observe both the DesktopSidebar container and the AboutSection container, but only one will be visible at any time. Use a single ref that conditionally points to whichever is visible, or observe both and let CSS visibility determine which triggers.
**Warning signs:** Scrolling to About doesn't highlight the tab. Tab highlights About at the wrong scroll position.

### Pitfall 6: Color System Migration (zinc to stone)
**What goes wrong:** The existing monolith uses `zinc-*` color classes (Tailwind default gray). Phase 1 design system uses `stone-*` (warm gray). Mixing them creates visual inconsistency.
**Why it happens:** Forgetting to update color classes during component extraction.
**How to avoid:** During extraction, systematically replace all `zinc-*` with `stone-*` equivalents. Also remove all `dark:` variants (Phase 1 decision: light mode only).
**Warning signs:** Some sections look slightly cooler/bluer than others. Borders have inconsistent tones.

## Code Examples

### Shared Element Gallery Transition (Motion layoutId)

The user wants photos to "morph" from their grid position to fullscreen. However, due to known AnimatePresence + layoutId bugs, use a simpler but reliable approach:

```typescript
// GalleryLightbox.tsx -- reliable fullscreen gallery
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { springs } from '@/lib/animations';

interface GalleryLightboxProps {
  photos: { url: string; category: string }[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

export function GalleryLightbox({ photos, initialIndex, open, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    // Swipe down to dismiss
    if (info.offset.y > 100 && info.velocity.y > 300) {
      onClose();
      return;
    }
    // Swipe left/right for next/prev
    if (Math.abs(info.offset.x) > 50 && Math.abs(info.velocity.x) > 500) {
      if (info.offset.x < 0) {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header with counter and close */}
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm font-medium">{currentIndex + 1} / {photos.length}</span>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
              <X size={22} />
            </button>
          </div>

          {/* Draggable image */}
          <div className="flex-1 flex items-center justify-center">
            <motion.img
              key={currentIndex}
              src={photos[currentIndex].url}
              alt=""
              className="max-w-full max-h-full object-contain select-none"
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springs.snappy}
            />
          </div>

          {/* Navigation arrows (desktop) */}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full hidden lg:flex items-center justify-center text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full hidden lg:flex items-center justify-center text-white"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Tab Navigation with layoutId Indicator

```typescript
// TabNavigation.tsx
'use client';

import { motion } from 'motion/react';
import { springs } from '@/lib/animations';
import { cn } from '@/app/components/ui/_lib/cn';

interface Tab {
  id: string;
  label: string;
  ref: React.RefObject<HTMLElement | null>;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabClick }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-warm-sm">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                tab.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                onTabClick(tab.id);
              }}
              className={cn(
                'relative px-3.5 lg:px-5 py-2.5 lg:py-3.5 text-[13px] lg:text-[15px] whitespace-nowrap transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-500 font-medium hover:text-stone-700'
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={springs.snappy}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

### Rating Distribution with Primary Color

```typescript
// RatingDistribution.tsx
'use client';

import React from 'react';
import { StarRating } from '@/app/components/ui/StarRating';
import type { ReviewStats } from './_lib/types';

interface RatingDistributionProps {
  stats: ReviewStats;
  reviewCountLabel: string;
}

export function RatingDistribution({ stats, reviewCountLabel }: RatingDistributionProps) {
  const { average_rating, total_reviews, rating_distribution } = stats;

  return (
    <div className="flex items-center gap-4 lg:gap-6 p-4 lg:p-5 bg-stone-50 rounded-2xl mb-4 lg:mb-5">
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl lg:text-5xl font-bold text-stone-900">{average_rating}</span>
        <StarRating rating={average_rating} size="sm" />
        <span className="text-xs text-stone-400 mt-0.5">{total_reviews} {reviewCountLabel}</span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = rating_distribution[star] || 0;
          const pct = total_reviews > 0 ? (count / total_reviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-stone-400 w-3 text-right">{star}</span>
              <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-stone-400 w-5 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Working Hours Expandable Schedule

```typescript
// WorkingHours.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronDown } from 'lucide-react';
import { springs } from '@/lib/animations';
import { cn } from '@/app/components/ui/_lib/cn';

interface WorkingHoursProps {
  workingHours: Record<string, { start: number; end: number; is_open: boolean }>;
  dayNames: Record<string, string>;
  todayLabel: string;
  closedLabel: string;
  title: string;
  openUntilText?: string;
  /** Whether to show inline (sidebar) or collapsible (mobile) */
  variant?: 'inline' | 'collapsible';
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function secondsToTime(seconds: number): string {
  if (seconds >= 86399) return '24:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getTodayKey(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

export function WorkingHours({ workingHours, dayNames, closedLabel, title, openUntilText, variant = 'collapsible' }: WorkingHoursProps) {
  const [expanded, setExpanded] = useState(variant === 'inline');
  const todayKey = getTodayKey();

  const schedule = (
    <div className="space-y-1">
      {DAY_ORDER.map((day) => {
        const hours = workingHours[day];
        const isToday = day === todayKey;
        return (
          <div
            key={day}
            className={cn(
              'flex justify-between text-sm py-2 px-3 rounded-lg',
              isToday && 'bg-primary/10'
            )}
          >
            <span className={cn(
              isToday ? 'font-medium text-primary' : hours?.is_open ? 'text-stone-600' : 'text-stone-400'
            )}>
              {dayNames[day]}
            </span>
            <span className={cn(
              isToday ? 'font-medium text-primary' : hours?.is_open ? 'text-stone-900' : 'text-stone-400'
            )}>
              {hours?.is_open ? `${secondsToTime(hours.start)} - ${secondsToTime(hours.end)}` : closedLabel}
            </span>
          </div>
        );
      })}
    </div>
  );

  if (variant === 'inline') {
    return (
      <div>
        <h4 className="text-base font-semibold text-stone-900 mb-3">{title}</h4>
        {schedule}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-3.5">
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-primary" />
          <span className="text-sm font-semibold text-stone-900">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {openUntilText && <span className="text-xs font-medium text-emerald-600">{openUntilText}</span>}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-stone-400" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.gentle}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{schedule}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## State of the Art

| Old Approach (Monolith) | New Approach (Phase 2) | Impact |
|-------------------------|------------------------|--------|
| All code in one 1536-line file | ~22 focused components + hooks | Each file under 150 lines; easier to modify individual sections |
| Inline TypeScript interfaces | Shared `_lib/types.ts` | Server page.tsx and client components share type definitions |
| `zinc-*` color classes + dark mode variants | `stone-*` warm palette, light mode only | Consistent warm aesthetic per Phase 1 design system |
| Inline Star rendering with SVG | `StarRating` component | Consistent star display with half-star support |
| Inline avatar rendering | `Avatar` component | Consistent gradient-initial fallback |
| Basic div containers | `Card` component | Consistent shadows, padding, rounding |
| Inline shimmer divs | `Skeleton` component | Consistent shimmer animation via globals.css keyframe |
| `animate-pulse` for loading | `animate-[shimmer_1.5s]` | Smoother directional shimmer vs generic opacity pulse |
| Dark mode support throughout | Light mode only | Simplified markup, no `dark:` variant noise |

## Open Questions

1. **Gallery Shared Element Transition Reliability**
   - What we know: Motion layoutId can create shared element transitions between grid photos and fullscreen gallery. Known bugs exist with AnimatePresence + layoutId (#2172, #1619, #2616) causing unmount failures and blinking.
   - What's unclear: Whether the morphing effect works reliably in production across iOS Safari, Chrome, and Firefox.
   - Recommendation: Implement a simpler but reliable approach first (scale-in/out animation) with layout prop preparation. If time allows, experiment with layoutId for the hero-to-lightbox transition as an enhancement. The tab indicator layoutId (no AnimatePresence) is safe to use.

2. **Services Section Stub**
   - What we know: Services section (TS-01 through TS-05) is Phase 3. But tab navigation lists "Services" as the first tab.
   - What's unclear: Should Phase 2 include a minimal services section stub, or should the existing services rendering remain as-is during this phase?
   - Recommendation: Keep existing services rendering as-is during Phase 2 decomposition. Wrap it in a ServicesSection placeholder component that Phase 3 will replace. Don't rebuild services UI in Phase 2.

3. **Translation String Organization**
   - What we know: Current monolith has ~50 UI_TEXT strings inline. Phase 1 decision (AR-04) says "all user-facing strings use the translation system (centralized or co-located)."
   - What's unclear: Whether to extract to `lib/translations.ts` (centralized) or keep co-located `_lib/translations.ts` near the tenant components.
   - Recommendation: Extract to `_lib/translations.ts` co-located with the tenant page components. These strings are tenant-page-specific, not used elsewhere. Keep `useLocale()` hook pattern from Phase 1 for accessing them.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test infrastructure exists in the landing-page project |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements --> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TH-01 | Desktop mosaic renders 5-photo grid | manual-only | Visual inspection at lg breakpoint | N/A |
| TH-02 | Mobile carousel swipes with dot indicators | manual-only | Touch device testing | N/A |
| TH-03 | Fullscreen lightbox with swipe navigation | manual-only | Touch + desktop testing | N/A |
| TH-04 | "See all photos" button appears when >5 photos | manual-only | Visual inspection | N/A |
| TH-05 | Header displays name, avatar, tagline | manual-only | Visual inspection | N/A |
| TH-06 | Metadata badges show status, rating, distance | manual-only | Visual inspection | N/A |
| TH-07 | Language switcher toggles RU/UZ | manual-only | Click test, verify URL change | N/A |
| TR-01 | Team cards in horizontal scroll | manual-only | Visual + scroll test | N/A |
| TR-02 | Aggregate rating with distribution bars | manual-only | Visual inspection | N/A |
| TR-03 | Individual review cards with all metadata | manual-only | Visual inspection | N/A |
| TR-04 | Show all / show fewer reviews toggle | manual-only | Click test | N/A |
| TA-01 | About section with hours, contact, location | manual-only | Visual inspection | N/A |
| TA-02 | Desktop sticky sidebar | manual-only | Scroll test at lg breakpoint | N/A |
| TA-03 | Sticky tabs with IO-driven active state | manual-only | Scroll test, verify tab highlight | N/A |
| TA-04 | Mobile bottom nav with elevated Book CTA | manual-only | Visual inspection at mobile | N/A |
| TA-05 | Per-section skeleton loading screens | manual-only | Throttle network, verify skeletons | N/A |
| AR-01 | Monolith decomposed into ~20 components | smoke | `npm run build` -- build succeeds with no type errors | N/A |

**Justification for manual-only:** This is a UI presentation layer with no business logic. All requirements are visual/interactive. The primary automated validation is `npm run build` (TypeScript type checking) and `npm run lint` (ESLint). Visual regression testing would require Playwright/Cypress + screenshot comparison, which is not in the current stack.

### Sampling Rate
- **Per task commit:** `npm run build` -- verifies no TypeScript errors
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** `npm run build` succeeds + manual visual inspection against success criteria

### Wave 0 Gaps
- None -- no test infrastructure to set up. Validation is build-time type checking + manual visual inspection.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `app/[locale]/[tenant]/TenantPage.tsx` (1536 lines) -- all existing features analyzed line-by-line
- Existing codebase: Phase 1 components in `app/components/ui/` -- all 10 primitives reviewed
- Existing codebase: `lib/animations.ts` -- spring presets and animation variants
- Existing codebase: `app/globals.css` -- warm design system, shimmer keyframe, safe area support
- [Motion layout animations docs](https://motion.dev/docs/react-layout-animations) -- layoutId API
- [Motion gestures docs](https://motion.dev/docs/react-gestures) -- drag, onDragEnd, velocity detection

### Secondary (MEDIUM confidence)
- [Motion layoutId + AnimatePresence bug #2172](https://github.com/framer/motion/issues/2172) -- unmount failures
- [Motion layoutId blinking bug #2616](https://github.com/motiondivision/motion/issues/2616) -- enter/exit visual glitches
- [CSS scroll-snap iOS Safari issues](https://www.xjavascript.com/blog/css-scroll-snap-visual-glitches-on-ios-when-programmatically-setting-style-on-children/) -- snap point recalculation
- [MDN env() safe-area-inset-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) -- iOS safe area padding

### Tertiary (LOW confidence)
- Motion+ Carousel feature availability -- mentioned in Motion blog but may require paid Motion+ subscription; using CSS scroll-snap instead

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed, Phase 1 components already built and reviewed
- Architecture: HIGH -- decomposition strategy based on reading every line of the 1536-line monolith, clear extraction boundaries
- Pitfalls: HIGH -- identified from existing code patterns, known Motion bugs with issue numbers, iOS Safari documented quirks
- Gallery transition: MEDIUM -- layoutId API is well-documented but has known bugs with AnimatePresence; simpler fallback approach recommended

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- no moving targets, all libraries already pinned)
