# Project Research Summary

**Project:** BLYSS Tenant Page UI Rebuild
**Domain:** Multi-tenant salon/barbershop booking page (brownfield component architecture rebuild)
**Researched:** 2026-03-09
**Confidence:** HIGH

## Executive Summary

This is a brownfield UI restructuring project, not a greenfield build. The BLYSS tenant page (`TenantPage.tsx`) is a ~1,537-line monolithic client component that needs to be decomposed into ~20 focused components with clear boundaries, co-located utilities, and a shared design system. The existing stack (Next.js 16, React 19, TailwindCSS 4, motion, lucide-react) is fully sufficient -- zero new dependencies are required. The architectural improvement comes entirely from restructuring existing code: eliminating duplicate mobile/desktop markup, extracting inline sub-components, centralizing scattered translations, and pushing state ownership down to the lowest component that needs it.

The recommended approach is a dependency-ordered, four-phase rebuild: (1) design system primitives and extracted utilities as the foundation, (2) presentational/static sections to validate the design language, (3) interactive sections (services, gallery, tab nav) that build on primitives, and (4) final composition of the orchestrator and responsive polish. This order is driven by the component dependency graph -- every section component imports from the design system and utilities, so those must exist first. The rebuild targets architectural parity: the page should look and function identically to the current implementation, but with clean component boundaries that enable parallel development and isolated testing.

The primary risks center on silently breaking existing functionality during decomposition. The booking flow (service selection -> cookie-based intent -> navigation to booking page) is the revenue-critical path and the most fragile during refactoring. Auth cookie handling across subdomains, per-tenant color theming, and the dual routing system (subdomain vs path-based) are all areas where "working code" masks subtle dependencies that decomposition can sever. Every phase must include manual verification of these flows. The skeleton loading states must be updated in lockstep with layout changes to avoid CLS regressions, especially important given that users in Uzbekistan are often on slower networks.

## Key Findings

### Recommended Stack

No stack changes. This is a restructuring project that explicitly introduces zero new npm packages. The current stack is more than capable.

**Core technologies:**
- **Next.js 16 (App Router):** SSR, Server Components for data fetching, Server Actions for booking intent -- already in use
- **React 19:** Server Components by default, `'use client'` only on interactive leaves -- already in use
- **TailwindCSS 4:** Utility-first CSS with CSS custom properties for per-tenant theming (`--primary`) -- already in use
- **motion (framer-motion):** AnimatePresence for modals, layout animations for tab indicators -- already in use, use sparingly
- **lucide-react:** Tree-shakeable icon library -- already in use

**Explicitly rejected:** shadcn/ui, antd-mobile (project constraint: custom Tailwind only), Zustand/Jotai/Context (state is section-local), SWR/React Query (data fetched server-side).

### Expected Features

**Must have (table stakes) -- 20 features that exist today and must not regress:**
- Photo gallery with mosaic layout (desktop) and swipe carousel (mobile)
- Business identity: name, tagline, avatar, open/closed status, distance, rating
- Service listing with search and category filtering
- Individual service booking button (cookie-based intent flow)
- Employee/specialist display
- Reviews with rating distribution
- Sticky tab navigation with IntersectionObserver
- Google Maps embed, working hours, phone/Instagram contact
- Language switcher (ru/uz), bottom navigation, per-tenant theming
- Location permission modal, booking intent via cookie

**Should have (differentiators from the rebuild itself):**
- Component decomposition (maintainability, parallel development)
- Single responsive markup (eliminate mobile/desktop duplication)
- Design system primitives (Button, Card, Badge, Modal, Avatar, Spinner, Skeleton)
- Section-local state management (fewer re-renders)
- Extracted utilities and centralized translations

**Defer:**
- Animation refinements (get structure right first, polish later)
- Performance optimizations (measure with Lighthouse baseline, then optimize)
- Virtual scrolling (typical salons have 5-30 services, not needed)
- Dark mode (light mode only per project constraints)

### Architecture Approach

The target architecture follows a Server Component page with thin client orchestrator pattern. `page.tsx` (Server Component) handles all data fetching and SEO. It passes complete data to `TenantPage.tsx` (a thin `'use client'` orchestrator, target ~150-200 lines) which composes ~20 section components. Each section owns its local state. The only shared state in the orchestrator is gallery modal visibility and booking-in-progress service ID. Components live in `_components/` and utilities in `_lib/` (underscore prefix prevents Next.js from treating them as route segments). Shared design system primitives live in `app/components/ui/`.

**Major components:**
1. **TenantPage orchestrator** -- thin layout shell, CSS variable setup, two-column grid, section ref management (~150-200 lines)
2. **HeroGallery** -- photo display with PhotoMosaic (desktop), PhotoCarousel (mobile), GalleryModal (fullscreen)
3. **ServicesSection** -- service listing with ServiceSearch, CategoryPills, ServiceCard (core booking UX)
4. **BusinessHeader + MetadataBadges** -- brand identity, open status, distance, rating
5. **StickyTabNav** -- IntersectionObserver-driven active tab, scroll-to-section
6. **ReviewsSection** -- rating distribution chart, review cards, show-more toggle
7. **AboutSidebar** -- composes MapCard, WorkingHoursCard, ContactCard, BookingCTA (responsive: sidebar on desktop, stacked on mobile)
8. **Design system primitives** -- Button, Card, Badge, Modal, Spinner, Avatar, SectionHeading, Skeleton

**Key patterns to follow:**
- Server Components by default, `'use client'` only on interactive leaves
- One concern per component, co-located but not coupled
- Responsive Tailwind classes on single markup (never duplicate mobile/desktop)
- Callback props for cross-section actions (booking flow)
- Co-located private modules with `_` prefix

### Critical Pitfalls

1. **Booking flow breakage during decomposition** -- The `setBookingIntent` server action writes a cookie that the booking page reads. If decomposed components call `router.push()` before the server action completes, or the action loses its `'use server'` boundary, users tap "Book" and land on an empty booking page. **Prevent:** Extract `handleBookService` as a shared callback from the orchestrator; test the full flow (select service -> book -> verify booking page) after every phase.

2. **Skeleton/loading state mismatch** -- The `loading.tsx` mirrors the exact pixel layout. Layout changes without updating skeletons cause jarring CLS, especially on slow 3G connections common in Uzbekistan. **Prevent:** Every layout change must update `loading.tsx` in the same change; test on throttled network.

3. **Auth cookie breakage across subdomains** -- Server actions in `actions.ts` set cross-subdomain cookies. Moving or re-exporting these actions through barrel files breaks the `'use server'` boundary silently. **Prevent:** Never move `actions.ts`; never re-export server actions; test auth in incognito after any change to login UI or imports.

4. **Per-tenant theme color regression** -- New components that hardcode hex colors instead of using `text-primary`/`bg-primary` (which resolve to CSS `var(--primary)`) will look correct with the default teal but break for tenants with different brand colors. **Prevent:** Never use raw hex for brand elements; test with at least 2 different primary colors.

5. **Translation loss or duplication** -- Translations are scattered across 4+ files. Decomposition risks losing keys or creating inconsistent wording across locales. **Prevent:** Centralize all translation keys before decomposition; enforce that every user-facing string comes from the translation system.

## Implications for Roadmap

Based on research, a four-phase structure follows the natural dependency graph and balances risk.

### Phase 1: Design System Foundation
**Rationale:** Every section component imports from design system primitives and shared utilities. This must come first to prevent circular dependencies and establish the design language. Also the safest phase -- no existing functionality is changed.
**Delivers:** Shared UI primitives (`app/components/ui/` -- Button refactor, Card, Badge, Modal, Spinner, Avatar, SectionHeading, Skeleton), extracted utilities (`_lib/` -- translations.ts, formatting.ts, business-helpers.ts, distance-cache.ts), TypeScript interfaces for all data types.
**Addresses features:** Design system primitives (differentiator), extracted utilities (differentiator), professional loading skeletons (differentiator).
**Avoids pitfalls:** #4 (establish color token rules from day one), #7 (define breakpoint strategy: `lg:` = 1024px primary), #11 (establish no-dark-mode rule), #9 (build Modal with full behavior: scroll lock, focus trap, escape, click-outside), #10 (move Google Maps API key to env var).

### Phase 2: Presentational Sections
**Rationale:** These components are mostly static/presentational with minimal state. Building them validates the design system primitives and establishes visual consistency before tackling complex interactive sections.
**Delivers:** BusinessHeader + MetadataBadges, EmployeeCard + TeamSection, ReviewCard + RatingDistribution + ReviewsSection, MapCard + ContactCard + WorkingHoursCard.
**Addresses features:** Business identity display, employee display, reviews with rating distribution, map/hours/contact -- all table stakes features.
**Avoids pitfalls:** #4 (validates that all presentational components use `primary` token correctly), #5 (validates translation system works in practice).

### Phase 3: Interactive Sections
**Rationale:** These components manage their own state and have complex interactions. They depend on Phase 1 primitives (Modal, Button, Spinner) and Phase 2's visual patterns.
**Delivers:** ServicesSection (search, filter, book), HeroGallery (mosaic, carousel, fullscreen modal), StickyTabNav (IntersectionObserver), LanguageSwitcher, LocationPermissionModal.
**Addresses features:** Service listing with search/filter (table stakes), photo gallery (table stakes), sticky tab navigation (table stakes), language switching (table stakes) -- the core interactive features.
**Avoids pitfalls:** #1 (booking flow -- this is the critical phase; must verify the full service-select -> book -> cookie -> booking-page flow), #6 (animation performance -- set budget of 3-5 simultaneous animated elements), #13 (scroll position tracking via IntersectionObserver).

### Phase 4: Composition and Integration
**Rationale:** The orchestrator is built last because it depends on all sections existing. This phase wires everything together and verifies the complete page works as a unified experience.
**Delivers:** AboutSidebar (composes Phase 2 cards + BookingCTA), TenantPage orchestrator (composes all sections, manages refs for tab nav, owns gallery/booking shared state), responsive polish across all breakpoints, updated `loading.tsx` to match new layout.
**Addresses features:** Single responsive markup (differentiator), section-local state management (differentiator), component decomposition (core differentiator).
**Avoids pitfalls:** #2 (skeleton/loading mismatch -- update loading.tsx as final step), #8 (dual routing paths -- test both subdomain and path-based routing), #3 (auth cookie flow -- full incognito test of login -> book -> complete booking).

### Phase Ordering Rationale

- **Dependency-driven:** The component dependency graph flows downward: Design System -> Presentational Sections -> Interactive Sections -> Orchestrator. Building in this order means each phase has its dependencies already available.
- **Risk escalation:** Earlier phases are safer (additive, no existing code changed). Later phases carry more risk (replacing the monolith). This gives time to build confidence with the design system before touching the revenue-critical booking flow.
- **Validation cascading:** Each phase validates the previous one. If design system primitives have issues, they surface in Phase 2 (presentational sections) before being used in the more complex Phase 3 components.
- **Pitfall timing:** The most critical pitfalls (#1 booking flow, #3 auth cookies) are concentrated in Phases 3-4, after the foundation is solid. Phase 1 establishes the rules (#4 color tokens, #7 breakpoints, #11 no dark mode) that prevent recurring pitfalls in later phases.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Interactive Sections):** The gallery component involves responsive layout switching between mosaic and carousel, plus a fullscreen overlay. The StickyTabNav involves IntersectionObserver edge cases (threshold tuning, sticky offset coordination). Both warrant examining the existing implementation closely during phase planning.
- **Phase 4 (Composition):** Wiring the orchestrator involves understanding all state flows and ref management. The dual routing system (subdomain vs path) adds testing complexity. Phase planning should include mapping the exact state that lives at each level.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Design System Foundation):** Well-documented patterns. Tailwind component primitives, utility extraction, and TypeScript interfaces are straightforward. The existing LoginModal serves as a reference implementation for the Modal primitive.
- **Phase 2 (Presentational Sections):** Standard React component decomposition. These are mostly props-in, JSX-out components with minimal logic.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No stack changes -- using existing Next.js 16 + React 19 + TailwindCSS 4 already in production |
| Features | HIGH | Feature set derived from direct analysis of the 1,537-line monolith; no ambiguity about what exists |
| Architecture | HIGH | Component decomposition patterns well-established in React/Next.js ecosystem; verified against official docs |
| Pitfalls | HIGH | Pitfalls identified from direct codebase analysis of actual code paths (booking flow, auth cookies, routing); not hypothetical |

**Overall confidence:** HIGH

All research is grounded in analysis of the actual codebase, not external domain research. The stack is unchanged, the features are already implemented (this is a restructuring), and the architecture follows established Next.js App Router patterns with extensive official documentation.

### Gaps to Address

- **iOS Safari modal scroll lock:** The current LoginModal implements manual body scroll lock, but iOS Safari is notoriously tricky. The new Modal primitive needs testing on real iOS devices, not just Chrome DevTools simulation. Validate during Phase 1 when building the Modal component.
- **Performance baseline:** No current Lighthouse scores documented. Before starting the rebuild, capture baseline metrics (LCP, CLS, FID) so the rebuild can be measured against them. Do this before Phase 1.
- **Employee photo handling:** The architecture identifies that employee avatars use gradient fallback initials when no photo exists. The Avatar primitive needs to handle this gracefully. Validate the fallback pattern during Phase 1.
- **Service count scaling:** The architecture assumes 5-30 services per business. If any business currently has significantly more, the decision to skip virtual scrolling should be revisited. Verify with production data before Phase 3.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: `TenantPage.tsx` (1,537 lines), `BookingPage.tsx`, `LoginModal.tsx`, `actions.ts`, `middleware.ts`, `loading.tsx`, `BottomNav.tsx`
- Project requirements: `.planning/PROJECT.md`
- Existing stack documentation: `.planning/codebase/STACK.md`, `package.json`

### Secondary (MEDIUM confidence)
- [Next.js Docs: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Docs: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Airbnb Server-Driven UI Architecture](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5)
- [React Component Decomposition Techniques](https://medium.com/dailyjs/techniques-for-decomposing-react-components-e8a1081ef5da)
- [React Component Composition](https://www.developerway.com/posts/components-composition-how-to-get-it-right)

### Tertiary (LOW confidence)
- [Booking UX Best Practices](https://ralabs.org/blog/booking-ux-best-practices/) -- domain-specific UX patterns
- [Frontend Migration Risks](https://houseofangular.io/5-frontend-migration-risks-you-need-to-know/) -- rewrite failure patterns
- [Tailwind Design System Pitfalls](https://sancho.dev/blog/tailwind-and-design-systems) -- Tailwind consistency patterns

---
*Research completed: 2026-03-09*
*Ready for roadmap: yes*
