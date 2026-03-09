---
phase: 02-tenant-page-presentation-layout
plan: 04
subsystem: ui
tags: [react, typescript, skeleton, loading, orchestrator, decomposition]

# Dependency graph
requires:
  - phase: 01-design-system-foundation
    provides: Skeleton component, cn utility
  - phase: 02-tenant-page-presentation-layout (plan 01)
    provides: _lib/types.ts, _lib/utils.ts, _lib/translations.ts, _lib/use-distance.ts, HeroGallery components
  - phase: 02-tenant-page-presentation-layout (plan 02)
    provides: BusinessHeader, MetadataBadges, LanguageSwitcher, TeamSection, ReviewsSection
  - phase: 02-tenant-page-presentation-layout (plan 03)
    provides: TabNavigation, useActiveSection, WorkingHours, DesktopSidebar, AboutSection, ContactInfo, BottomNav
provides:
  - 7 per-section skeleton components matching actual content layout dimensions
  - Rewritten loading.tsx composing skeleton components for CLS-free loading
  - TenantPage.tsx slim orchestrator (187 lines, down from 1536) wiring all decomposed components
affects: [03 (services extraction), page composition, loading performance]

# Tech tracking
tech-stack:
  added: []
  patterns: [skeleton-per-section pattern, slim orchestrator wiring pattern]

key-files:
  created:
    - app/[locale]/[tenant]/_components/skeletons/HeroSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/HeaderSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/TabsSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/TeamSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/ReviewsSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/SidebarSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/AboutSkeleton.tsx
  modified:
    - app/[locale]/[tenant]/loading.tsx
    - app/[locale]/[tenant]/TenantPage.tsx

key-decisions:
  - "Skeleton components use Phase 1 Skeleton primitive (shimmer gradient) instead of raw divs with animate-pulse"
  - "TenantPage services section kept inline at 187 total lines to avoid creating a component Phase 3 will immediately replace"
  - "aboutRef shared between DesktopSidebar wrapper div and AboutSection for IO-based tab tracking across responsive breakpoints"

patterns-established:
  - "Per-section skeleton pattern: each section has a matching skeleton for CLS prevention"
  - "Slim orchestrator pattern: TenantPage.tsx is imports + hooks + derived state + JSX composition, no inline component definitions"

requirements-completed: [TA-05, AR-01]

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 2 Plan 04: Skeleton Loading + TenantPage Orchestrator Summary

**7 per-section skeleton components using Phase 1 Skeleton primitive, and TenantPage.tsx rewritten from 1536-line monolith to 187-line orchestrator wiring all 20+ decomposed components**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T10:11:03Z
- **Completed:** 2026-03-09T10:15:00Z
- **Tasks:** 2
- **Files created/modified:** 9

## Accomplishments
- Created 7 skeleton components (Hero, Header, Tabs, Team, Reviews, Sidebar, About) that mirror exact dimensions of actual content sections to prevent Cumulative Layout Shift
- Rewrote loading.tsx to compose skeleton components instead of raw divs with animate-pulse; uses bg-background warm off-white, stone-* palette
- Replaced 1536-line TenantPage.tsx monolith with 187-line orchestrator that imports and wires all decomposed components from Plans 01-03
- Eliminated all zinc-* classes and dark: variants from both TenantPage.tsx and loading.tsx
- Services section preserved inline in orchestrator (search, category filter, book button all functional) -- Phase 3 will extract it

## Task Commits

Each task was committed atomically:

1. **Task 1: Create per-section skeleton components and update loading.tsx** - `4a212a7` (feat)
2. **Task 2: Rewrite TenantPage.tsx as slim orchestrator** - `aa008eb` (feat)

## Files Created/Modified
- `app/[locale]/[tenant]/_components/skeletons/HeroSkeleton.tsx` - Desktop mosaic + mobile carousel shimmer matching hero layout
- `app/[locale]/[tenant]/_components/skeletons/HeaderSkeleton.tsx` - Avatar + name + badges shimmer matching BusinessHeader
- `app/[locale]/[tenant]/_components/skeletons/TabsSkeleton.tsx` - Sticky tab bar shimmer with 4 varying-width placeholders
- `app/[locale]/[tenant]/_components/skeletons/TeamSkeleton.tsx` - Circular avatar row shimmer matching TeamSection
- `app/[locale]/[tenant]/_components/skeletons/ReviewsSkeleton.tsx` - Aggregate rating + 3 review card skeletons matching ReviewsSection
- `app/[locale]/[tenant]/_components/skeletons/SidebarSkeleton.tsx` - Desktop-only sidebar with CTA, map, hours, contact skeletons
- `app/[locale]/[tenant]/_components/skeletons/AboutSkeleton.tsx` - Mobile-only map card, call button, hours card skeletons
- `app/[locale]/[tenant]/loading.tsx` - Rewritten to compose all skeleton components
- `app/[locale]/[tenant]/TenantPage.tsx` - 187-line orchestrator (was 1536 lines)

## Decisions Made
- Skeleton components use Phase 1 Skeleton primitive with shimmer gradient animation (bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200) instead of raw divs with animate-pulse for visual consistency
- Services section kept inline in orchestrator rather than extracting to a ServicesSection component, since Phase 3 will rebuild services completely
- aboutRef attached to both DesktopSidebar wrapper and AboutSection -- IntersectionObserver only fires for the visible one (hidden elements have zero intersection), solving the dual-breakpoint tab tracking issue

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 2 decomposition complete: TenantPage.tsx is now a clean orchestrator wiring ~20 focused components
- All components use stone-* warm palette with Phase 1 design system primitives
- Loading states match actual content layout dimensions for CLS prevention
- Services section is the only remaining monolithic code, ready for Phase 3 extraction
- Tab navigation, gallery lightbox, distance display, booking intent all functional via decomposed components

## Self-Check: PASSED

All 9 files verified present. Both task commits (4a212a7, aa008eb) verified in git log. TenantPage.tsx at 187 lines (under 250 target). Build passes with zero errors. No zinc-* or dark: classes in any changed files.

---
*Phase: 02-tenant-page-presentation-layout*
*Completed: 2026-03-09*
