---
phase: 05-profile-header-photo-strip
plan: 02
subsystem: ui
tags: [react, nextjs, tailwind, photo-strip, tenant-page, component-cleanup, skeleton]

# Dependency graph
requires:
  - phase: 05-profile-header-photo-strip
    provides: ProfileHeader component from Plan 01
  - phase: 01-design-system
    provides: Skeleton UI component for loading state
provides:
  - PhotoStrip horizontal thumbnail component with lightbox trigger
  - Rewritten TenantPage orchestrator using ProfileHeader + PhotoStrip
  - Updated loading skeleton matching new layout
  - Cleaned component tree (8 old components + 4 old skeletons deleted)
affects: [06-services-reviews, 07-about-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single-column layout replacing desktop sidebar grid"
    - "PhotoStrip as horizontal scroll row of 56x56 thumbnails triggering GalleryLightbox"
    - "forwardRef components used without ref (graceful null ref handling)"

key-files:
  created:
    - app/[locale]/[tenant]/_components/PhotoStrip.tsx
  modified:
    - app/[locale]/[tenant]/TenantPage.tsx
    - app/[locale]/[tenant]/loading.tsx
  deleted:
    - app/[locale]/[tenant]/_components/HeroGallery/HeroMosaic.tsx
    - app/[locale]/[tenant]/_components/HeroGallery/HeroCarousel.tsx
    - app/[locale]/[tenant]/_components/HeroGallery/HeroEmpty.tsx
    - app/[locale]/[tenant]/_components/BusinessHeader.tsx
    - app/[locale]/[tenant]/_components/MetadataBadges.tsx
    - app/[locale]/[tenant]/_components/TabNavigation.tsx
    - app/[locale]/[tenant]/_components/BottomNav.tsx
    - app/[locale]/[tenant]/_components/DesktopSidebar.tsx
    - app/[locale]/[tenant]/_components/skeletons/HeroSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/HeaderSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/TabsSkeleton.tsx
    - app/[locale]/[tenant]/_components/skeletons/SidebarSkeleton.tsx

key-decisions:
  - "Removed search bar from services section entirely (Phase 6 will redesign services)"
  - "Removed tab navigation and section refs (Phase 7 may re-add scroll tracking)"
  - "TeamSection, ReviewsSection, AboutSection called without ref (forwardRef handles null gracefully)"

patterns-established:
  - "TenantPage as slim orchestrator: ProfileHeader > PhotoStrip > inline services > TeamSection > ReviewsSection > AboutSection"
  - "Loading skeleton mirrors exact component composition of the page"

requirements-completed: [PG-01, PG-02]

# Metrics
duration: 2min
completed: 2026-03-09
---

# Phase 5 Plan 2: PhotoStrip + TenantPage Rewrite Summary

**Horizontal photo strip with lightbox, rewritten TenantPage orchestrator replacing hero/tabs/sidebar with clean single-column profile layout, 12 old files deleted**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T12:42:15Z
- **Completed:** 2026-03-09T12:45:08Z
- **Tasks:** 2
- **Files modified:** 15 (1 created, 2 modified, 12 deleted)

## Accomplishments
- Created PhotoStrip component rendering horizontal scrollable row of 56x56 photo thumbnails with lightbox integration
- Rewrote TenantPage orchestrator to use ProfileHeader + PhotoStrip composition, removing hero gallery, business header, tab navigation, desktop sidebar, and bottom nav
- Deleted 8 old components (HeroMosaic, HeroCarousel, HeroEmpty, BusinessHeader, MetadataBadges, TabNavigation, BottomNav, DesktopSidebar) and 4 old skeletons (HeroSkeleton, HeaderSkeleton, TabsSkeleton, SidebarSkeleton)
- Rewrote loading.tsx skeleton to match new profile header + photo strip + services layout
- Net reduction of ~850 lines of code

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PhotoStrip and rewrite TenantPage orchestrator** - `172441d` (feat)
2. **Task 2: Delete old components and update loading skeleton** - `20f385e` (chore)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `app/[locale]/[tenant]/_components/PhotoStrip.tsx` - Horizontal scrollable photo thumbnail strip with lightbox trigger
- `app/[locale]/[tenant]/TenantPage.tsx` - Rewritten orchestrator using ProfileHeader + PhotoStrip, single-column layout
- `app/[locale]/[tenant]/loading.tsx` - Updated skeleton matching new profile header + photo strip + services layout
- 8 old component files deleted (no longer imported)
- 4 old skeleton files deleted (no longer match layout)

## Decisions Made
- Removed search bar from services section entirely rather than keeping it -- Phase 6 will redesign services with new filtering UX
- Removed tab navigation and all section refs (servicesRef, teamRef, reviewsRef, aboutRef) -- vertical scroll with section headers replaces tabs; Phase 7 may re-add scroll tracking
- TeamSection, ReviewsSection, and AboutSection (all forwardRef components) called without ref props -- forwardRef handles null refs gracefully

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 5 is fully complete -- ProfileHeader + PhotoStrip wired into TenantPage
- Old v1.0 hero/header/tabs/sidebar/bottomnav components fully removed
- GalleryLightbox preserved for photo strip lightbox functionality
- TeamSection, ReviewsSection, AboutSection preserved for Phase 6/7 rebuilds
- Services section rendered inline in TenantPage -- Phase 6 will extract and redesign
- Build passes cleanly; lint has only pre-existing warnings/errors in unrelated files

## Self-Check: PASSED

All files exist, all commits verified, all deletions confirmed, GalleryLightbox preserved, build passes.

---
*Phase: 05-profile-header-photo-strip*
*Completed: 2026-03-09*
