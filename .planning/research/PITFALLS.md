# Domain Pitfalls

**Domain:** UI rebuild of multi-tenant salon/barber booking landing page (brownfield)
**Researched:** 2026-03-09
**Confidence:** HIGH (based on codebase analysis + domain research)

## Critical Pitfalls

Mistakes that cause rewrites, broken flows, or significant regression.

---

### Pitfall 1: Breaking the Booking Flow During Decomposition

**What goes wrong:** The current `TenantPage.tsx` is an 1800-line monolith that owns the entire service selection and "Book" button flow. It manages `bookingServiceId` state, calls `setBookingIntent()` (a server action that writes a cookie), then navigates to `/booking`. The `BookingPage.tsx` reads that cookie via `getBookingIntent()` to know which services the user selected. If the decomposed components lose access to the `handleBookService` function, or the cookie-setting happens in the wrong render context, the booking flow silently breaks -- user taps "Book" and lands on an empty booking page with no services pre-selected.

**Why it happens:** When splitting TenantPage into `ServicesList`, `ServiceCard`, etc., the booking intent logic gets separated from its trigger point. A new component might call `router.push()` before the server action completes, or the server action gets accidentally converted to a client-side call during refactoring.

**Consequences:** Users click "Book" and see an error or empty state. This is the primary revenue-generating flow -- any breakage here directly impacts business owners.

**Prevention:**
- Extract the `handleBookService` function into a shared hook or context FIRST, before decomposing visual components
- Write a manual test script: select service -> tap book -> verify booking page shows correct service/price
- Keep `setBookingIntent` as a server action (it uses `cookies()` from `next/headers`) -- never move it to a client module
- Test both subdomain (`tenant.blyss.uz`) and path-based (`blyss.uz/ru/b/slug`) routing, as `basePath` calculation differs

**Detection:** The booking page shows "no services selected" or falls back to a generic state after the rebuild. Users can still reach the page but nothing is pre-populated.

**Phase relevance:** Must be verified in every phase that touches tenant page or service components.

---

### Pitfall 2: Skeleton/Loading State Mismatch After Layout Changes

**What goes wrong:** The existing `loading.tsx` files are hand-crafted skeleton screens that mirror the exact pixel layout of the current design -- the mosaic grid structure (4-column, 2-row), the sticky tab nav, the two-column desktop layout with 380px sidebar. When the UI layout changes but the loading skeletons are not updated to match, users see a jarring layout shift: skeleton shows old layout, then real page pops in with a completely different structure.

**Why it happens:** Loading states are easy to forget because they only appear briefly. Developers rebuild the main page, ship it, and don't notice the skeleton mismatch until someone on a slow connection reports visual "jumping."

**Consequences:** Cumulative Layout Shift (CLS) spikes, which damages perceived quality (the exact opposite of the "polished, trustworthy" goal) and hurts Core Web Vitals / SEO scores. Users on slow networks -- common in Uzbekistan -- experience the worst version of this.

**Prevention:**
- Rule: Every layout change requires updating the corresponding `loading.tsx` in the same PR
- Create a shared skeleton primitives file (`components/ui/Skeleton.tsx`) so both loading states and inline loading use the same visual language
- Test on throttled network (3G) to actually see the transition

**Detection:** Open the page with network throttling (Chrome DevTools -> Slow 3G). If the skeleton and the rendered page have visibly different structures, it is broken.

**Phase relevance:** Every phase that changes page layout. Build skeleton components in the design system phase so they are ready when pages are rebuilt.

---

### Pitfall 3: Auth Cookie Flow Silently Breaks Across Subdomains

**What goes wrong:** The auth system uses cross-subdomain cookies (domain: `.blyss.uz` in production) set by server actions. The `LoginModal` is a client component that calls server actions (`sendOtp`, `verifyOtp`, `registerUser`) which set cookies via `next/headers`. If the LoginModal gets moved, re-imported from a different route segment, or its `onSuccess` callback changes behavior, cookies may not propagate correctly. The token refresh logic (`refreshTokens()`) is particularly fragile -- it reads and writes cookies in the same server action call.

**Why it happens:** During a visual redesign of the login modal, developers change the component structure but don't realize the server action imports are path-sensitive in Next.js App Router (they must be imported from a file with `'use server'` at the top). Moving actions to a shared utils folder without proper `'use server'` directive breaks the server action boundary.

**Consequences:** Users appear to log in successfully (modal closes), but cookies are not set. They immediately see a "not authenticated" state when navigating to bookings or trying to complete a booking. This is invisible during development because the developer might already have valid cookies.

**Prevention:**
- Never move the `actions.ts` file or its server action exports without verifying the `'use server'` directive
- The LoginModal's server action imports (`sendOtp`, `verifyOtp`, `registerUser`) must always point to the same `actions.ts` file, not be re-exported through barrel files
- Test auth flow in an incognito window after every phase that touches login UI or component imports
- Keep the `LoginModal` as a single self-contained component -- resist the urge to decompose it further (it is only 595 lines and its complexity is justified)

**Detection:** Open incognito, go to tenant page, try to book a service, complete OTP login. If redirected to bookings page and it shows "login required," cookies failed.

**Phase relevance:** Phase where login modal is redesigned. Also any phase that restructures component imports or file locations.

---

### Pitfall 4: Per-Tenant Theme Color Regression

**What goes wrong:** The current system uses CSS custom property `--primary` set via inline style on the root container: `style={{ '--primary': primaryColor }}`. Every component references `text-primary`, `bg-primary`, `bg-primary/10`, etc. via Tailwind. If the new design system introduces its own color tokens or hardcodes hex values in new components instead of using `text-primary`, some tenants will have wrong brand colors on parts of their page.

**Why it happens:** When building new Tailwind-only components, developers test with the default primary color (`#088395`) and hardcode values that look correct. Only when deployed to a tenant with a different primary color (e.g., a pink salon or a dark barbershop brand) does the mismatch appear.

**Consequences:** Parts of the page use the tenant's brand color while newly built sections use the hardcoded default. This looks unprofessional and breaks the "each business has their own branded experience" promise.

**Prevention:**
- Establish a firm rule in the design system: NEVER use raw hex colors for interactive/brand elements. Always use `primary` token
- In `tailwind.config`, verify that `primary` maps to `var(--primary)` (it currently does via CSS custom properties)
- Test every new component against at least 2 different primary colors (the default teal and one contrasting color like red or purple)
- Create a developer checklist: search new component code for any hardcoded color hex values before merge

**Detection:** Change the `primary_color` in the business data to something dramatically different (e.g., bright red `#FF0000`). Visually scan the entire page for elements that stayed teal/default.

**Phase relevance:** Design system phase (when defining tokens) and every subsequent phase that creates new components.

---

### Pitfall 5: Inline Translations Lost or Duplicated

**What goes wrong:** The current codebase has translations scattered across at least 4 locations: `lib/translations.ts` (global), `TenantPage.tsx` (`UI_TEXT` and `DAY_NAMES` constants, ~100 keys), `LoginModal.tsx` (its own `T` and `ERROR_CODES` objects), and `BookingPage.tsx` (its own `UI_TEXT`). During the rebuild, if translations are "cleaned up" and consolidated prematurely, keys get lost. If left scattered, new components duplicate existing translations with slightly different wording, creating inconsistency.

**Why it happens:** The monolith had all its translations co-located. When decomposing into smaller components, each component needs its own translation access pattern. Without a clear strategy, some translations end up hardcoded in English/Russian during development ("I'll add the translation later") and never get the Uzbek counterpart.

**Consequences:** Uzbek users see Russian text mixed with Uzbek text. Or worse, they see English developer placeholder text. This breaks trust immediately in a locale-sensitive market.

**Prevention:**
- Before any decomposition, create a centralized translations file (expand `lib/translations.ts`) that contains ALL keys from all scattered locations
- Enforce a pattern: every user-facing string must come from the translation system, never be hardcoded
- Add a lint rule or code review checklist: search for Cyrillic/Latin string literals in TSX files that aren't wrapped in translation lookups
- Both locales (ru/uz) must have the same keys -- missing keys should throw a TypeScript error

**Detection:** Switch locale to Uzbek and go through every page. Any Russian text appearing is a missed translation. Any English text is a developer oversight.

**Phase relevance:** Design system phase (establish pattern), then enforced in every subsequent phase.

---

## Moderate Pitfalls

### Pitfall 6: Animation Library Misuse Tanking Mobile Performance

**What goes wrong:** The current codebase uses `motion/react` (Framer Motion) for `whileInView` scroll animations, `AnimatePresence` for modals, and `layoutId` for tab indicators. During a visual overhaul aiming for "warm micro-interactions," developers add entrance animations to every element (service cards, review cards, employee cards). On budget Android phones common in Uzbekistan, this causes visible jank, especially in lists with 20+ service items where each has a staggered `motion.div` with `initial/animate` transitions.

**Prevention:**
- Set a budget: max 3-5 animated elements visible simultaneously
- Use CSS transitions (Tailwind's `transition-*` classes) for simple state changes (hover, focus, color changes)
- Reserve Motion library for: page transitions, modal enter/exit, layout animations, and one hero entrance animation per page
- Use `will-change` sparingly and never on list items
- Test on a throttled CPU (Chrome DevTools -> 4x slowdown) with a business that has 15+ services

**Detection:** Open the tenant page on a mid-range Android phone or with CPU throttling. Scroll through services. If scrolling stutters or cards visibly "pop in" one by one with delay, animations are too heavy.

**Phase relevance:** Every phase that adds animations. Establish the animation budget in the design system phase.

---

### Pitfall 7: Responsive Breakpoint Inconsistency Between Old and New Components

**What goes wrong:** The current codebase uses `lg:` as the primary mobile/desktop breakpoint (1024px). The page has a consistent pattern: single column on mobile, two-column with 380px sidebar on desktop (`lg:grid lg:grid-cols-[1fr_380px]`). If new components use `md:` breakpoints or different column structures, the page will have sections that switch to desktop layout at 768px while others switch at 1024px, creating an awkward "half-mobile half-desktop" state on tablets.

**Prevention:**
- Document breakpoint strategy in the design system: mobile-first, `lg:` (1024px) is the primary breakpoint
- Use `sm:` for minor adjustments only (padding, font sizes)
- Never introduce `md:` breakpoint for layout changes unless explicitly discussed
- Create responsive wrapper components that enforce consistent container widths

**Detection:** Resize browser to 800px width. If some sections show desktop layout while others show mobile layout, breakpoints are inconsistent.

**Phase relevance:** Design system phase (define breakpoint rules) and every component-building phase.

---

### Pitfall 8: Dual Routing Paths Not Tested

**What goes wrong:** BLYSS supports two routing patterns: subdomain routing (`tenant.blyss.uz/ru/...` which rewrites to `/ru/tenant/...`) and direct path routing (`blyss.uz/ru/b/slug/...`). The TenantPage calculates `basePath` differently for each: `/${locale}` for subdomain vs `/${locale}/b/${slug}` for direct. Navigation links (BottomNav, booking links, back buttons) all depend on this. If new components hardcode one path pattern, the other breaks.

**Prevention:**
- Extract `basePath` computation into a shared hook (`useBasePath`) that both routes can use
- Test every navigational element under both routing modes
- For local dev: test both `tenant.localhost:3000` and `localhost:3000/ru/b/tenant`
- The BottomNav already handles this -- use it as the reference implementation

**Detection:** Access the same business via both routing patterns. Click every navigation link (bottom nav tabs, book buttons, back buttons). If any link 404s or redirects incorrectly under one pattern, it is broken.

**Phase relevance:** Any phase that adds or modifies navigation links. Especially the design system/layout phase where BottomNav is rebuilt.

---

### Pitfall 9: Removing External UI Libraries Creates Regression in Edge Cases

**What goes wrong:** The project constraint says "custom Tailwind only -- no external component libraries." The current BookingPage uses `react-spinners` (HashLoader). The LoginModal uses custom animations for enter/exit. Removing dependencies is fine, but the replacements need to handle the same edge cases: body scroll lock when modals are open, focus trapping for accessibility, escape key handling, click-outside-to-close. The current LoginModal has all of these implemented manually. If a new modal component is built from scratch and misses one, the UX regresses.

**Prevention:**
- Before removing any external dependency, catalog every behavior it provides
- The LoginModal is the reference for modal behavior: body scroll lock (line 132-144), escape key (line 185-191), click-outside (line 398-399), enter animation (line 136)
- Build a shared `Modal` primitive component that encapsulates all these behaviors, then use it everywhere
- Test modal behavior on iOS Safari specifically (scroll lock is notoriously tricky on iOS)

**Detection:** Open a modal, try scrolling the background, press Escape, tap outside. If any of these don't work as expected, the behavior is missing.

**Phase relevance:** Design system phase when building primitive components (Modal, Sheet, Dialog).

---

### Pitfall 10: Google Maps Embed API Key Exposure

**What goes wrong:** The current codebase has a Google Maps Embed API key hardcoded in the component JSX (`AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`). During the rebuild, this key might accidentally get committed in a different location, copied to environment variable handling incorrectly, or the referrer restrictions on the API key might not cover new development/staging domains.

**Prevention:**
- Move the API key to an environment variable (`NEXT_PUBLIC_GOOGLE_MAPS_KEY`) during the rebuild
- Ensure the Google Cloud Console has HTTP referrer restrictions set for production, staging, and development domains
- This is a quick-win cleanup to include in the first phase

**Detection:** Check the codebase for any hardcoded API key strings. Verify the Google Maps embed loads on all environments.

**Phase relevance:** First phase (design system/foundations).

---

## Minor Pitfalls

### Pitfall 11: Dark Mode Styles Lingering From Current Code

**What goes wrong:** The project explicitly states "light mode only for now," but the current codebase has extensive `dark:` variants on almost every element (`dark:bg-zinc-900`, `dark:text-zinc-100`, `dark:border-zinc-800`). During the rebuild, developers might copy-paste these dark mode classes into new components out of habit, adding dead code that inflates the CSS bundle and creates maintenance burden.

**Prevention:**
- Establish in the design system: no `dark:` variants in new components
- Set up a lint rule or grep check to flag `dark:` prefixes in new code
- When copying patterns from old components, strip dark mode classes

**Detection:** Search new component files for `dark:` prefix. Any occurrences should be flagged.

**Phase relevance:** Every phase. Easy to enforce from the start.

---

### Pitfall 12: Image Optimization Regression

**What goes wrong:** The current TenantPage uses raw `<img>` tags for all images (cover photos, gallery, employee avatars) instead of Next.js `<Image>`. This is likely intentional (images come from external GCS URLs), but during the rebuild if someone "improves" this by switching to `next/image` without proper `remotePatterns` configuration, images will break or require additional Next.js config changes.

**Prevention:**
- If keeping `<img>` tags, add `loading="lazy"` and explicit `width`/`height` or `aspect-ratio` for CLS prevention
- If switching to `next/image`, update `next.config.ts` with proper `remotePatterns` for the GCS domain
- Document the decision either way in the design system

**Detection:** Images not rendering, or console errors about unoptimized images.

**Phase relevance:** Phase where the photo gallery and hero sections are rebuilt.

---

### Pitfall 13: Losing Scroll Position and Section Tracking

**What goes wrong:** The current TenantPage has an `IntersectionObserver` that tracks which section (services, team, reviews, about) is visible and highlights the corresponding sticky tab. It also has `scroll-mt-16` on each section for proper scroll-to offset. If the new design changes the sticky header height or introduces new sections without adding them to the observer, the tab highlighting breaks or scrolls to the wrong position (content hidden behind the sticky header).

**Prevention:**
- When changing sticky header height, update all `scroll-mt-*` values to match
- Add new sections to the IntersectionObserver's section map
- Consider making the scroll offset dynamic (read from the actual sticky header height)

**Detection:** Click each tab in the sticky nav. If the section starts with content hidden behind the header, scroll margin is wrong. If the active tab indicator doesn't update while scrolling, the observer is broken.

**Phase relevance:** Phase where the tenant page layout and tab navigation are rebuilt.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Design system / foundations | Color token regression (#4), breakpoint inconsistency (#7), dark mode cruft (#11) | Define tokens, breakpoint rules, and no-dark-mode rule before any component work |
| Tenant page decomposition | Booking flow breakage (#1), translation scattering (#5), scroll tracking (#13) | Extract booking intent hook and centralize translations BEFORE splitting components |
| Booking flow redesign | Auth cookie breakage (#3), server action boundary issues | Test full OTP flow in incognito after every change; never move `actions.ts` |
| Loading states / polish | Skeleton mismatch (#2), animation performance (#6) | Update skeletons in same PR as layout changes; set animation budget |
| Navigation / layout | Dual routing paths (#8), BottomNav regression | Test both subdomain and path routing; extract `useBasePath` hook |
| Modal / overlay components | Missing edge case behaviors (#9), iOS scroll lock | Build shared Modal primitive with full behavior checklist |
| Photo gallery / images | Image optimization regression (#12), CLS from lazy loading | Decide img vs next/image early; add proper dimensions |

## Sources

- [Booking UX Best Practices to Boost Conversions](https://ralabs.org/blog/booking-ux-best-practices/) -- booking-specific UX patterns
- [Top UI/UX Mistakes in Travel Booking Apps](https://miracuves.com/blog/top-ui-ux-mistakes-travel-booking-platforms/) -- booking platform pitfalls
- [5 Frontend Migration Risks You Need to Know](https://houseofangular.io/5-frontend-migration-risks-you-need-to-know/) -- frontend rewrite risks
- [Software Rewrite Strategy: Why 90% Fail](https://www.amazingcto.com/why-rewrites-fail-and-how-to-be-successful/) -- rewrite failure patterns
- [5 Best Practices for Preventing Chaos in Tailwind CSS](https://evilmartians.com/chronicles/5-best-practices-for-preventing-chaos-in-tailwind-css) -- Tailwind consistency
- [Don't Use Tailwind for Your Design System](https://sancho.dev/blog/tailwind-and-design-systems) -- Tailwind design system pitfalls
- [A Guide to Frontend Migrations](https://frontendmastery.com/posts/frontend-migration-guide/) -- incremental migration strategy
- Direct codebase analysis of `TenantPage.tsx` (1800 lines), `BookingPage.tsx`, `LoginModal.tsx`, `actions.ts`, `middleware.ts`, `loading.tsx`, `BottomNav.tsx`, `translations.ts`
