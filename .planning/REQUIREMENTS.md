# Requirements: BLYSS Tenant Page Redesign

**Defined:** 2026-03-09
**Core Value:** Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation

## v1.0 Requirements (Complete)

Shipped in v1.0 milestone. Design system foundation and old tenant page presentation.

### Design System (Complete)

- [x] **DS-01** through **DS-11**: Full design system shipped (Button, Card, Modal, Badge, Avatar, Skeleton, StarRating, SectionHeading, typography, color system, warm visual language)

### Old Tenant Page (Replaced by v2.0)

- [x] **TH-01** through **TH-07**: Hero gallery, business header, metadata badges, language switcher — being replaced
- [x] **TR-01** through **TR-04**: Team section, reviews section, rating distribution — being replaced
- [x] **TA-01** through **TA-05**: About section, desktop sidebar, tab navigation, bottom nav, skeletons — being replaced
- [x] **AR-01** through **AR-04**: Architecture (decomposition, co-location, single responsive markup, translations)
- [x] **IX-04**: Mobile-first responsive design

## v2.0 Requirements

Requirements for the "Clean Profile" tenant page redesign. Each maps to roadmap phases.

### Profile Header

- [x] **PH-01**: Visitor sees centered business avatar, name, and tagline above the fold
- [x] **PH-02**: Visitor sees open/closed status, star rating, and distance in a single inline status row
- [x] **PH-03**: Visitor can tap a full-width Book button above the fold without scrolling
- [x] **PH-04**: Visitor can tap Call, Map, or Share quick-action buttons below the Book button
- [x] **PH-05**: Language toggle (UZ/RU) is accessible at the top of the page

### Photo Gallery

- [x] **PG-01**: Visitor sees a horizontal strip of photo thumbnails below the profile header
- [x] **PG-02**: Visitor can tap any thumbnail to open a fullscreen lightbox gallery

### Services

- [x] **SV-01**: Visitor sees a flat list of services with name, duration, and price per row
- [x] **SV-02**: Visitor can filter services by category pills when multiple categories exist
- [x] **SV-03**: Visitor can tap a service row to expand it and reveal description + Book button
- [x] **SV-04**: Tapping Book sets booking intent cookie and navigates to booking flow

### Team

- [x] **TM-01**: Visitor sees team members as a compact horizontal avatar strip (when >1 employee)

### Reviews

- [ ] **RV-01**: Visitor sees 2-3 review cards with masked name, date, rating, and comment
- [ ] **RV-02**: Visitor can expand to see all reviews

### About

- [ ] **AB-01**: Visitor sees today's working hours, expandable to full week schedule
- [ ] **AB-02**: Visitor can tap address to open Google Maps
- [ ] **AB-03**: Visitor can tap to call or view Instagram

### Interaction

- [ ] **IX-01**: A floating Book pill appears when the main Book button scrolls out of view
- [ ] **IX-02**: Sections animate in on scroll with subtle fade-in
- [ ] **IX-03**: Desktop renders the mobile layout centered in a max-w-480px container

## Future Requirements

Deferred to separate milestones. Tracked but not in current roadmap.

### Booking Flow Redesign

- **BK-01**: Redesigned date/time picker with horizontal scroll
- **BK-02**: Redesigned specialist picker
- **BK-03**: Redesigned OTP login modal
- **BK-04**: Booking success animation

### Landing Page

- **LP-01**: Landing page hero with search
- **LP-02**: Nearest businesses section
- **LP-03**: Browse by city

### Auxiliary Pages

- **AX-01**: Bookings list page redesign
- **AX-02**: Rating page redesign
- **AX-03**: Location page redesign

## Out of Scope

| Feature | Reason |
|---------|--------|
| Hero carousel/mosaic | Replaced by photo strip in new design |
| Tab navigation | Replaced by vertical scroll with section headers |
| Desktop sidebar layout | Replaced by centered single-column |
| Map embed | Replaced by tap-to-open address row |
| Rating distribution bars | Inline rating replaces heavy breakdown |
| Bottom nav with business name | Replaced by floating Book pill |
| Dark mode | Light mode only |
| Backend API changes | UI rebuild only |
| Booking flow redesign | Separate milestone |
| Landing page | Separate milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PH-01 | Phase 5 | Complete |
| PH-02 | Phase 5 | Complete |
| PH-03 | Phase 5 | Complete |
| PH-04 | Phase 5 | Complete |
| PH-05 | Phase 5 | Complete |
| PG-01 | Phase 5 | Complete |
| PG-02 | Phase 5 | Complete |
| SV-01 | Phase 6 | Complete |
| SV-02 | Phase 6 | Complete |
| SV-03 | Phase 6 | Complete |
| SV-04 | Phase 6 | Complete |
| TM-01 | Phase 6 | Complete |
| RV-01 | Phase 7 | Pending |
| RV-02 | Phase 7 | Pending |
| AB-01 | Phase 7 | Pending |
| AB-02 | Phase 7 | Pending |
| AB-03 | Phase 7 | Pending |
| IX-01 | Phase 7 | Pending |
| IX-02 | Phase 7 | Pending |
| IX-03 | Phase 7 | Pending |

**Coverage:**
- v2.0 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after v2.0 roadmap creation*
