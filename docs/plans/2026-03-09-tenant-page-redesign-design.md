# Tenant Page Redesign — "The Clean Profile"

**Date**: 2026-03-09
**Status**: Approved

## Philosophy

Treat the barbershop page like a social media profile meets a product page. Centered layout, information-dense, immediate action. No decorative waste. The Book button is above the fold — you never need to scroll to take action.

Every current salon booking page (Booksy, Fresha, our current one) follows the same formula: big hero photo, business name, tab navigation, services, team, reviews, about. This design breaks that pattern entirely.

## Constraints

- White background (#FFFFFF)
- Mobile-first (390px viewport target)
- Next.js 16 App Router, React 19, TailwindCSS 4, Motion, lucide-react
- Custom Tailwind only — no external component libraries
- All existing API endpoints, server actions, data flow unchanged
- Two locales: UZ / RU
- Per-tenant primary color via `--primary` CSS custom property

## Layout — Mobile (390px)

### 1. Profile Header (above the fold, centered)

- **Language toggle** (UZ/RU pill) — top-left
- **Share button** — top-right
- **Business avatar** — 88px circle, centered. Falls back to gradient + initial if no avatar
- **Business name** — 24px bold, centered
- **Tagline/bio** — 14px stone-500, centered, single line
- **Status line** — centered, inline: green/red dot + "Open until HH:MM" or "Closed" · star rating + count · distance
- **Book button** — full-width, 48px tall, rounded-xl, primary color background, white text
- **Quick action row** — 3 equal icon+label buttons: Call, Map, Share
- **Photo strip** — horizontal scrollable row of 56x56 rounded-lg thumbnails. Tap opens lightbox gallery. Only shown if photos exist.

No hero image. No carousel. No mosaic. The avatar is the identity.

### 2. Services Section

- **Section header** — "Xizmatlar", 20px semibold, left-aligned
- **Category pills** — horizontal scroll, only if multiple categories exist. "All" pill + category names
- **Service rows** — flat list, no cards:
  - Row: service name (left, 16px medium), price (right, 16px medium)
  - Below name: duration in stone-500 (14px)
  - Subtle stone-100 divider between rows
  - **Tap to expand**: description text + "Book" button appears
  - No Book button visible in collapsed state
- Style reference: Apple Settings list rows — clean, functional, minimal

### 3. Team Section (conditional: only if >1 employee)

- **Section header** — "Mutaxassislar"
- **Horizontal scroll** of compact items:
  - 56px circle avatar (gradient+initial fallback)
  - First name below (13px medium)
  - Role below name (12px stone-500)
- No large cards. Like Instagram stories strip.

### 4. Reviews Section

- **Section header** — "Sharhlar" + inline "★ X.X (N)" rating
- **Review cards** — show first 2-3:
  - Masked customer name + relative date (right-aligned)
  - Star rating row
  - Comment text (2-line clamp, expandable)
- **"See all N reviews"** link at bottom
- No rating distribution bars. No aggregate breakdown. Reviews speak for themselves.

### 5. About Section (collapsible info rows)

Three stacked rows with subtle dividers:

1. **Working hours** — shows today's hours by default, chevron to expand full week schedule. Current day highlighted.
2. **Address** — tap to open Google Maps. Shows street address text.
3. **Contact** — phone number + Instagram link if available.

No map embed. No large about section. Compact, functional.

### 6. Floating Book Button

- When the main Book button (in profile header) scrolls out of view, a floating pill appears fixed at bottom-center
- Small rounded pill: "Band qilish" in primary color
- Disappears when main button scrolls back into view
- No fixed bottom nav. No business name repeated. Just the action.

## Layout — Desktop

Center the entire mobile layout in a `max-w-[480px]` container on a `stone-50` background. The mobile experience IS the experience, just centered. Like WhatsApp Web or Telegram Web.

No sidebar. No split layout. One column, centered.

## Design Tokens

- **Background**: white (#FFFFFF)
- **Text primary**: stone-900
- **Text secondary**: stone-500
- **Dividers**: stone-100
- **Primary/accent**: `var(--primary)` per-tenant
- **Spacing**: 16px horizontal padding, 24px vertical gaps between sections
- **Border radius**: 12px for cards/containers, 24px for buttons, full for avatars/pills
- **Typography**: Nunito Sans (already set up in Phase 1)
- **Animations**: subtle section fade-in on scroll (motion), button press scale (active:scale-95)

## Key Differences from Current Design

| Current | New |
|---------|-----|
| Hero carousel (mobile) / mosaic (desktop) | No hero — avatar-centered profile header |
| Sticky tab navigation | Vertical scroll with clear section headers |
| Business name shown 3 times (header, bottom nav, about) | Once in profile header only |
| Hero image takes entire first viewport | Everything important above the fold |
| Fixed bottom nav with business name + book button | Floating mini-book pill on scroll |
| Large team cards in horizontal scroll | Compact 56px avatar strip |
| Desktop: 2-column with sticky sidebar | Single centered column (max-w-480px) |
| Rating distribution bars section | Inline rating next to section header |
| Embedded Google Maps iframe | Tap-to-open address row |
| Per-service Book buttons visible | Tap-to-expand service rows with hidden Book |

## Data Model

No changes to any types, API calls, or server actions. Uses existing:
- `Business` (avatar_url, name, bio/tagline, working_hours, location, phone, review_stats, primary_color)
- `Service[]` (name, price, duration_minutes, category, description)
- `Employee[]` (first_name, last_name, position, avatar via services)
- `Photo[]` (url, category)
- `Review[]` (customer_name, comment, submitted_at, rating)

## Components to Build

1. **ProfileHeader** — avatar, name, tagline, status badges, book button, quick actions
2. **PhotoStrip** — horizontal scroll thumbnails + lightbox trigger
3. **ServiceList** — expandable service rows with category filter
4. **TeamStrip** — horizontal avatar scroll
5. **ReviewsList** — compact review cards
6. **AboutInfo** — collapsible working hours, address, contact rows
7. **FloatingBookButton** — scroll-aware floating CTA
8. **TenantPage** — orchestrator composing all above

## What Gets Deleted

All current tenant page components get replaced:
- HeroMosaic, HeroCarousel, HeroEmpty
- BusinessHeader, MetadataBadges
- TabNavigation
- TeamCard, TeamSection
- ReviewCard, ReviewsSection, RatingDistribution
- AboutSection, DesktopSidebar, WorkingHours, ContactInfo
- BottomNav
- All skeleton components

The `_lib/` utilities (types, translations, utils, hooks) stay — they're data-layer, not UI.
