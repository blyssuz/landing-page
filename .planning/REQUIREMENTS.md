# Requirements: BLYSS Tenant Page & AI Chat

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

## v2.0 Requirements (Phases 5-7)

### Profile Header (Complete)

- [x] **PH-01**: Visitor sees centered business avatar, name, and tagline above the fold
- [x] **PH-02**: Visitor sees open/closed status, star rating, and distance in a single inline status row
- [x] **PH-03**: Visitor can tap a full-width Book button above the fold without scrolling
- [x] **PH-04**: Visitor can tap Call, Map, or Share quick-action buttons below the Book button
- [x] **PH-05**: Language toggle (UZ/RU) is accessible at the top of the page

### Photo Gallery (Complete)

- [x] **PG-01**: Visitor sees a horizontal strip of photo thumbnails below the profile header
- [x] **PG-02**: Visitor can tap any thumbnail to open a fullscreen lightbox gallery

### Services (Complete)

- [x] **SV-01**: Visitor sees a flat list of services with name, duration, and price per row
- [x] **SV-02**: Visitor can filter services by category pills when multiple categories exist
- [x] **SV-03**: Visitor can tap a service row to expand it and reveal description + Book button
- [x] **SV-04**: Tapping Book sets booking intent cookie and navigates to booking flow

### Team (Complete)

- [x] **TM-01**: Visitor sees team members as a compact horizontal avatar strip (when >1 employee)

### Reviews (Phase 7 — Pending)

- [ ] **RV-01**: Visitor sees 2-3 review cards with masked name, date, rating, and comment
- [ ] **RV-02**: Visitor can expand to see all reviews

### About (Phase 7 — Pending)

- [ ] **AB-01**: Visitor sees today's working hours, expandable to full week schedule
- [ ] **AB-02**: Visitor can tap address to open Google Maps
- [ ] **AB-03**: Visitor can tap to call or view Instagram

### Interaction (Phase 7 — Pending)

- [ ] **IX-01**: A floating Book pill appears when the main Book button scrolls out of view
- [ ] **IX-02**: Sections animate in on scroll with subtle fade-in
- [ ] **IX-03**: Desktop renders the mobile layout centered in a max-w-480px container

## v3.0 Requirements

Requirements for AI chat experience overhaul. Each maps to roadmap phases.

### System Prompt Q&A

- [x] **PROMPT-01**: AI answers working hours questions using actual business `working_hours` data
- [x] **PROMPT-02**: AI answers services and pricing questions by calling `get_services` and formatting results naturally
- [x] **PROMPT-03**: AI answers location/address questions using business address data injected into prompt
- [x] **PROMPT-04**: AI answers payment method questions (from business data or sensible default)
- [x] **PROMPT-05**: AI answers walk-in policy questions naturally
- [x] **PROMPT-06**: AI answers cancellation/rebooking questions with actionable guidance
- [x] **PROMPT-07**: AI handles greetings and small talk naturally (salom, rahmat, xayr) without triggering booking flow
- [x] **PROMPT-08**: AI gracefully handles unknown questions by redirecting to phone/contact
- [x] **PROMPT-09**: AI appends a booking nudge after every non-booking Q&A answer

### Button Patterns

- [x] **BTN-01**: AI shows action-labeled confirmation buttons before creating a booking (summary + "Ha, yozib qo'ying" / "Vaqtni o'zgartiraman")
- [x] **BTN-02**: All confirmation buttons use action-specific labels, never abstract Yes/No
- [x] **BTN-03**: Buttons only appear in 3 scenarios: quick-start greeting, structured choice (service/date/time), and pre-booking confirmation
- [x] **BTN-04**: AI never shows buttons when asking for phone, OTP, or name input

### Conversational Quality

- [x] **CONV-01**: AI enforces one-question-per-turn — each message asks at most one question
- [x] **CONV-02**: AI responds in the user's language (Uzbek Lotin, Uzbek Kirill, or Russian) automatically
- [x] **CONV-03**: AI tone is natural and informal — like texting a real receptionist, not filling out a form
- [x] **CONV-04**: Business context block includes address, working hours, and payment info from Firestore data

### Frontend Greeting

- [ ] **FE-01**: ChatWidget shows AI-generated greeting with business name instead of hardcoded text
- [ ] **FE-02**: Quick-start buttons appear on first chat open (e.g., "Yozilish", "Narxlar", "Manzil va ish vaqti")
- [ ] **FE-03**: Quick-start buttons are computed server-side from actual business data

## v3.x Requirements

Deferred to after v3.0 validation. Tracked but not in current roadmap.

### Custom Knowledge Base

- **FAQ-01**: Business owners can add custom Q&A pairs via `chat_faq` Firestore field
- **FAQ-02**: Custom FAQ entries are injected into the system prompt at runtime

### Chat Actions

- **ACT-01**: User can cancel an existing booking through the chat
- **ACT-02**: User can reschedule a booking through the chat

## Future Requirements

Deferred to separate milestones.

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
| New API endpoints or database schema changes | Prompt/logic changes only for v3.0 |
| Chat widget layout/design changes | Already redesigned in v2.0 |
| New tool functions | Existing 7 tools stay the same |
| Multi-service booking | Requires `create_booking` tool rewrite — v4.0 |
| Voice messages or file uploads | Different feature category entirely |
| Multi-language system prompt | Uzbek-primary with auto-detect is correct approach |
| Proactive upsell nudge | Depends on multi-service booking — v4.0 |
| Style consultation | Requires per-business staff expertise data — v4.0 |
| Dark mode | Light mode only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

### v2.0 Traceability

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

### v3.0 Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PROMPT-01 | Phase 8 | Complete |
| PROMPT-02 | Phase 8 | Complete |
| PROMPT-03 | Phase 8 | Complete |
| PROMPT-04 | Phase 8 | Complete |
| PROMPT-05 | Phase 8 | Complete |
| PROMPT-06 | Phase 8 | Complete |
| PROMPT-07 | Phase 8 | Complete |
| PROMPT-08 | Phase 8 | Complete |
| PROMPT-09 | Phase 8 | Complete |
| BTN-01 | Phase 8 | Complete |
| BTN-02 | Phase 8 | Complete |
| BTN-03 | Phase 8 | Complete |
| BTN-04 | Phase 8 | Complete |
| CONV-01 | Phase 8 | Complete |
| CONV-02 | Phase 8 | Complete |
| CONV-03 | Phase 8 | Complete |
| CONV-04 | Phase 8 | Complete |
| FE-01 | Phase 9 | Pending |
| FE-02 | Phase 9 | Pending |
| FE-03 | Phase 9 | Pending |

**Coverage:**
- v3.0 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-12 after v3.0 roadmap created (Phases 8-9)*
