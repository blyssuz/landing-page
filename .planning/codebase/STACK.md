# Technology Stack

**Analysis Date:** 2026-02-24

## Languages

**Primary:**
- TypeScript 5.9.3 - Application codebase, type safety enforcement
- JavaScript (JSX/TSX) - React components, configuration

**Secondary:**
- CSS - Styling via Tailwind utilities

## Runtime

**Environment:**
- Node.js - Required (version not explicitly locked, recommend using .nvmrc in future)

**Package Manager:**
- npm - Lockfile present (package-lock.json implied by package.json)

## Frameworks

**Core:**
- Next.js 16.1.2 - Full-stack React framework with App Router, server actions, API routes
- React 19.2.3 - UI components and hooks
- React DOM 19.2.3 - React rendering for web

**Styling & UI:**
- Tailwind CSS 4.0 - Utility-first CSS framework
- PostCSS 4.0 (@tailwindcss/postcss plugin) - CSS processing pipeline
- Lucide React 0.563.0 - Icon library (SVG components)

**Maps & Location:**
- Leaflet 1.9.4 - Interactive map library
- React Leaflet 5.0.0 - React bindings for Leaflet

**Animations:**
- Motion 12.34.0 - Animation library (likely for smooth transitions)

**Loading/Spinners:**
- React Spinners 0.17.0 - Loading spinner components

## Development & Build Tools

**Linting:**
- ESLint 9 - Code quality and consistency
- ESLint Config Next 16.1.2 - Next.js specific rules

**Type Checking:**
- TypeScript 5.9.3 - Static type checking

**Next.js Features:**
- Next.js built-in image optimization (remotePatterns configured for picsum.photos)
- Built-in font optimization (Geist Sans and Geist Mono from next/font/google)

## Key Dependencies

**Critical:**
- Next.js 16.1.2 - Core application framework, provides routing, server actions, image optimization
- React 19.2.3 - UI rendering engine
- Tailwind CSS 4.0 - Styling and layout system
- TypeScript 5.9.3 - Type safety and development experience

**Infrastructure:**
- Leaflet + React Leaflet - Location/map features in venue browsing
- Lucide React - Consistent icon system across UI
- React Spinners - Loading states for async operations
- Motion - Enhanced animations for user feedback

## Configuration

**Environment:**
- `NEXT_PUBLIC_API_URL` - Backend API base URL (defaults to `http://localhost:3001` or `https://api.blyss.uz`)
- `API_SECRET` - HMAC-SHA256 signing key for authenticated requests to backend API
- `API_URL` - Backend API URL for Instagram callback page (defaults to `https://api.blyss.uz`)
- `NODE_ENV` - Deployment environment (development, production) - controls cookie security settings

**Build:**
- `next.config.ts` - Next.js configuration with:
  - Standalone output mode for containerized deployments
  - Security headers (HSTS, CSP, X-Frame-Options, etc.)
  - CORS and frame-ancestors policies restricted to `blyss.uz` domains
  - Google APIs allowed in connect-src for Google integration
- `tsconfig.json` - TypeScript compiler options with strict mode enabled, ES2017 target
- `eslint.config.mjs` - ESLint using flat config format with Next.js core web vitals and TypeScript rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind processing

## Platform Requirements

**Development:**
- Node.js (version unspecified, recommend 18+ LTS)
- npm package manager
- Git for version control

**Production:**
- Node.js runtime environment (via standalone build output)
- Container support (Dockerfile-compatible via standalone mode)
- HTTPS/TLS for secure cookie transmission

## Security & Headers

**Implemented:**
- Strict-Transport-Security: max-age=63072000 with preload and subdomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: ALLOW-FROM https://blyss.uz
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy with restrictive defaults and specific allowances

**CSP Directives:**
- default-src: self
- script-src: self, unsafe-inline (for Next.js hydration)
- style-src: self, unsafe-inline (for Tailwind)
- img-src: self, data, https
- font-src: self, https://fonts.gstatic.com (Google Fonts)
- connect-src: self, https://api.blyss.uz, https://www.googleapis.com
- frame-src: https://www.google.com (reCAPTCHA or similar)
- frame-ancestors: self, https://*.blyss.uz, https://blyss.uz

---

*Stack analysis: 2026-02-24*
