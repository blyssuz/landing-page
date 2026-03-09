---
phase: 02-tenant-page-presentation-layout
plan: 03
subsystem: ui
tags: [react, typescript, motion, intersection-observer, navigation, sidebar, tailwindcss]

# Dependency graph
requires:
  - phase: 01-design-system-foundation
    provides: Button, Card, cn utility, springs animation presets
  - phase: 02-tenant-page-presentation-layout (plan 01)
    provides: _lib/types.ts, _lib/utils.ts, _lib/translations.ts
  - phase: 02-tenant-page-presentation-layout (plan 02)
    provides: Section components with forwardRef pattern
provides:
  - TabNavigation with spring-animated active indicator via Motion layoutId
  - useActiveSection hook wrapping IntersectionObserver for section tracking
  - WorkingHours component with inline (desktop) and collapsible (mobile) variants
  - DesktopSidebar with sticky Book CTA, map, hours, and contact
  - AboutSection with mobile map, call, collapsible hours, and Instagram
  - ContactInfo shared between sidebar and mobile variants
  - BottomNav with elevated center Book CTA and safe area padding
affects: [02-04 (skeletons/loading), 03 (services integration), page composition]

# Tech tracking
tech-stack:
  added: []
  patterns: [useActiveSection IO hook, WorkingHours dual-variant pattern, ContactInfo sidebar/mobile variant pattern]

key-files:
  created:
    - app/[locale]/[tenant]/_lib/use-active-section.ts
    - app/[locale]/[tenant]/_components/TabNavigation.tsx
    - app/[locale]/[tenant]/_components/WorkingHours.tsx
    - app/[locale]/[tenant]/_components/ContactInfo.tsx
    - app/[locale]/[tenant]/_components/DesktopSidebar.tsx
    - app/[locale]/[tenant]/_components/AboutSection.tsx
    - app/[locale]/[tenant]/_components/BottomNav.tsx
  modified: []

key-decisions:
  - "WorkingHours uses DaySchedule internal component shared between inline and collapsible variants to avoid duplication"
  - "ContactInfo split into sidebar (compact inline) and mobile (full-width button) variants via prop"
  - "BottomNav created as new tenant-specific file, leaving old app/components/layout/BottomNav.tsx intact for other pages"

patterns-established:
  - "Dual-variant component pattern: same component renders differently based on variant prop (WorkingHours, ContactInfo)"
  - "useActiveSection hook decouples IO logic from TabNavigation for reuse and testability"
  - "AboutSection uses forwardRef for IO-based tab tracking, consistent with Plan 02 section pattern"

requirements-completed: [TA-01, TA-02, TA-03, TA-04]

# Metrics
duration: 3min
completed: 2026-03-09
---

# Phase 2 Plan 03: Tab Navigation, Sidebar, About & Bottom Nav Summary

**Sticky tab navigation with IO-driven active state and spring-animated indicator, desktop sidebar with map/hours/contact, mobile about section with collapsible hours, and 3-item bottom nav with elevated Book CTA and safe area padding**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-09T10:04:20Z
- **Completed:** 2026-03-09T10:07:24Z
- **Tasks:** 2
- **Files created:** 7

## Accomplishments
- TabNavigation renders sticky tab bar with Motion layoutId spring-animated indicator using springs.snappy, driven by useActiveSection hook wrapping IntersectionObserver with rootMargin -80px 0px -60% 0px
- WorkingHours supports both inline (desktop sidebar, always visible) and collapsible (mobile, AnimatePresence height animation) variants with today highlighted in primary color
- DesktopSidebar (hidden lg:block) renders sticky sidebar with Book CTA (context-aware: "Book Now" vs "My Bookings"), Google Maps iframe, inline working hours, and contact info using Phase 1 Card primitive
- AboutSection (lg:hidden) renders mobile about with map, full-width call button, collapsible hours, and Instagram link with gradient icon, all with entrance animation
- BottomNav redesigned with 3-item layout: Bookings + elevated center Book CTA (-mt-3, active:scale-95) + Call, with safe area padding via pb-[env(safe-area-inset-bottom)]

## Task Commits

Each task was committed atomically:

1. **Task 1: Build TabNavigation, useActiveSection hook, and WorkingHours** - `210262d` (feat)
2. **Task 2: Build DesktopSidebar, AboutSection, ContactInfo, and BottomNav** - `5269ded` (feat)

## Files Created/Modified
- `app/[locale]/[tenant]/_lib/use-active-section.ts` - Custom hook wrapping IntersectionObserver for section tracking
- `app/[locale]/[tenant]/_components/TabNavigation.tsx` - Sticky tab bar with Motion layoutId spring-animated active indicator
- `app/[locale]/[tenant]/_components/WorkingHours.tsx` - Dual-variant working hours: inline (sidebar) and collapsible (mobile)
- `app/[locale]/[tenant]/_components/ContactInfo.tsx` - Phone + Instagram shared between sidebar and mobile variants
- `app/[locale]/[tenant]/_components/DesktopSidebar.tsx` - Desktop sticky sidebar with Book CTA, map, hours, contact
- `app/[locale]/[tenant]/_components/AboutSection.tsx` - Mobile about section with map, call, collapsible hours, Instagram
- `app/[locale]/[tenant]/_components/BottomNav.tsx` - 3-item bottom nav with elevated center Book CTA

## Decisions Made
- WorkingHours internally extracts a DaySchedule sub-component to share day row rendering between inline and collapsible variants, avoiding code duplication
- ContactInfo uses variant prop ("sidebar" vs "mobile") rather than two separate components, keeping the shared phone/Instagram logic DRY
- New BottomNav created at tenant-specific path, leaving the existing app/components/layout/BottomNav.tsx intact for other pages as specified in plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 7 components + 1 hook ready for composition into the main TenantPage orchestrator (Plan 04)
- TabNavigation + useActiveSection ready to replace monolith IO logic
- DesktopSidebar and AboutSection handle responsive visibility (hidden lg:block / lg:hidden)
- BottomNav ready to replace the existing bottom navigation on tenant pages
- All components use stone-* palette exclusively, no dark: variants

## Self-Check: PASSED

All 7 files verified present. Both task commits (210262d, 5269ded) verified in git log. Build passes with zero errors.

---
*Phase: 02-tenant-page-presentation-layout*
*Completed: 2026-03-09*
