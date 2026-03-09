# Requirements: BLYSS Landing Page — Professional UI Rebuild

**Defined:** 2026-03-09
**Core Value:** Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation

## v1 Requirements

Requirements for the UI rebuild. Each maps to roadmap phases.

### Design System

- [x] **DS-01**: Design system includes custom Button component with primary, secondary, ghost, and outline variants using Tailwind only
- [x] **DS-02**: Design system includes Card component with consistent padding, rounded corners, and soft shadow
- [x] **DS-03**: Design system includes Modal component with scroll lock, focus trap, escape-to-close, and click-outside-to-close
- [x] **DS-04**: Design system includes Badge component for metadata display (rating, status, distance)
- [x] **DS-05**: Design system includes Avatar component with image support and gradient-initial fallback
- [x] **DS-06**: Design system includes Skeleton component with shimmer animation for loading states
- [x] **DS-07**: Design system includes StarRating component (display and interactive input modes)
- [x] **DS-08**: Design system includes SectionHeading component with consistent typography
- [x] **DS-09**: Typography system defines type scale (headings, body, caption) with consistent line-heights and tracking
- [x] **DS-10**: Color system uses CSS custom properties with per-tenant `--primary` theming throughout all components
- [x] **DS-11**: Warm visual language: rounded corners, soft shadows, generous whitespace, inviting color palette

### Tenant Page — Hero & Header

- [x] **TH-01**: Hero gallery shows Airbnb-style 5-photo mosaic layout on desktop (1 large + 4 small grid)
- [x] **TH-02**: Hero gallery shows swipeable photo carousel on mobile with dot indicators
- [x] **TH-03**: Fullscreen gallery lightbox with swipe navigation between photos and swipe-down-to-close
- [x] **TH-04**: "See all photos" button opens fullscreen gallery when business has more than 5 photos
- [x] **TH-05**: Business header displays name, avatar, and tagline with clear typographic hierarchy
- [x] **TH-06**: Metadata badges row shows open/closed status, star rating with count, and distance from user
- [x] **TH-07**: Language switcher (RU/UZ) accessible from header area

### Tenant Page — Services

- [ ] **TS-01**: Service list grouped by categories with category pill filters
- [ ] **TS-02**: Service search input filters services by name in real-time
- [ ] **TS-03**: Service cards show name, price, duration, and per-service Book button
- [ ] **TS-04**: Tapping Book button triggers booking intent (cookie) and navigates to booking page
- [ ] **TS-05**: Service cards support discount display (strikethrough original price + discounted price)

### Tenant Page — Team & Reviews

- [x] **TR-01**: Team section shows employee cards in horizontal scroll with photo/avatar, name, role
- [x] **TR-02**: Reviews section shows aggregate star rating with Airbnb-style rating distribution bars
- [x] **TR-03**: Individual review cards show reviewer initial/avatar, star rating, relative date, comment, and service context
- [x] **TR-04**: "Show all reviews" expand toggle when business has more than 3 reviews

### Tenant Page — About & Navigation

- [ ] **TA-01**: About section shows working hours (expandable weekly schedule), contact info (phone, Instagram), and location link
- [ ] **TA-02**: Desktop layout uses right sidebar for business info (hours, contact, location, Book CTA) visible while scrolling
- [ ] **TA-03**: Sticky tab navigation with IntersectionObserver-driven active state and spring-animated indicator
- [ ] **TA-04**: Mobile bottom navigation with prominent booking action and tap feedback animation
- [ ] **TA-05**: Per-section skeleton loading screens matching actual content layout with shimmer animation

### Booking Flow

- [ ] **BK-01**: Date picker as horizontal scrollable strip with today/tomorrow labels and active date accent
- [ ] **BK-02**: Time slot grid grouped by time of day (morning/afternoon/evening) with available/unavailable states
- [ ] **BK-03**: Employee/specialist picker per slot showing name, price, and discount info
- [ ] **BK-04**: Multi-service booking cart with add/remove and running total
- [ ] **BK-05**: Booking summary card showing all selections (services, date, time, specialist, total price)
- [ ] **BK-06**: Auth gate with redesigned OTP login modal — warm, trustworthy feel
- [ ] **BK-07**: Booking confirmation with success animation (checkmark + celebration)
- [ ] **BK-08**: Clear error states with warning cards for slot-taken, booking-limit, past-date scenarios
- [ ] **BK-09**: Optional notes/comments field for special requests

### Landing Page

- [ ] **LP-01**: Hero section with bold typography, warm imagery, and clear value proposition + search/CTA
- [ ] **LP-02**: Nearest businesses section with polished venue cards (photo, name, rating, type, distance)
- [ ] **LP-03**: Browse by city section with city cards or tabs for market-level navigation
- [ ] **LP-04**: For-business CTA section with warm, professional design to attract business owners
- [ ] **LP-05**: Reusable venue/business card component used consistently across landing page

### Auxiliary Pages

- [ ] **AX-01**: Bookings list page with booking cards showing date, time, service, specialist, status
- [ ] **AX-02**: Cancel booking with confirmation modal
- [ ] **AX-03**: Login prompt for unauthenticated users on bookings page — warm, inviting (not error-like)
- [ ] **AX-04**: Rating page with animated star input, comment textarea, and success confirmation
- [ ] **AX-05**: Location page with polished map container styling

### Interactions & Polish

- [ ] **IX-01**: Section scroll-reveal animations (fade-in + slide-up) on all major sections using Motion
- [ ] **IX-02**: Micro-interactions: button press scale, card hover lift, tab spring transitions
- [ ] **IX-03**: Success animations on booking confirmation and review submission
- [x] **IX-04**: Mobile-first responsive design — every component designed for phone first, scales up to desktop
- [ ] **IX-05**: Thoughtful empty states with icon + descriptive text when no reviews, photos, or specialists

### Architecture

- [ ] **AR-01**: TenantPage.tsx decomposed from ~1800-line monolith into ~20 focused components
- [x] **AR-02**: Components organized in co-located `_components/` directories with `_lib/` for utilities
- [x] **AR-03**: Single responsive markup per component (no duplicate mobile/desktop rendering)
- [x] **AR-04**: All user-facing strings use the translation system (centralized or co-located)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish & Performance

- **V2-01**: Advanced page-to-page transitions between tenant page and booking page
- **V2-02**: Performance optimization pass based on Lighthouse metrics after rebuild
- **V2-03**: Virtual scrolling for businesses with 50+ services
- **V2-04**: Custom empty state illustrations (beyond icon + text)
- **V2-05**: Dark mode support

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Backend API changes | UI rebuild only — all endpoints unchanged |
| New business logic | Visual/UX overhaul, not feature additions |
| Third-party component libraries | Tailwind-only constraint per project decision |
| Chat/messaging | Requires WebSocket backend; phone + Telegram sufficient |
| Online payments | Backend doesn't support; cash/card at salon is the norm |
| Social login (Google, Apple) | Backend only supports OTP phone auth |
| Push notifications | Service worker + backend required; Telegram/SMS handles this |
| Before/after photo slider | Requires paired photo data model not in backend |
| Real-time availability on tenant page | Adds complexity; availability shown on booking page per Booksy/Fresha pattern |
| Heavy animation choreography | Hurts performance on low-end Android; keep animations purposeful |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DS-01 | Phase 1 | Complete |
| DS-02 | Phase 1 | Complete |
| DS-03 | Phase 1 | Complete |
| DS-04 | Phase 1 | Complete |
| DS-05 | Phase 1 | Complete |
| DS-06 | Phase 1 | Complete |
| DS-07 | Phase 1 | Complete |
| DS-08 | Phase 1 | Complete |
| DS-09 | Phase 1 | Complete |
| DS-10 | Phase 1 | Complete |
| DS-11 | Phase 1 | Complete |
| TH-01 | Phase 2 | Complete |
| TH-02 | Phase 2 | Complete |
| TH-03 | Phase 2 | Complete |
| TH-04 | Phase 2 | Complete |
| TH-05 | Phase 2 | Complete |
| TH-06 | Phase 2 | Complete |
| TH-07 | Phase 2 | Complete |
| TS-01 | Phase 3 | Pending |
| TS-02 | Phase 3 | Pending |
| TS-03 | Phase 3 | Pending |
| TS-04 | Phase 3 | Pending |
| TS-05 | Phase 3 | Pending |
| TR-01 | Phase 2 | Complete |
| TR-02 | Phase 2 | Complete |
| TR-03 | Phase 2 | Complete |
| TR-04 | Phase 2 | Complete |
| TA-01 | Phase 2 | Pending |
| TA-02 | Phase 2 | Pending |
| TA-03 | Phase 2 | Pending |
| TA-04 | Phase 2 | Pending |
| TA-05 | Phase 2 | Pending |
| BK-01 | Phase 3 | Pending |
| BK-02 | Phase 3 | Pending |
| BK-03 | Phase 3 | Pending |
| BK-04 | Phase 3 | Pending |
| BK-05 | Phase 3 | Pending |
| BK-06 | Phase 3 | Pending |
| BK-07 | Phase 3 | Pending |
| BK-08 | Phase 3 | Pending |
| BK-09 | Phase 3 | Pending |
| LP-01 | Phase 4 | Pending |
| LP-02 | Phase 4 | Pending |
| LP-03 | Phase 4 | Pending |
| LP-04 | Phase 4 | Pending |
| LP-05 | Phase 4 | Pending |
| AX-01 | Phase 4 | Pending |
| AX-02 | Phase 4 | Pending |
| AX-03 | Phase 4 | Pending |
| AX-04 | Phase 4 | Pending |
| AX-05 | Phase 4 | Pending |
| IX-01 | Phase 3 | Pending |
| IX-02 | Phase 3 | Pending |
| IX-03 | Phase 3 | Pending |
| IX-04 | Phase 1 | Complete |
| IX-05 | Phase 3 | Pending |
| AR-01 | Phase 2 | Pending |
| AR-02 | Phase 1 | Complete |
| AR-03 | Phase 1 | Complete |
| AR-04 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 60 total
- Mapped to phases: 60
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after Plan 02-02 completion*
