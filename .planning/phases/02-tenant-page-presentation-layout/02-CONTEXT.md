# Phase 2: Tenant Page — Presentation & Layout - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Decompose the ~1536-line TenantPage.tsx monolith into ~20 focused components. Build the tenant page presentation layer: hero photo gallery, business header with metadata, team section, reviews section, about/contact section, sticky tab navigation, desktop sidebar layout, mobile bottom navigation, and per-section skeleton loading screens. Services section and booking flow are separate phases.

Requirements: TH-01, TH-02, TH-03, TH-04, TH-05, TH-06, TH-07, TR-01, TR-02, TR-03, TR-04, TA-01, TA-02, TA-03, TA-04, TA-05, AR-01

</domain>

<decisions>
## Implementation Decisions

### Photo Gallery
- Mobile carousel: full-bleed photos spanning full screen width, no rounded corners at top. Dot indicators overlaid at bottom. Photo counter "1/12" top-right, "See all" button bottom-right
- Desktop: Airbnb-style 5-photo mosaic layout (1 large + 4 small grid)
- Fullscreen lightbox: shared element transition — tapped photo morphs/scales into fullscreen using Motion layoutId. Backdrop fades in (black 90%). Swipe left/right to browse, swipe down to dismiss (photo shrinks back)
- No pinch-to-zoom — keeps gestures simple, no conflicts with swipe navigation
- Gallery interactions: swipe left/right for next/prev, swipe down to dismiss, tap to toggle caption/counter
- Empty hero (no photos): warm gradient background using tenant's --primary color at 10% opacity with business Avatar and name centered

### Desktop Layout & Sidebar
- Airbnb-style two-column: content left (~60%), sticky sidebar right (~40%)
- Sidebar is a Card component with position:sticky, contains: rating, open/closed status, working hours (expandable), phone, Instagram, location/distance, and Book Now CTA at bottom
- Book CTA: full-width button inside sidebar card, rounded-full, bg-primary, text-white — always visible as user scrolls
- On mobile: no sidebar — business info lives in the About tab section. Bottom nav has Book CTA always visible

### Business Header
- Layout: Avatar left (56px, rounded-full), name + tagline + badges to the right
- Name: text-2xl font-bold tracking-tight
- Tagline: text-sm text-stone-500
- Metadata badges row using Badge components: open/closed status, star rating with count, distance
- Open/closed badge: small colored dot (emerald-500 for open, rose-500 for closed) with text like "Открыто до 21:00" or "Сейчас закрыто"
- Language switcher: small pill toggle [RU|UZ] in header/nav area top-right. Active: bg-primary text-white. Inactive: stone-200 text-stone-600. text-xs, rounded-full

### Team Section
- Horizontal scrollable row with snap-x, snap-center
- Compact vertical cards ~120px wide, no border/shadow: Avatar (64px circular) + name (text-sm font-medium) + role (text-xs text-stone-500)
- Uses Avatar component with gradient-initial fallback
- 1-2 members: same card design, centered instead of left-aligned, no scroll indicator
- 0 members: subtle empty state with icon + text (consistent with reviews empty state pattern)

### Reviews Presentation
- Aggregate rating: Airbnb-style — large rating number on left, 5-to-1 star distribution bars on right. Bars: rounded-full, h-2, filled portion bg-primary, empty stone-200. Review count per star shown
- Individual review cards: Avatar (gradient-initial fallback) + reviewer name + star rating + relative date + comment text + service tag (Badge component showing service name + employee name)
- "Show all reviews": expand in-place. Show first 3, "Show all N reviews" button expands to reveal rest inline. "Show fewer" button to collapse
- Empty state (0 reviews): subtle message with star icon (lucide-react Star), "Пока нет отзывов" / "Будьте первым!", text-stone-400, text-center

### Tab Navigation
- Sticky horizontal tab bar below header on scroll, visible on both mobile and desktop
- Tab order: Services | Team | Reviews | About
- Active indicator: 2px underline in bg-primary that slides between tabs with spring animation (Motion layoutId, snappy spring preset)
- Active tab: text-stone-900. Inactive: text-stone-500
- Tap → smooth scroll to corresponding section
- IntersectionObserver updates active tab as user scrolls through sections (existing pattern in TenantPage.tsx)
- On desktop: tabs sit above the left content column, sidebar stays separate

### Mobile Bottom Navigation
- 3 items: Bookings (left) + Book CTA (center, elevated) + Call (right)
- Book button: elevated (-mt-3), rounded-full, bg-primary, scale animation on tap
- Safe area padding for iPhone notch (pb-safe)
- Always visible on mobile

### Working Hours Schedule
- Collapsed default: shows today's hours with clock icon and chevron ("🕒 Сегодня 09:00–21:00 ▼")
- Expand to full weekly schedule on tap
- Today's row: font-semibold + primary color highlight
- Closed days: text-stone-400 with "Закрыто" text
- Height animation using gentle spring preset

### Skeleton Loading
- Per-section skeletons matching actual content layout to prevent CLS
- Hero skeleton: photo placeholder shimmer
- Header skeleton: avatar circle + name/badge rectangles
- Team skeleton: row of circular avatars
- Reviews skeleton: card-shaped rectangles
- Uses Skeleton component from Phase 1 with appropriate variants

### Claude's Discretion
- Exact component decomposition strategy (how to split TenantPage.tsx into ~20 components)
- Component file organization within _components/ directories
- TypeScript interface extraction for shared business data types
- Exact scroll behavior tuning (IntersectionObserver rootMargin values)
- Skeleton animation timing details
- Whether to extract UI_TEXT translations inline or into lib/translations.ts

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/ui/Card.tsx`: Card with warm shadow, padding variants — use for sidebar card, review cards
- `app/components/ui/Badge.tsx`: Metadata display — use for status, rating, distance badges
- `app/components/ui/Avatar.tsx`: Image + gradient-initial fallback — use for team members, reviewers
- `app/components/ui/Skeleton.tsx`: Shimmer loading — use for all section skeletons
- `app/components/ui/SectionHeading.tsx`: Section titles — use for "Специалисты", "Отзывы", "О салоне"
- `app/components/ui/StarRating.tsx`: Star display — use in review cards and aggregate rating
- `app/components/ui/Modal.tsx`: Native dialog — could be used for fullscreen gallery (but shared element transition may need different approach)
- `app/components/ui/Button.tsx`: 4 variants — use for Book CTA, Show all reviews, etc.
- `lib/animations.ts`: Spring presets (gentle, snappy, soft) and animation variants (fadeUp, scaleIn, staggerChildren)
- `app/components/layout/BottomNav.tsx`: Existing bottom nav — refactor/restyle for warm design

### Established Patterns
- `React.forwardRef` + `displayName` for all UI components
- `className` prop extension via cn() utility
- Named exports (not default) for non-page components
- Mobile-first responsive with md:/lg: breakpoints
- `useLocale()` hook + translations for i18n
- IntersectionObserver for active tab tracking (existing in TenantPage.tsx)

### Integration Points
- `app/[locale]/[tenant]/TenantPage.tsx`: The 1536-line monolith to decompose — all data props already defined
- `app/[locale]/[tenant]/actions.ts`: Server actions (getDistance, reverseGeocode, setBookingIntent) — keep as-is
- `app/[locale]/[tenant]/loading.tsx`: Page-level loading — update to use section skeletons
- `app/globals.css`: Warm color system, shadow utilities, shimmer keyframe already defined

</code_context>

<specifics>
## Specific Ideas

- Airbnb photo gallery feel — shared element transition with photo morphing into fullscreen position
- Review distribution bars should use --primary color (tenant-branded), not a fixed color
- Team cards should feel like a quick "meet the team" glance — compact, scannable, not elaborate profiles
- Working hours: "Today" label instead of day name when collapsed, to feel personal and relevant
- Bottom nav Book CTA should feel like THE action on the page — elevated, colored, with satisfying tap feedback
- The page should feel like scrolling through a premium salon's profile — warm, trustworthy, not cluttered

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-tenant-page-presentation-layout*
*Context gathered: 2026-03-09*
