# Roadmap: BLYSS Landing Page — Tenant Page Redesign

## Milestones

- [x] **v1.0 Professional UI Rebuild** - Phases 1-4 (Phase 1-2 shipped 2026-03-09, Phases 3-4 deferred)
- [ ] **v2.0 Tenant Page Redesign** - Phases 5-7 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>v1.0 Professional UI Rebuild (Phases 1-4)</summary>

- [x] **Phase 1: Design System Foundation** - Custom Tailwind component primitives, typography/color system, and architectural scaffolding (completed 2026-03-09)
- [x] **Phase 2: Tenant Page -- Presentation & Layout** - Hero gallery, business header, team, reviews, about/sidebar, and page shell decomposition (completed 2026-03-09)
- [ ] **Phase 3: Tenant Page -- Services, Booking & Interactions** - Deferred (booking flow redesign moved to future milestone)
- [ ] **Phase 4: Landing Page & Auxiliary Pages** - Deferred (moved to future milestone)

</details>

### v2.0 Tenant Page Redesign

- [x] **Phase 5: Profile Header & Photo Strip** - Above-fold identity: avatar, status, Book button, quick actions, and photo thumbnails (completed 2026-03-09)
- [ ] **Phase 6: Services & Team** - Decision content: expandable service rows with category filter, tap-to-book, and team avatar strip
- [ ] **Phase 7: Reviews, About & Interactions** - Trust layer and polish: review cards, collapsible info rows, floating Book pill, scroll animations, desktop layout

## Phase Details

<details>
<summary>v1.0 Phase Details (Phases 1-4)</summary>

### Phase 1: Design System Foundation
**Goal**: A complete library of reusable, Tailwind-only UI primitives and a consistent typography/color system that every subsequent component builds on
**Depends on**: Nothing (first phase)
**Requirements**: DS-01, DS-02, DS-03, DS-04, DS-05, DS-06, DS-07, DS-08, DS-09, DS-10, DS-11, AR-02, AR-03, AR-04, IX-04
**Success Criteria** (what must be TRUE):
  1. Every design system component (Button, Card, Modal, Badge, Avatar, Skeleton, StarRating, SectionHeading) renders correctly in isolation with all documented variants
  2. Modal component locks scroll, traps focus, closes on Escape and click-outside on both desktop and mobile
  3. All components use CSS custom property `--primary` for brand color -- no hardcoded hex values for brand elements
  4. Typography scale (headings, body, caption) and spacing are visually consistent across all primitives
  5. Component files are organized in `app/components/ui/` with co-located utilities in `_lib/` directories, and every component uses single responsive markup (no duplicate mobile/desktop rendering)
**Plans**: 3 plans (complete)

Plans:
- [x] 01-01-PLAN.md — Warm color system, Nunito Sans font, animation presets, _lib/ utility
- [x] 01-02-PLAN.md — New components: Card, Badge, Avatar, Skeleton, SectionHeading, Input
- [x] 01-03-PLAN.md — Refactored components: Button, PillButton, StarRating + new Modal

### Phase 2: Tenant Page -- Presentation & Layout
**Goal**: The tenant page displays business identity, photos, team, reviews, and about information in a warm, trust-building layout with clear visual hierarchy
**Depends on**: Phase 1
**Requirements**: TH-01, TH-02, TH-03, TH-04, TH-05, TH-06, TH-07, TR-01, TR-02, TR-03, TR-04, TA-01, TA-02, TA-03, TA-04, TA-05, AR-01
**Success Criteria** (what must be TRUE):
  1. Visitor sees a photo mosaic (desktop) or swipeable carousel (mobile) at the top of the tenant page, can open a fullscreen gallery lightbox, and can browse all photos
  2. Business name, avatar, tagline, open/closed status, star rating, and distance are immediately visible with clear typographic hierarchy
  3. Team section shows employees in a horizontally scrollable row with photos (or gradient-initial fallback), names, and roles
  4. Reviews section shows aggregate rating with distribution bars and individual review cards; "show all" toggle appears when more than 3 reviews exist
  5. About area displays working hours (expandable schedule), contact info (phone, Instagram), and location link -- on desktop this appears as a sticky right sidebar
**Plans**: 4 plans (complete)

Plans:
- [x] 02-01-PLAN.md — Shared foundation (_lib/ types, utils, translations, hooks) + Hero gallery components
- [x] 02-02-PLAN.md — Business header, metadata badges, language switcher, team section, reviews section
- [x] 02-03-PLAN.md — Tab navigation, about/sidebar, working hours, contact info, bottom navigation
- [x] 02-04-PLAN.md — Per-section skeleton loading screens + slim orchestrator rewrite of TenantPage.tsx

### Phase 3: Tenant Page -- Services, Booking & Interactions
**Goal**: Deferred to future milestone (booking flow redesign)
**Status**: Deferred

### Phase 4: Landing Page & Auxiliary Pages
**Goal**: Deferred to future milestone
**Status**: Deferred

</details>

### Phase 5: Profile Header & Photo Strip
**Goal**: Visitors see a clean, avatar-centered profile above the fold with instant access to booking and business essentials
**Depends on**: Phase 1 (design system primitives), replaces Phase 2 components
**Requirements**: PH-01, PH-02, PH-03, PH-04, PH-05, PG-01, PG-02
**Success Criteria** (what must be TRUE):
  1. Visitor sees a centered business avatar (88px, gradient+initial fallback), business name, and tagline above the fold without scrolling
  2. Visitor sees open/closed status, star rating with count, and distance in a single inline row below the business name
  3. Visitor can tap a full-width Book button above the fold; the button uses the tenant's primary color and navigates to the booking flow
  4. Visitor can tap Call (opens phone dialer), Map (opens Google Maps), or Share (triggers native share or copies link) quick-action buttons below the Book button
  5. Visitor sees a horizontal strip of photo thumbnails below the header and can tap any thumbnail to open a fullscreen lightbox gallery; language toggle (UZ/RU) is accessible at the top of the page
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — ProfileHeader component (avatar, name, status, Book CTA, quick actions) + translation keys
- [ ] 05-02-PLAN.md — PhotoStrip component + TenantPage orchestrator rewrite + old component cleanup

### Phase 6: Services & Team
**Goal**: Visitors can browse services, filter by category, expand for details, and book -- plus see the team at a glance
**Depends on**: Phase 5
**Requirements**: SV-01, SV-02, SV-03, SV-04, TM-01
**Success Criteria** (what must be TRUE):
  1. Visitor sees a flat list of services showing name, duration, and price per row with subtle dividers between rows
  2. When multiple service categories exist, visitor can filter by tapping category pills (horizontal scroll); an "All" pill is always present
  3. Visitor can tap any service row to expand it, revealing the service description and a Book button; tapping Book sets the booking intent cookie and navigates to the existing booking flow
  4. When the business has more than one employee, visitor sees a compact horizontal avatar strip (56px circles with name and role) below the services section
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Reviews, About & Interactions
**Goal**: Visitors see social proof, find practical business info, and experience a polished page with floating CTA and scroll animations on both mobile and desktop
**Depends on**: Phase 6
**Requirements**: RV-01, RV-02, AB-01, AB-02, AB-03, IX-01, IX-02, IX-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees 2-3 review cards showing masked customer name, relative date, star rating, and comment (2-line clamp); a "See all N reviews" link expands to show all reviews
  2. Visitor sees today's working hours with a chevron to expand the full week schedule (current day highlighted); can tap the address to open Google Maps; can tap to call or view Instagram
  3. A floating Book pill appears fixed at bottom-center when the main Book button scrolls out of view, and disappears when it scrolls back into view
  4. Sections animate in on scroll with subtle fade-in effects; on desktop, the entire page renders centered in a max-w-480px container on a stone-50 background
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Design System Foundation | v1.0 | 3/3 | Complete | 2026-03-09 |
| 2. Tenant Page -- Presentation & Layout | v1.0 | 4/4 | Complete | 2026-03-09 |
| 3. Services, Booking & Interactions | v1.0 | - | Deferred | - |
| 4. Landing Page & Auxiliary Pages | v1.0 | - | Deferred | - |
| 5. Profile Header & Photo Strip | 2/2 | Complete   | 2026-03-09 | - |
| 6. Services & Team | v2.0 | 0/0 | Not started | - |
| 7. Reviews, About & Interactions | v2.0 | 0/0 | Not started | - |
