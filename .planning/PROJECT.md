# BLYSS Landing Page — Tenant Page Redesign

## What This Is

A complete redesign of the BLYSS tenant page — the public-facing booking page for barbershops and salons. The new design ("The Clean Profile") replaces the traditional hero-carousel-tabs pattern with a mobile-native, social-profile-style layout. Centered avatar header, above-fold booking, expandable service rows, compact team strip, no hero carousel. Desktop renders the mobile layout centered in a narrow column.

## Core Value

Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation — the UI should never be the reason someone leaves.

## Current Milestone: v3.0 AI Chat Experience Overhaul

**Goal:** Transform the AI chat from a booking-only form into a natural, real-life conversational experience that handles all customer questions.

**Target features:**
- Comprehensive system prompt rewrite covering all real-life customer questions
- Smart button patterns: yes/no, quick-start, confirmation, context-aware choices
- Natural conversational tone — like texting the salon receptionist on WhatsApp
- AI-generated greeting with quick-start buttons instead of hardcoded text
- Response templates for every common scenario (hours, prices, location, payment, cancellation, etc.)
- Booking confirmation flow with button-based confirmations before finalizing

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

<!-- v3.0 requirements — see REQUIREMENTS.md for full list with REQ-IDs -->

- [ ] Comprehensive AI system prompt covering all customer question types
- [ ] Smart button patterns (yes/no, quick-start, confirmations)
- [ ] Natural conversational tone across all scenarios
- [ ] AI-generated greeting with quick-start buttons
- [ ] Response templates for common questions (hours, prices, location, payment, etc.)
- [ ] Booking confirmation buttons before finalizing

### Out of Scope

- New API endpoints or database schema changes — prompt/logic changes only
- Chat widget layout/design changes — already redesigned in v2.0
- New tool functions (get_services, etc.) — existing tools stay the same
- Authentication flow changes — OTP + JWT stays
- Dark mode
- Voice messages or file uploads in chat
- Multi-language system prompt (stays Uzbek-primary with auto-detect)

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
*Last updated: 2026-03-12 after v3.0 milestone start*
