# BLYSS Landing Page — Professional UI Rebuild

## What This Is

A complete UI overhaul of the BLYSS landing page and tenant pages — the public-facing booking experience for barbershops and salons on the BLYSS platform. The goal is to transform every page from its current state into a warm, inviting, Airbnb/Booksy-quality experience that builds trust and makes booking feel effortless. This is a brownfield rebuild: all backend integration, routing, and data flow stay the same — the UI and page structure get rebuilt from scratch.

## Core Value

Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation — the UI should never be the reason someone leaves.

## Requirements

### Validated

<!-- Existing capabilities that already work and must be preserved. -->

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

### Active

<!-- New goals for this rebuild. -->

- [ ] Rebuild tenant page with warm, inviting Airbnb/Booksy-style design
- [ ] Rebuild landing page (hero, browse, nearest businesses) professionally
- [ ] Rebuild booking flow with seamless, polished UX
- [ ] Rebuild bookings list, rating page, and location page
- [ ] Fully restructure page sections — rethink layout, order, and information hierarchy
- [ ] Custom Tailwind-only components (remove dependency on external UI libraries)
- [ ] Professional typography, spacing, and color system
- [ ] Smooth, purposeful animations and micro-interactions (motion library)
- [ ] Mobile-first responsive design across all pages
- [ ] Consistent design system (buttons, cards, inputs, modals) used everywhere
- [ ] Professional loading states and skeleton screens
- [ ] Trust-building UI patterns (reviews, ratings, employee credentials)

### Out of Scope

- Backend API changes — UI rebuild only, all endpoints stay the same
- New features or business logic — this is a visual/UX overhaul
- Dark mode — light mode only for now
- Third-party component libraries (shadcn, antd, etc.) — Tailwind only
- New pages that don't exist yet — rebuild what's there

## Context

- The current `TenantPage.tsx` is ~1800 lines — likely needs decomposition into smaller components during rebuild
- Current stack: Next.js 16, React 19, TailwindCSS 4, Motion (framer-motion), lucide-react icons
- Keep lucide-react for icons — it's lightweight and already used everywhere
- The platform serves Uzbekistan (barbershops/salons), so the warm/inviting style fits the personal-service nature of the business
- Two locales: Russian (default) and Uzbek
- Per-tenant primary color theming via CSS custom properties — must be preserved
- The codebase map at `.planning/codebase/` has full architectural details

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, TailwindCSS 4, Motion, lucide-react — no new frameworks
- **Components**: Custom Tailwind only — no external component libraries
- **Backend**: All API endpoints, server actions, and data flow unchanged
- **Routing**: Middleware, subdomain routing, locale routing — unchanged
- **Auth**: OTP + JWT cookie flow — unchanged, only UI for login modal redesigned
- **i18n**: All existing translations must work, new UI strings added to `lib/translations.ts`
- **Deployment**: Standalone Docker output mode — must continue working

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tailwind-only components | Full design control, no library aesthetic to fight | — Pending |
| Full page restructure | Current layout doesn't flow well, needs rethinking | — Pending |
| Warm/inviting Airbnb-Booksy style | Fits salon/barber personal-service domain, builds trust | — Pending |
| Decompose TenantPage.tsx | 1800-line monolith is unmaintainable, rebuild as smaller components | — Pending |
| Keep motion library | Already used, good for warm micro-interactions | — Pending |
| Mobile-first approach | Most users likely access via phone (Telegram Mini App context) | — Pending |

---
*Last updated: 2026-03-09 after initialization*
