# Roadmap: BLYSS Landing Page — Professional UI Rebuild

## Overview

This roadmap transforms the BLYSS landing page and tenant pages from their current state into a warm, Airbnb/Booksy-quality booking experience. The work follows the natural dependency graph: design system primitives first (everything depends on them), then presentational tenant page sections (validate the design language), then interactive sections and the booking flow (the revenue-critical path), and finally the landing page and auxiliary pages (which reuse everything built before). Every phase delivers a coherent, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design System Foundation** - Custom Tailwind component primitives, typography/color system, and architectural scaffolding
- [ ] **Phase 2: Tenant Page -- Presentation & Layout** - Hero gallery, business header, team, reviews, about/sidebar, and page shell decomposition
- [ ] **Phase 3: Tenant Page -- Services, Booking & Interactions** - Service listing, full booking flow, sticky navigation, and animations
- [ ] **Phase 4: Landing Page & Auxiliary Pages** - Landing page rebuild, bookings list, rating page, and location page

## Phase Details

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
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Warm color system, Nunito Sans font, animation presets, _lib/ utility
- [ ] 01-02-PLAN.md — New components: Card, Badge, Avatar, Skeleton, SectionHeading, Input
- [ ] 01-03-PLAN.md — Refactored components: Button, PillButton, StarRating + new Modal

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
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — Shared foundation (_lib/ types, utils, translations, hooks) + Hero gallery components
- [ ] 02-02-PLAN.md — Business header, metadata badges, language switcher, team section, reviews section
- [ ] 02-03-PLAN.md — Tab navigation, about/sidebar, working hours, contact info, bottom navigation
- [ ] 02-04-PLAN.md — Per-section skeleton loading screens + slim orchestrator rewrite of TenantPage.tsx

### Phase 3: Tenant Page -- Services, Booking & Interactions
**Goal**: Users can browse services, complete the full booking flow (select service, pick date/time/specialist, authenticate, confirm), and experience smooth animations throughout
**Depends on**: Phase 2
**Requirements**: TS-01, TS-02, TS-03, TS-04, TS-05, BK-01, BK-02, BK-03, BK-04, BK-05, BK-06, BK-07, BK-08, BK-09, IX-01, IX-02, IX-03, IX-05
**Success Criteria** (what must be TRUE):
  1. Visitor can filter services by category pills and search by name; each service card shows name, price, duration, discount (if any), and a Book button
  2. Booking flow works end-to-end: tapping Book sets cookie intent, date picker shows horizontal scrollable strip, time slots grouped by time-of-day, specialist picker shows per-slot with price/discount, multi-service cart works with running total
  3. Unauthenticated user tapping Book is presented with a warm OTP login modal; after authentication the booking completes with a success animation
  4. Error states (slot taken, booking limit reached, past date) display clear warning cards; optional notes field is available for special requests
  5. Sections animate in on scroll (fade-in + slide-up), buttons have press-scale feedback, cards have hover-lift, and empty states show icon + descriptive text
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Landing Page & Auxiliary Pages
**Goal**: The landing page attracts and routes visitors to tenant pages, and auxiliary pages (bookings list, rating, location) deliver a polished experience consistent with the rebuilt tenant page
**Depends on**: Phase 3
**Requirements**: LP-01, LP-02, LP-03, LP-04, LP-05, AX-01, AX-02, AX-03, AX-04, AX-05
**Success Criteria** (what must be TRUE):
  1. Landing page hero shows bold typography with clear value proposition and a search/CTA; nearest businesses section displays polished venue cards with photo, name, rating, type, and distance
  2. Landing page includes browse-by-city navigation and a for-business CTA section; the venue card component is reused consistently across all listing contexts
  3. Bookings list page shows booking cards with date, time, service, specialist, and status; cancel booking has a confirmation modal; unauthenticated users see a warm login prompt
  4. Rating page has animated star input, comment textarea, and success confirmation animation
  5. Location page displays a polished map container consistent with the overall design system
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System Foundation | 3/3 | Complete | 2026-03-09 |
| 2. Tenant Page -- Presentation & Layout | 2/4 | Executing | - |
| 3. Tenant Page -- Services, Booking & Interactions | 0/0 | Not started | - |
| 4. Landing Page & Auxiliary Pages | 0/0 | Not started | - |
