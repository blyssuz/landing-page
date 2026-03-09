# External Integrations

**Analysis Date:** 2026-03-09

## APIs & External Services

**Blyss Backend API:**
- Primary backend for all business data, bookings, auth, and reviews
- Base URL: `NEXT_PUBLIC_API_URL` env var (prod: `https://api.blyss.uz`, dev: `http://localhost:3001`)
- Auth: HMAC-SHA256 signature via `X-Timestamp` + `X-Signature` headers
- Client: Custom `signedFetch()` in `lib/api.ts`
- Endpoints consumed (all via server actions in `app/[locale]/[tenant]/actions.ts`):
  - `GET /public/businesses/{slug}/services` - Business data, services, employees, photos
  - `GET /public/businesses/{slug}/reviews` - Business reviews
  - `GET /public/businesses/nearest` - Nearest businesses by geo
  - `GET /public/businesses` - All businesses (for sitemap)
  - `GET /public/businesses/{id}/available-slots-v2` - Available booking slots
  - `GET /public/businesses/{id}/slot-employees` - Employee availability for slot
  - `POST /public/businesses/{id}/bookings-v2` - Create booking (requires JWT)
  - `POST /public/send-otp` - Send OTP for login
  - `POST /public/verify-otp` - Verify OTP code
  - `POST /public/register` - Register new user
  - `POST /public/refresh-token` - Refresh JWT tokens
  - `GET /public/me` - Current user profile (requires JWT)
  - `GET /public/my-bookings` - User's bookings (requires JWT)
  - `PATCH /public/my-bookings/{id}/cancel` - Cancel booking (requires JWT)
  - `GET /public/reviews/{token}` - Get review by token (in `app/[locale]/rate/actions.ts`)
  - `POST /public/reviews/{token}` - Submit review
  - `POST /instagram/auth` - Instagram OAuth callback (in `app/[locale]/instagram/callback/page.tsx`)

**Google Geolocation API:**
- Purpose: Determine user's location without browser geolocation permission
- Endpoint: `https://www.googleapis.com/geolocation/v1/geolocate`
- API Key: Hardcoded in `lib/location-context.tsx` (public API key)
- Fallback: Tashkent center coordinates (41.2995, 69.2401)
- Caching: sessionStorage with 1-hour TTL

**OpenStreetMap Nominatim:**
- Purpose: Reverse geocoding (lat/lng to human-readable address)
- Endpoint: `https://nominatim.openstreetmap.org/reverse`
- Auth: None (public API, User-Agent: `blyss.uz`)
- Used in: `app/[locale]/[tenant]/actions.ts` `reverseGeocode()` server action
- Caching: Next.js `revalidate: 86400` (24 hours)

**Telegram Bot API:**
- Purpose: Send visit notifications to a Telegram chat when users visit the site
- Endpoint: `https://api.telegram.org/bot{TOKEN}/sendMessage`
- Auth: `TELEGRAM_BOT_TOKEN` env var
- Chat: `TELEGRAM_CHAT_ID` env var
- Used in: `app/api/visit/route.ts`
- Data sent: Location coordinates, page URL, IP, user agent, referrer, timestamp

**Instagram Graph API (OAuth Callback):**
- Purpose: Handle Instagram OAuth redirect for business owners connecting their accounts
- Landing page acts as the OAuth redirect URI at `/instagram/callback`
- Forwards authorization code + business ID to `{API_URL}/instagram/auth`
- Used in: `app/[locale]/instagram/callback/page.tsx`

## Data Storage

**Databases:**
- None directly - all data comes from the Blyss Backend API

**Client-side Storage:**
- sessionStorage: User location cache (`blyss_location` key, 1-hour TTL in `lib/location-context.tsx`)
- sessionStorage: Visit tracking flag (`blyss_visit_sent` key in `lib/location-context.tsx`)
- Cookies (set via server actions in `app/[locale]/[tenant]/actions.ts`):
  - `blyss_access_token` - JWT access token (24h, httpOnly, secure in prod, domain: `.blyss.uz`)
  - `blyss_refresh_token` - JWT refresh token (30d, httpOnly, secure in prod, domain: `.blyss.uz`)
  - `blyss_user` - Serialized user info (365d, NOT httpOnly, readable by client)
  - `blyss_booking_intent` - Booking intent before login (30min)

**File Storage:**
- None - images served from backend API URLs or `picsum.photos` placeholders

**Caching:**
- Next.js `cache: 'no-store'` on most API calls (real-time data)
- Next.js `revalidate: 86400` on Nominatim reverse geocoding
- Client sessionStorage for geolocation (1-hour TTL)

## Authentication & Identity

**Auth Provider:**
- Custom OTP-based authentication via Blyss Backend API
  - Flow: Phone number -> OTP (SMS or Telegram) -> Verify -> JWT tokens
  - Implementation: Server actions in `app/[locale]/[tenant]/actions.ts`
  - UI: `app/components/auth/LoginModal.tsx` (client component)
  - Token refresh: Automatic retry on 401 responses with refresh token
  - Registration: Inline after OTP verification if user is new (first name required, last name optional)
  - Phone format: +998 prefix (Uzbekistan), 9-digit local number

**API Authentication (to backend):**
- HMAC-SHA256 signature: All server-to-API requests signed with `API_SECRET`
  - Signature = HMAC-SHA256(body + timestamp, API_SECRET)
  - Headers: `X-Timestamp` (unix seconds), `X-Signature` (hex digest)
  - Implementation: `lib/api.ts` `signedFetch()` and `generateSignature()`
- JWT Bearer token: Added to `Authorization` header for authenticated user requests

## Monitoring & Observability

**Error Tracking:**
- None (console.error only)

**Logs:**
- `console.log` / `console.error` throughout server actions
- Verbose debug logging in `getMyBookings()`, `setAuthCookies()` (includes cookie options, response status)
- Visit tracking notification via Telegram Bot API (`app/api/visit/route.ts`)

**Analytics:**
- Custom visit reporting to Telegram chat (location, page, IP, user agent)
- No third-party analytics (no Google Analytics, Plausible, etc.)

## CI/CD & Deployment

**Hosting:**
- Docker container (self-hosted or cloud)
- `docker-compose.yml` maps port 9999 -> 3000
- Container: `blyss-uz-app`

**CI Pipeline:**
- Not detected in this repository

**Docker Build:**
- Multi-stage build: `Dockerfile`
  - Stage 1 (`deps`): Install dependencies with Bun
  - Stage 2 (`builder`): Build Next.js app with Bun
  - Stage 3 (`runner`): Serve standalone output with Node.js
- Base image: `oven/bun:1-alpine`
- Production user: `nextjs` (non-root, UID 1001)

## Environment Configuration

**Required env vars:**
- `API_SECRET` - HMAC signing key for backend API calls (critical)
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `TELEGRAM_BOT_TOKEN` - For visit notifications
- `TELEGRAM_CHAT_ID` - For visit notifications

**Optional env vars:**
- `API_URL` - Alternative API URL used in Instagram callback page
- `TUNNEL_TENANT` - Cloudflare tunnel tenant override for local development
- `NODE_ENV` - Controls cookie secure flag and domain settings

**Secrets location:**
- `.env` file (not committed to git)
- `docker-compose.yml` references `.env` via `env_file`

## Webhooks & Callbacks

**Incoming:**
- `GET /instagram/callback` - Instagram OAuth redirect URI
  - Receives: `code` (auth code), `state` (business ID), `error` (if denied)
  - Forwards to backend: `POST {API_URL}/instagram/auth`
  - Location: `app/[locale]/instagram/callback/page.tsx`

**Outgoing:**
- Visit notifications via Telegram Bot API
  - Triggered on: Every new page visit (once per session)
  - Sends: Location, page URL, IP, user agent, referrer, timestamp
  - Location: `app/api/visit/route.ts`, triggered from `lib/location-context.tsx`

## Internal API Routes

**`GET /api/nearest`** (`app/api/nearest/route.ts`):
- Proxy to backend `GET /public/businesses/nearest`
- Adds HMAC signature headers
- Params: `lat`, `lng` (query string)
- Purpose: Client-side nearest businesses fetching (avoids exposing API_SECRET)

**`POST /api/visit`** (`app/api/visit/route.ts`):
- Records site visits by sending notifications to Telegram
- Body: `{ lat, lng, page }`
- Captures: IP, user agent, referer from headers

---

*Integration audit: 2026-03-09*
