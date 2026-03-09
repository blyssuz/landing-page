# Testing Patterns

**Analysis Date:** 2026-03-09

## Test Framework

**Runner:**
- No test framework configured
- No test runner dependency in `package.json` (no jest, vitest, playwright, or cypress)
- No test configuration files found (no `jest.config.*`, `vitest.config.*`, `playwright.config.*`)

**Assertion Library:**
- None installed

**Run Commands:**
```bash
# No test commands available
# package.json scripts: dev, build, start, lint
```

## Test File Organization

**Location:**
- No test files exist anywhere in the project
- No `__tests__/` directories
- No `*.test.*` or `*.spec.*` files

**Naming:**
- Not established

**Structure:**
- Not established

## Test Structure

**No tests exist.** The following sections describe patterns that SHOULD be adopted based on the codebase structure.

### Recommended Test Setup

Given this is a Next.js 16 project with TypeScript, the recommended approach:

```bash
# Install vitest + React Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

**Recommended config (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

## Mocking

**Framework:** Not established

**What Would Need Mocking:**
- `signedFetch()` from `lib/api.ts` (HMAC-signed API calls)
- Next.js `cookies()` from `next/headers` (used in server actions `app/[locale]/[tenant]/actions.ts`)
- Next.js `headers()` from `next/headers` (used in `lib/tenant.ts`)
- `next/navigation` (`redirect`, `useRouter`, `usePathname`)
- Browser APIs: `sessionStorage`, `IntersectionObserver`, `navigator.geolocation`
- External fetch calls: Google Geolocation API, Nominatim API, Telegram Bot API

**Recommended Pattern for Server Actions:**
```typescript
// Mock signedFetch for server action tests
vi.mock('@/lib/api', () => ({
  signedFetch: vi.fn(),
}))

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
  headers: vi.fn(() => new Map()),
}))
```

## Fixtures and Factories

**Test Data:**
- Static mock data already exists in `data/` directory:
  - `data/venues.ts`: Mock venue objects with the `Venue` interface
  - `data/reviews.ts`: Mock review objects with the `Review` interface
  - `data/cities.ts`: Region/city data with `Region` and `ServiceLink` interfaces
  - `data/stats.ts`: Stats data
- These can serve as test fixtures

**Key Interfaces to Create Factories For:**
- `BusinessData` (defined in `app/[locale]/[tenant]/page.tsx`)
- `MultilingualText` (`{ uz: string, ru: string }`)
- `Service`, `Employee`, `Photo`, `Review` (redefined across multiple files)

## Coverage

**Requirements:** None enforced

**Current Coverage:** 0% -- no tests exist

## Test Types

**Unit Tests (highest priority):**
- `lib/i18n.ts`: `isValidLocale()` function
- `lib/tenant.ts`: `getSubdomainFromHost()`, `isValidTenantSlug()`, `isReservedSubdomain()`, `getTenantUrl()`
- `lib/api.ts`: `generateSignature()` function
- `middleware.ts`: Locale detection and subdomain rewriting logic
- Server actions in `app/[locale]/[tenant]/actions.ts`: `validateSlug()`, auth cookie management
- Helper functions in `app/components/auth/LoginModal.tsx`: `formatPhoneDisplay()`, `extractDigits()`, `validateFirstName()`
- `app/[locale]/b/[slug]/page.tsx`: `extractBusinessId()` slug parsing

**Integration Tests (medium priority):**
- API routes: `app/api/nearest/route.ts`, `app/api/visit/route.ts`
- Server actions end-to-end: `sendOtp`, `verifyOtp`, `createBooking` (with mocked signedFetch)
- Middleware routing: subdomain to path rewriting

**E2E Tests:**
- Not configured
- Recommended framework: Playwright (good Next.js integration)
- Critical flows to test: tenant page load, service selection, booking flow, OTP login

## Testable Pure Functions

These functions are pure or near-pure and easiest to test first:

| Function | File | What It Does |
|---|---|---|
| `isValidLocale()` | `lib/i18n.ts` | Checks if string is 'uz' or 'ru' |
| `getSubdomainFromHost()` | `lib/tenant.ts` | Extracts subdomain from hostname |
| `isValidTenantSlug()` | `lib/tenant.ts` | Validates tenant slug format |
| `isReservedSubdomain()` | `lib/tenant.ts` | Checks reserved subdomain list |
| `getTenantUrl()` | `lib/tenant.ts` | Constructs full tenant URL |
| `generateSignature()` | `lib/api.ts` | Creates HMAC-SHA256 signature |
| `formatPhoneDisplay()` | `app/components/auth/LoginModal.tsx` | Formats phone digits for display |
| `extractDigits()` | `app/components/auth/LoginModal.tsx` | Strips non-digit chars from string |
| `extractBusinessId()` | `app/[locale]/b/[slug]/page.tsx` | Parses business ID from URL slug |
| `slugify()` | `app/components/venues/NearestBusinesses.tsx` | Converts business name to URL slug |
| `secondsToTime()` | `app/[locale]/[tenant]/TenantPage.tsx` | Converts seconds to HH:MM string |

## Linting as Quality Gate

**Current quality enforcement is lint-only:**

```bash
npm run lint    # ESLint with Next.js config (core-web-vitals + typescript)
```

ESLint config at `eslint.config.mjs` enforces:
- Next.js core web vitals rules
- TypeScript type-checking rules
- Standard Next.js patterns (Image component usage, link behavior, etc.)

## Recommended Test Addition Strategy

1. **Phase 1:** Add vitest, create test for pure utility functions in `lib/`
2. **Phase 2:** Test server actions with mocked fetch/cookies
3. **Phase 3:** Add component tests for `app/components/ui/` (Button, PillButton, StarRating)
4. **Phase 4:** Add Playwright for critical user flows (tenant page, booking)

---

*Testing analysis: 2026-03-09*
