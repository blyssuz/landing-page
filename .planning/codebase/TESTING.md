# Testing Patterns

**Analysis Date:** 2025-02-24

## Test Framework

**Status:** Not detected

**Current State:**
- No test framework configured (Jest, Vitest, Playwright, etc.)
- No test files in source code (only in node_modules from dependencies)
- No test configuration files (`jest.config.js`, `vitest.config.js`, `playwright.config.js`)
- No test scripts in `package.json` (only `dev`, `build`, `start`, `lint`)

**Implications:**
- Codebase has zero test coverage
- No automated test suite
- Manual testing only
- Critical business logic (auth, bookings, API calls) untested

## Testing Approach (Recommended Structure)

If testing were to be implemented, the following structure would align with codebase conventions:

### Suggested Test File Locations

**Co-located pattern** (recommended for this codebase):

```
app/components/auth/
├── LoginModal.tsx
├── LoginModal.test.tsx
└── UserMenu.tsx

lib/
├── api.ts
├── api.test.ts
├── tenant.ts
└── tenant.test.ts

app/[locale]/[tenant]/
├── actions.ts
├── actions.test.ts
```

**Alternative: Separate test directory:**
```
tests/
├── unit/
│   ├── lib/api.test.ts
│   ├── lib/tenant.test.ts
├── components/
│   ├── LoginModal.test.tsx
```

### Test Naming Convention

**Files:**
- `*.test.ts` for utility/function tests
- `*.test.tsx` for component tests
- `*.spec.ts` for integration/e2e tests (if used)

### What Should Be Tested (Priority Order)

**High Priority - Core Business Logic (untested):**
1. `lib/api.ts` - signature generation: `generateSignature()`, `signedFetch()`
2. `app/[locale]/[tenant]/actions.ts` - All server actions:
   - `validateSlug()` - slug validation
   - `reverseGeocode()` - geocoding API integration
   - `getDistance()` - distance calculation
   - `getAvailableSlots()` - booking slot retrieval
   - `sendOtp()` - OTP sending
   - `verifyOtp()` - OTP verification
   - `registerUser()` - user registration
   - `createBooking()` - booking creation
   - `getMyBookings()` - booking retrieval with token refresh
3. `lib/tenant.ts` - tenant extraction:
   - `getTenant()` - current tenant from headers
   - `getSubdomainFromHost()` - subdomain parsing
   - `isValidTenantSlug()` - slug validation
   - `getTenantUrl()` - URL generation

**Medium Priority - Utilities:**
1. `lib/i18n.ts` - locale validation: `isValidLocale()`
2. `app/components/auth/LoginModal.tsx` - phone/OTP formatting:
   - `formatPhoneDisplay()`
   - `extractDigits()`

**Lower Priority - UI Components:**
1. `app/components/ui/Button.tsx` - rendering with variants/sizes
2. `app/components/hero/HeroSection.tsx` - rendering structure
3. Context providers: `LocaleProvider`, `LocaleContext`

### Test Framework Recommendation

**Suggested:** Vitest + React Testing Library

**Why:**
- Vitest: Near-instant feedback, native ESM, minimal config, zero-dependency test framework
- React Testing Library: Testing components as users interact with them
- Works with Tailwind and Next.js out of the box

**Alternative:** Jest + React Testing Library (if Next.js testing standard preferred)

## Testing Patterns (To Be Established)

### Setup Pattern

**Recommended structure for utilities:**

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { generateSignature, signedFetch } from '@/lib/api'

describe('api', () => {
  beforeEach(() => {
    // Setup environment
    process.env.API_SECRET = 'test-secret'
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('generateSignature', () => {
    it('should generate correct HMAC-SHA256 signature', () => {
      const body = 'test-body'
      const timestamp = '1234567890'

      const signature = generateSignature(body, timestamp)

      // Assert signature format (hex string)
      expect(signature).toMatch(/^[a-f0-9]{64}$/)
    })
  })
})
```

**Recommended structure for server actions:**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as actions from '@/app/[locale]/[tenant]/actions'

// Mock signedFetch
vi.mock('@/lib/api', () => ({
  signedFetch: vi.fn(),
}))

describe('actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com'
  })

  describe('validateSlug', () => {
    it('should accept valid slugs', () => {
      expect(() => validateSlug('my-tenant')).not.toThrow()
      expect(() => validateSlug('a')).not.toThrow()
    })

    it('should reject invalid slugs', () => {
      expect(() => validateSlug('INVALID')).toThrow('Invalid tenant slug')
      expect(() => validateSlug('test!')).toThrow('Invalid tenant slug')
    })
  })
})
```

**Recommended structure for components:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginModal } from '@/app/components/auth/LoginModal'

// Mock server actions
vi.mock('@/app/[locale]/[tenant]/actions', () => ({
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
  registerUser: vi.fn(),
}))

describe('LoginModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    locale: 'uz' as const,
  }

  it('should render phone input step when open', () => {
    render(<LoginModal {...defaultProps} />)

    expect(screen.getByPlaceholderText('XX XXX XX XX')).toBeInTheDocument()
  })

  it('should format phone display correctly', async () => {
    const user = userEvent.setup()
    render(<LoginModal {...defaultProps} />)

    const input = screen.getByPlaceholderText('XX XXX XX XX')
    await user.type(input, '9012345678')

    expect(input).toHaveValue('90 123 45 67')
  })
})
```

### Mocking Pattern

**What to mock:**
- External API calls (`signedFetch`, `fetch`)
- Server actions in component tests
- Environment variables
- Timers (for countdown logic)
- `navigator.geolocation` for location-based features

**What NOT to mock:**
- Utility functions (validators, formatters) - test them directly
- React hooks behavior unless testing specific hook interaction
- Component composition unless testing error boundaries

**Mocking example from codebase (would be):**

```typescript
import { vi } from 'vitest'

// Mock signedFetch
vi.mock('@/lib/api', () => ({
  signedFetch: vi.fn(async (url: string) => {
    if (url.includes('nearest')) {
      return {
        ok: true,
        json: async () => ({ businesses: [] }),
        status: 200,
      }
    }
    return { ok: false, status: 500 }
  }),
}))

// Mock server actions
vi.mock('@/app/[locale]/[tenant]/actions', () => ({
  sendOtp: vi.fn(async () => ({ success: true, delivery_method: 'sms' })),
  verifyOtp: vi.fn(async () => ({ success: true, needs_registration: false })),
  registerUser: vi.fn(async () => ({ success: true })),
}))

// Mock geolocation
global.navigator.geolocation = {
  getCurrentPosition: vi.fn((success) => {
    success({ coords: { latitude: 41.3, longitude: 69.2 } })
  }),
}
```

### Fixtures and Test Data

**Location:** `tests/fixtures/` or `tests/__data__/`

**Example for booking system:**

```typescript
// tests/fixtures/bookings.ts
export const mockBusiness = {
  id: 'business-1',
  slug: 'salon-beaute',
  name: 'Salon Beaute',
  location: { latitude: 41.3, longitude: 69.2 },
}

export const mockSlot = {
  id: 'slot-1',
  service_id: 'service-1',
  employee_id: 'emp-1',
  start_time: 14400, // 4 AM in seconds from midnight
  duration: 1800, // 30 minutes
  available: true,
}

export const mockUser = {
  phone: '+998901234567',
  first_name: 'John',
  last_name: 'Doe',
}
```

### Async Testing Pattern

**For server action testing:**

```typescript
describe('getDistance', () => {
  it('should fetch and return distance', async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ distance: 500 }),
    }))

    const result = await getDistance('my-salon', 41.3, 69.2)

    expect(result).toBe(500)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('lat=41.3'),
      expect.any(Object)
    )
  })

  it('should return null on error', async () => {
    const mockFetch = vi.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    }))

    const result = await getDistance('invalid', 0, 0)

    expect(result).toBeNull()
  })
})
```

### Error Testing Pattern

**For validation and error handling:**

```typescript
describe('validateSlug', () => {
  it('should throw on invalid input', () => {
    expect(() => validateSlug('-invalid')).toThrow('Invalid tenant slug')
    expect(() => validateSlug('UPPERCASE')).toThrow('Invalid tenant slug')
    expect(() => validateSlug('test!')).toThrow('Invalid tenant slug')
  })

  it('should accept valid formats', () => {
    expect(validateSlug('my-tenant')).toBe('my-tenant')
    expect(validateSlug('a')).toBe('a')
    expect(validateSlug('tenant123')).toBe('tenant123')
  })
})

describe('LoginModal error states', () => {
  it('should display error message from server', async () => {
    const { sendOtp: mockSendOtp } = await import('@/app/[locale]/[tenant]/actions')
    ;(mockSendOtp as any).mockResolvedValueOnce({
      success: false,
      error_code: 'RATE_LIMITED',
      error: 'Too many attempts',
    })

    render(<LoginModal {...defaultProps} />)

    const input = screen.getByPlaceholderText('XX XXX XX XX')
    await userEvent.type(input, '9012345678')
    await userEvent.click(screen.getByText('Send Code'))

    expect(screen.getByText(/слишком много попыток/i)).toBeInTheDocument()
  })
})
```

## Coverage

**Current:** 0% - No tests

**Recommended Target:**
- Utilities (validators, formatters, API signing): 90%+
- Server actions (auth, bookings): 80%+
- Components (critical user paths): 60%+
- Styling/layout: Not tested (visual regression testing instead)

## Test Commands (To Be Added to package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## CI/CD Integration

**When to run tests:**
- Pre-commit hook (if test setup added)
- On push to branches
- Before merge to main
- Build step in deployment pipeline

**Current status:** No CI/CD testing configured

---

*Testing analysis: 2025-02-24*
