# Architecture

**Analysis Date:** 2026-02-24

## Pattern Overview

**Overall:** Next.js 16 App Router with multi-tenant subdomain architecture and i18n support

**Key Characteristics:**
- Multi-tenant system where each business operates on a subdomain (e.g., `salon-name.blyss.uz`)
- Dynamic locale routing with two languages: Russian (ru, default) and Uzbek (uz)
- Server and client component separation with explicit `'use client'` and `'use server'` boundaries
- Signed HMAC-SHA256 authentication for API communication with backend
- Cookie-based session management with automatic token refresh on 401
- Real-time location-based features (geolocation, reverse geocoding, distance calculation)

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interactions
- Location: `app/components/` (25 components across 8 domains: auth, bookings, browse, business, download, hero, layout, reviews, stats, ui, venues)
- Contains: React components, forms, modals, sections, navigation
- Depends on: Locale context, location context, translations, lucide-react icons, tailwindcss styling
- Used by: Page components

**Page/Route Layer:**
- Purpose: Server-side data fetching, metadata generation, route logic
- Location: `app/[locale]/` and `app/[locale]/[tenant]/` dynamic routes
- Contains: Page components (*.tsx), loading states, layout wrappers
- Depends on: API layer (signedFetch), tenant resolution, locale validation, actions
- Used by: Next.js router, browser navigation

**Domain Logic Layer (Server Actions):**
- Purpose: Encapsulate business logic, API calls, authentication, session management
- Location: `app/[locale]/[tenant]/actions.ts`, `app/[locale]/[tenant]/rate/actions.ts`, `app/[locale]/rate/actions.ts`
- Contains:
  - **Auth**: sendOtp, verifyOtp, registerUser, getAuthStatus, logout, refreshTokens
  - **Bookings**: getAvailableSlots, getSlotEmployees, createBooking, getMyBookings, cancelBooking
  - **Utility**: getDistance, reverseGeocode, setBookingIntent, getBookingIntent
- Depends on: signedFetch, cookies API, validator patterns
- Used by: Client components via form actions, effects

**API Layer:**
- Purpose: HTTP communication with external backend API
- Location: `lib/api.ts`, `app/api/nearest/route.ts`
- Contains:
  - `signedFetch()`: HMAC-SHA256 signed requests with timestamp headers
  - `generateSignature()`: HMAC-SHA256 signature generation
  - Route handlers: nearest businesses endpoint
- Depends on: crypto, Next.js fetch API, environment variables
- Used by: Server actions, route handlers, page components

**Context & State Layer:**
- Purpose: Provide app-wide context for locale, location, theme
- Location: `lib/locale-context.tsx`, `lib/location-context.tsx`, `app/components/ThemeProvider.tsx`
- Contains:
  - LocaleProvider: Supplies current locale to all components via context
  - LocationProvider: Manages user geolocation (Google Geolocation API fallback to Tashkent)
  - ThemeProvider: Dark mode toggle with sessionStorage persistence
- Depends on: React context, Google APIs, sessionStorage
- Used by: All components, layouts

**Configuration & Utilities:**
- Purpose: Tenant resolution, locale validation, translations
- Location: `lib/tenant.ts`, `lib/i18n.ts`, `lib/translations.ts`
- Contains:
  - Subdomain extraction and tenant slug validation
  - Locale type guards and constants
  - Bilingual translation strings (Russian/Uzbek)
- Depends on: Request headers API, type system
- Used by: Layouts, pages, components

**Public Resources:**
- Purpose: Static assets and metadata
- Location: `public/`
- Contains: Favicons, OG images, SVG icons, logo, manifest
- Used by: SEO, branding

## Data Flow

**Homepage Load Flow:**

1. Browser requests `https://blyss.uz/ru`
2. Root layout (`app/layout.tsx`) initializes global metadata, fonts, theme/location providers
3. Locale layout (`app/[locale]/layout.tsx`) validates locale param, extracts from URL, wraps with LocaleProvider
4. Home page (`app/[locale]/page.tsx`) executes server-side:
   - Calls `getAuthStatus()` to check if user is logged in (reads access token from cookies)
   - Generates locale-specific metadata
   - Renders static components (Navbar, HeroSection, NearestBusinesses, ForBusinessSection, BrowseByCitySection)
5. Browser renders with client components (SearchBar, UserMenu with LoginModal)
6. LocationProvider initializes on mount: checks sessionStorage cache → tries Google Geolocation API → falls back to Tashkent center

**Tenant Page Load Flow:**

1. Browser requests `https://salon.blyss.uz/ru` (business subdomain)
2. Tenant context extracted from `Host` header via `getTenant()`
3. Subdomain validation: checks against RESERVED_SUBDOMAINS list (www, app, admin, api, cdn, static, mail)
4. If not tenant request, redirects to `/${locale}`
5. If tenant request, page component (`app/[locale]/[tenant]/page.tsx`) fetches:
   - Business data: `signedFetch(/public/businesses/{slug}/services)`
   - Returns: business info, photos, services, employees with multilingual names
6. Renders TenantPage with business details, photo gallery, service list
7. Client-side interactions (SearchBar, ServiceSelector) can trigger `setBookingIntent()`

**Booking Creation Flow:**

1. User selects services → `setBookingIntent(businessId, serviceIds)` saves to cookies (30 min TTL)
2. Clicks "Book" → navigates to `/{locale}/{tenant}/booking`
3. Page component validates intent exists, fetches business data again
4. Renders BookingPage with date picker, time slots, employee selection
5. User selects date → calls `getAvailableSlots(businessId, date, serviceIds)`
6. User selects time → calls `getSlotEmployees(businessId, date, serviceIds, startTime)`
7. User confirms → calls `createBooking()` which:
   - Reads access token from cookies
   - POSTs to `${API_URL}/public/businesses/{id}/bookings-v2`
   - If 401 (expired token): calls `refreshTokens()` → retries once
   - On success: clears booking intent, shows confirmation
   - On 429: shows "too many requests" message

**Authentication Flow:**

1. User clicks "Login" → LoginModal opens (`'use client'`)
2. User enters phone → clicks "Send Code" → calls `sendOtp(phoneNumber)`
3. Server action calls API, gets delivery_method (sms/telegram), sets timer
4. User enters OTP → auto-calls `verifyOtp(phoneNumber, otpCode)`
5. If existing user: API returns tokens → `setAuthCookies()` stores access/refresh tokens + user info
6. If new user: API returns needs_registration=true → shows registration form
7. User submits name → calls `registerUser(otpId, phone, firstName, lastName)`
8. API creates user, returns tokens → `setAuthCookies()`
9. Component calls `onSuccess()` → modal closes, page refreshes

**Token Refresh Flow:**

- Any action that gets 401 response calls `refreshTokens()`
- Reads refresh_token from cookies
- POSTs to `${API_URL}/public/refresh-token` with signed headers
- On success: updates both access_token and refresh_token cookies
- Used in: createBooking, getAuthStatus, getMyBookings, cancelBooking

## Key Abstractions

**Tenant Context:**
- Purpose: Identify which business/tenant the current request is for
- Examples: `lib/tenant.ts` exports `getTenant()`, `getSubdomainFromHost()`, `getTenantUrl()`
- Pattern: Reads from request headers (server-side only), validates against reserved list, returns {slug, isTenant}

**Signed API Communication:**
- Purpose: Authenticate requests to backend API with HMAC-SHA256 signatures
- Examples: `lib/api.ts` with `signedFetch()`, `generateSignature()`
- Pattern: Timestamp + HMAC(body + timestamp) in `x-timestamp` and `x-signature` headers
- Usage: All `/public/*` endpoints require this signature

**Locale System:**
- Purpose: Provide bilingual (ru/uz) content across the app
- Examples: `lib/i18n.ts` with LOCALES constant, type guard, `lib/locale-context.tsx` with provider
- Pattern: Locale extracted from URL param, validated, wrapped with LocaleProvider, accessed via `useLocale()` in client components
- Translations live in `lib/translations.ts` as const object

**Location Tracking:**
- Purpose: Get user's current location for distance-based features
- Examples: `lib/location-context.tsx` with LocationProvider
- Pattern: Try Google Geolocation API → cache in sessionStorage → fall back to Tashkent center
- Accessed via `useLocation()` hook, revalidated every hour

**Booking Intent:**
- Purpose: Persist selected services/business across navigation
- Examples: `setBookingIntent()` and `getBookingIntent()` in actions
- Pattern: JSON stored in cookie with 30-minute TTL
- Validated on booking page — if missing, redirects to home

## Entry Points

**Web Entry Point:**
- Location: `app/layout.tsx`
- Triggers: All HTTP requests to the application
- Responsibilities:
  - Load Google fonts (Geist Sans/Mono)
  - Initialize global CSS and Tailwind
  - Set up root metadata for SEO
  - Provide ThemeProvider and LocationProvider to all children
  - Inject color-scheme script to prevent flash of wrong theme

**Locale Routing Entry:**
- Location: `app/[locale]/layout.tsx`
- Triggers: Any request to `/{locale}/*`
- Responsibilities:
  - Validate locale param is in LOCALES ('ru', 'uz')
  - Redirect to DEFAULT_LOCALE ('ru') if invalid
  - Wrap children with LocaleProvider

**Tenant Routing Entry:**
- Location: `app/[locale]/[tenant]/page.tsx`
- Triggers: Requests to subdomain (e.g., salon.blyss.uz/ru)
- Responsibilities:
  - Extract tenant from host header via getTenant()
  - Validate tenant matches URL param
  - Fetch business data via signedFetch
  - Generate metadata (title, OG images, schema.org)
  - Render business profile

**API Route Entry:**
- Location: `app/api/nearest/route.ts`
- Triggers: GET `/api/nearest?lat={lat}&lng={lng}`
- Responsibilities:
  - Generate HMAC signature for backend request
  - Fetch nearest businesses (radius 1000m, max 50 results)
  - Return JSON response

## Error Handling

**Strategy:** Fail gracefully with fallbacks; log errors; show user-friendly messages

**Patterns:**

1. **Fetch Failures:**
   - Try/catch around all API calls
   - Log error to console with context (e.g., `[getBusinessData] 500 Server Error:`)
   - Return null or empty array (don't throw)
   - Page shows "not found" or empty state

2. **Authentication Errors:**
   - 401 response → attempt token refresh once
   - Refresh fails → clear all auth cookies → return unauthenticated state
   - Components show LoginModal or guest view

3. **Rate Limiting:**
   - 429 response on business page → show "too many requests" message
   - 429 on sendOtp → show timer, enable resend after wait_seconds
   - Handled in sendOtp/verifyOtp with wait_seconds returned from API

4. **Validation Errors:**
   - Phone number: format validation in component, backend validates length
   - OTP: numeric input only, length must be 5
   - Tenant slug: regex validation before making API calls (`validateSlug()`)
   - Locale: type guard with `isValidLocale()`, never trusts user input

5. **Geolocation Failures:**
   - Browser refuses permission → fall back to Tashkent center
   - Google API fails → fall back to Tashkent center
   - No logging (silent failure acceptable for location)

6. **Cookie Issues:**
   - SessionStorage unavailable (private browsing) → ignore gracefully
   - Cookies domain mismatch → handled by browser, cookie not sent
   - Production uses `.blyss.uz` domain, dev uses no domain (localhost)

## Cross-Cutting Concerns

**Logging:**
- Pattern: `console.error()` and `console.log()` with prefixed context tags like `[functionName]`
- Examples: `console.error('[getBusinessData] 500:', text)`, `console.log('[setAuthCookies] cookie options:', {...})`
- Used for debugging API failures, auth flow, booking creation

**Validation:**
- Phone numbers: 9-digit Uzbek format (998 prefix added), validated with regex
- Tenant slugs: lowercase alphanumeric + hyphens (3-50 chars), regex check before API calls
- OTP: exactly 5 numeric digits, enforced with `inputMode="numeric"` and maxLength
- Names: Unicode letters, spaces, hyphens, apostrophes (via `\p{L}` Unicode property)
- Dates: ISO format (YYYY-MM-DD), passed as query params to API
- Services/employees: IDs are strings from API, arrays validated by length

**Authentication:**
- Stateless: tokens stored in httpOnly cookies
- Access token: short-lived (24 hour max), sent in Authorization header
- Refresh token: long-lived (30 days), used only to refresh access token
- On every 401: automatic refresh attempt once, then fail if still 401
- On page load: `getAuthStatus()` verifies token is still valid by calling `/public/me`
- Logout: deletes all three cookies (access, refresh, user data)

**Internationalization (i18n):**
- Locale extracted from URL first segment: `/{locale}/...`
- Provider wraps all children, calls `document.documentElement.lang = locale`
- Components access via `useLocale()` hook
- Translations are const object with ru/uz keys
- No dynamic loading — all strings bundled in app
- Search/filter logic supports searching in both languages

**Styling:**
- Tailwind CSS v4 for all components
- Dark mode: class-based via data-color-scheme attribute
- Responsive: mobile-first, `md:` breakpoint for desktop
- Theme colors: primary color from business (optional), black/white fallback
- CSS custom properties for gradient blobs and theme colors
- All components use Tailwind utilities, no additional CSS files

**Performance:**
- Next.js caching: ISR (revalidate: 60) on business data fetch
- No-store on location fetch (always fresh for distance calculation)
- Geolocation cached in sessionStorage (1-hour TTL)
- Static components: HeroSection, ForBusinessSection, BrowseByCitySection
- Image optimization: Next.js Image component with remotePatterns whitelist
- Gzip compression: handled by Next.js/hosting provider

**Security:**
- HMAC-SHA256 signatures on all API requests (prevent tampering)
- Strict CSP header (restrictive frame-ancestors, script-src, style-src)
- Cookies: httpOnly + secure (prod only) + sameSite=lax + domain=.blyss.uz (prod only)
- No sensitive data in logs (tokens never logged)
- Path traversal prevention: tenant slug validation before API calls
- XSS prevention: all user input escaped by React, no dangerouslySetInnerHTML except for CSP/schema.org

---

*Architecture analysis: 2026-02-24*
