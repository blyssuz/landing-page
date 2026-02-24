# Codebase Concerns

**Analysis Date:** 2026-02-24

## Tech Debt

**Empty API_SECRET Fallback:**
- Issue: `lib/api.ts` falls back to empty string if `API_SECRET` env var is missing, silently creating invalid signatures
- Files: `lib/api.ts` (line 3)
- Impact: API calls will fail with cryptic auth errors in non-production environments without clear error message
- Fix approach: Add validation at module load time to throw error if API_SECRET is missing, or provide meaningful fallback message

**Unused Error State Properties:**
- Issue: Rate limiting and OTP retry logic set `wait_seconds` but this isn't validated as a number before using in state
- Files: `app/components/auth/LoginModal.tsx` (lines 215-218, 338-339)
- Impact: Could cause NaN timer values if backend returns unexpected format
- Fix approach: Add explicit number coercion and bounds checking (0 to 300 seconds)

**Console Logging in Production Code:**
- Issue: Multiple `console.log()` and `console.error()` statements left in server actions without environment guards
- Files: `app/[locale]/[tenant]/actions.ts` (line 38), `app/api/nearest/route.ts` (line 33)
- Impact: Sensitive data could leak to logs in production, increases bundle verbosity
- Fix approach: Replace with conditional logging: `if (process.env.NODE_ENV === 'development') console.log(...)`

**String Type Casting Without Validation:**
- Issue: Multiple casts to `string` without validating JSON response structure: `as string`, `as const`, inline type assertions
- Files: `app/[locale]/[tenant]/actions.ts` (lines 176, 176, 211-222, 251, 376-378)
- Impact: Type safety is bypassed; runtime errors if API changes response format
- Fix approach: Create typed response interfaces and validate before casting

## Known Issues

**API_SECRET Not Required at Compile Time:**
- Symptoms: Routes fail at runtime with "Cannot read property 'update' of undefined" when API_SECRET is missing
- Files: `app/api/nearest/route.ts` (line 5 uses `!` non-null assertion)
- Trigger: Deploying without setting API_SECRET env var
- Workaround: Ensure .env is set before deployment; add pre-flight validation in middleware

**OTP Input Auto-Submit Race Condition:**
- Symptoms: User types quickly, code auto-verifies before all digits are visible, then shows error clearing fields
- Files: `app/components/auth/LoginModal.tsx` (lines 278-290)
- Trigger: Pasting OTP code or rapid keyboard input
- Workaround: User can manually click Verify button after code arrives

**Booking State Persistence Across Tenants:**
- Symptoms: When switching between tenant subdomains, saved booking state (date/services) might be retained
- Files: `app/[locale]/[tenant]/booking/BookingPage.tsx` (lines 367-399)
- Trigger: User visits tenantA.blyss.uz, books service, then visits tenantB.blyss.uz — tenantB might show tenantA's selected services
- Workaround: Clear browser LocalStorage when switching tenants
- Fix approach: Namespace booking state key with `businessId`

## Security Considerations

**Insufficient CSP for Script Tags:**
- Risk: CSP allows `script-src 'self' 'unsafe-inline'` which defeats most XSS mitigation
- Files: `next.config.ts` (line 38)
- Current mitigation: React automatic escaping helps, but inline event handlers could be injected
- Recommendations:
  - Remove `'unsafe-inline'` and use nonce-based CSP for Next.js styles
  - Move inline styles to Tailwind only
  - Use CSP nonce generation in middleware

**Unvalidated User Input in Slug Generation:**
- Risk: `slugify()` function converts business names without encoding, could create XSS vectors in URLs
- Files: `app/components/venues/NearestBusinesses.tsx` (lines 30-41)
- Current mitigation: URL encoding happens in href but display might be vulnerable
- Recommendations: Use URL encoding library (URLSearchParams or encodeURIComponent)

**OTP Code Exposure in Browser Memory:**
- Risk: OTP values stored in React state array, could be exposed in memory dumps or devtools
- Files: `app/components/auth/LoginModal.tsx` (lines 112, 267-290)
- Current mitigation: OTP is numeric-only and temporary
- Recommendations: Clear OTP from state immediately after submission, use input refs directly instead of state array

**Missing CSRF Protection on State-Changing Actions:**
- Risk: Server actions don't validate origin or referer for POST operations
- Files: `app/[locale]/[tenant]/actions.ts` (lines 165-184, 267-331)
- Current mitigation: Signed fetch provides some protection via HMAC
- Recommendations: Add explicit CSRF token validation on critical operations (createBooking, registerUser)

**Domain Assumption in Production:**
- Risk: Cookie domain hardcoded to `.blyss.uz` in production, fails if deployed elsewhere
- Files: `app/[locale]/[tenant]/actions.ts` (line 28)
- Current mitigation: Dev environment doesn't set domain
- Recommendations: Make domain configurable via env var, validate against allowed domains

## Performance Bottlenecks

**N+1 Queries on Booking Page:**
- Problem: Each service selection triggers separate `getSlotEmployees` call, then another for slot data
- Files: `app/[locale]/[tenant]/booking/BookingPage.tsx` (multiple useEffect chains)
- Cause: Reactive state management without batching or memoization
- Improvement path:
  - Batch employee queries per date change
  - Use SWR or React Query to deduplicate requests
  - Implement request debouncing

**Lazy-Load All Services on Every Slot Fetch:**
- Problem: `getAvailableSlots` endpoint returns full employee roster even when only checking availability
- Files: Called from `app/[locale]/[tenant]/booking/BookingPage.tsx`
- Cause: No query parameter to skip employee details
- Improvement path: Request employees separately only when needed, not on slot query

**Unoptimized Image Rendering in Carousels:**
- Problem: VenueCarousel loads all business avatar images without lazy loading or responsive sizing
- Files: `app/components/venues/NearestBusinesses.tsx` (lines 48-58)
- Cause: Direct `<img>` tag without Next.js Image optimization
- Improvement path: Use Next.js `<Image>` component with `placeholder="blur"` and responsive sizes

**No Memoization on Expensive Computations:**
- Problem: `formatPrice()`, `getText()`, slot availability calculations re-run on every render
- Files: `app/[locale]/[tenant]/booking/BookingPage.tsx` (lines 326-355)
- Cause: Functions defined inline without useMemo
- Improvement path: Wrap in useMemo with proper dependency arrays

**Synchronous JSON Parsing on User Data:**
- Problem: Cookie reading and JSON parsing happens synchronously on every getAuthStatus call
- Files: `app/[locale]/[tenant]/actions.ts` (lines 386-395)
- Cause: No caching of parsed user data
- Improvement path: Cache parsed user object in module variable or use cookies() with parsing helper

## Fragile Areas

**Middleware Subdomain Logic:**
- Files: `middleware.ts` (lines 30-52)
- Why fragile: Multiple rewrite conditions without clear precedence, easy to break with new routes
- Safe modification: Add unit tests for all subdomain/path combinations before changing matcher
- Test coverage: No tests visible for middleware path rewriting

**Authentication State Management:**
- Files: `app/[locale]/[tenant]/actions.ts` (lines 335-384), `app/components/auth/LoginModal.tsx`
- Why fragile: Token refresh logic duplicated in multiple places (createBooking, getAuthStatus); stale token handling is manual
- Safe modification: Extract token refresh to utility function, use single source of truth for auth state
- Test coverage: No visible tests for token refresh edge cases (expired refresh token, concurrent requests)

**Slug Extraction from URL:**
- Files: `app/[locale]/b/[slug]/booking/page.tsx` (lines 35-38)
- Why fragile: Simple `lastIndexOf('-')` assumes business ID is always at end; breaks if business name contains dashes
- Safe modification: Use proper slug decoding with version number or ULID instead of mixed slugs
- Test coverage: No visible validation tests

**Error Handling in API Routes:**
- Files: `app/api/nearest/route.ts`, multiple server actions
- Why fragile: Silent failures with `catch () { }` blocks that return null
- Safe modification: Create error boundary wrapper with structured logging
- Test coverage: No visible error scenario tests

## Scaling Limits

**Hard-Coded API URL:**
- Current capacity: Single API endpoint
- Limit: No load balancing or failover support
- Scaling path: Make API_URL configurable per environment, add health checks and retry logic

**In-Memory Slot Cache:**
- Current capacity: No caching strategy visible
- Limit: Every slot request hits API, no deduplication for same date/services within 30 seconds
- Scaling path: Implement SWR or React Query with 30-second cache, add request deduplication

**Cookie-Based Auth Tokens:**
- Current capacity: No token rotation or device tracking
- Limit: Single token per domain; can't revoke without clearing all cookies
- Scaling path: Implement token blacklist or use short-lived JWTs with refresh token rotation

**SMS/Telegram OTP Delivery:**
- Current capacity: Delegated to backend API
- Limit: No visible retry or fallback delivery method in frontend
- Scaling path: Add exponential backoff, support multiple OTP channels, implement OTP resend quota

## Dependencies at Risk

**Outdated Leaflet/React-Leaflet:**
- Risk: leaflet 1.9.4 and react-leaflet 5.0.0 are stable but missing recent bug fixes
- Impact: Map rendering issues on certain browsers, memory leaks in map cleanup
- Migration plan: Update to latest versions, test map interactions thoroughly

**Motion Library (formerly Framer Motion):**
- Risk: motion 12.34.0 is recent but not widely tested with Next.js 16 concurrent features
- Impact: Animation frame drops, state sync issues in StrictMode
- Migration plan: Monitor for animation performance issues, consider react-spring as alternative

**React 19.2.3 (Canary):**
- Risk: Latest major version with breaking changes to server component rendering
- Impact: Unexpected behavior with hooks, potential issues with conditional rendering
- Migration plan: Lock version until broader ecosystem adoption, test thoroughly before updating

**No Direct OpenAI/LLM Dependency:**
- Risk: Not applicable (this project doesn't use OpenAI directly)
- Note: Unlike the Telegram bot project (uses gpt-4.1-mini), this is a booking frontend

## Missing Critical Features

**No Rate Limiting on Frontend:**
- Problem: Users can spam OTP requests or booking attempts without local throttling
- Blocks: Cannot prevent accidental double-booking or brute-force OTP guessing
- Improvement: Add exponential backoff (60s, 120s, 300s) on client side

**No Offline Fallback:**
- Problem: Entire app is useless if API is down
- Blocks: Users can't view bookings or check availability
- Improvement: Cache critical data (services, working hours) and show read-only state

**No Service Availability Warnings:**
- Problem: If service has 0 available employees for a date, entire page becomes confusing
- Blocks: Users don't know why they can't select a date (service unavailable vs. business closed)
- Improvement: Show explicit "This service is not available on this date" message

**No Booking Confirmation Email/SMS:**
- Problem: User receives no receipt after booking
- Blocks: Disputes about booking details, no proof of reservation
- Improvement: Send confirmation via backend API, include in booking response

**No Analytics/Error Tracking:**
- Problem: Silent failures in `catch` blocks mean issues go unnoticed
- Blocks: Can't identify common user friction points
- Improvement: Integrate Sentry or similar, add structured error reporting

## Test Coverage Gaps

**Authentication Flow:**
- What's not tested: Complete OTP cycle with token refresh, concurrent login attempts
- Files: `app/components/auth/LoginModal.tsx`, `app/[locale]/[tenant]/actions.ts`
- Risk: Token expiration edge cases could break bookings mid-flow
- Priority: High

**Middleware Routing:**
- What's not tested: All combinations of (locale, subdomain, route) matching
- Files: `middleware.ts`
- Risk: Wrong rewrite rules could expose internal paths or break subdomain routing
- Priority: High

**Server Actions Error Handling:**
- What's not tested: Network timeouts, malformed API responses, concurrent requests
- Files: `app/[locale]/[tenant]/actions.ts`
- Risk: Unhandled errors crash page or create invalid state
- Priority: High

**Booking State Persistence:**
- What's not tested: Cookie expiration, state validation across domain changes
- Files: `app/[locale]/[tenant]/booking/BookingPage.tsx`
- Risk: Corrupted booking state could cause booking failures
- Priority: Medium

**Mobile Responsiveness:**
- What's not tested: Touch interactions, viewport-specific layouts
- Files: All components
- Risk: Touch events might not work on mobile, date/time selection broken
- Priority: Medium

**OTP Input Edge Cases:**
- What's not tested: Paste behavior, rapid typing, backspace from first field, non-numeric input
- Files: `app/components/auth/LoginModal.tsx`
- Risk: Users can't complete login on certain devices
- Priority: Medium

---

*Concerns audit: 2026-02-24*
