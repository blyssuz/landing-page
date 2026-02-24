# External Integrations

**Analysis Date:** 2026-02-24

## APIs & External Services

**Blyss Backend API:**
- Service: Custom REST API at `https://api.blyss.uz` (production) or `http://localhost:3001` (development)
- SDK/Client: Native fetch with HMAC-SHA256 signature middleware
- Auth: HMAC-SHA256 signature using `API_SECRET` env var, Bearer token for user endpoints
- Endpoints:
  - `/public/businesses/nearest` - GET nearest venues by lat/lng
  - `/public/businesses/{slug}/services` - GET business services and distance
  - `/public/businesses/{slug}/available-slots-v2` - GET available appointment slots
  - `/public/businesses/{slug}/slot-employees` - GET employees for slot
  - `/public/businesses/{slug}/bookings-v2` - POST create booking
  - `/public/send-otp` - POST send OTP to phone
  - `/public/verify-otp` - POST verify OTP code
  - `/public/register` - POST register new user
  - `/public/me` - GET authenticated user profile
  - `/public/refresh-token` - POST refresh access token
  - `/public/my-bookings` - GET user bookings
  - `/public/my-bookings/{id}/cancel` - PATCH cancel booking
  - `/public/reviews/{token}` - GET/POST review submission
  - `/instagram/auth` - POST Instagram OAuth callback handler

**Google Fonts API:**
- Service: Google Fonts CDN (https://fonts.gstatic.com)
- Usage: Font delivery for Geist Sans and Geist Mono families
- Auth: None (public CDN)

**Google APIs:**
- Service: https://www.googleapis.com
- Usage: Appears in CSP connect-src; likely for reCAPTCHA or Maps API
- Auth: API key (if reCAPTCHA) - not visible in codebase, likely in environment config
- Frames allowed from: https://www.google.com

**OpenStreetMap Nominatim API:**
- Service: https://nominatim.openstreetmap.org/reverse
- Usage: Reverse geocoding (lat/lng to address)
- Implementation: `reverseGeocode()` in `app/[locale]/[tenant]/actions.ts`
- Auth: User-Agent header required ('blyss.uz')
- Caching: 24-hour revalidation

**Instagram OAuth:**
- Service: Instagram Graph API OAuth flow
- Implementation: `app/[locale]/instagram/callback/page.tsx`
- Auth flow:
  1. User redirected to Instagram authorization
  2. Instagram redirects back with `code` parameter
  3. Backend processes code at `/instagram/auth` endpoint
  4. Returns Instagram username on success
- State parameter: Passes business_id through OAuth state
- Error handling: User-friendly Uzbek-language messages

**Picture Service:**
- Service: https://picsum.photos
- Usage: Placeholder images in remote image patterns
- Auth: None (public service)

## Data Storage

**Databases:**
- Not detected - Data persists on backend Blyss API (Firestore based on project context)
- No direct database connection from frontend

**File Storage:**
- Not detected - Avatar/media handling delegated to backend API

**Caching:**
- Server-side: Next.js revalidation (24h for reverse geocode, no-store for API calls)
- Client-side: React component state and browser cache headers via CSP

## Authentication & Identity

**Auth Provider:**
- Custom OTP-based implementation on Blyss Backend API

**Implementation:**
- OTP sent to phone number (SMS via backend)
- OTP verification returns:
  - New user → `needs_registration=true` with `otp_id`
  - Existing user → `access_token` and `refresh_token`
- User registration with first_name and last_name
- Token refresh: 24-hour access token, 30-day refresh token
- Token storage: HTTP-only secure cookies (`blyss_access_token`, `blyss_refresh_token`)
- User metadata: Separate non-HTTP-only cookie `blyss_user` (365-day expiry)

**Cookie Configuration:**
- Development: Non-secure, sameSite=lax, path=/
- Production: Secure, sameSite=lax, path=/, domain=.blyss.uz (multi-tenant support)

**Auth Actions:**
- `sendOtp()` - Initiate login/registration
- `verifyOtp()` - Validate OTP and get tokens
- `registerUser()` - Complete new user registration
- `getAuthStatus()` - Check if user authenticated
- `getUserProfile()` - Fetch user details from `/public/me`
- `logout()` - Clear all auth cookies
- `refreshTokens()` - Automatic token refresh on 401

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service (Sentry, etc.) configured

**Logs:**
- Browser console via `console.log()` and `console.error()`
- Server-side logging in server actions (`app/[locale]/[tenant]/actions.ts` and `app/api/nearest/route.ts`)
- Debug logs include: API call URLs, response status, error details, cookie operations

## CI/CD & Deployment

**Hosting:**
- Not detected in codebase - Deployment infrastructure not visible
- Likely: Vercel (Next.js native), self-hosted, or cloud provider

**Build Output:**
- Standalone mode (`output: 'standalone'` in next.config.ts) - Can run without `node_modules`
- Suitable for containerized deployment (Docker)

**CI Pipeline:**
- Not detected - No CI/CD configuration files found

## Environment Configuration

**Required Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (public, used in browser)
- `API_SECRET` - HMAC signing key for server actions (secret, server-only)
- `API_URL` - Backend API URL for Instagram callback (can differ from NEXT_PUBLIC_API_URL)
- `NODE_ENV` - Deployment environment (development, production) - controls security settings

**Secrets Location:**
- `.env.local` - Local development (not committed)
- `.env.production` - Production secrets (should be managed by deployment platform)
- Environment variables via deployment platform (e.g., Vercel env vars, Docker secrets, K8s secrets)

## Webhooks & Callbacks

**Incoming Webhooks:**
- `/[locale]/instagram/callback` - Instagram OAuth callback
  - Query params: `code`, `state` (business_id), `error`
  - Handled as SSR page component

**Outgoing Webhooks:**
- Not detected - Frontend initiates requests only, no outbound webhooks

## API Integration Patterns

**Authentication:**
- Signed requests via HMAC-SHA256 (`signedFetch()` in `lib/api.ts`)
- Headers: `X-Timestamp`, `X-Signature`, `X-Signature` (case-insensitive in API design)
- Bearer token for authenticated endpoints: `Authorization: Bearer {accessToken}`

**Error Handling:**
- HTTP status codes drive UX decisions (401 triggers refresh, 404/410 for expired reviews)
- API returns error object with `error` and `error_code` properties
- Specific codes: `NO_TOKEN`, `not_found`, `expired`, `already_submitted`, `unknown`

**Data Format:**
- Request bodies: JSON via `Content-Type: application/json`
- Response format: JSON
- Date format: ISO string (date parameter in slots queries)
- Time format: Seconds from midnight (stored in `start_time`)

**Caching Strategy:**
- Most API calls: `cache: 'no-store'` (real-time data)
- Reverse geocoding: `next: { revalidate: 86400 }` (24-hour cache)

---

*Integration audit: 2026-02-24*
