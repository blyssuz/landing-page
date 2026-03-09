# Coding Conventions

**Analysis Date:** 2026-03-09

## Naming Patterns

**Files:**
- React components: PascalCase (`TenantPage.tsx`, `BookingPage.tsx`, `LoginModal.tsx`, `StarRating.tsx`)
- Server actions: camelCase (`actions.ts`)
- Utility/library modules: kebab-case (`locale-context.tsx`, `location-context.tsx`, `i18n.ts`)
- Data files: camelCase (`venues.ts`, `cities.ts`, `reviews.ts`, `stats.ts`)
- Next.js conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`, `middleware.ts`
- API routes: kebab-case directories (`app/api/nearest/route.ts`, `app/api/visit/route.ts`)

**Functions:**
- Regular functions: camelCase (`getBusinessData`, `reverseGeocode`, `validateSlug`)
- React components: PascalCase (`HeroSection`, `BottomNav`, `NearestBusinesses`)
- Server actions: camelCase with verb prefix (`getAuthStatus`, `sendOtp`, `verifyOtp`, `createBooking`, `cancelBooking`)
- Event handlers: `handle` prefix (`handleClose`, `handleSendCode`, `handleOtpChange`, `handlePhoneKeyDown`)

**Variables:**
- Constants: UPPER_SNAKE_CASE for module-level constants (`MAIN_DOMAIN`, `LOCAL_DOMAIN`, `RESERVED_SUBDOMAINS`, `API_URL`, `DAY_ORDER`, `SITE_URL`)
- Translation objects: UPPER_SNAKE_CASE or single uppercase letter (`T`, `UI_TEXT`, `DAY_NAMES`, `ERROR_CODES`, `META`)
- State variables: camelCase (`phoneDigits`, `otpValues`, `deliveryMethod`)
- Boolean state: `is`/`has` prefix (`isVisible`, `isTenant`, `isBookings`, `hasLocale`, `hasHalfStar`)

**Types/Interfaces:**
- PascalCase (`TenantInfo`, `BusinessData`, `MultilingualText`, `UserLocation`)
- Props interfaces: `{ComponentName}Props` suffix (`ButtonProps`, `BottomNavProps`, `LoginModalProps`, `StarRatingProps`)
- No `I` prefix on interfaces

## Code Style

**Formatting:**
- No explicit Prettier config detected; uses ESLint for formatting
- Indentation: 2 spaces
- Semicolons: inconsistent -- some files use them (`app/layout.tsx`, `app/components/ui/Button.tsx`), others omit (`middleware.ts`, `lib/api.ts`, `app/[locale]/[tenant]/actions.ts`). New code should match the file being edited.
- Quotes: single quotes for strings in most files
- Trailing commas: used in multi-line arrays and objects

**Linting:**
- ESLint 9 with flat config: `eslint.config.mjs`
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run via `npm run lint` (calls `eslint` with no args)

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- Target: ES2017
- Module resolution: bundler
- Path alias: `@/*` maps to project root (e.g., `@/lib/i18n`, `@/app/components/layout/BottomNav`)

## Import Organization

**Order:**
1. React/Next.js framework imports (`import { useState } from 'react'`, `import { NextRequest } from 'next/server'`)
2. Third-party libraries (`import { motion } from 'motion/react'`, `import { Star } from 'lucide-react'`)
3. Internal lib/utility imports using `@/` alias (`import { signedFetch } from '@/lib/api'`)
4. Relative component imports (`import { BottomNav } from '@/app/components/layout/BottomNav'`)
5. Type-only imports use `import type` (`import type { Locale } from '@/lib/i18n'`, `import type { Metadata } from 'next'`)

**Path Aliases:**
- Use `@/*` for all non-relative imports: `@/lib/i18n`, `@/app/components/ui/Button`, `@/data/venues`
- Relative imports only for files in the same directory or immediate parent

## Component Patterns

**Server Components (default):**
- Page files (`page.tsx`) are async Server Components that fetch data
- Use `await params` for accessing route params (Next.js 16 pattern)
- Pattern: fetch data in page, pass to client component

```tsx
// Server Component page pattern
export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string; locale: string }>
}) {
  const { tenant, locale: localeParam } = await params
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const data = await fetchData(tenant)
  return <ClientComponent data={data} locale={locale} />
}
```

**Client Components:**
- Marked with `'use client'` directive at file top
- Use hooks for state management (`useState`, `useEffect`, `useRef`, `useCallback`)
- No external state management library; use React context for cross-component state

**UI Components (`app/components/ui/`):**
- Use `React.forwardRef` pattern
- Set `displayName` on forwarded-ref components
- Export as named exports
- Accept `className` prop for style extension
- Build className by concatenating base + variant + size strings

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();
    return <button className={finalClassName} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';
export { Button };
```

**Feature Components:**
- Named exports (not default) for non-page components
- Arrow function syntax for simple presentational components (`export const HeroSection = () => { ... }`)
- Function declaration syntax for components with complex logic (`export function LoginModal({ ... }) { ... }`)

## Server Actions

**Location:** `app/[locale]/[tenant]/actions.ts` (primary), `app/[locale]/rate/actions.ts`

**Pattern:**
- Marked with `'use server'` directive
- Return discriminated unions with `success` boolean and `as const` assertions
- Wrap all external calls in try/catch
- Log errors with `console.error` using bracket-prefixed tags: `[functionName]`
- Return safe fallback values on error (never throw to client)

```tsx
export async function sendOtp(phoneNumber: string) {
  try {
    const response = await signedFetch(`${API_URL}/public/send-otp`, { method: 'POST', body })
    const data = await response.json()
    if (!response.ok) {
      return { success: false as const, error: data.error as string, error_code: data.error_code as string }
    }
    return { success: true as const, delivery_method: (data.delivery_method as string) || 'sms' }
  } catch (error) {
    console.error('[sendOtp] exception:', error)
    return { success: false as const, error: 'Failed to send OTP' }
  }
}
```

**Auth token refresh pattern:** When a 401 is received, attempt token refresh via `refreshTokens()`, then retry the request once.

## Internationalization (i18n)

**Approach:** URL-based locale routing with static translation objects.

**Supported locales:** `'uz'` and `'ru'` (defined in `lib/i18n.ts`)
**Default locale:** `'ru'`

**Translation patterns:**
- Global translations: `lib/translations.ts` -- nested object with `{ key: { ru: string, uz: string } }` structure
- Component-local translations: defined as `const T: Record<Locale, Record<string, string>>` at component top
- UI text maps: `const UI_TEXT: Record<Locale, Record<string, string>>` in large components
- Access via `translations.hero.title[locale]` or `t.loginTitle`
- Template strings for dynamic values: `'{{time}} gacha ochiq'` replaced manually

**Locale context:**
- Server: passed as prop from `params`
- Client: `useLocale()` hook from `lib/locale-context.tsx`

## Error Handling

**Server Actions:**
- Always try/catch, never throw
- Return `{ success: false, error: string, error_code?: string }` on failure
- Log with `console.error('[functionName] description:', error)`

**API Route Handlers:**
- Return `NextResponse.json({ error: 'message' }, { status: code })` for errors
- Catch-all try/catch returns 500

**Data Fetching (Server Components):**
- Return `null` on fetch failure, check in caller
- Pattern: `{ data: T | null, status: number }` return type

**Client-Side:**
- Display error via state variable, clear on next action
- Use localized error messages via error code lookup tables (`ERROR_CODES`)

## Styling

**Framework:** TailwindCSS 4 via `@tailwindcss/postcss`

**Theme:**
- CSS custom properties in `app/globals.css`: `--background`, `--foreground`, `--primary` (#088395)
- Dark mode via `data-color-scheme` attribute (currently forced to light)
- Custom dark variant: `@custom-variant dark (&:where([data-color-scheme="dark"], [data-color-scheme="dark"] *))`

**Patterns:**
- Utility-first with inline Tailwind classes
- Responsive: mobile-first with `md:`, `lg:`, `xl:` breakpoints
- Dark mode classes always included alongside light: `bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100`
- Custom animations defined in `globals.css` as `@keyframes` + `.animate-*` classes
- No CSS modules or styled-components
- Skeleton loading states use `animate-pulse` with gray placeholder divs

**Color system:**
- Primary: `--primary` / `bg-primary`, `text-primary`
- Zinc scale for dark mode backgrounds
- Gray scale for light mode
- Amber for stars/ratings

## Logging

**Framework:** `console.error` and `console.log` (no logging library)

**Patterns:**
- Server actions: `console.error('[functionName] description:', error)`
- Some debug logging left in with `console.log` (e.g., `app/api/nearest/route.ts` line 33, `actions.ts` getMyBookings)
- No structured logging

## Comments

**When to Comment:**
- Section dividers use `// --- Section Name ---` pattern (e.g., `// --- Types ---`, `// --- Helpers ---`, `// --- Auth actions ---`)
- Inline comments for non-obvious logic
- JSDoc-style `/** */` comments on utility functions in `lib/tenant.ts`
- No strict TSDoc/JSDoc requirement across the codebase

**Code Organization in Large Files:**
- Use section comment dividers: `// --- Phone step ---`, `// --- OTP step ---`, `// --- Register step ---`
- Group related state declarations
- Group event handlers near their usage

## Function Design

**Size:** No enforced limit, but components vary widely. `TenantPage.tsx` is very large (monolithic client component). Most utility functions are small (5-30 lines).

**Parameters:**
- Props destructured in function signature
- Server actions take primitive arguments (strings, numbers, arrays of primitives)
- Optional params use `?` or defaults in destructuring

**Return Values:**
- Server actions: discriminated union `{ success: true, ...data } | { success: false, error: string }`
- Data fetchers: `T | null` or `{ data: T | null, status: number }`
- Components: JSX

## Module Design

**Exports:**
- Named exports preferred throughout
- Default exports only for Next.js page/layout/loading conventions
- Single barrel file exists: `app/components/venues/index.ts`

**Barrel Files:**
- Only `app/components/venues/index.ts` uses barrel pattern
- Most components imported directly from their file path

## Data Layer

**Static Data:** `data/` directory contains mock/seed data (`venues.ts`, `cities.ts`, `reviews.ts`, `stats.ts`) with typed interfaces and exported arrays.

**API Communication:**
- Server-side: `signedFetch()` from `lib/api.ts` (adds HMAC signature headers)
- Client-side: Browser `fetch()` to internal API routes (`/api/nearest`, `/api/visit`)
- No `@tanstack/react-query` or SWR in this project; data fetched in Server Components or via `useEffect`

**Interface Duplication:** The same interfaces (`MultilingualText`, `Service`, `Employee`, `Photo`, `Review`, `BusinessData`) are redefined in multiple page files rather than shared from a central types file.

---

*Convention analysis: 2026-03-09*
