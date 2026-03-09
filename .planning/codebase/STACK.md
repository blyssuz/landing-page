# Technology Stack

**Analysis Date:** 2026-03-09

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`tsconfig.json` target: ES2017, strict mode enabled)

**Secondary:**
- CSS - Global styles and TailwindCSS (`app/globals.css`)

## Runtime

**Environment:**
- Node.js (production runtime via `node server.js` in Docker)
- Bun (build-time and development via `oven/bun:1-alpine` Docker image)

**Package Manager:**
- npm - Primary (lockfile: `package-lock.json`, 161KB)
- Bun - Used in Docker builds (`bun install --frozen-lockfile`, `bun run build`; lockfile: `bun.lock`, 110KB)
- Both lockfiles are present; Docker uses Bun, local dev uses npm

## Frameworks

**Core:**
- Next.js ^16.1.6 - App Router with standalone output mode (`next.config.ts`)
- React 19.2.3 - UI framework
- React DOM 19.2.3 - DOM rendering

**Build/Dev:**
- TailwindCSS ^4 - Utility-first CSS framework, via PostCSS plugin (`postcss.config.mjs`)
- `@tailwindcss/postcss` ^4 - PostCSS integration for TailwindCSS 4
- ESLint ^9 - Linting with `eslint-config-next` 16.1.2 (core-web-vitals + TypeScript presets in `eslint.config.mjs`)

## Key Dependencies

**Critical:**
- `next` ^16.1.6 - Framework, App Router, Server Components, Server Actions, middleware
- `react` 19.2.3 - UI rendering with Server Components support
- `motion` ^12.34.0 - Animation library (imported as `motion/react`), used extensively in `TenantPage.tsx`, `BookingPage.tsx`
- `lucide-react` ^0.563.0 - Icon library, used in every component

**UI/UX:**
- `leaflet` ^1.9.4 + `react-leaflet` ^5.0.0 - Interactive maps for location pages (`app/[locale]/[tenant]/location/LocationMap.tsx`)
- `react-spinners` ^0.17.0 - Loading spinners (`HashLoader` in `BookingPage.tsx`)

**Type Definitions (dev):**
- `@types/leaflet` ^1.9.21
- `@types/node` ^20
- `@types/react` ^19
- `@types/react-dom` ^19

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2017, strict mode, bundler module resolution
- Path alias: `@/*` maps to project root (`@/lib/api`, `@/app/components/...`)
- Incremental compilation enabled

**Next.js:**
- Config: `next.config.ts`
- Output: `standalone` (optimized Docker deployment)
- Remote images: `picsum.photos` (placeholder images)
- Security headers: HSTS, X-Content-Type-Options, Referrer-Policy, CSP
- CSP allows: `connect-src 'self' https://api.blyss.uz https://www.googleapis.com`

**PostCSS:**
- Config: `postcss.config.mjs`
- Plugin: `@tailwindcss/postcss` only

**ESLint:**
- Config: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

**Environment:**
- `.env` file present - contains environment configuration
- Key env vars used in code:
  - `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3001` dev, `https://api.blyss.uz` prod)
  - `API_SECRET` - HMAC signing key for API requests
  - `TELEGRAM_BOT_TOKEN` - Bot token for visit notifications
  - `TELEGRAM_CHAT_ID` - Chat ID for visit notifications
  - `TUNNEL_TENANT` - Cloudflare tunnel tenant override
  - `NODE_ENV` - Environment detection for cookie settings
  - `API_URL` - Used in Instagram callback page (default: `https://api.blyss.uz`)

**CSS/Theming:**
- Global styles: `app/globals.css`
- CSS custom properties for theming (`--background`, `--foreground`, `--primary: #088395`)
- Custom dark mode via `data-color-scheme` attribute (currently forced to light in `ThemeProvider.tsx`)
- Fonts: Geist Sans + Geist Mono via `next/font/google`

## Platform Requirements

**Development:**
- Node.js (version not pinned, no `.nvmrc` or `.node-version`)
- npm for package management
- Local tenant testing: `{tenant}.localhost:3000`

**Production:**
- Docker container based on `oven/bun:1-alpine`
- Standalone Next.js output (built with Bun, served with Node.js)
- Port: 3000 (mapped to 9999 in `docker-compose.yml`)
- Non-root user: `nextjs` (UID 1001)
- Health check: HTTP GET on `http://localhost:3000`
- Domain: `*.blyss.uz` (wildcard subdomain for multi-tenancy)

**SEO:**
- Dynamic sitemap generation (`app/sitemap.ts`) - fetches all businesses from API
- Robots.txt (`app/robots.ts`) - allows all, disallows `/api/`, `/admin/`, `/_next/`
- Web App Manifest (`app/manifest.ts`) - PWA-ready
- JSON-LD structured data for both homepage (WebApplication) and tenant pages (HealthAndBeautyBusiness)
- OpenGraph and Twitter Card metadata per locale

---

*Stack analysis: 2026-03-09*
