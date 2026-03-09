# Architecture

**Analysis Date:** 2026-03-09

## Pattern Overview

**Overall:** Next.js 16 App Router with multi-tenant subdomain routing, server-side data fetching, and HMAC-signed API communication to an external Express.js backend.

**Key Characteristics:**
- Multi-tenant architecture via subdomain-based routing (`{tenant}.blyss.uz` rewrites to `/[locale]/[tenant]/...`)
- Two access paths to businesses: subdomain-based (`{tenant}.blyss.uz`) and path-based (`blyss.uz/{locale}/b/{slug}`)
- Server Components handle data fetching and auth verification; Client Components handle interactivity
- All backend API calls use HMAC-SHA256 signed requests (`X-Timestamp` + `X-Signature` headers)
- Cookie-based JWT authentication with automatic token refresh
- URL-based i18n with two locales: `ru` (default) and `uz`
- Standalone output mode for Docker deployment

## Layers

**Middleware Layer:**
- Purpose: Intercepts all requests to handle subdomain detection, locale injection, and URL rewriting
- Location: `middleware.ts`
- Contains: Subdomain extraction, locale detection, URL rewriting/redirecting logic
- Depends on: `@/lib/i18n` for locale constants
- Used by: Every incoming request (matcher excludes `api`, `_next`, static files)

**Page Layer (Server Components):**
- Purpose: Route entry points that fetch data from the API, verify auth, and pass data to Client Components
- Location: `app/[locale]/page.tsx`, `app/[locale]/[tenant]/page.tsx`, `app/[locale]/b/[slug]/page.tsx`, etc.
- Contains: Data fetching functions, `generateMetadata()` for SEO, server-side auth checks
- Depends on: `@/lib/api` (signedFetch), `@/lib/tenant` (getTenant), `@/lib/i18n`, Server Actions
- Used by: Next.js router

**Server Actions Layer:**
- Purpose: Server-side functions callable from Client Components for mutations and auth operations
- Location: `app/[locale]/[tenant]/actions.ts`, `app/[locale]/[tenant]/rate/actions.ts`, `app/[locale]/rate/actions.ts`
- Contains: Auth (OTP send/verify, register, login, logout, token refresh), booking CRUD, reverse geocode, distance calculation, slot queries
- Depends on: `@/lib/api` (signedFetch), `next/headers` (cookies)
- Used by: Client Components via `'use server'` imports

**Client Component Layer:**
- Purpose: Interactive UI rendered in the browser
- Location: `app/components/`, `app/[locale]/[tenant]/TenantPage.tsx`, `app/[locale]/[tenant]/booking/BookingPage.tsx`, etc.
- Contains: UI rendering, user interactions, animations, state management
- Depends on: Server Actions (for mutations), React Context (locale, location), lucide-react icons, motion
- Used by: Page layer (passed data as props)

**API Route Layer:**
- Purpose: Lightweight server-side API endpoints for browser-initiated requests
- Location: `app/api/nearest/route.ts`, `app/api/visit/route.ts`
- Contains: Proxy to backend API (nearest businesses), visit tracking via Telegram
- Depends on: Backend API (via fetch with HMAC), Telegram Bot API
- Used by: Client Components via fetch

**Library Layer:**
- Purpose: Shared utilities, context providers, and configuration
- Location: `lib/`
- Contains: HMAC signing (`api.ts`), tenant detection (`tenant.ts`), i18n config (`i18n.ts`), translations (`translations.ts`), React Context providers (`locale-context.tsx`, `location-context.tsx`)
- Depends on: Node.js crypto, Next.js headers
- Used by: All other layers

**Static Data Layer:**
- Purpose: Hardcoded seed data for landing page sections (not used in tenant pages)
- Location: `data/`
- Contains: Venue listings (`venues.ts`), city/region data (`cities.ts`), review samples (`reviews.ts`), stats (`stats.ts`)
- Depends on: Nothing
- Used by: Landing page components

## Data Flow

**Tenant Page Load (subdomain access):**

1. Browser requests `big-bro.blyss.uz/ru`
2. `middleware.ts` extracts subdomain `big-bro`, rewrites URL to `/ru/big-bro`
3. `app/[locale]/[tenant]/page.tsx` runs as Server Component
4. Page calls `getTenant()` (reads host header) to verify subdomain matches route param
5. Page calls `getBusinessData(tenantSlug)` using `signedFetch()` to `{API_URL}/public/businesses/{slug}/services`
6. Page calls `getAuthStatus()` which reads cookies and verifies JWT against `{API_URL}/public/me`
7. Page calls `getBusinessReviews(tenantSlug)` for review data
8. Data passed as props to `<TenantPage>` Client Component
9. Client Component renders interactive UI with service selection, booking flow

**Tenant Page Load (path-based access):**

1. Browser requests `blyss.uz/ru/b/big-bro-4829d9b06ecc2552`
2. Middleware adds locale (no subdomain detected)
3. `app/[locale]/b/[slug]/page.tsx` extracts business ID from slug suffix
4. Same data fetching pattern as subdomain access, but no `getTenant()` subdomain verification
5. Reuses same `<TenantPage>` component

**Booking Flow:**

1. User selects services on TenantPage, clicks "Book"
2. `setBookingIntent()` Server Action stores selected service IDs in a cookie
3. User navigated to `/booking` page
4. Booking page reads intent from cookie, fetches fresh business data
5. User picks date/time via `getAvailableSlots()` Server Action
6. User picks employee via `getSlotEmployees()` Server Action
7. If not authenticated, OTP login flow triggered (`sendOtp()` -> `verifyOtp()` -> optionally `registerUser()`)
8. `createBooking()` Server Action sends authenticated request with JWT
9. If JWT expired, automatic refresh via `refreshTokens()` then retry

**Authentication Flow:**

1. `sendOtp(phoneNumber)` -> backend sends SMS via Eskiz API
2. `verifyOtp(phoneNumber, otpCode)` -> returns JWT tokens or `needs_registration`
3. If new user: `registerUser(otpId, phone, firstName, lastName)` -> returns JWT tokens
4. Tokens stored in httpOnly cookies: `blyss_access_token` (24h), `blyss_refresh_token` (30d), `blyss_user` (365d, non-httpOnly)
5. In production, cookies scoped to `.blyss.uz` domain for cross-subdomain access

**State Management:**
- Server state: All business data fetched server-side per request (no caching except `next: { revalidate: 60 }` on some endpoints)
- Client state: React `useState` for UI interactions (service selection, modals, form state)
- Location state: `LocationProvider` React Context, uses Google Geolocation API, caches in sessionStorage (1h TTL)
- Locale state: `LocaleProvider` React Context, derived from URL segment
- Auth state: Cookie-based, verified server-side on each page load via `getAuthStatus()`

## Key Abstractions

**signedFetch:**
- Purpose: Wraps native `fetch()` with HMAC-SHA256 signature headers for backend API authentication
- Location: `lib/api.ts`
- Pattern: Generates timestamp, creates HMAC of `body + timestamp` using `API_SECRET`, attaches `x-timestamp` and `x-signature` headers

**getTenant:**
- Purpose: Server-side tenant detection from request headers
- Location: `lib/tenant.ts`
- Pattern: Reads `host` header, extracts subdomain, returns `{ slug, isTenant }` object

**Server Actions (actions.ts):**
- Purpose: Bridge between Client Components and backend API with cookie management
- Location: `app/[locale]/[tenant]/actions.ts`
- Pattern: `'use server'` functions that handle HMAC signing, JWT cookie management, and automatic token refresh on 401 responses

**MultilingualText:**
- Purpose: Bilingual content representation
- Pattern: `{ uz: string; ru: string }` objects, rendered by accessing `text[locale]`
- Examples: Service names, descriptions, UI translations throughout tenant pages

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Sets up fonts (Geist), global CSS, ThemeProvider, LocationProvider

**Locale Layout:**
- Location: `app/[locale]/layout.tsx`
- Triggers: Every localized page
- Responsibilities: Validates locale, redirects invalid locales, wraps children in LocaleProvider

**Landing Page:**
- Location: `app/[locale]/page.tsx`
- Triggers: Main domain requests (no subdomain)
- Responsibilities: Renders hero, nearest businesses, browse by city, for-business sections

**Tenant Page:**
- Location: `app/[locale]/[tenant]/page.tsx`
- Triggers: Subdomain access to a business
- Responsibilities: Fetches business data, renders TenantPage with services/employees/photos/reviews

**Business Page (path-based):**
- Location: `app/[locale]/b/[slug]/page.tsx`
- Triggers: Direct link access (`blyss.uz/ru/b/{name}-{id}`)
- Responsibilities: Same as tenant page but extracts business ID from URL slug, no subdomain verification

**Middleware:**
- Location: `middleware.ts`
- Triggers: All non-static requests
- Responsibilities: Subdomain detection, locale injection, URL rewriting

**API Routes:**
- Location: `app/api/nearest/route.ts` - Proxies nearest business queries from client
- Location: `app/api/visit/route.ts` - Tracks page visits via Telegram bot notifications

**SEO/Meta:**
- Location: `app/sitemap.ts` - Dynamic sitemap including all tenant pages
- Location: `app/robots.ts` - Search engine directives
- Location: `app/manifest.ts` - PWA manifest

## Error Handling

**Strategy:** Defensive returns with fallback values; no global error boundary.

**Patterns:**
- Server data fetching wraps API calls in try/catch, returns `null` on failure, pages render fallback UI or redirect
- 429 rate limit responses show a dedicated "too many requests" message (tenant page)
- 401 responses trigger automatic token refresh and retry (one attempt) in Server Actions
- API errors logged via `console.error` with `[functionName]` prefix for traceability
- Catch-all route `app/[locale]/[tenant]/[...catchAll]/page.tsx` redirects unknown paths to locale root
- `notFound()` used in path-based business page for missing businesses

## Cross-Cutting Concerns

**Logging:** `console.error` and `console.log` with `[functionName]` prefixes in Server Actions. Some debug logging present (e.g., `console.log('data', data)` in API routes).

**Validation:** Tenant slug validation via regex in `lib/tenant.ts` (`isValidTenantSlug`) and in `actions.ts` (`validateSlug` to prevent path traversal). Locale validation via `isValidLocale()`.

**Authentication:** Cookie-based JWT with automatic refresh. Cookies scoped to `.blyss.uz` in production for cross-subdomain sharing. Auth state verified server-side on page load, not cached.

**SEO:** Rich metadata generation per page (Open Graph, Twitter Cards, JSON-LD structured data). Dynamic sitemap from API. Locale-aware canonical URLs and alternates.

**Security:** HMAC-SHA256 signed API requests, HSTS headers, CSP headers, input validation on slugs, httpOnly cookies for tokens.

**Theming:** CSS custom properties (`--primary`, `--background`, `--foreground`). Per-tenant primary color passed via `style` prop as CSS variable override. Light mode forced by default.

---

*Architecture analysis: 2026-03-09*
