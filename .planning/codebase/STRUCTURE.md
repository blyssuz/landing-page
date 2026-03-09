# Codebase Structure

**Analysis Date:** 2026-03-09

## Directory Layout

```
landing-page/
├── app/                        # Next.js App Router pages, components, API routes
│   ├── [locale]/               # Locale-scoped routes (uz, ru)
│   │   ├── [tenant]/           # Subdomain tenant pages
│   │   │   ├── booking/        # Booking flow page
│   │   │   ├── bookings/       # User's bookings list page
│   │   │   ├── location/       # Map/location page
│   │   │   ├── rate/           # Review/rating page
│   │   │   └── [...catchAll]/  # Catch-all redirect for unknown sub-paths
│   │   ├── b/[slug]/           # Path-based business access (non-subdomain)
│   │   │   ├── booking/        # Booking flow (path-based)
│   │   │   ├── bookings/       # User's bookings (path-based)
│   │   │   └── location/       # Map/location (path-based)
│   │   ├── instagram/callback/ # Instagram OAuth callback
│   │   └── rate/               # Standalone rating page (non-tenant)
│   ├── api/                    # Next.js API routes
│   │   ├── nearest/            # Proxy: nearest businesses by geolocation
│   │   └── visit/              # Visit tracking via Telegram
│   ├── components/             # Shared React components
│   │   ├── auth/               # Login modal, user menu
│   │   ├── bookings/           # Bookings list component
│   │   ├── browse/             # Browse by city/region
│   │   ├── business/           # For-business CTA section
│   │   ├── download/           # Download app section
│   │   ├── hero/               # Hero section, search bar, gradient blobs
│   │   ├── layout/             # Navbar, Footer, BottomNav
│   │   ├── reviews/            # Review card, reviews section
│   │   ├── stats/              # Animated counters, stats section
│   │   ├── ui/                 # Generic UI primitives (Button, PillButton, StarRating)
│   │   └── venues/             # Venue cards, carousels, sections
│   ├── globals.css             # Global styles, CSS custom properties, animations
│   ├── layout.tsx              # Root layout (fonts, ThemeProvider, LocationProvider)
│   ├── manifest.ts             # PWA manifest
│   ├── robots.ts               # robots.txt generation
│   └── sitemap.ts              # Dynamic sitemap generation
├── data/                       # Static data files for landing page
│   ├── cities.ts               # Regions and service categories
│   ├── reviews.ts              # Sample review data
│   ├── stats.ts                # Platform statistics
│   └── venues.ts               # Sample venue data (placeholder)
├── lib/                        # Shared utilities and context providers
│   ├── api.ts                  # HMAC-signed fetch wrapper
│   ├── i18n.ts                 # Locale constants and validation
│   ├── locale-context.tsx      # React Context for current locale
│   ├── location-context.tsx    # React Context for user geolocation
│   ├── tenant.ts               # Tenant detection from request headers
│   └── translations.ts         # UI string translations (ru/uz)
├── public/                     # Static assets (favicons, icons, OG images)
├── middleware.ts               # Next.js middleware (subdomain routing, locale)
├── next.config.ts              # Next.js configuration (standalone, headers, images)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── Dockerfile                  # Multi-stage Docker build (Bun + standalone)
├── docker-compose.yml          # Docker Compose config
├── postcss.config.mjs          # PostCSS config (TailwindCSS)
└── eslint.config.mjs           # ESLint configuration
```

## Directory Purposes

**`app/[locale]/[tenant]/`:**
- Purpose: All pages for a business accessed via subdomain (e.g., `big-bro.blyss.uz`)
- Contains: Server Component pages, Client Component feature pages, Server Actions
- Key files: `page.tsx` (main business page), `TenantPage.tsx` (main client component, ~1800 lines), `actions.ts` (all server actions for auth, booking, data fetching)

**`app/[locale]/b/[slug]/`:**
- Purpose: Path-based business access (e.g., `blyss.uz/ru/b/big-bro-4829d9b06ecc2552`)
- Contains: Thin page wrappers that extract business ID from slug and reuse tenant components
- Key files: `page.tsx` (reuses `TenantPage` component from `[tenant]/`)

**`app/[locale]/rate/` and `app/[locale]/[tenant]/rate/`:**
- Purpose: Review/rating pages triggered by review links sent to customers
- Contains: Token-based review form (independent of auth)
- Key files: `page.tsx`, `RatingPage.tsx` (client component), `actions.ts` (getReview, submitReview)

**`app/components/`:**
- Purpose: All reusable React components, organized by feature domain
- Contains: Client Components (`'use client'`), some pure presentational components
- Key files: `layout/BottomNav.tsx`, `layout/Navbar.tsx`, `venues/NearestBusinesses.tsx`, `auth/LoginModal.tsx`, `bookings/BookingsList.tsx`

**`app/api/`:**
- Purpose: Server-side API route handlers for browser-to-server communication
- Contains: Two routes: nearest business proxy and visit tracking
- Key files: `nearest/route.ts`, `visit/route.ts`

**`lib/`:**
- Purpose: Core shared utilities used across server and client code
- Contains: API signing, i18n config, React Contexts, tenant detection, translations
- Key files: `api.ts` (HMAC signing), `tenant.ts` (subdomain detection), `translations.ts` (all UI strings)

**`data/`:**
- Purpose: Static/seed data for the main landing page
- Contains: Hardcoded venue listings, city/region data, sample reviews, platform stats
- Key files: `cities.ts` (14 regions with service categories), `venues.ts` (placeholder data using picsum.photos)

**`public/`:**
- Purpose: Static assets served directly
- Contains: Favicons (multiple sizes), OG image, SVG logos
- Key files: `og-image.png`, `icon-192.png`, `icon-512.png`, `logo.svg`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout (fonts, providers, global CSS)
- `app/[locale]/layout.tsx`: Locale layout (locale validation, LocaleProvider)
- `app/[locale]/page.tsx`: Landing/home page
- `app/[locale]/[tenant]/page.tsx`: Tenant business page (subdomain access)
- `app/[locale]/b/[slug]/page.tsx`: Business page (path-based access)
- `middleware.ts`: Request interceptor for subdomain routing

**Configuration:**
- `next.config.ts`: Standalone output, security headers, image remote patterns
- `tsconfig.json`: TypeScript config with `@/*` path alias
- `postcss.config.mjs`: TailwindCSS via `@tailwindcss/postcss`
- `eslint.config.mjs`: ESLint config
- `Dockerfile`: Multi-stage build using Bun

**Core Logic:**
- `lib/api.ts`: HMAC-SHA256 signed fetch for all backend API calls
- `lib/tenant.ts`: Subdomain extraction and tenant validation
- `lib/i18n.ts`: Locale type definitions and validation
- `lib/translations.ts`: All UI translation strings
- `app/[locale]/[tenant]/actions.ts`: Primary Server Actions (auth, booking, data)
- `app/[locale]/[tenant]/TenantPage.tsx`: Main tenant business UI (~1800 lines)

**Styling:**
- `app/globals.css`: CSS custom properties, animation keyframes, utility classes
- TailwindCSS 4 applied via PostCSS (no tailwind.config file -- uses CSS-first config)

**SEO:**
- `app/sitemap.ts`: Dynamic sitemap including all businesses from API
- `app/robots.ts`: Search engine directives
- `app/manifest.ts`: PWA manifest

**Testing:**
- No test files exist in this codebase

## Naming Conventions

**Files:**
- Page routes: `page.tsx` (Next.js convention)
- Loading states: `loading.tsx` (Next.js convention)
- Client Components: PascalCase (e.g., `TenantPage.tsx`, `BookingPage.tsx`, `RatingPage.tsx`, `LocationMap.tsx`)
- Server Actions: `actions.ts`
- API routes: `route.ts`
- Utilities/config: camelCase (e.g., `api.ts`, `tenant.ts`, `i18n.ts`)
- Context providers: kebab-case with `-context` suffix (e.g., `locale-context.tsx`, `location-context.tsx`)
- Static data: camelCase (e.g., `cities.ts`, `venues.ts`)

**Directories:**
- Route segments: kebab-case or Next.js dynamic segments (`[locale]`, `[tenant]`, `[slug]`, `[...catchAll]`)
- Component groups: lowercase, grouped by feature domain (e.g., `auth/`, `hero/`, `venues/`, `ui/`)

**Components:**
- Named exports preferred: `export function ComponentName()` or `export const ComponentName`
- Default exports only for page components (`export default async function Page()`)

## Where to Add New Code

**New Tenant Sub-Page (e.g., `/gallery`):**
- Create route: `app/[locale]/[tenant]/gallery/page.tsx` (Server Component)
- Create client component: `app/[locale]/[tenant]/gallery/GalleryPage.tsx` (if interactive)
- Create loading skeleton: `app/[locale]/[tenant]/gallery/loading.tsx`
- If path-based access needed: mirror at `app/[locale]/b/[slug]/gallery/page.tsx`
- Add Server Action if needed: extend `app/[locale]/[tenant]/actions.ts` or create `gallery/actions.ts`

**New Landing Page Section:**
- Create component: `app/components/{feature-domain}/{SectionName}.tsx`
- Import in `app/[locale]/page.tsx`
- Add translations to `lib/translations.ts`

**New Shared Component:**
- UI primitive (button, input): `app/components/ui/{ComponentName}.tsx`
- Feature-specific: `app/components/{domain}/{ComponentName}.tsx`
- Use barrel export if grouping related components (see `app/components/venues/index.ts`)

**New API Route:**
- Create handler: `app/api/{route-name}/route.ts`
- Use `signedFetch()` from `@/lib/api` for backend API calls

**New Server Action:**
- Add to `app/[locale]/[tenant]/actions.ts` if tenant-related
- Create new `actions.ts` in the relevant route directory for page-specific actions
- Always mark file with `'use server'` directive at top

**New Utility:**
- Add to `lib/{name}.ts`
- Use `@/{path}` import alias

**New Static Data:**
- Add to `data/{name}.ts`
- Export typed constants

**New Translation Keys:**
- Add to `lib/translations.ts` following the existing `{ ru: string; uz: string }` pattern
- Or use inline translation objects (`const T = { ru: {...}, uz: {...} }`) for page-specific strings (pattern used in `bookings/page.tsx`, `BottomNav.tsx`)

## Special Directories

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (by `npm run build`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: Project planning and codebase analysis documents
- Generated: No (manual/tool-generated)
- Committed: Yes

**`public/`:**
- Purpose: Static files served at root URL
- Generated: No
- Committed: Yes

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in `.gitignore`)

---

*Structure analysis: 2026-03-09*
