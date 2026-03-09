# Feature Landscape

**Domain:** Salon/barber multi-tenant booking landing page (UI rebuild)
**Researched:** 2026-03-09
**Focus:** UI/UX features only (backend already exists, unchanged)
**Competitive references:** Booksy, Fresha, Vagaro, Square Appointments, Airbnb (listing UX)

---

## Table Stakes

Features users expect from a professional salon/barber booking page. Missing = page feels amateur, users bounce.

### Tenant Profile Page (Business Page)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero photo gallery with mosaic/carousel | Booksy profiles with 10+ images get 3x more bookings. Customers need to see the space before visiting. | Med | Already exists. Rebuild with Airbnb-style 5-photo mosaic on desktop, swipeable carousel on mobile. |
| Fullscreen photo lightbox with swipe | Users expect to tap/click photos and browse full-screen. Standard mobile pattern. | Med | Already exists but needs polish: swipe-to-navigate, swipe-down-to-close, smooth transitions. |
| Business name, avatar, tagline | Basic identity. Every platform (Booksy, Fresha, Vagaro) shows this prominently. | Low | Already exists. Rebuild with better typography hierarchy. |
| Open/closed status with hours | Customers check before traveling. Green dot + "Open until HH:MM" is universal. | Low | Already exists. Keep pulsing green dot pattern -- it is the industry standard. |
| Star rating + review count badge | Trust signal #1. Booksy, Fresha, Google Maps all show aggregate rating in the header area. | Low | Already exists. Ensure it is prominent near business name, not hidden. |
| Service list with price, duration, and book button | Core conversion element. Every booking platform leads with services. Fresha, Booksy, Vagaro all show service name + price + duration + CTA. | Med | Already exists. Rebuild with better card design, per-service Book button. |
| Service search/filter | Table stakes when business has 10+ services. Booksy and Fresha both offer filtering. | Low | Already exists. Keep search input with clear button. |
| Service categories with grouping | Organizes long menus. Standard on Booksy (grouped by category with headers). | Low | Already exists. Rebuild with cleaner category pill filters and section headers. |
| Team/specialist section with cards | Customers want to see who will serve them. Fresha lets you pick a specialist. Featuring staff increases new-client trust by ~20%. | Med | Already exists as horizontal scroll. Rebuild with better cards (photo support when available, role, service count). |
| Reviews section with rating distribution | Social proof. Booksy shows verified reviews + star distribution chart. Airbnb shows aggregate + per-star breakdown. | Med | Already exists. Rebuild with Airbnb-style distribution bars + individual review cards. |
| Individual review cards | Users read 2-3 reviews minimum before booking. Need reviewer initial/avatar, rating stars, relative date, comment, service info. | Low | Already exists. Polish with relative dates, service tags, cleaner layout. |
| Location/address with directions link | Customers need directions. "Get Directions" linking to Google/Yandex Maps is universal across all platforms. | Low | Already exists. Keep "Get Directions" external link. |
| Working hours display | Users check schedule before planning visit. Booksy shows full weekly schedule expandable. | Low | Already exists as expandable weekly schedule. Polish visual design. |
| Contact info (phone, social links) | Fallback for users who prefer to call. Instagram link for portfolio browsing. | Low | Already exists. Keep phone + Instagram links. |
| Distance from user (geolocation) | Now table stakes on Booksy, Google Maps, Fresha marketplace. "X km away" builds convenience perception. | Low | Already exists with geolocation API. Keep as-is. |
| Sticky tab navigation | Long profile pages need section anchoring. Booksy uses tabs (Services, Reviews, About). Airbnb listing pages use the same pattern. | Med | Already exists with IntersectionObserver-based active tab. Rebuild with cleaner styling and spring-animated underline. |
| Mobile-first responsive design | 60%+ of salon booking users browse on phones. Mobile UX must be designed first, not adapted from desktop. | High | Core constraint of the rebuild. Every component designed mobile-first with responsive breakpoints. |
| Floating/sticky book CTA (mobile) | Conversion essential. Sticky CTAs on mobile keep booking action always accessible on long-scroll pages. Booksy, Fresha, and Vagaro all use this pattern. | Low | Bottom nav already exists with booking action. Rebuild with more prominent booking button. |
| Loading skeleton screens | Skeleton loaders reduce perceived load time by ~20% vs spinners (Viget research). Users consistently rate skeleton experiences as faster. | Med | Partial skeletons exist. Need full per-section skeleton screens matching actual content layout with shimmer animation (1.5-2s cycle). |
| Language switcher (RU/UZ) | Core requirement for Uzbekistan market with two primary languages. | Low | Already exists. Keep compact pill-style switcher overlay on hero photos. |

### Booking Flow Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Date picker (horizontal scrollable strip) | Every booking platform has date selection as step 1. Horizontal date strip is the standard mobile pattern (Booksy, Fresha, Vagaro). | Med | Already exists. Rebuild with better design (today/tomorrow labels, active date accent color, month transitions). |
| Time slot grid grouped by time of day | After date, show available times. Fresha groups by morning/afternoon/evening. Clear visual separation reduces scanning effort. | Med | Already exists with time-of-day grouping. Polish the slot cards. |
| Employee/specialist picker per slot | Fresha lets you pick different specialists per service. "Any specialist" option is standard. Shows name + price per specialist. | Med | Already exists. Rebuild with better employee cards showing name, price, and discount info. |
| Multi-service booking cart | Customers often book haircut + beard trim together. Booksy and Fresha support multi-service in one appointment. Cart shows selected services with remove option. | High | Already exists with add/remove service flow. Polish the cart summary UI. |
| Booking summary with total price | Final review before confirmation. Fresha shows: selected services, date, time, specialist(s), total price, notes field, and business policies. | Med | Already exists. Rebuild with cleaner summary card layout. |
| Auth gate (login before confirm) | Standard pattern across all platforms: browse freely, authenticate only when booking. Fresha explicitly requires account at confirmation step. | Med | Already exists with OTP modal. Rebuild the modal UI to feel warm and trustworthy. |
| Booking confirmation success state | After booking, clear confirmation with celebration. Green checkmark, booking details, next-action buttons ("View Bookings" / "Back to Business"). | Med | Already exists. Rebuild with success animation (checkmark animation, confetti-lite). |
| Notes/comments field | Fresha and Vagaro offer an optional notes field for special requests. Standard for service businesses. | Low | Already exists. Keep optional textarea with placeholder text guidance. |
| Error states with clear messaging | Slot taken, booking limit reached, past date, specialist unavailable -- all need clear, inline, non-technical messages. | Med | Already exists with comprehensive error messages. Rebuild with better visual error states (warning cards, not alerts). |
| Discount display (original vs final price) | When discounts apply, showing crossed-out original price + final price builds perceived value. Standard e-commerce pattern. | Low | Already exists in slot employee data. Ensure strikethrough price is clearly visible. |

### Bookings List Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Upcoming bookings list | Users need to see and manage their appointments. Booksy and Fresha both have "My Bookings" section accessible from the main nav. | Med | Already exists. Rebuild with better booking cards (date, time, service, specialist, status). |
| Cancel booking action | Standard on all platforms. Usually with confirmation dialog to prevent accidental cancellation. | Low | Already exists. Polish with confirmation modal. |
| Login prompt for unauthenticated users | Page must gracefully handle non-logged-in state with clear "Log in to see your bookings" prompt. | Low | Already exists. Rebuild with warmer, more inviting prompt -- not a dead-end error page. |

### Rating/Review Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Star rating input (tappable) | Token-linked review page for post-visit feedback. Tappable/clickable star selection with visual feedback. | Low | Already exists. Add animation on star selection (scale + color transition). |
| Comment textarea | Free-text review with optional prompt or character guidance. | Low | Already exists. Polish styling to match design system. |
| Success confirmation after submit | Clear feedback that review was submitted. Satisfying moment of closure. | Low | Already exists. Add success animation (checkmark + thank-you message). |

### Landing Page (blyss.uz homepage)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with value proposition + CTA | Immediately communicate what the platform does. "Find and book salons near you." Strong typography + clear Book Now or Search action. | Med | Already exists. Rebuild with bolder typography (2026 trend: type-first heroes), warm imagery. |
| Nearest businesses (geolocation) | Location-aware discovery is table stakes for marketplace/discovery pages. Google Maps, Booksy, Fresha all do this. | Med | Already exists. Rebuild venue cards with better design (photo, name, rating, type, distance). |
| Browse by city | Market-level navigation for users not sharing location or exploring other cities. | Med | Already exists. Rebuild with better city cards/tabs. |
| Business/venue cards (reusable) | Consistent card component used across the landing page. Photo thumbnail, business name, rating, type, distance. | Med | Already exists. Rebuild as polished reusable component. |
| For Business CTA section | Attract new business owners to join the platform. Secondary but important for supply-side growth. | Low | Already exists. Rebuild with warmer, more professional design. |

### Location Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Interactive map with pin | Show business location on a map. Standard for any location page. | Med | Already exists with Leaflet. Polish container and map marker styling. |
| Address + directions link | Text address + "Get Directions" button to Google/Yandex Maps. | Low | Already exists. Keep functional. |

---

## Differentiators

Features that set BLYSS apart from competitors. Not expected, but create a premium, Airbnb-quality feeling that makes users trust the page and book without hesitation.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Warm micro-interactions throughout | Subtle animations on scroll-in, tab switches, button presses, card hovers create a living, breathing feel. Airbnb feels alive because of purposeful motion. Booksy and Fresha feel static by comparison. | Med | Use Motion (framer-motion) for: section fade-in on scroll (whileInView), spring tab indicator (layoutId), card hover lift (whileHover y:-2), button press scale (whileTap scale:0.97). Keep all motion 200-400ms, ease-out. |
| Per-tenant color theming | Each business gets a unique primary color that tints buttons, accents, active states. Creates brand ownership per business. Most competitors use one brand color site-wide. This makes BLYSS feel like "their website." | Low | Already exists via CSS custom properties. Ensure the rebuilt design system uses `var(--primary)` and computed opacity variants consistently in every component. |
| Airbnb-style photo mosaic (desktop) | The 5-photo grid layout (1 large + 4 small) is immediately recognizable as premium. Most salon platforms just use carousels. The mosaic communicates "high-quality listing" at a glance. | Med | Already partially exists. Rebuild with exact Airbnb proportions (2-column large + 2x2 grid), hover brightness effects, rounded corners, "See all photos (N)" button. |
| Trust-building header composition | Combine avatar + name + tagline + open-status + rating + distance in a single scannable header. Information hierarchy communicates trustworthiness in under 2 seconds. Airbnb does this masterfully. | Med | Redesign the metadata badges area: generous spacing, clear typographic hierarchy (name bold 2xl, tagline light, metadata row with icon+text badges separated by dots). |
| Professional typography system | Large, expressive headings + readable body text with consistent spacing rhythm. 2026 design trend: "confidence in type" with oversized, minimal section headers paired with restrained body text. | Med | Define a type scale used everywhere: hero name (2xl-3xl bold), section heading (lg-2xl semibold), body (sm-base regular), caption (xs zinc-400). Consistent line-heights, tracking. |
| Skeleton screens matching content shapes | Instead of generic gray blocks, skeleton screens that precisely mirror actual content shapes (photo mosaic skeleton, service list skeleton, review card skeleton). Research shows this reduces cognitive load and perceived wait time more than generic placeholders. | Med | Create per-section skeleton components that match their loaded counterparts exactly. Use CSS shimmer animation with 1.5-2s cycle, subtle and gentle. |
| Thoughtful empty states | When there are no reviews, no photos, or no specialists, show a warm, designed empty state with an icon + descriptive text instead of a bare "No items" message. | Low | Simple icon + text compositions. E.g., Star icon + "No reviews yet -- be the first!" Warmer than plain text. |
| Review cards with service context | Show which specific service was performed and by which employee on each review card. More informative than generic "Great service!" reviews. Helps potential customers evaluate relevance. | Low | Data already exists in review objects (services array with service_name + employee_name). Ensure the rebuilt review card displays these as subtle tags/badges beneath the comment. |
| Gradient overlays with brand influence | Subtle dark gradient at bottom of hero photos for text readability, plus an ambient tint from the business's primary color. Creates a warm, custom feel that differs per business. | Low | Rebuild gradient overlays with primary color influence (mix primary color at ~10% opacity into the gradient). |
| Bottom nav with app-like tap feedback | Mobile bottom nav that responds to taps with subtle scale animation, mimicking native app feel. Active state uses primary color. Icons animate on selection. | Low | Already exists functionally. Add whileTap={{ scale: 0.92 }} on nav items. Active icon uses primary color fill. |
| Desktop sidebar info panel | On desktop, the right column shows a persistent summary: business hours, contact info, location link, and a prominent Book Now CTA. Keeps key info visible while scrolling services. Like Airbnb's sticky price sidebar but adapted for services. | Med | Already partially exists as two-column layout. Redesign the right sidebar content to be a cohesive info panel with card-style sections. |
| Smooth section reveal animations | Sections fade in and slide up gently as user scrolls down the page. Creates a sense of the page "building itself" for the user. Used subtly, not dramatically. | Low | Already partially exists with whileInView on team and reviews sections. Apply consistently to all major sections with viewport once:true, small y offset (12-20px), and 300-400ms duration. |

---

## Anti-Features

Features to explicitly NOT build for this UI rebuild.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Dark mode | Out of scope per PROJECT.md. Adds 2x design work for every component, doubles testing surface. No evidence Uzbek salon users need it for a booking page. | Build light mode only. Remove existing dark: utility classes during rebuild to reduce code clutter. |
| Third-party component libraries (shadcn, antd, Mantine) | PROJECT.md explicitly requires Tailwind-only custom components. External libs impose their own aesthetic, add bundle weight, and create upgrade dependencies. | Build a small custom design system: Button, Card, Input, Modal, Badge, Skeleton, StarRating, Avatar components in pure Tailwind. Full control over every pixel. |
| Chat/messaging with business | Complex feature requiring backend WebSocket support (out of scope). Phone and Telegram already serve this communication need well in Uzbekistan. | Keep phone call button and Telegram link as contact options. Sufficient for the market. |
| Online payment / checkout | Backend does not support payment processing, and Uzbekistan payment infrastructure (card-based) is still developing. Adding payment UI without backend creates dead interactions. | Keep the booking flow payment-free. Payments happen at the salon in cash or card. This matches user expectations in the market. |
| Loyalty program UI | Requires backend support (point tracking, rewards). Booksy and Fresha have this, but it is operator-facing, not relevant to the public booking page customer experience. | Skip entirely. Not needed for the customer-facing booking page. |
| Product/retail shop | Vagaro allows selling retail products. Far beyond scope of a booking landing page and requires full e-commerce backend (inventory, payments, shipping). | This is strictly a service booking page. No product sales. |
| Push notifications | Requires service worker, notification permission flows, backend notification system. Out of scope for a UI rebuild, and Telegram notifications already serve operators. | Existing Telegram + SMS notification infrastructure handles this. No browser push needed. |
| Social login (Google, Apple, Facebook) | Backend only supports OTP phone authentication. Adding social login buttons without backend support creates broken UI. Phone number is the primary user identifier in Uzbekistan. | Keep OTP-only authentication. Simple, works everywhere, matches local norms. |
| Infinite scroll / pagination for reviews | Over-engineering. Most businesses will have 5-50 reviews. "Show all" toggle handles this cleanly without pagination complexity. | "Show all reviews" expand button for businesses with >3 reviews. Simple and effective. |
| Map embedded directly in tenant page | Adds Leaflet bundle weight to the main tenant page, slows initial load, and takes significant vertical space for relatively low-priority information. Location page already exists as a dedicated route. | Keep "Location" link/button in About section that navigates to the dedicated /location route with full interactive map. |
| Before/after photo slider | Compelling feature for hair transformation galleries, but requires paired photo uploads in the backend data model which does not exist. Cannot be built with current data structure. | Standard portfolio-style photo gallery is sufficient. Before/after could be a future feature when backend adds paired photo support. |
| Real-time availability calendar on tenant page | Showing a live availability calendar on the business profile (before entering booking flow) adds multiple API calls per page load, increases complexity, and creates stale-data risks. | Keep the flow: browse services on tenant page -> click Book -> see real-time availability on booking page. This is exactly the Fresha and Booksy pattern. |
| Auto-detect language from browser | Detecting language from browser locale and auto-switching adds edge cases (wrong detection, locale mismatch). URL-based routing is SEO-friendly and explicit. | Keep explicit RU/UZ toggle in the UI. Users in Uzbekistan are bilingual and prefer choosing their language. URL-based locale is better for SEO. |
| Heavy animation choreography | Staggered entrance sequences on every element, parallax scrolling layers, orchestrated page transition timelines. Feels "portfolio demo" rather than professional product. Hurts performance on low-end Android devices common in Uzbekistan. | Keep animations purposeful and restrained: section fade-in on scroll, tab spring transitions, button feedback. 200-400ms max duration. No animation should draw attention to itself. If a user notices the animation, it is too much. |
| Desktop sticky booking sidebar | Airbnb has a sticky price sidebar on desktop. For salon booking, the primary CTA is per-service (each service has its own Book button), so a sticky sidebar booking widget does not map well. It would duplicate the per-service booking pattern or require a generic "Book" that adds friction. | Keep per-service Book buttons inline in the service list. Desktop right column shows business info (hours, contact, location) which is genuinely useful to have persistently visible. |

---

## Feature Dependencies

```
Design System Primitives (Button, Card, Input, Modal, Badge, Skeleton, StarRating, Avatar)
  |-> Every page section depends on these
  |-> Must be built first

Typography + Color System (type scale, spacing, --primary theming)
  |-> Every text element and accent color depends on this
  |-> Must be defined alongside design system

Skeleton Loading Screens
  |-> Depend on Design System (use Skeleton primitive)
  |-> Each content section needs its own matching skeleton

Photo Gallery (mosaic + carousel)
  |-> Fullscreen Lightbox (lightbox requires gallery images array)
  |-> Business Header (hero area flows into header on mobile)

Business Header (name, avatar, metadata badges)
  |-> Open/Closed Status (requires working_hours data)
  |-> Distance Badge (requires geolocation + business coordinates)
  |-> Rating Badge (requires review_stats data)

Service List Section
  |-> Service Search (search filters the service data)
  |-> Category Filters (categories derived from service data)
  |-> Per-service Book Button -> Booking Flow Page (navigates with service intent)

Booking Flow (separate page/route)
  |-> Date Picker -> Time Slots (slots fetched after date selection)
  |-> Time Slots -> Employee Picker (employees loaded per slot)
  |-> Employee Picker -> Booking Summary (summary shows all selections)
  |-> Booking Summary -> Auth Gate (login modal if not authenticated)
  |-> Auth Gate -> Booking Confirmation (API call + success state)

Reviews Section
  |-> Rating Distribution (requires review_stats aggregate data)
  |-> Review Cards (requires individual review objects)

Team Section
  |-> Employee Cards (requires employee data with name, role, services)

Sticky Tab Navigation
  |-> Depends on section refs from all content sections
  |-> IntersectionObserver watches section visibility
```

---

## MVP Recommendation (Phase Ordering for UI Rebuild)

### Phase 1: Foundation (Build First)

1. **Design system primitives** -- Button, Card, Input, Modal, Badge, Skeleton, StarRating, Avatar
   - Reason: Every page section depends on these. Build once, use everywhere. This is the foundation everything else composes from.

2. **Typography + color system** -- Type scale, spacing rhythm, primary color theming tokens
   - Reason: Visual consistency requires these decisions upfront before building any section.

3. **Skeleton loading screens** -- Per-section skeleton components with shimmer
   - Reason: These are literally the first thing users see on every page load. Good skeletons make the page feel fast and polished from the first millisecond.

### Phase 2: Core Tenant Page (Build Second)

4. **Hero photo gallery** -- Airbnb mosaic (desktop) + swipeable carousel (mobile) + fullscreen lightbox
   - Reason: First visual impression. Highest-impact section for perceived quality. Sets the tone for the entire experience.

5. **Business header** -- Name, avatar, tagline, metadata badges (open status, rating, distance)
   - Reason: Trust-building zone. Users decide to stay or bounce within 2 seconds of seeing this area.

6. **Service list** -- Categories, search, service cards with per-service Book buttons
   - Reason: Primary conversion element. This is where booking intent forms. The most important interactive section.

7. **Sticky tab navigation** -- Section anchoring with smooth scroll + spring-animated active indicator
   - Reason: Enables efficient navigation of the long profile page. Small component, high usability impact.

### Phase 3: Trust + Social Proof (Build Third)

8. **Team/specialist section** -- Employee cards in horizontal scroll with name, role, service count
   - Reason: Builds trust through transparency about who serves customers.

9. **Reviews section** -- Rating distribution bars + individual review cards with service context
   - Reason: Social proof. Third most important trust signal after photos and services.

10. **About section / Desktop sidebar** -- Working hours, location link, contact info, bio
    - Reason: Informational. Important but not the primary conversion driver.

### Phase 4: Booking + Auxiliary Pages (Build Fourth)

11. **Booking flow rebuild** -- Date picker, time slots, specialist picker, summary, auth gate, confirmation
    - Reason: Conversion completion path. Only reached after tenant page successfully creates booking intent.

12. **Bookings list + rating page** -- My bookings with cancel, star rating submission
    - Reason: Post-booking experience. Important for retention and review collection, not initial acquisition.

13. **Landing page rebuild** -- Hero section, nearest businesses, browse by city, for-business CTA
    - Reason: Discovery/marketplace page. Important but a separate concern from the tenant booking experience.

### Defer to Polish Pass

- **Location page map redesign**: Functional with Leaflet already. Container styling only needed.
- **Advanced empty state illustrations**: Use icon + text initially, add custom illustrations later if desired.
- **Complex page transitions**: Page-to-page animation between tenant page and booking page. Nice-to-have, can add after core sections are solid.
- **Performance tuning**: Measure first with Lighthouse after rebuild, optimize based on actual data rather than premature optimization.

---

## Sources

- [Booksy Profile Features](https://biz.booksy.com/en-us/features/booksy-profile) -- HIGH confidence (official product page)
- [Booksy Features Overview](https://biz.booksy.com/en-us/features) -- HIGH confidence (official)
- [Fresha Online Booking Flow](https://www.fresha.com/help-center/knowledge-base/online-profile/599-learn-how-clients-book-appointments-online) -- HIGH confidence (official docs)
- [Fresha Salon Software](https://www.fresha.com/for-business/salon) -- HIGH confidence (official)
- [Fresha Best Salon Software Comparison](https://www.fresha.com/for-business/salon/best-salon-software) -- MEDIUM confidence
- [Vagaro Salon Software Features](https://www.vagaro.com/pro/salon-software) -- MEDIUM confidence (official)
- [Beauty Salon Website Design: 20 Stunning Ideas](https://www.ronkot.com/beauty-salon-website-design/) -- MEDIUM confidence (design analysis)
- [Hero Section Design Patterns 2026](https://www.perfectafternoon.com/2025/hero-section-design/) -- MEDIUM confidence
- [Skeleton Screens UX](https://clay.global/blog/skeleton-screen) -- HIGH confidence (UX research)
- [Skeleton Loading Perceived Performance](https://blog.logrocket.com/ux-design/skeleton-loading-screen-design/) -- MEDIUM confidence
- [Airbnb UX Design Patterns](https://medium.com/design-bootcamp/airbnbs-secret-to-seamless-ux-f7caf7cc9b23) -- MEDIUM confidence
- [Airbnb UX Laws for Growth](https://pony.studio/design-for-growth/how-airbnb-leveraged-ux-laws-for-exponential-growth) -- MEDIUM confidence
- [Salon Website Design Guide](https://www.softtrix.com/blog/website-design-guide-for-salon-business/) -- MEDIUM confidence
- [CTA Placement Best Practices 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) -- MEDIUM confidence
- [Book Now Button Optimization](https://youcanbook.me/blog/book-now-button) -- MEDIUM confidence
- [Success Message UX Best Practices](https://www.pencilandpaper.io/articles/success-ux) -- MEDIUM confidence
- [Booking UX Best Practices 2025](https://ralabs.org/blog/booking-ux-best-practices/) -- MEDIUM confidence
- Existing codebase: TenantPage.tsx (~1800 lines), BookingPage.tsx (~1600 lines), landing page components -- HIGH confidence (direct analysis)
- PROJECT.md constraints and requirements -- HIGH confidence (project source of truth)

---

*Feature landscape researched: 2026-03-09*
