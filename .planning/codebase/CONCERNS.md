# Codebase Concerns

**Analysis Date:** 2026-03-09

## Tech Debt

**Hardcoded Google Geolocation API Key:**
- Issue: A Google Geolocation API key is hardcoded directly in client-side code as a string literal
- Files: `lib/location-context.tsx` (line 6)
- Impact: The key is shipped to every browser, making it trivially extractable. Anyone can use this key for their own Google API calls, potentially running up billing. The key cannot be rotated without a code deploy.
- Fix approach: Move to an API route (e.g., `/api/geolocation`) that proxies the Google Geolocation request server-side, keeping the key in an environment variable. Alternatively, use the browser's native `navigator.geolocation.getCurrentPosition()` which requires no API key.

**Massive Single-File Components (TenantPage, BookingPage):**
- Issue: `TenantPage.tsx` is 1,536 lines and `BookingPage.tsx` is 1,349 lines. These monolithic client components contain UI rendering, state management, data formatting, translations, and business logic all in one file.
- Files: `app/[locale]/[tenant]/TenantPage.tsx`, `app/[locale]/[tenant]/booking/BookingPage.tsx`
- Impact: Very difficult to review, test, modify safely, or reuse individual parts. High risk of merge conflicts. Slow IDE performance.
- Fix approach: Extract into sub-components (e.g., `ServiceList`, `EmployeeSelector`, `DatePicker`, `PhotoGallery`, `ReviewsList`). Move translations to `lib/translations.ts`. Move formatting utilities to a shared `lib/format.ts`.

**Duplicate Interface Definitions Across Files:**
- Issue: `MultilingualText`, `Service`, `Employee`, `Photo`, `Review`, `BusinessData` interfaces are copy-pasted across 7+ files with minor variations.
- Files: `app/[locale]/[tenant]/TenantPage.tsx`, `app/[locale]/[tenant]/page.tsx`, `app/[locale]/b/[slug]/page.tsx`, `app/[locale]/[tenant]/booking/page.tsx`, `app/[locale]/b/[slug]/booking/page.tsx`, `app/[locale]/[tenant]/booking/BookingPage.tsx`, `app/components/bookings/BookingsList.tsx`
- Impact: Interfaces drift apart over time, making it easy to introduce type mismatches. Updating a field requires changing 7+ files.
- Fix approach: Create a shared `lib/types.ts` file with canonical interface definitions. Import from there in all consuming files.

**Duplicate `extractBusinessId` Utility Function:**
- Issue: The same `extractBusinessId(slug: string): string` function is defined identically in 4 separate files.
- Files: `app/[locale]/b/[slug]/page.tsx`, `app/[locale]/b/[slug]/location/page.tsx`, `app/[locale]/b/[slug]/booking/page.tsx`, `app/[locale]/b/[slug]/bookings/page.tsx`
- Impact: A bug fix or behavior change must be applied in 4 places.
- Fix approach: Move to `lib/utils.ts` and import from there.

**Duplicate `getBusinessData` / `getBusinessLocation` / `getBusinessInfo` Functions:**
- Issue: Nearly identical async functions that call the same API endpoint (`/public/businesses/{id}/services`) are defined in 7+ server components.
- Files: `app/[locale]/[tenant]/page.tsx`, `app/[locale]/b/[slug]/page.tsx`, `app/[locale]/[tenant]/booking/page.tsx`, `app/[locale]/b/[slug]/booking/page.tsx`, `app/[locale]/[tenant]/bookings/page.tsx`, `app/[locale]/b/[slug]/bookings/page.tsx`, `app/[locale]/[tenant]/location/page.tsx`, `app/[locale]/b/[slug]/location/page.tsx`
- Impact: Changes to API response handling or error recovery must be replicated across all files. Inconsistent error handling between copies (some log errors, some do not).
- Fix approach: Create a shared server-side data fetching module (e.g., `lib/data.ts`) with a single `getBusinessData(slugOrId)` function.

**Parallel Route Structure Duplication (`[tenant]` vs `b/[slug]`):**
- Issue: The entire `app/[locale]/[tenant]/` route tree is essentially mirrored at `app/[locale]/b/[slug]/` with minor differences (subdomain lookup vs slug-based lookup). Pages for booking, bookings, location, and rate all have near-identical copies.
- Files: `app/[locale]/[tenant]/` (entire directory), `app/[locale]/b/[slug]/` (entire directory)
- Impact: Every feature or bugfix for tenant pages must be applied in two places. The `b/[slug]` routes import components from `[tenant]` via deep relative paths like `../../../[tenant]/booking/BookingPage`.
- Fix approach: Unify into a single route structure by extracting tenant resolution to a layout or middleware step, or create shared page components that accept a `businessId` prop regardless of how it was resolved.

**Inline Translations Scattered Across Components:**
- Issue: Translation objects (`T`, `ERROR_CODES`, month names, etc.) are defined inline in individual components rather than centralized.
- Files: `app/components/auth/LoginModal.tsx` (lines 20-80), `app/components/bookings/BookingsList.tsx` (lines 46-69), `app/[locale]/[tenant]/bookings/page.tsx` (lines 14-31), `app/components/layout/BottomNav.tsx` (lines 12-15), `app/components/auth/UserMenu.tsx` (lines 20-31), `app/[locale]/[tenant]/booking/BookingPage.tsx` (lines 99+)
- Impact: No single source of truth for translations. Easy to have inconsistent wording across the app. Adding a new language requires editing dozens of files.
- Fix approach: Consolidate all translations into `lib/translations.ts` (which already exists but only covers a subset of the app).

**Excessive Debug Logging in Server Actions:**
- Issue: `getMyBookings` has 8 `console.log` statements, `setAuthCookies` logs cookie options including NODE_ENV, and `api/nearest/route.ts` has a bare `console.log('data', data)` that logs entire API responses.
- Files: `app/[locale]/[tenant]/actions.ts` (lines 38, 443, 448, 453, 457, 459, 467, 478), `app/api/nearest/route.ts` (line 33)
- Impact: Noisy server logs in production. The `console.log('data', data)` in the nearest route could log large payloads. Cookie option logging could expose configuration details.
- Fix approach: Remove debug `console.log` statements. Keep `console.error` for actual errors only. Use structured logging if detailed tracing is needed.

**Placeholder/Dummy Data Files Still Present:**
- Issue: Static data files contain fake US-based venue data (e.g., "Urban Cuts Barbershop, 123 Main St, New York"), reviews mentioning "Fresha" (a competitor), and inflated stats ("1 billion+ appointments"). These appear to be cloned from a template.
- Files: `data/venues.ts`, `data/reviews.ts`, `data/stats.ts`
- Impact: If these are rendered anywhere in production, they present false/misleading content. The venue images point to `picsum.photos` (placeholder image service).
- Fix approach: Either remove these files entirely if unused, or replace with real Blyss data. Check all imports to confirm if they are still referenced.

**Footer Contains Untranslated English Placeholder Content:**
- Issue: The `Footer` component has all English text ("Get the app", "Careers", "Help", "Blog", "Privacy"), placeholder `href="#"` links, and references to social platforms (Facebook, Twitter, LinkedIn) that may not be relevant.
- Files: `app/components/layout/Footer.tsx`
- Impact: If rendered, it breaks the bilingual (ru/uz) user experience. The language selector at the bottom is a non-functional `<select>` element.
- Fix approach: Either translate the footer content and wire up real links, or hide/remove the footer until it is ready.

## Security Considerations

**Hardcoded API Key Exposed to Client:**
- Risk: The Google Geolocation API key `AIzaSyAJGY6AKA5S0eJQsPJCU0BqAanlhgpvJU0` is embedded directly in client-side JavaScript (`lib/location-context.tsx`). This key is included in the browser bundle and can be extracted by anyone viewing the page source.
- Files: `lib/location-context.tsx` (line 6)
- Current mitigation: None visible. The key has no HTTP referrer restrictions mentioned.
- Recommendations: Move the geolocation call behind a server-side API route. Set HTTP referrer restrictions on the API key in the Google Cloud Console. Rotate the current key immediately as it has been committed to git history.

**No Input Validation on `/api/nearest` Route:**
- Risk: The `lat` and `lng` query parameters are passed directly to the upstream API without validation (e.g., checking that they are valid numbers within geographic bounds).
- Files: `app/api/nearest/route.ts`
- Current mitigation: Only checks for presence (`if (!lat || !lng)`), not format.
- Recommendations: Validate that `lat` and `lng` are valid floating-point numbers within reasonable bounds (-90 to 90 for lat, -180 to 180 for lng) before forwarding.

**No Rate Limiting on API Routes:**
- Risk: The `/api/nearest` and `/api/visit` routes have no rate limiting. An attacker could flood the visit endpoint to send unlimited Telegram notifications or exhaust the API's nearest-business quota.
- Files: `app/api/nearest/route.ts`, `app/api/visit/route.ts`
- Current mitigation: None.
- Recommendations: Implement rate limiting middleware, or at minimum add IP-based throttling to the visit endpoint.

**No Input Sanitization on Visit Endpoint:**
- Risk: The `/api/visit` route takes user-supplied `lat`, `lng`, and `page` values and embeds them directly in an HTML-formatted Telegram message. While Telegram's `parse_mode: 'HTML'` does some escaping, a crafted `page` value could potentially inject HTML tags into the Telegram message.
- Files: `app/api/visit/route.ts` (lines 22-30)
- Current mitigation: None visible.
- Recommendations: Sanitize or escape all user inputs before embedding in HTML messages. Validate lat/lng are numbers. Limit `page` to URL-safe characters.

**Review Endpoint Calls API Without HMAC Signature:**
- Risk: The `getReview` and `submitReview` server actions in `app/[locale]/rate/actions.ts` call the API using plain `fetch()` instead of `signedFetch()`, bypassing the HMAC authentication layer.
- Files: `app/[locale]/rate/actions.ts` (lines 7, 34)
- Current mitigation: The API endpoint is under `/public/` which may not require HMAC, but this breaks the authentication convention used everywhere else.
- Recommendations: Use `signedFetch()` consistently for all API calls, even to public endpoints, to maintain a uniform security posture and allow the backend to tighten security later.

**Instagram Callback Uses Different Env Var for API URL:**
- Risk: `app/[locale]/instagram/callback/page.tsx` uses `process.env.API_URL` while every other file uses `process.env.NEXT_PUBLIC_API_URL`. If only one is configured, the callback could point to the wrong API endpoint, or the fallback `https://api.blyss.uz` may be used unexpectedly.
- Files: `app/[locale]/instagram/callback/page.tsx` (line 1)
- Current mitigation: None.
- Recommendations: Standardize on a single env var name for the API URL across all files.

**Instagram Callback Has No CSRF Protection:**
- Risk: The Instagram OAuth callback page directly sends the authorization `code` to the backend API without any CSRF token or state validation beyond the `businessId` in the `state` parameter.
- Files: `app/[locale]/instagram/callback/page.tsx`
- Current mitigation: The `state` parameter carries the `businessId`, but there is no verification that the OAuth flow was initiated by the current user.
- Recommendations: Implement a proper CSRF token that is set before the OAuth redirect and verified in the callback.

## Performance Bottlenecks

**No API Response Caching on Main Tenant Page:**
- Problem: The main tenant page (`app/[locale]/[tenant]/page.tsx`) and the `b/[slug]` page both use `cache: 'no-store'` for all API calls, meaning every page visit triggers a fresh API round-trip.
- Files: `app/[locale]/[tenant]/page.tsx` (line 87), `app/[locale]/b/[slug]/page.tsx` (line 75)
- Cause: `cache: 'no-store'` disables Next.js's built-in fetch cache. While this ensures fresh data, it creates unnecessary load on the API for data (business info, services, employees, photos) that changes infrequently.
- Improvement path: Use `next: { revalidate: 60 }` (ISR) for business data fetches, similar to what the booking and location pages already do. Reserve `cache: 'no-store'` for user-specific data only.

**Duplicate API Calls Per Page Load:**
- Problem: The tenant page calls `getBusinessData` once for `generateMetadata` and again for the page component, resulting in two identical API calls per page load.
- Files: `app/[locale]/[tenant]/page.tsx` (lines 82-99, 209), `app/[locale]/b/[slug]/page.tsx` (lines 71-87, 142, 186)
- Cause: Next.js does not share data between `generateMetadata` and the default export by default.
- Improvement path: Next.js deduplicates `fetch` calls within the same render when using the same URL and options. Ensure both calls use identical URLs and cache options so Next.js can deduplicate them, or use `cache()` from `react` to memoize the data function.

**Google Geolocation API Called on Every Session:**
- Problem: The `LocationProvider` calls the Google Geolocation API via a POST request on every new browser session (sessionStorage-based cache, not persistent).
- Files: `lib/location-context.tsx` (lines 46-59, 76-89)
- Cause: Uses `sessionStorage` with 1-hour expiry. Each new tab or session re-triggers the API call.
- Improvement path: Use `localStorage` instead of `sessionStorage` for location caching. The Google Geolocation API is billable per request. Consider using the browser's native `navigator.geolocation` first, falling back to Google Geolocation only if the browser API is denied.

**LocationProvider Wraps Entire App:**
- Problem: The `LocationProvider` is mounted in the root layout, meaning it runs for every single page including rate pages, Instagram callbacks, and other pages that do not need geolocation.
- Files: `app/layout.tsx` (line 132)
- Cause: The provider is unconditionally rendered in the root layout.
- Improvement path: Move the `LocationProvider` to only wrap the pages/layouts that actually need it (the homepage and tenant pages), or make it lazy-initialize so it only calls the API when `useLocation()` is actually consumed.

## Fragile Areas

**Middleware Subdomain Routing:**
- Files: `middleware.ts`, `lib/tenant.ts`
- Why fragile: The middleware performs complex URL rewriting based on hostname parsing. The `getSubdomain` function must handle production (`.blyss.uz`), local dev (`.localhost`), and Cloudflare tunnel environments. The `getTenant()` function in `lib/tenant.ts` duplicates this logic independently, and any mismatch between the two implementations causes routing failures.
- Safe modification: Always test changes against all three environments (production domain, localhost, tunnel). The duplicate guard on line 39 of `middleware.ts` (`if (segments[1] === subdomain)`) prevents double-rewrites but adds complexity.
- Test coverage: No tests exist for middleware routing logic.

**Token Refresh Flow in Server Actions:**
- Files: `app/[locale]/[tenant]/actions.ts` (lines 304-321 for `createBooking`, 349-365 for `getAuthStatus`, 456-470 for `getMyBookings`, 500-514 for `cancelBooking`)
- Why fragile: Every authenticated server action manually implements the same token refresh pattern: make request -> check for 401 -> call `refreshTokens()` -> re-read cookie -> retry request. This pattern is duplicated 4 times with slight variations.
- Safe modification: Extract the retry-on-401 logic into a single `authenticatedFetch` wrapper function. Test the wrapper independently.
- Test coverage: No tests.

**Cookie-Based Auth Across Subdomains:**
- Files: `app/[locale]/[tenant]/actions.ts` (lines 20-43, 423-437)
- Why fragile: Auth cookies are set with `domain: '.blyss.uz'` in production to work across subdomains. The `blyss_user` cookie stores user data as JSON and is `httpOnly: false` (readable by client JS). Cookie deletion on logout must specify the exact same domain, or stale cookies persist.
- Safe modification: Ensure all cookie set/delete operations use consistent options. Test cross-subdomain cookie behavior in staging.
- Test coverage: No tests.

**`actions.ts` as a God Module:**
- Files: `app/[locale]/[tenant]/actions.ts` (567 lines)
- Why fragile: This single file contains all server actions: authentication (OTP, verify, register, refresh, logout), booking CRUD, user profile, distance calculation, reverse geocoding, and booking intent management. Changes to any one concern risk breaking others.
- Safe modification: Avoid editing multiple unrelated functions in the same PR. Consider splitting into `actions/auth.ts`, `actions/booking.ts`, `actions/user.ts`.
- Test coverage: No tests.

## Scaling Limits

**Session Storage for Location:**
- Current capacity: One cached location per browser tab, expiring every hour.
- Limit: Every new browser tab triggers a Google Geolocation API call.
- Scaling path: Move to `localStorage` with longer TTL to reduce API calls. Consider IP-based geolocation on the server to avoid client-side API calls entirely.

**Visit Tracking via Telegram Messages:**
- Current capacity: Each page visit sends a Telegram message via the bot API.
- Limit: Telegram bot API has rate limits (~30 messages/second). Under even moderate traffic, this will fail silently.
- Scaling path: Replace with proper analytics (e.g., Google Analytics, PostHog, or a simple database log). Use the Telegram notification only for significant events, not every page visit.

## Dependencies at Risk

**Placeholder Image Dependency (`picsum.photos`):**
- Risk: The `data/venues.ts` file references images from `https://picsum.photos/`, a free placeholder image service with no SLA.
- Impact: If picsum.photos goes down or changes its URL scheme, venue cards on the landing page would show broken images.
- Migration plan: Replace with actual business images from Google Cloud Storage, or remove the mock data files entirely.

**`next.config.ts` allows images from `picsum.photos`:**
- Risk: The `remotePatterns` config only allows `picsum.photos`, which means real business images from other domains (e.g., Google Cloud Storage) are not configured.
- Files: `next.config.ts` (lines 6-11)
- Impact: Real business avatar/cover images loaded via `next/image` would be blocked. Currently, images use raw `<img>` tags to work around this, losing Next.js image optimization.
- Migration plan: Add the actual image hosting domain to `remotePatterns` and use `next/image` for all images.

## Missing Critical Features

**No Test Suite:**
- Problem: There are zero test files in the project. No unit tests, integration tests, or end-to-end tests exist.
- Blocks: Confident refactoring, safe deployments, regression detection.

**Search Bar is Non-Functional:**
- Problem: The search bar on the homepage (`app/components/hero/SearchBar.tsx`) lets users select a business type and region, but the "Find" button has no `onClick` handler and does nothing. The geolocation obtained from "My location" is stored in state but never used for navigation or filtering.
- Files: `app/components/hero/SearchBar.tsx` (line 238)
- Blocks: Users cannot search for businesses from the homepage.

**No Error Boundaries:**
- Problem: No React error boundaries exist anywhere in the component tree. A runtime error in any client component will crash the entire page with no recovery UI.
- Blocks: Graceful degradation. Users see a white screen on errors.

**Footer Language Selector is Non-Functional:**
- Problem: The language `<select>` in the footer does not have an `onChange` handler. It renders as a static dropdown.
- Files: `app/components/layout/Footer.tsx` (lines 186-189)
- Blocks: Users cannot change language from the footer.

## Test Coverage Gaps

**Entire Codebase Untested:**
- What's not tested: Everything -- middleware routing, server actions (auth, booking, OTP), API routes, components, utility functions, data fetching, cookie management.
- Files: All source files.
- Risk: Any refactoring (especially the recommended consolidation of duplicate code) carries high risk of undetected regressions. The token refresh flow, subdomain routing, and booking creation are the highest-risk areas.
- Priority: High. Start with:
  1. Unit tests for `lib/tenant.ts` (subdomain parsing logic)
  2. Unit tests for `lib/api.ts` (HMAC signature generation)
  3. Integration tests for `middleware.ts` (URL rewriting rules)
  4. Unit tests for server actions in `actions.ts` (at minimum: `refreshTokens`, `verifyOtp`, `createBooking`)

---

*Concerns audit: 2026-03-09*
