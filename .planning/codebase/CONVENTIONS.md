# Coding Conventions

**Analysis Date:** 2025-02-24

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `HeroSection.tsx`, `LoginModal.tsx`)
- Utilities/helpers: camelCase with `.ts` extension (e.g., `api.ts`, `i18n.ts`)
- Route handlers: lowercase with `.ts` extension (e.g., `route.ts`)
- Actions (server functions): `actions.ts` in the route segment directory
- Barrel files: index files export named exports

**Directories:**
- Components: PascalCase (e.g., `components/auth/`, `components/layout/`)
- Features by domain: lowercase (e.g., `app/[locale]/[tenant]/`)
- Types exported from files where used or in dedicated `lib/` utilities

**Functions:**
- Regular functions: camelCase (e.g., `getDistance`, `validateSlug`, `extractDigits`)
- React components: PascalCase (e.g., `LoginModal`, `HeroSection`, `AnimatedCounter`)
- Event handlers: `handle` prefix (e.g., `handlePhoneChange`, `handleOtpChange`, `handleClose`)
- Validation helpers: `validate` prefix (e.g., `validateSlug`, `validateFirstName`)
- Filter/transform helpers: verb prefix (e.g., `filterTypes`, `filterRegions`, `extractDigits`, `formatPhoneDisplay`)
- Custom hooks: `use` prefix (e.g., `useLocale`)

**Variables:**
- React state: camelCase (e.g., `phoneDigits`, `otpValues`, `isVisible`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_SECRET`, `BUSINESS_TYPES`, `REGIONS`, `DEFAULT_LOCALE`)
- Type/interface names: PascalCase (e.g., `LoginModalProps`, `BusinessTypeOption`, `LocationOption`)
- Discriminated union types: camelCase (e.g., `step` with type `'phone' | 'otp' | 'register'`)

**Types:**
- Interfaces: PascalCase with `Props` suffix for component props (e.g., `ButtonProps`, `LoginModalProps`)
- Type aliases: PascalCase (e.g., `TenantSlug`, `Locale`, `Step`)
- Discriminated union types: use simple camelCase for the value (e.g., `'phone' | 'otp'`)

## Code Style

**Formatting:**
- No explicit prettier/linter config beyond ESLint Next.js defaults
- Imports use path aliases (`@/` for root)
- Single quotes for strings (`'use client'`, regular strings)
- Trailing commas where applicable
- 2-space indentation (Next.js/React default)

**Linting:**
- Tool: ESLint 9 with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Config file: `eslint.config.mjs` (flat config format)
- Automatically lints TypeScript with Next.js recommended rules
- Run: `npm run lint` (ESLint)

## Import Organization

**Order:**
1. React imports (`React`, hooks like `useState`, `useEffect`, `useRef`, `useCallback`)
2. Next.js imports (`next/headers`, `next/navigation`, `next/server`, etc.)
3. External packages (`crypto`, `lucide-react`, `react-leaflet`, etc.)
4. Type imports (`import type { ... }`)
5. Internal path aliases (`@/lib/...`, `@/app/...`)
6. Local relative imports (within same feature)

**Path Aliases:**
- `@/*` maps to project root
- Used consistently: `@/lib/api`, `@/lib/locale-context`, `@/app/components/...`
- Enables imports from anywhere in the codebase without `../../../` chains

**Example from `LoginModal.tsx`:**
```typescript
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, Loader2, Phone, User, AlertCircle } from 'lucide-react'
import { sendOtp, verifyOtp, registerUser } from '@/app/[locale]/[tenant]/actions'
```

## Comment Organization

**Section separators:**
- Use `// ─── SectionName ───` to visually organize large components
- Examples from `LoginModal.tsx`:
  - `// ─── Types ───`
  - `// ─── Translations ───`
  - `// ─── Helpers ───`
  - `// ─── Component ───`
  - `// ─── Body scroll lock ───`
  - `// ─── Phone step ───`
  - `// ─── Render guards ───`

**Inline comments:**
- Used sparingly for non-obvious logic
- Example: `// Focus first OTP input after step change`
- Not used for obvious code patterns

**JSDoc:**
- Not consistently used; minimal documentation in comments
- Type safety via TypeScript interfaces/types preferred

## Error Handling

**Patterns:**
- Try-catch with error logging: `console.error('[functionName] message:', error)`
- Named logging: prefix with `[functionName]` for debugging (e.g., `[setAuthCookies]`, `[getDistance]`)
- Silent failures: `return null` on error (e.g., in `reverseGeocode`, `getDistance`)
- Error recovery: specific error codes mapped to user messages (e.g., `INVALID_OTP`, `PHONE_EXISTS`)
- State reset on errors: clear form fields, reset to initial state

**Error response handling:**
```typescript
// From actions.ts
if (!response.ok) {
  console.error(`[getDistance] ${response.status}:`, await response.text())
  return null
}
```

**User-facing errors:**
- Mapped via error codes: `getAuthErrorMessage(locale, result.error_code, result.error)`
- Bilingual error messages in component (e.g., `ERROR_CODES` object in `LoginModal.tsx`)
- Validation before submission: `validateSlug`, `validateFirstName`

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- Error logging: `console.error('[functionName] message:', error)` for debugging
- Debug logging: `console.log('[functionName] message:', details)` in development
- All logs include `[functionName]` prefix for traceable logs
- Logs appear in server console for server actions, client console for client code

**Examples from codebase:**
```typescript
console.log('[setAuthCookies] cookie options:', { domain: opts.domain, secure: opts.secure, NODE_ENV: process.env.NODE_ENV })
console.error('[getDistance] error:', error)
console.log('[getMyBookings] accessToken exists:', !!accessToken, 'businessId:', businessId)
```

## Component Design

**Functional components:**
- All components are functional, using hooks
- Use `'use client'` directive for client components

**Props:**
- Typed with interfaces: `interface ComponentNameProps { ... }`
- Destructured in function signature
- Defaults provided via parameter defaults (e.g., `locale = 'ru'`)

**Refs and forwardRef:**
- Used for DOM access (e.g., `useRef<HTMLInputElement>(null)`)
- `React.forwardRef` for reusable components that need ref forwarding (e.g., `Button` component)
- Display name set on forwarded components: `Button.displayName = 'Button'`

**State management:**
- Local state with `useState` for component-level state
- Context API for global state: `LocaleContext`, `LocationContext`
- No Redux or other state management libraries

**Effects:**
- `useEffect` for side effects with proper dependency arrays
- Cleanup functions for event listeners and observers
- Timer cleanup with `clearInterval`

**Example from `Button.tsx` (forwardRef pattern):**
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = '...'
    return <button className={finalClassName} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
export { Button }
```

## Conditional Rendering

**Early returns:**
- Guard clauses at top of component: `if (!isOpen) return null`
- Prevents unnecessary rendering of conditional content

**Ternary operators:**
- Used inline for simple conditionals
- Readable variable assignment: `const finalClassName = condition ? 'class1' : 'class2'`

**Template literals:**
- Used for dynamic className composition
- Example: `` className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()} ``

## Data Flow & Props

**Prop drilling:**
- Used when necessary (e.g., `locale`, `user` passed through components)
- Context preferred for frequently accessed values (`locale` via `useLocale()`)

**Callback pattern:**
- Event handlers receive synthetic React events
- Example: `const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }`

**Server actions:**
- Located in `app/[locale]/[tenant]/actions.ts`
- Prefixed with `'use server'` directive
- Return typed objects: `{ success: boolean; error_code?: string; error?: string; ... }`
- Validate inputs before API calls (e.g., `validateSlug`)

## Styling

**Framework:** Tailwind CSS with inline classNames
- No separate CSS files
- Classes built dynamically and concatenated
- Dark mode support: `dark:` variants used throughout
- Responsive breakpoints: `md:`, `lg:`, `sm:` prefixes
- Animations: Tailwind transitions and custom CSS animations via `motion` package

**Motion & animations:**
- Package: `motion` 12.34.0
- Used for smooth transitions in components

## Module Design

**Exports:**
- Named exports for components: `export const ComponentName = ...`
- Named exports for functions: `export async function functionName() { ... }`
- Index/barrel files: re-export for convenience

**Example from `locale-context.tsx`:**
```typescript
export function LocaleProvider({ locale, children }: { ... }) { ... }
export function useLocale(): Locale { ... }
```

## String Templates & Translation

**Pattern:**
- Translations object with nested structure by feature and locale
- All strings stored in `lib/translations.ts`
- Access: `translations.hero.title[locale]`
- Bilingual: `{ ru: '...', uz: '...' }` for all user-facing text

**Error messages:**
- Stored as lookup tables: `ERROR_CODES[locale][errorCode]`
- Fallback: `fallback || T[locale].error`

## Validation

**Pattern:**
- Regex-based: `SLUG_REGEX.test(slug)`, Unicode-aware for names: `/^[\p{L}\s\-']+$/u`
- Guard clauses: check validity and throw/return error early
- Multiple validation levels: field validation, slug validation, phone format validation

**Examples:**
```typescript
function validateSlug(slug: string): string {
  if (!SLUG_REGEX.test(slug)) {
    throw new Error('Invalid tenant slug')
  }
  return slug
}

const validateFirstName = (name: string): boolean => {
  const trimmed = name.trim()
  if (trimmed.length < 2) return false
  if (!/^[\p{L}\s\-']+$/u.test(trimmed)) return false
  return true
}
```

## API Integration

**Signed requests:**
- HMAC-SHA256 authentication via `signedFetch` helper
- Signature = `createHmac('sha256', API_SECRET).update(body + timestamp)`
- Headers: `x-timestamp`, `x-signature` added by helper

**Error handling:**
- Check `response.ok` before parsing JSON
- Log full error text on failure: `console.error(await response.text())`
- Return `null` on failure for graceful degradation

---

*Convention analysis: 2025-02-24*
