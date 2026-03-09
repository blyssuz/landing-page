---
phase: 02-tenant-page-presentation-layout
plan: 01
subsystem: ui
tags: [react, typescript, motion, gallery, carousel, lightbox, i18n]

# Dependency graph
requires:
  - phase: 01-design-system-foundation
    provides: Avatar, cn(), springs animation presets
provides:
  - Shared TypeScript interfaces for all tenant page components (_lib/types.ts)
  - Pure utility functions for formatting and business logic (_lib/utils.ts)
  - Localized UI text strings with new translation keys (_lib/translations.ts)
  - Distance fetching hook with geolocation caching (_lib/use-distance.ts)
  - Desktop 5-photo Airbnb-style mosaic grid (HeroMosaic)
  - Mobile CSS scroll-snap carousel with dot indicators (HeroCarousel)
  - Empty state hero with warm gradient and Avatar (HeroEmpty)
  - Fullscreen gallery lightbox with Motion drag gestures (GalleryLightbox)
affects: [02-02, 02-03, 02-04, 03-01]

# Tech tracking
tech-stack:
  added: []
  patterns: [_lib/ shared modules pattern, pure utility functions with locale params, custom hooks for side effects]

key-files:
  created:
    - app/[locale]/[tenant]/_lib/types.ts
    - app/[locale]/[tenant]/_lib/utils.ts
    - app/[locale]/[tenant]/_lib/translations.ts
    - app/[locale]/[tenant]/_lib/use-distance.ts
    - app/[locale]/[tenant]/_components/HeroGallery/HeroMosaic.tsx
    - app/[locale]/[tenant]/_components/HeroGallery/HeroCarousel.tsx
    - app/[locale]/[tenant]/_components/HeroGallery/HeroEmpty.tsx
    - app/[locale]/[tenant]/_components/HeroGallery/GalleryLightbox.tsx
  modified: []

key-decisions:
  - "Types re-export Locale via import+export to keep it usable within the types module itself"
  - "GalleryLightbox uses Motion drag with dragConstraints/dragElastic for swipe gestures instead of touch event handlers"
  - "HeroEmpty uses CSS color-mix for gradient to derive warm tones from --primary custom property"

patterns-established:
  - "_lib/ modules: types, utils, translations, hooks as shared foundation for all tenant page components"
  - "Pure functions accept locale/config params instead of closing over component state"
  - "Gallery components receive callbacks (onPhotoClick, onSeeAll) for parent state management"

requirements-completed: [TH-01, TH-02, TH-03, TH-04]

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 2 Plan 01: Shared Foundation + Hero Gallery Summary

**Extracted _lib/ foundation (types, utils, translations, distance hook) from TenantPage.tsx monolith and built 4 HeroGallery components with Airbnb-style mosaic, scroll-snap carousel, drag-to-dismiss lightbox, and warm empty state**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T09:56:53Z
- **Completed:** 2026-03-09T10:01:15Z
- **Tasks:** 2
- **Files created:** 8

## Accomplishments
- Shared TypeScript interfaces, pure utility functions, and i18n translations extracted as clean importable modules from the 1536-line TenantPage.tsx monolith
- Desktop mosaic handles 1, 2, 3-4, and 5+ photo cases with Airbnb-style 4-column grid
- Mobile carousel with CSS scroll-snap, dot indicators, business name overlay, and photo counter
- Fullscreen lightbox with Motion drag gestures (swipe left/right for nav, swipe down to dismiss), category filter pills, thumbnail strip, and keyboard navigation

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract shared foundation modules (_lib/)** - `5c89cb9` (feat)
2. **Task 2: Build Hero Gallery components** - `7d5ca25` (feat)

## Files Created/Modified
- `app/[locale]/[tenant]/_lib/types.ts` - All shared interfaces (Business, Service, Employee, Photo, Review, etc.)
- `app/[locale]/[tenant]/_lib/utils.ts` - Pure functions (secondsToTime, isOpenNow, formatPrice, getText, etc.)
- `app/[locale]/[tenant]/_lib/translations.ts` - UI_TEXT, DAY_NAMES, LOCALE_LABELS with new keys (beTheFirst, noTeam, showFewerReviews)
- `app/[locale]/[tenant]/_lib/use-distance.ts` - useDistance hook with geolocation + localStorage/sessionStorage caching
- `app/[locale]/[tenant]/_components/HeroGallery/HeroMosaic.tsx` - Desktop 5-photo mosaic grid
- `app/[locale]/[tenant]/_components/HeroGallery/HeroCarousel.tsx` - Mobile CSS scroll-snap carousel
- `app/[locale]/[tenant]/_components/HeroGallery/HeroEmpty.tsx` - Warm gradient empty state with Avatar
- `app/[locale]/[tenant]/_components/HeroGallery/GalleryLightbox.tsx` - Fullscreen gallery with drag gestures

## Decisions Made
- Types module uses `import type { Locale }` + `export type { Locale }` (not just re-export) so Locale is available within the types file itself for TenantPageProps
- GalleryLightbox uses Motion drag API with dragConstraints/dragElastic for swipe detection, not raw touch event handlers -- cleaner and consistent with project animation approach
- HeroEmpty uses CSS `color-mix()` for deriving gradient tones from `--primary` custom property rather than hardcoded colors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Locale type not available in types.ts scope**
- **Found during:** Task 1 (types.ts extraction)
- **Issue:** `export type { Locale } from '@/lib/i18n'` only re-exports without importing into local scope; TenantPageProps interface referencing Locale caused TS2304
- **Fix:** Split into `import type { Locale }` + `export type { Locale }` to make Locale available in both local scope and as an export
- **Files modified:** app/[locale]/[tenant]/_lib/types.ts
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** 5c89cb9 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Trivial TypeScript export pattern fix. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All _lib/ modules ready for import by Plans 02-04 (business header, team, reviews, about, tab nav, sidebar, skeletons)
- HeroGallery components are self-contained and ready for orchestrator integration in Plan 04
- All components use stone-* palette with no dark: variants, consistent with Phase 1 design system

## Self-Check: PASSED

All 8 files verified present. Both task commits (5c89cb9, 7d5ca25) verified in git log. Build passes with zero errors.

---
*Phase: 02-tenant-page-presentation-layout*
*Completed: 2026-03-09*
