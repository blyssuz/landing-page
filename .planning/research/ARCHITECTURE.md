# Architecture Patterns

**Domain:** Multi-tenant salon/barbershop booking page (UI rebuild)
**Researched:** 2026-03-09

## Current State Analysis

The current `TenantPage.tsx` is a ~1,537-line monolithic `'use client'` component containing:

- **17 state variables** (search, gallery, distance, modals, tabs, carousel, reviews, booking, navigation)
- **6 inline sub-components** (LanguageSwitcher, LanguageSwitcherDesktop, MetadataBadges, RatingDistribution, Spinner)
- **12+ utility/helper functions** (formatting, time calculations, locale switching, geolocation)
- **~200 lines of translation/constant definitions** (UI_TEXT, DAY_NAMES, LOCALE_LABELS)
- **Duplicated markup** for mobile vs desktop (map section rendered twice, language switcher rendered twice, working hours rendered twice)
- **Mixed concerns** throughout: data transformation, geolocation logic, localStorage caching, intersection observer setup, service filtering, and rendering all in one function body

The page is the Server Component (`page.tsx`) passing all data as props into the single Client Component. The entire page tree is in the Client Module Graph, meaning every byte ships to the browser.

## Recommended Architecture

### Guiding Principles

1. **Server Components by default.** Only mark `'use client'` on the smallest interactive leaves. The hero image mosaic, business info header, and static content sections have zero interactivity and should be Server Components.
2. **One concern per component.** Each component should own one visual section or one piece of interactive behavior, not both "display services" and "manage gallery state."
3. **Co-located but not coupled.** Tenant page components live together in a `_components/` directory within the route segment, but communicate through props, not shared useState.
4. **No duplicate markup.** Use responsive Tailwind classes on a single component instead of rendering two separate mobile/desktop components with different markup.

### Component Hierarchy

```
app/[locale]/[tenant]/page.tsx (Server Component - data fetching, SEO, JSON-LD)
  |
  +-- TenantPage.tsx ('use client' - thin orchestrator, owns shared state)
      |
      +-- _components/
          |
          +-- HeroGallery.tsx ('use client' - carousel state, gallery modal trigger)
          |   +-- PhotoMosaic.tsx (presentational - desktop grid layout)
          |   +-- PhotoCarousel.tsx ('use client' - mobile swipe carousel)
          |   +-- GalleryModal.tsx ('use client' - fullscreen gallery overlay)
          |
          +-- BusinessHeader.tsx (presentational - name, tagline, avatar)
          |   +-- MetadataBadges.tsx ('use client' - distance fetching, open status)
          |   +-- LanguageSwitcher.tsx ('use client' - locale toggle)
          |
          +-- StickyTabNav.tsx ('use client' - intersection observer, scroll-to)
          |
          +-- ServicesSection.tsx ('use client' - search, category filter, booking action)
          |   +-- ServiceSearch.tsx ('use client' - search input state)
          |   +-- CategoryPills.tsx ('use client' - active category state)
          |   +-- ServiceCard.tsx ('use client' - book button with loading state)
          |
          +-- TeamSection.tsx (presentational - employee grid/carousel)
          |   +-- EmployeeCard.tsx (presentational - avatar, name, position, service count)
          |
          +-- ReviewsSection.tsx ('use client' - show-more toggle)
          |   +-- RatingDistribution.tsx (presentational - bar chart)
          |   +-- ReviewCard.tsx (presentational - individual review)
          |
          +-- AboutSidebar.tsx (presentational - desktop sidebar wrapper)
          |   +-- BookingCTA.tsx ('use client' - navigate to bookings/services)
          |   +-- MapCard.tsx (presentational - embedded Google Maps iframe)
          |   +-- WorkingHoursCard.tsx ('use client' - collapsible on mobile)
          |   +-- ContactCard.tsx (presentational - phone, Instagram links)
          |
          +-- LocationPermissionModal.tsx ('use client' - modal state)
```

### Shared Design System Components

These live in `app/components/ui/` and are reused across tenant page, booking page, landing page, and other pages:

```
app/components/ui/
  +-- Button.tsx          (exists - needs primary-color-aware variants)
  +-- StarRating.tsx      (exists - keep as-is)
  +-- PillButton.tsx      (exists - rename to Chip or FilterChip)
  +-- Badge.tsx           (new - open/closed status, distance, review count)
  +-- Card.tsx            (new - base card with border/shadow/rounded)
  +-- Modal.tsx           (new - base bottom-sheet-on-mobile, centered-on-desktop)
  +-- Spinner.tsx         (new - extract from inline SVG)
  +-- Avatar.tsx          (new - image with gradient fallback initial)
  +-- SectionHeading.tsx  (new - h2 with count badge pattern)
  +-- Skeleton.tsx        (new - loading placeholder primitives)
```

### Data Flow

```
page.tsx (Server Component)
  |
  | Fetches: business, services, employees, photos, reviews, auth status
  | Passes all as props to:
  |
  v
TenantPage.tsx (Client Component - thin orchestrator)
  |
  | Owns shared state:
  |   - bookingServiceId (which service is being booked - loading state)
  |   - showGallery / currentImageIndex (gallery modal state)
  |
  | Passes down via props to children:
  |   - business, locale, basePath to every section
  |   - services to ServicesSection
  |   - employees to TeamSection
  |   - reviews to ReviewsSection
  |   - photos to HeroGallery
  |   - onBookService callback to ServicesSection
  |   - onOpenGallery callback to HeroGallery
  |
  | Each section manages its OWN local state:
  |   - ServicesSection: searchQuery, activeCategory
  |   - ReviewsSection: showAllReviews
  |   - MetadataBadges: distance, distanceLoading, distanceDenied
  |   - StickyTabNav: activeTab (via IntersectionObserver)
  |   - HeroGallery: mobileCarouselIndex
  |   - WorkingHoursCard: showAllHours (mobile collapsible)
  |
  | Server Actions called directly from leaf components:
  |   - ServiceCard -> setBookingIntent() + router.push
  |   - MetadataBadges -> getDistance(), reverseGeocode()
```

**State ownership rule:** State lives in the lowest common ancestor that needs it. Most state is section-local. The only shared state that needs to live in TenantPage is gallery modal visibility (triggered from HeroGallery, rendered as portal-level overlay) and booking-in-progress service ID (triggered from ServiceCard, might need to disable other cards).

### Extracted Utilities

Move out of TenantPage into dedicated files:

```
app/[locale]/[tenant]/
  _lib/
    translations.ts     -- UI_TEXT, DAY_NAMES, LOCALE_LABELS constants
    formatting.ts       -- formatPrice, formatDuration, secondsToTime, getRelativeDate
    business-helpers.ts -- isOpenNow, getClosingTime, getTodayName, getText
    distance-cache.ts   -- getCachedDistance, cacheDistance, localStorage helpers
```

**Why `_lib/` with underscore prefix:** Next.js App Router ignores directories starting with `_` for routing purposes. This keeps utilities co-located with the route segment but not treated as route segments.

**Why `_components/` with underscore prefix:** Same reason. Components specific to the tenant page stay co-located with the route, separate from the shared `app/components/` directory.

## Component Boundaries: Detailed Specifications

### TenantPage.tsx (Orchestrator)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Thin layout shell: CSS variable setup, two-column desktop grid, section ordering, shared state |
| **State** | `bookingServiceId`, `showGallery`, `currentImageIndex` |
| **Props** | All data from page.tsx: business, services, employees, photos, reviews, tenantSlug, businessId, locale, savedUser |
| **Children** | All section components |
| **Lines target** | ~150-200 lines (down from ~1,537) |

### HeroGallery.tsx

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Photo display: desktop mosaic, mobile carousel, gallery modal trigger |
| **State** | `mobileCarouselIndex` (local), receives `showGallery`/`setShowGallery` from parent |
| **Props** | photos, business.name, business.cover_url, onOpenGallery callback |
| **Children** | PhotoMosaic, PhotoCarousel, GalleryModal |

### ServicesSection.tsx

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Service listing with search, category filtering, and individual book buttons |
| **State** | `searchQuery`, `activeCategory` (all local) |
| **Props** | services, locale, businessId, basePath, bookingServiceId, onBookService |
| **Children** | ServiceSearch, CategoryPills, ServiceCard[] |
| **Lines target** | ~200-250 lines |

### StickyTabNav.tsx

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Sticky navigation bar with section tabs, IntersectionObserver-driven active state, scroll-to-section |
| **State** | `activeTab` (local, driven by IntersectionObserver) |
| **Props** | sections array `{ id, label, ref, show }[]`, locale |
| **Note** | Receives refs to section DOM elements for observation. Parent passes refs down. |

### ReviewsSection.tsx

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Rating distribution chart + review cards with show-more |
| **State** | `showAllReviews` (local) |
| **Props** | reviews, business.review_stats, locale |
| **Children** | RatingDistribution, ReviewCard[] |

### AboutSidebar.tsx

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Right column on desktop, bottom section on mobile. Contains map, hours, contact, CTA. |
| **State** | None of its own (children own their state) |
| **Props** | business, locale, savedUser, basePath |
| **Children** | BookingCTA, MapCard, WorkingHoursCard, ContactCard |
| **Note** | Uses responsive Tailwind to render as sidebar on lg+ and as stacked cards on mobile. Single markup, NOT duplicate mobile/desktop components. |

## Patterns to Follow

### Pattern 1: Server Component Page with Thin Client Orchestrator

**What:** The `page.tsx` Server Component does all data fetching and passes complete data to a single `'use client'` orchestrator that composes section components.

**When:** Always for data-driven pages in Next.js App Router.

**Example:**
```typescript
// page.tsx (Server Component)
export default async function Page({ params }) {
  const { tenant, locale } = await params
  const [businessData, reviews] = await Promise.all([
    getBusinessData(tenant),
    getBusinessReviews(tenant),
  ])

  return (
    <>
      <script type="application/ld+json" ... />
      <TenantPage
        business={businessData.business}
        services={businessData.services}
        employees={businessData.employees}
        photos={businessData.photos}
        reviews={reviews}
        locale={locale}
      />
    </>
  )
}
```

### Pattern 2: Section Refs for Tab Navigation

**What:** The orchestrator creates refs for each scrollable section and passes them down. The StickyTabNav observes these refs via IntersectionObserver.

**When:** Any page with sticky section navigation.

**Example:**
```typescript
// TenantPage.tsx
const servicesRef = useRef<HTMLDivElement>(null)
const teamRef = useRef<HTMLDivElement>(null)
const reviewsRef = useRef<HTMLDivElement>(null)
const aboutRef = useRef<HTMLDivElement>(null)

const sections = [
  { id: 'services', ref: servicesRef, show: true },
  { id: 'team', ref: teamRef, show: employees.length > 0 },
  { id: 'reviews', ref: reviewsRef, show: reviews.length > 0 },
  { id: 'about', ref: aboutRef, show: true },
]

return (
  <>
    <StickyTabNav sections={sections} locale={locale} />
    <div ref={servicesRef}><ServicesSection ... /></div>
    <div ref={teamRef}><TeamSection ... /></div>
    <div ref={reviewsRef}><ReviewsSection ... /></div>
    <div ref={aboutRef}><AboutSidebar ... /></div>
  </>
)
```

### Pattern 3: Responsive Single Markup (Not Duplicate Components)

**What:** Use Tailwind responsive prefixes on one component instead of rendering separate mobile and desktop components.

**When:** Always. The current codebase duplicates the map card, working hours, and language switcher for mobile vs desktop.

**Example:**
```typescript
// MapCard.tsx - ONE component for both layouts
function MapCard({ business, locale }) {
  return (
    <div className="rounded-xl lg:rounded-2xl overflow-hidden border ...">
      <div className="aspect-[16/9] lg:aspect-[16/10] ...">
        {/* Single iframe, responsive aspect ratio */}
      </div>
      <div className="p-3.5 lg:p-4">
        {/* Single content block, responsive sizing */}
      </div>
    </div>
  )
}
```

### Pattern 4: Callback Props for Cross-Section Actions

**What:** When a child component action affects sibling components (e.g., booking a service triggers navigation), pass callbacks from the common parent.

**When:** When two sibling components need to coordinate.

**Example:**
```typescript
// TenantPage.tsx
const handleBookService = async (service: Service) => {
  setBookingServiceId(service.id)
  await setBookingIntent(businessId, [service.id])
  router.push(`${basePath}/booking`)
}

<ServicesSection
  onBookService={handleBookService}
  bookingServiceId={bookingServiceId}
/>
```

### Pattern 5: Co-located Private Modules with `_` Prefix

**What:** Use `_components/` and `_lib/` directories within route segments for route-specific code that should not be treated as route segments by Next.js.

**When:** Components or utilities are specific to one route and not shared.

**Example:**
```
app/[locale]/[tenant]/
  page.tsx
  TenantPage.tsx
  actions.ts
  loading.tsx
  _components/
    HeroGallery.tsx
    ServicesSection.tsx
    ...
  _lib/
    translations.ts
    formatting.ts
    ...
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: God Component

**What:** Single 1,500+ line component that handles all sections, state, and logic.
**Why bad:** Impossible to reason about, every change risks breaking unrelated sections, entire component re-renders on any state change, cannot be worked on in parallel by multiple developers, kills code review quality.
**Instead:** Decompose into section components with clear prop interfaces. Target 100-250 lines per component.

### Anti-Pattern 2: Duplicated Mobile/Desktop Markup

**What:** Rendering two complete versions of a section (`<div className="lg:hidden">...mobile...</div>` and `<div className="hidden lg:block">...desktop...</div>`) with different but largely identical markup.
**Why bad:** Every change must be made twice. Easy to forget one. Doubles the DOM size. Ships unused markup to the client.
**Instead:** Use one component with responsive Tailwind classes. The exceptions (where layouts are fundamentally different, like mosaic vs carousel) should be separate components toggled by a single breakpoint wrapper.

### Anti-Pattern 3: Inline Component Definitions

**What:** Defining components (`const LanguageSwitcher = () => ...`) inside another component's function body.
**Why bad:** Re-created on every render (new function identity). Cannot be memoized. Cannot be tested independently. Confusing scope.
**Instead:** Extract to separate files. If the component needs parent state, pass it as props.

### Anti-Pattern 4: All State in One Component

**What:** Lifting ALL state to the top-level orchestrator even when state is only used by one section.
**Why bad:** Every state change re-renders the entire page. Prop threading becomes verbose.
**Instead:** State lives in the lowest component that needs it. `searchQuery` belongs in ServicesSection, not TenantPage.

### Anti-Pattern 5: Mixing Translation Definitions with Component Logic

**What:** 200+ lines of translation constants at the top of a component file.
**Why bad:** Obscures the component logic. Cannot be reused. Hard to maintain.
**Instead:** Extract to `_lib/translations.ts` or use the existing `lib/translations.ts` system.

## Suggested Build Order

Build order follows dependency direction: foundations first, then sections that depend on them, then composition.

### Phase 1: Design System Foundation
1. **Shared UI primitives** (`app/components/ui/`): Button (refactor), Card, Badge, Modal, Spinner, Avatar, SectionHeading, Skeleton
2. **Extracted utilities** (`_lib/`): translations.ts, formatting.ts, business-helpers.ts, distance-cache.ts
3. **TypeScript interfaces** (`_lib/types.ts`): Business, Service, Employee, Photo, Review, ReviewStats -- shared across all section components

**Rationale:** Every section component imports from these. Building them first prevents circular dependencies and establishes the design language.

### Phase 2: Static/Presentational Sections
4. **BusinessHeader + MetadataBadges** -- establishes the primary color theming pattern used everywhere
5. **EmployeeCard + TeamSection** -- simplest section, no state, pure presentation
6. **ReviewCard + RatingDistribution + ReviewsSection** -- minimal state (show-more toggle)
7. **MapCard + ContactCard + WorkingHoursCard** -- small independent cards

**Rationale:** These components are mostly presentational. Building them validates the design system primitives and establishes visual consistency before tackling complex interactive sections.

### Phase 3: Interactive Sections
8. **ServiceCard + ServiceSearch + CategoryPills + ServicesSection** -- the core booking UX
9. **HeroGallery + PhotoMosaic + PhotoCarousel + GalleryModal** -- complex but self-contained
10. **StickyTabNav** -- depends on section refs existing
11. **LanguageSwitcher** -- small interactive component
12. **LocationPermissionModal** -- modal pattern established in Phase 1

**Rationale:** These components manage their own state and have more complex interactions. They build on Phase 1 primitives (Modal, Button, Spinner) and Phase 2's visual patterns.

### Phase 4: Composition + Sidebar
13. **AboutSidebar** -- composes Phase 2 cards + BookingCTA
14. **TenantPage orchestrator** -- composes all sections, wires refs for tab nav
15. **Responsive polish** -- verify single-markup responsive behavior across all breakpoints

**Rationale:** The orchestrator is built last because it depends on all sections existing. The sidebar is a composition of already-built cards.

## Scalability Considerations

| Concern | Current (1 business) | At 100 businesses | At 1000+ businesses |
|---------|---------------------|-------------------|---------------------|
| Component reuse | TenantPage used for both subdomain and path-based access | Same -- component is business-agnostic | Same |
| Bundle size | ~1,537 lines in one client chunk | Same single chunk per business page | Consider route-level code splitting for gallery modal via `dynamic()` |
| Per-tenant theming | CSS variable `--primary` set at root | Works -- each page load sets the variable | Works -- no scaling concern |
| Photo gallery | All photos loaded at once | Consider lazy loading thumbnails if businesses have 50+ photos | Virtual scrolling in gallery modal |
| Service list | All services rendered | Works for typical salon (5-30 services) | If 100+ services, add pagination or virtual list |

## Sources

- Airbnb server-driven UI architecture: [A Deep Dive into Airbnb's Server-Driven UI System](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5)
- Next.js server/client component boundaries: [Next.js Docs: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- Next.js App Router project structure: [Next.js Docs: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- React component decomposition: [Techniques for decomposing React components](https://medium.com/dailyjs/techniques-for-decomposing-react-components-e8a1081ef5da)
- React component composition: [React components composition: how to get it right](https://www.developerway.com/posts/components-composition-how-to-get-it-right)
- React project structure: [React project structure for scale: decomposition, layers and hierarchy](https://www.developerway.com/posts/react-project-structure)

---

*Architecture analysis: 2026-03-09*
