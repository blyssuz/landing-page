# BLYSS Landing Page — Tenant Page Redesign

## What This Is

A complete redesign of the BLYSS tenant page — the public-facing booking page for barbershops and salons. The new design ("The Clean Profile") replaces the traditional hero-carousel-tabs pattern with a mobile-native, social-profile-style layout. Centered avatar header, above-fold booking, expandable service rows, compact team strip, no hero carousel. Desktop renders the mobile layout centered in a narrow column.

## Core Value

Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation — the UI should never be the reason someone leaves.

## Current Milestone: v2.0 Tenant Page Redesign

**Goal:** Total redesign of the tenant page with "The Clean Profile" design — mobile-native, avatar-centered, above-fold booking.

**Target features:**
- Profile header with centered avatar, name, status, and above-fold Book button
- Photo strip (horizontal thumbnails) replacing hero carousel
- Expandable service rows with tap-to-book
- Compact team avatar strip
- Minimal review cards
- Collapsible about/hours/contact rows
- Floating Book pill on scroll
- Desktop: centered single-column layout

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

<!-- v2.0 requirements — see REQUIREMENTS.md for full list with REQ-IDs -->

- [ ] Profile header: avatar, name, tagline, status, above-fold Book button, quick actions
- [ ] Photo strip: horizontal thumbnails with lightbox
- [ ] Services: expandable rows with category filter and tap-to-book
- [ ] Team: compact horizontal avatar strip
- [ ] Reviews: minimal cards with expand-all
- [ ] About: collapsible hours, address, contact rows
- [ ] Floating Book pill on scroll
- [ ] Desktop: centered mobile layout in max-w-480px
- [ ] Subtle scroll animations

### Out of Scope

- Backend API changes — UI rebuild only, all endpoints stay the same
- New features or business logic — this is a visual/UX overhaul
- Dark mode — light mode only for now
- Third-party component libraries (shadcn, antd, etc.) — Tailwind only
- Landing page, bookings list, rating page, location page (separate milestone)
- Booking flow redesign (separate milestone — existing flow preserved)
- Hero carousel/mosaic — replaced by photo strip
- Tab navigation — replaced by vertical scroll
- Desktop sidebar layout — replaced by centered single column
- Map embed — replaced by tap-to-open address

## Context

- v1.0 shipped Phase 1 (design system) and Phase 2 (old tenant page presentation)
- v2.0 replaces all Phase 2 components with the new "Clean Profile" design
- Phase 1 design system primitives (Button, Card, Modal, Badge, Avatar, Skeleton, StarRating) are reused
- The `_lib/` utilities (types, translations, utils, hooks) stay unchanged
- Design doc: `docs/plans/2026-03-09-tenant-page-redesign-design.md`
- Current stack: Next.js 16, React 19, TailwindCSS 4, Motion, lucide-react
- Per-tenant primary color theming via CSS custom properties

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, TailwindCSS 4, Motion, lucide-react — no new frameworks
- **Components**: Custom Tailwind only — no external component libraries
- **Backend**: All API endpoints, server actions, and data flow unchanged
- **Routing**: Middleware, subdomain routing, locale routing — unchanged
- **Auth**: OTP + JWT cookie flow — unchanged
- **i18n**: All existing translations must work, new UI strings added to `_lib/translations.ts`
- **Deployment**: Standalone Docker output mode — must continue working
- **Design**: White background, mobile-first, centered layout, no hero images

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
*Last updated: 2026-03-09 after v2.0 milestone start*
