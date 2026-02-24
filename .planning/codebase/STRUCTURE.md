# Codebase Structure

**Analysis Date:** 2026-02-24

## Directory Layout

```
tenant_blyss_uz/
├── app/                              # Next.js App Router - pages, components, API routes
│   ├── layout.tsx                   # Root layout - fonts, metadata, providers
│   ├── globals.css                  # Global Tailwind directives and custom properties
│   ├── robots.ts                    # robots.txt generation
│   ├── sitemap.ts                   # sitemap.xml generation
│   ├── manifest.ts                  # PWA manifest
│   ├── [locale]/                    # Locale-gated routes (ru, uz)
│   │   ├── layout.tsx               # Locale provider, validation
│   │   ├── page.tsx                 # Homepage: hero, search, nearest businesses
│   │   ├── [tenant]/                # Multi-tenant routes (subdomain)
│   │   │   ├── page.tsx             # Business profile page
│   │   │   ├── [tenant]/TenantPage.tsx  # Client component (large, 51KB)
│   │   │   ├── booking/
│   │   │   │   ├── page.tsx         # Booking form page (date, time, services)
│   │   │   │   ├── BookingPage.tsx  # Client component (interactive form)
│   │   │   │   └── loading.tsx      # Loading skeleton
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx         # User's bookings list
│   │   │   │   ├── BookingsUserInfo.tsx
│   │   │   │   ├── BookingsLoginPrompt.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── location/
│   │   │   │   ├── page.tsx         # Location map view
│   │   │   │   ├── LocationMap.tsx  # React Leaflet map component
│   │   │   │   └── loading.tsx
│   │   │   ├── rate/
│   │   │   │   ├── page.tsx         # Rating form (visit feedback)
│   │   │   │   ├── RatingPage.tsx   # Client component
│   │   │   │   ├── actions.ts       # Rating submission
│   │   │   │   └── loading.tsx
│   │   │   ├── actions.ts           # All server actions (auth, bookings, utilities)
│   │   │   ├── [...catchAll]/       # Fallback for unmapped routes
│   │   │   │   └── page.tsx         # Redirects to home
│   │   │   └── loading.tsx          # Skeleton for tenant page
│   │   ├── b/                       # Short URL routes (bookings without subdomain)
│   │   │   └── [slug]/
│   │   │       ├── booking/
│   │   │       └── bookings/
│   │   ├── rate/                    # Rating without tenant context
│   │   │   ├── page.tsx
│   │   │   ├── RatingPage.tsx
│   │   │   ├── actions.ts
│   │   │   └── loading.tsx
│   │   └── instagram/               # Instagram integration
│   │       └── callback/            # OAuth callback (unused currently)
│   ├── api/                         # API routes (backend integrations)
│   │   └── nearest/
│   │       └── route.ts             # GET /api/nearest?lat&lng - proxy to backend
│   └── components/                  # Reusable React components
│       ├── ThemeProvider.tsx        # Dark mode toggle provider
│       ├── auth/                    # Authentication UI
│       │   ├── LoginModal.tsx       # OTP-based login (use client)
│       │   └── UserMenu.tsx         # User dropdown menu
│       ├── layout/                  # Layout components
│       │   ├── Navbar.tsx           # Top navigation bar
│       │   ├── Footer.tsx           # Footer section
│       │   └── BottomNav.tsx        # Mobile bottom navigation
│       ├── hero/                    # Hero section components
│       │   ├── HeroSection.tsx      # Main hero with background
│       │   ├── SearchBar.tsx        # Dual input search (services + location)
│       │   └── GradientBlobs.tsx    # Background gradient animations
│       ├── business/                # Business section
│       │   └── ForBusinessSection.tsx  # CTA for businesses
│       ├── browse/                  # Browse by location section
│       │   ├── BrowseByCitySection.tsx
│       │   └── CountryTabs.tsx      # Tabs for regions
│       ├── venues/                  # Venue cards and listings
│       │   ├── VenueCard.tsx        # Single business card
│       │   ├── VenueCarousel.tsx    # Carousel of venues
│       │   ├── VenueSection.tsx     # Generic venue section
│       │   ├── NearestBusinesses.tsx # Location-based nearest list
│       │   └── index.ts             # Barrel export
│       ├── bookings/                # Booking-related UI
│       │   └── BookingsList.tsx     # Display list of bookings
│       ├── reviews/                 # Review section
│       │   ├── ReviewCard.tsx       # Single review display
│       │   └── ReviewsSection.tsx   # Reviews container
│       ├── download/                # App download CTA
│       │   └── DownloadAppSection.tsx
│       ├── stats/                   # Statistics display
│       │   ├── StatsSection.tsx
│       │   └── AnimatedCounter.tsx
│       └── ui/                      # Primitive UI components
│           ├── Button.tsx           # Custom button component
│           ├── PillButton.tsx       # Pill-style button
│           └── StarRating.tsx       # Star rating display
├── lib/                             # Shared utilities and context
│   ├── api.ts                       # HMAC-SHA256 signed fetch
│   ├── tenant.ts                    # Subdomain extraction, validation
│   ├── i18n.ts                      # Locale type definitions
│   ├── locale-context.tsx           # Locale provider (use client)
│   ├── location-context.tsx         # Location provider with geolocation
│   └── translations.ts              # Bilingual strings (ru/uz)
├── data/                            # Static data files
│   ├── cities.ts                    # City/region list
│   ├── venues.ts                    # Sample venue data
│   ├── stats.ts                     # Statistics
│   └── reviews.ts                   # Sample reviews
├── public/                          # Static assets
│   ├── favicon.png, favicon-*.png   # Tab icon variants
│   ├── apple-touch-icon.png         # iOS home screen icon
│   ├── icon-192.png, icon-512.png   # PWA icons
│   ├── og-image.png                 # Open Graph image
│   ├── logo.svg                     # Logo (unused)
│   └── *.svg                        # Other SVG assets
├── .planning/codebase/              # GSD planning documents
│   ├── ARCHITECTURE.md              # Architecture patterns
│   └── STRUCTURE.md                 # This file
├── .git/                            # Git repository
├── .claude/                         # Claude Code metadata
├── .next/                           # Next.js build output (generated)
├── node_modules/                    # Dependencies (generated)
├── .env*                            # Environment variables (not committed)
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc.json                 # Prettier configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Dependency lock file
└── README.md                        # Project documentation
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router routes, pages, and components
- Contains: Page components, layouts, API routes, UI components
- Key files: layout.tsx (root), [locale]/page.tsx (home), [tenant]/page.tsx (business)

**app/[locale]/**
- Purpose: Locale-gated section of the app
- Contains: Locale-specific pages and tenant routes
- Key files: layout.tsx (locale provider), page.tsx (homepage)

**app/[locale]/[tenant]/**
- Purpose: Multi-tenant business pages (subdomain routing)
- Contains: Business profile, booking, user bookings, location, rating pages
- Key files: page.tsx (business profile), TenantPage.tsx (large client component)

**app/components/**
- Purpose: Reusable React components organized by feature
- Contains: 25 components across 10 domains (auth, layout, hero, etc.)
- Key files: LoginModal.tsx, SearchBar.tsx, HeroSection.tsx, TenantPage.tsx

**lib/**
- Purpose: Shared utilities, context providers, configuration
- Contains: API client, tenant resolution, locale system, translations
- Key files: api.ts (signed fetch), tenant.ts (subdomain logic), locale-context.tsx

**data/**
- Purpose: Static data files (cities, venues, reviews, stats)
- Contains: Constant arrays and objects for UI
- Key files: cities.ts, venues.ts, stats.ts, reviews.ts

**public/**
- Purpose: Static assets served directly
- Contains: Icons, images, manifest, SVGs
- Key files: favicon.png, og-image.png, icon-512.png, manifest.webmanifest

**.planning/codebase/**
- Purpose: GSD codebase documentation
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md (planned), TESTING.md (planned)
- Key files: ARCHITECTURE.md, STRUCTURE.md

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root application layout (fonts, metadata, global providers)
- `app/[locale]/page.tsx`: Homepage with hero, search, nearest businesses
- `app/[locale]/[tenant]/page.tsx`: Business profile pages
- `app/api/nearest/route.ts`: Geolocation-based search API endpoint

**Configuration:**
- `tsconfig.json`: TypeScript compiler, path aliases (@/*)
- `next.config.ts`: Next.js config (standalone output, CSP headers, remotePatterns)
- `tailwind.config.ts`: Tailwind CSS configuration
- `package.json`: Dependencies (Next.js 16, React 19, Tailwind, Lucide icons)

**Core Logic:**
- `lib/api.ts`: HMAC-SHA256 signed fetch function
- `lib/tenant.ts`: Subdomain extraction and tenant validation
- `app/[locale]/[tenant]/actions.ts`: Server actions (auth, bookings, utilities)
- `lib/i18n.ts`: Locale type definitions and constants

**Context & Providers:**
- `lib/locale-context.tsx`: Provides current locale to all components
- `lib/location-context.tsx`: Geolocation and caching logic
- `app/components/ThemeProvider.tsx`: Dark mode toggle

**Testing:**
- No test files found (testing not set up yet)

## Naming Conventions

**Files:**
- Page routes: `page.tsx` (Next.js convention)
- Server actions: `actions.ts` (contain `'use server'` directive)
- Client components: Named exports in `ComponentName.tsx`, marked with `'use client'`
- Loading states: `loading.tsx` (Next.js Suspense boundaries)
- Utilities: `camelCase.ts` (api.ts, tenant.ts, i18n.ts)
- Types/interfaces: Defined inline in files where used or in component files

**Directories:**
- Feature-based: `components/auth/`, `components/hero/`, `app/[locale]/[tenant]/`
- Route parameters: Square brackets `[locale]`, `[tenant]`, `[...catchAll]`
- Lowercase with hyphens: `app/api/nearest/route.ts`

**Components:**
- PascalCase for components: `LoginModal`, `SearchBar`, `HeroSection`
- Export pattern: `export const ComponentName = (...) => {...}`
- Props interface: `ComponentNameProps` right above component
- Client directive at top: `'use client'` as first line

**Functions:**
- camelCase for all functions: `getTenant()`, `generateSignature()`, `signedFetch()`
- Server actions: camelCase with action suffix (optional): `sendOtp`, `verifyOtp`
- Handlers: `handle*` prefix: `handleSendCode`, `handleOtpChange`

**Variables:**
- camelCase for all: `phoneDigits`, `otpValues`, `businessData`
- Constants (module-level): UPPER_SNAKE_CASE: `MAIN_DOMAIN`, `RESERVED_SUBDOMAINS`, `DEFAULT_LOCALE`
- State: descriptive names from domain: `loading`, `error`, `timer`

**Types:**
- Interfaces: `interface ComponentProps`, `interface BusinessData`, `interface User`
- Type aliases: `type Locale = 'ru' | 'uz'`, `type TenantSlug = string`
- Enums: Not used; prefer unions for small sets

## Where to Add New Code

**New Feature (e.g., Reviews System):**
- Primary code: `app/[locale]/[tenant]/reviews/page.tsx` (route), `app/components/reviews/ReviewForm.tsx` (component)
- Server actions: `app/[locale]/[tenant]/reviews/actions.ts` (submitReview, getReviews)
- Tests: Create `app/components/reviews/ReviewForm.test.tsx` (when testing added)
- Data models: Type definitions in respective files
- Translations: Add keys to `lib/translations.ts`

**New Component/Module:**
- File location: `app/components/{feature}/{ComponentName}.tsx`
- If feature doesn't exist, create folder: `app/components/{new-feature}/`
- If needs server actions: add to `app/[locale]/[tenant]/actions.ts` or create feature-specific `app/{route}/actions.ts`
- Always include TypeScript types: define Props interface above component
- Mark as `'use client'` if using hooks (useState, useEffect, etc.)

**Utilities & Helpers:**
- Shared utilities: `lib/{utility-name}.ts`
- API-related: Add to `lib/api.ts` or create `lib/api/{feature}.ts`
- Locale/i18n: Add to `lib/translations.ts`
- Validation: Add validation functions to respective `actions.ts` files
- Don't create new context providers unless truly app-wide (LocaleProvider, LocationProvider are sufficient)

**Static Data:**
- City/venue/review data: Add to `data/{entity}.ts`
- Follow existing pattern: export const array with type annotations
- Use multilingual structure if needed: `{ru: 'text', uz: 'text'}`

**Routes:**
- New tenant-specific route: `app/[locale]/[tenant]/{new-route}/page.tsx`
- New global route: `app/[locale]/{new-route}/page.tsx`
- API endpoint: `app/api/{endpoint}/route.ts`
- All routes must support locale parameter via URL segment

**Styling:**
- Use Tailwind classes directly in JSX (no separate CSS files)
- For component-specific styles: use className string
- For complex layouts: use Tailwind's @apply in globals.css (sparingly)
- Dark mode: use `dark:` prefix (e.g., `dark:bg-zinc-900`)
- Responsive: mobile-first with `md:` breakpoint (e.g., `md:flex`)

**Forms:**
- Use server actions for submission (no form libraries like react-hook-form)
- Validation in component and in server action
- Error handling: set local state `[error, setError]`
- Loading: use `useTransition()` or component-level state
- Example: See LoginModal.tsx for multi-step form with validation

## Special Directories

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (automatically by `npm run build`)
- Committed: No (in .gitignore)
- Contents: Compiled pages, functions, static files, build metadata

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)
- Contents: All installed packages

**`.git/`:**
- Purpose: Git version control
- Generated: Yes (by `git init`)
- Committed: Yes (metadata only)
- Contents: Commit history, branches, config

**`.env* files`:**
- Purpose: Environment configuration
- Generated: No (created manually)
- Committed: No (in .gitignore)
- Contents: API_SECRET, NEXT_PUBLIC_API_URL, Google API key
- Usage: Loaded by Next.js at build/runtime
- Never commit secrets here

**`.claude/`:**
- Purpose: Claude Code workspace metadata
- Generated: Yes (by Claude Code)
- Committed: No (in .gitignore)
- Contents: Project settings, history

**`docs/plans/`:**
- Purpose: GSD phase planning documents
- Generated: No (created by humans)
- Committed: Yes
- Contents: Implementation plans, task breakdowns

## Code Organization Principles

1. **Co-location:** Place components, hooks, and logic close to where they're used
   - LoginModal.tsx in `components/auth/` (used across multiple pages)
   - Booking logic in `app/[locale]/[tenant]/actions.ts` (used by booking pages)

2. **Server/Client Separation:** Keep server actions and client components separate
   - `actions.ts` files contain `'use server'` directives
   - Component files contain `'use client'` if they use hooks
   - Pages are server components by default (no directive needed)

3. **Feature Folders:** Group related components by domain, not by type
   - `components/auth/` contains LoginModal, UserMenu
   - `components/hero/` contains HeroSection, SearchBar, GradientBlobs
   - NOT: `components/modals/LoginModal.tsx`, `components/sections/HeroSection.tsx`

4. **Configuration at Root:** Centralize configuration and constants
   - Translations: `lib/translations.ts`
   - Locale rules: `lib/i18n.ts`
   - Tenant rules: `lib/tenant.ts`
   - Environment: `.env.local`, `next.config.ts`

5. **Public vs Private:** Use underscore prefix for internal utilities (discouraged in this codebase)
   - Most functions are exported and used elsewhere
   - No private helper files (would break modularity)

---

*Structure analysis: 2026-02-24*
