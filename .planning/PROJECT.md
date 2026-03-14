# BLYSS Landing Page — Tenant Page Redesign

## What This Is

A complete redesign of the BLYSS tenant page — the public-facing booking page for barbershops and salons. The new design ("The Clean Profile") replaces the traditional hero-carousel-tabs pattern with a mobile-native, social-profile-style layout. Centered avatar header, above-fold booking, expandable service rows, compact team strip, no hero carousel. Desktop renders the mobile layout centered in a narrow column.

## Core Value

Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation — the UI should never be the reason someone leaves.

## Current Milestone: v4.0 Predefined Chat Flow

**Goal:** Replace AI-powered chat with a predefined, menu-driven chat flow — no OpenAI API calls, instant responses with simulated typing delay.

**Target features:**
- Language selection (UZ/RU) when chat opens
- Menu buttons for common queries: prices, services, location, working hours, etc.
- Predefined responses using actual business data (services, prices, hours, address)
- Simulated AI typing with 500ms-1s delay before showing response
- Remove OpenAI dependency from chat entirely
- Nested menu navigation (e.g., Prices → service list → individual service details)

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Multi-tenant subdomain routing (`{tenant}.blyss.uz`) — existing
- ✓ Path-based business access (`blyss.uz/{locale}/b/{slug}`) — existing
- ✓ URL-based i18n (Russian/Uzbek) — existing
- ✓ OTP-based phone authentication with JWT — existing
- ✓ Service listing with prices and durations — existing
- ✓ Employee listing with photos and roles — existing
- ✓ Business photo gallery — existing
- ✓ Available slot selection with date picker — existing
- ✓ Employee picker per time slot — existing
- ✓ Booking creation with auth flow — existing
- ✓ User bookings list with cancel — existing
- ✓ Review/rating submission via token link — existing
- ✓ Business reviews display — existing
- ✓ Nearest businesses by geolocation — existing
- ✓ SEO metadata, sitemap, JSON-LD — existing
- ✓ HMAC-signed API communication — existing
- ✓ Cookie-based auth with cross-subdomain sharing — existing
- ✓ Location detection via Google Geolocation API — existing
- ✓ Visit tracking via Telegram notifications — existing
- ✓ Standalone Docker deployment — existing
- ✓ Design system foundation (Nunito Sans, color system, Button, Card, Modal, Badge, Avatar, Skeleton, StarRating) — v1.0 Phase 1

### Active

<!-- v4.0 requirements — see REQUIREMENTS.md for full list with REQ-IDs -->

- [ ] Language selection (UZ/RU) on chat open
- [ ] Menu buttons for prices, services, location, hours, etc.
- [ ] Predefined responses with actual business data
- [ ] Simulated typing delay (500ms-1s)
- [ ] Remove OpenAI/AI dependency from chat
- [ ] Nested menu navigation for drill-down

### Out of Scope

- AI/OpenAI-powered chat responses — replaced by predefined flow
- New API endpoints or database schema changes — frontend-only changes
- Authentication flow changes — OTP + JWT stays
- Dark mode
- Voice messages or file uploads in chat
- Free-text chat input — menu-driven only

## Context

- v1.0 shipped design system + old tenant page
- v2.0 shipped "The Clean Profile" redesign (Phases 5-6 complete)
- Chat widget added outside roadmap: ChatWidget.tsx on landing-page, chatAi.js on API
- AI uses OpenAI gpt-4.1-mini with function calling (7 tools) and structured output (Zod schema)
- System prompt is in Uzbek, auto-detects user language (Uzbek Lotin/Kirill, Russian)
- Current prompt only covers booking flow — missing general Q&A
- Frontend: hardcoded greeting, no quick-start buttons
- Cross-repo: API changes in `blyss-gcloud-api/src/utils/chatAi.js`, frontend in `landing-page/ChatWidget.tsx`

## Constraints

- **AI Model**: OpenAI gpt-4.1-mini — no model changes
- **Tools**: Existing 7 tool functions unchanged — only prompt/logic around them
- **Schema**: ChatResponseSchema (message, buttons, input_type) unchanged
- **Backend**: Express.js API endpoints unchanged — only chatAi.js modifications
- **Frontend**: ChatWidget.tsx — minimal changes (greeting, button handling)
- **Language**: System prompt stays Uzbek-primary with auto-detection

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tailwind-only components | Full design control, no library aesthetic to fight | ✓ Good |
| Decompose TenantPage.tsx | 1800-line monolith rebuilt as ~8 focused components | ✓ Good |
| Keep motion library | Already used, good for subtle micro-interactions | ✓ Good |
| Mobile-first approach | Most users access via phone (Telegram Mini App context) | ✓ Good |
| No hero carousel | Avatar-centered profile header — breaks the Fresha/Booksy clone pattern | — Pending |
| No tab navigation | Vertical scroll with section headers — simpler, less chrome | — Pending |
| Desktop = centered mobile | Single column max-w-480px, no sidebar — consistency over complexity | — Pending |
| Floating Book pill | Replaces fixed bottom nav — less UI, more focused CTA | — Pending |
| Expandable service rows | Tap-to-expand instead of always-visible Book buttons — cleaner list | — Pending |

---
*Last updated: 2026-03-15 after v4.0 milestone start*
