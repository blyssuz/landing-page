# Phase 5: Profile Header & Photo Strip - Research

**Researched:** 2026-03-09
**Domain:** React component architecture, mobile-first profile layout, photo gallery UX
**Confidence:** HIGH

## Summary

Phase 5 replaces the existing hero carousel/mosaic + BusinessHeader + MetadataBadges + LanguageSwitcher + BottomNav with a new avatar-centered "Clean Profile" header. The design shifts from a photo-first identity (big hero image) to a social-profile identity (centered avatar, name, status row, CTA, quick actions, photo strip). This is a UI replacement phase -- no API changes, no new data fetching, no routing changes.

The existing codebase already has all the building blocks needed: the `Avatar` component (with gradient+initial fallback), `Button` component (with primary variant and --primary CSS custom property support), `StarRating` component, `GalleryLightbox` component (reusable for the photo strip), and all `_lib/` utilities (types, translations, hooks). The work is composing new UI components that consume the exact same data already passed to `TenantPage`.

**Primary recommendation:** Build two new components (`ProfileHeader` and `PhotoStrip`), refactor the `TenantPage` orchestrator to use them instead of the old hero/header/tabs/bottomnav components, and reuse the existing `GalleryLightbox` unchanged for the lightbox functionality.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PH-01 | Visitor sees centered business avatar, name, and tagline above the fold | Existing `Avatar` component supports gradient+initial fallback; needs custom 88px size via className override. Business data already available (name, avatar_url, tagline/bio) |
| PH-02 | Visitor sees open/closed status, star rating, and distance in a single inline status row | Existing `isOpenNow()`, `getClosingTime()`, `useDistance()` hook, and `StarRating` component. Recompose into inline row instead of stacked MetadataBadges |
| PH-03 | Visitor can tap a full-width Book button above the fold | Existing `Button` component with `variant="primary"` already uses --primary color. Navigation to booking flow already exists in TenantPage |
| PH-04 | Visitor can tap Call, Map, or Share quick-action buttons | Call: `tel:` link using `business.business_phone_number`. Map: Google Maps URL using `business.location.lat/lng`. Share: Web Share API with clipboard fallback |
| PH-05 | Language toggle (UZ/RU) accessible at the top of the page | Existing `LanguageSwitcher` component can be reused directly, positioned top-left per design doc |
| PG-01 | Visitor sees horizontal strip of photo thumbnails below header | New `PhotoStrip` component: horizontal scroll of 56x56 rounded-lg thumbnails. Photos data already available |
| PG-02 | Visitor can tap any thumbnail to open fullscreen lightbox gallery | Existing `GalleryLightbox` component is fully reusable -- same props interface, just triggered from PhotoStrip instead of HeroCarousel |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^16.1.6 | App Router, server components, routing | Already in project |
| React | 19.2.3 | UI rendering | Already in project |
| TailwindCSS | ^4 | Styling via utility classes | Already in project |
| Motion (framer-motion) | ^12.34.0 | Animations (fade-in, spring transitions) | Already in project |
| lucide-react | ^0.563.0 | Icon system | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@/app/components/ui/Avatar` | N/A (local) | Avatar with gradient+initial fallback | Profile header avatar |
| `@/app/components/ui/Button` | N/A (local) | Primary CTA button | Book button |
| `@/app/components/ui/StarRating` | N/A (local) | Star rating display | Status row |
| `@/lib/animations` | N/A (local) | Spring presets (springs, fadeUp, fadeIn) | Section animations |
| `cn()` utility | N/A (local) | Class name merging | All components |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Avatar size | New `Avatar` size prop | Adding a new size to Avatar is fine but className override (`w-[88px] h-[88px]`) works equally well and avoids touching a shared component |
| Custom share logic | `react-share` library | Unnecessary dependency; Web Share API + clipboard fallback is ~15 lines of code |
| New lightbox component | Keep existing `GalleryLightbox` | Existing lightbox already handles swipe, keyboard nav, category filter -- reuse it |

**Installation:**
```bash
# No new dependencies needed. Everything is already installed.
```

## Architecture Patterns

### Recommended Project Structure
```
app/[locale]/[tenant]/
  _components/
    ProfileHeader.tsx       # NEW: avatar, name, tagline, status, book, quick actions
    PhotoStrip.tsx          # NEW: horizontal thumbnail strip + lightbox trigger
    LanguageSwitcher.tsx    # KEEP: reused as-is (top of page)
    HeroGallery/
      GalleryLightbox.tsx   # KEEP: reused for photo strip lightbox
    # OLD components below will be removed in this phase:
    BusinessHeader.tsx      # REMOVE
    MetadataBadges.tsx      # REMOVE
    TabNavigation.tsx       # REMOVE
    BottomNav.tsx           # REMOVE
    HeroGallery/
      HeroMosaic.tsx        # REMOVE
      HeroCarousel.tsx      # REMOVE
      HeroEmpty.tsx         # REMOVE
  _lib/
    types.ts                # KEEP: unchanged
    translations.ts         # MODIFY: add new translation keys
    utils.ts                # KEEP: unchanged
    use-distance.ts         # KEEP: unchanged
    use-active-section.ts   # KEEP: unchanged (still needed for scroll-based section tracking in Phase 7)
  TenantPage.tsx            # MODIFY: replace imports, simplify orchestrator
```

### Pattern 1: Composing with Existing Design System
**What:** New components import and compose existing DS primitives rather than rebuilding them
**When to use:** Always -- the Avatar, Button, StarRating components already handle the visual language
**Example:**
```typescript
// ProfileHeader uses existing Avatar with custom size
import { Avatar } from '@/app/components/ui/Avatar';

<Avatar
  src={business.avatar_url || undefined}
  name={business.name}
  size="xl"
  className="w-[88px] h-[88px] text-2xl ring-4 ring-white shadow-lg"
/>
```

### Pattern 2: CSS Custom Property for Tenant Theming
**What:** All brand-colored elements use `var(--primary)` via Tailwind's `bg-primary`, `text-primary` classes
**When to use:** Book button, any accent color element
**Example:**
```typescript
// The --primary custom property is already set on the root div in TenantPage:
// style={{ '--primary': primaryColor } as React.CSSProperties}

// Button component already uses bg-primary via its primary variant
<Button variant="primary" size="lg" className="w-full rounded-xl py-3.5">
  {t.bookNow}
</Button>
```

### Pattern 3: Web Share API with Clipboard Fallback
**What:** Use navigator.share() when available, fall back to navigator.clipboard.writeText()
**When to use:** Share quick-action button
**Example:**
```typescript
const handleShare = async () => {
  const shareData = {
    title: business.name,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // User cancelled -- not an error
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  } else {
    // Fallback: copy URL to clipboard
    await navigator.clipboard.writeText(window.location.href);
    // Show brief toast/feedback
  }
};
```

### Pattern 4: Horizontal Scroll Strip (Photo Thumbnails)
**What:** CSS `overflow-x-auto` with `flex-nowrap` for horizontal scrolling
**When to use:** Photo strip, and later team strip (Phase 6)
**Example:**
```typescript
<div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
  {photos.map((photo, i) => (
    <button
      key={photo.id}
      onClick={() => onPhotoClick(i)}
      className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden"
    >
      <img src={photo.url} alt="" className="w-full h-full object-cover" />
    </button>
  ))}
</div>
```

### Anti-Patterns to Avoid
- **Don't create separate mobile/desktop components:** The new design uses a single centered column for both mobile and desktop. No `lg:hidden` / `hidden lg:block` splits needed for the profile header.
- **Don't duplicate data fetching:** All data is already fetched in `page.tsx` and passed through `TenantPage` as props. New components receive data via props only.
- **Don't modify the existing `Avatar` component:** The 88px size requirement can be achieved with className overrides. No need to add a new size variant to the shared component.
- **Don't remove GalleryLightbox:** It is reusable for Phase 5's photo strip lightbox. Same interface, same behavior.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Avatar with fallback | Custom avatar circle with gradient | Existing `Avatar` component | Already handles src/gradient/initial logic, tested |
| Star rating display | Custom star rendering logic | Existing `StarRating` component | Already handles half-stars, sizes, accessibility |
| Fullscreen gallery | Custom lightbox from scratch | Existing `GalleryLightbox` | Already handles swipe, keyboard, category filter, scroll lock |
| Button with primary color | Custom styled button | Existing `Button variant="primary"` | Already uses --primary CSS property, has press states |
| Language toggle | Custom locale switcher | Existing `LanguageSwitcher` | Already handles locale routing, visual toggle |
| Distance calculation | Custom geolocation logic | Existing `useDistance` hook | Already handles geolocation, caching, permission denied state |
| Open/closed status | Custom time comparison | Existing `isOpenNow()` + `getClosingTime()` | Already handles timezone, day-of-week logic |
| Class name merging | Template literals | Existing `cn()` utility | Filters falsy values cleanly |

**Key insight:** Phase 1 and Phase 2 built the entire utility layer. Phase 5 is purely a composition exercise -- assembling existing pieces into a new visual layout.

## Common Pitfalls

### Pitfall 1: Breaking the Booking Navigation
**What goes wrong:** The Book button in the profile header must navigate to the booking flow exactly like the current implementation does.
**Why it happens:** The current booking flow uses `setBookingIntent()` server action + `router.push()` to navigate. If the new Book button changes this pattern, booking breaks.
**How to avoid:** The profile header Book button should use the same `basePath` + `/booking` navigation pattern already in TenantPage. Since the profile header Book button is a general "book now" action (not tied to a specific service), it can simply navigate to `${basePath}/booking` or scroll to the services section.
**Warning signs:** Book button navigates to wrong path, or booking intent cookie is not set correctly.

### Pitfall 2: Avatar Size Not Matching Design Spec
**What goes wrong:** The Avatar component has predefined sizes (sm=32, md=40, lg=48, xl=64px). The design spec calls for 88px.
**Why it happens:** Using the existing `size="xl"` prop gives 64px, not 88px.
**How to avoid:** Override with `className="w-[88px] h-[88px] text-2xl"` while keeping `size="xl"` for the base styles. The `cn()` utility and Tailwind's specificity will let the explicit width/height override the size class.
**Warning signs:** Avatar looks too small compared to design mockup.

### Pitfall 3: Web Share API Not Available on All Browsers
**What goes wrong:** `navigator.share()` is not available on Firefox desktop and some older browsers. Calling it without checking throws an error.
**Why it happens:** Web Share API has ~91% mobile support but inconsistent desktop support.
**How to avoid:** Always check `navigator.share && navigator.canShare?.(data)` before calling. Provide clipboard fallback. Show brief visual feedback ("Link copied!") for the fallback path.
**Warning signs:** Share button does nothing or throws a console error on desktop Firefox.

### Pitfall 4: Photo Strip Hidden When No Photos
**What goes wrong:** Empty horizontal scroll container shows or takes vertical space when business has no photos.
**Why it happens:** Not conditionally rendering the PhotoStrip component.
**How to avoid:** Guard with `{photos.length > 0 && <PhotoStrip ... />}` in TenantPage.
**Warning signs:** Empty gap visible below profile header for businesses without photos.

### Pitfall 5: Removing Old Components Too Early
**What goes wrong:** Deleting HeroMosaic, HeroCarousel, BusinessHeader, etc. breaks the build because other imports reference them.
**Why it happens:** The old TenantPage.tsx imports all old components. Must refactor TenantPage simultaneously.
**How to avoid:** Build new components first, then update TenantPage imports to swap old for new, then delete old component files. Do it in a single coordinated change.
**Warning signs:** Build errors from missing imports after partial deletion.

### Pitfall 6: Translation Keys Missing for New UI Elements
**What goes wrong:** New UI strings (e.g., "Share", "Map", "Copied!") show as undefined because they were not added to translations.
**Why it happens:** New components introduce new user-facing text not present in current translations.
**How to avoid:** Add all new translation keys to `_lib/translations.ts` BEFORE building the components. New keys needed: share, map/directions, copied/linkCopied, and possibly bookNow label reuse.
**Warning signs:** Undefined text in rendered UI, or English strings in a UZ/RU interface.

### Pitfall 7: Google Maps URL Format
**What goes wrong:** Map button opens Google Maps but location is wrong or URL doesn't work on all platforms.
**Why it happens:** Using wrong URL format for Google Maps.
**How to avoid:** Use the universal Google Maps URL: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`. This works on both iOS and Android, and in both web and app contexts.
**Warning signs:** Map button opens blank or incorrect location.

## Code Examples

### ProfileHeader Component Structure
```typescript
// Source: Design doc + existing codebase patterns
interface ProfileHeaderProps {
  business: Business;
  locale: Locale;
  onSwitchLocale: (locale: Locale) => void;
  onBook: () => void;
  // Status row data
  openStatus: boolean;
  closingTime: string | null;
  distance: { distance: number; metric: string } | null;
  distanceLoading: boolean;
  translations: Record<string, string>;
}
```

### Status Row (PH-02) Inline Layout
```typescript
// Source: Design doc "Status line -- centered, inline: green/red dot + open/closed + star + distance"
<div className="flex items-center justify-center gap-1.5 text-sm">
  {/* Open/closed with colored dot */}
  <span className={cn(
    "w-2 h-2 rounded-full",
    openStatus ? "bg-emerald-500" : "bg-red-400"
  )} />
  <span className={openStatus ? "text-emerald-600" : "text-stone-500"}>
    {openStatus ? t.openUntil.replace('{{time}}', closingTime!) : t.closedNow}
  </span>

  {/* Dot separator + rating */}
  {reviewStats && (
    <>
      <span className="text-stone-300">&middot;</span>
      <StarRating rating={reviewStats.average_rating} size="sm" />
      <span className="text-stone-500">({reviewStats.total_reviews})</span>
    </>
  )}

  {/* Dot separator + distance */}
  {distance && (
    <>
      <span className="text-stone-300">&middot;</span>
      <span className="text-stone-500">
        {distance.distance} {distance.metric}
      </span>
    </>
  )}
</div>
```

### Quick Action Buttons (PH-04)
```typescript
// Source: Design doc "3 equal icon+label buttons: Call, Map, Share"
// Icons from lucide-react: Phone, MapPin, Share2
import { Phone, MapPin, Share2 } from 'lucide-react';

<div className="grid grid-cols-3 gap-3">
  <a href={`tel:${business.business_phone_number}`}
     className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 active:bg-stone-100 transition-colors">
    <Phone size={20} className="text-stone-700" />
    <span className="text-xs font-medium text-stone-600">{t.call}</span>
  </a>

  <a href={`https://www.google.com/maps/search/?api=1&query=${business.location?.lat},${business.location?.lng}`}
     target="_blank" rel="noopener noreferrer"
     className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 active:bg-stone-100 transition-colors">
    <MapPin size={20} className="text-stone-700" />
    <span className="text-xs font-medium text-stone-600">{t.map}</span>
  </a>

  <button onClick={handleShare}
     className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 active:bg-stone-100 transition-colors">
    <Share2 size={20} className="text-stone-700" />
    <span className="text-xs font-medium text-stone-600">{t.share}</span>
  </button>
</div>
```

### Google Maps URL
```typescript
// Source: Google Maps documentation
// Universal URL that works on mobile (opens app) and desktop (opens web)
const mapsUrl = business.location?.lat && business.location?.lng
  ? `https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`
  : null;
```

### Translation Keys to Add
```typescript
// Source: Design doc section names + new UI elements
// Add to UI_TEXT in _lib/translations.ts:
// uz:
share: 'Ulashish',
map: 'Xarita',
linkCopied: 'Havola nusxalandi',

// ru:
share: 'Поделиться',
map: 'Карта',
linkCopied: 'Ссылка скопирована',
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hero carousel/mosaic above fold | Avatar-centered profile header | Phase 5 (now) | Complete visual identity change |
| Sticky tab navigation | Vertical scroll with section headers | Phase 5 (now) | TabNavigation component removed |
| Fixed bottom nav bar | Nothing in Phase 5 (floating pill in Phase 7) | Phase 5 (now) | BottomNav component removed |
| Desktop sidebar + wide layout | Single centered column (max-w-480px in Phase 7) | Phase 5 (prep) | DesktopSidebar removal deferred to Phase 7 |

**Deprecated/outdated (to be removed):**
- `HeroMosaic.tsx`: Replaced by no hero -- avatar is the identity
- `HeroCarousel.tsx`: Replaced by no hero -- avatar is the identity
- `HeroEmpty.tsx`: Replaced by ProfileHeader (which always shows avatar)
- `BusinessHeader.tsx`: Replaced by ProfileHeader
- `MetadataBadges.tsx`: Status row logic inlined into ProfileHeader
- `TabNavigation.tsx`: Vertical scroll replaces tabs (no replacement component needed)
- `BottomNav.tsx`: Replaced by floating Book pill in Phase 7

## Open Questions

1. **Book button behavior: navigate to booking or scroll to services?**
   - What we know: The design doc says "Book button -- full-width, primary color, navigates to booking flow." The current service-level Book buttons set a booking intent cookie and navigate to `/booking`. But a general "Book Now" button without a service selection could either: (a) navigate directly to booking page, or (b) scroll to services section for the user to pick a service.
   - What's unclear: The design doesn't specify which behavior the top-level Book button should have.
   - Recommendation: Navigate directly to `${basePath}/booking`. The booking page already handles the case where no service is pre-selected. This matches the requirement "Visitor can tap a full-width Book button above the fold... navigates to the booking flow."

2. **Should the DesktopSidebar be removed in Phase 5 or Phase 7?**
   - What we know: Phase 7 handles the desktop layout change (centered single-column). The DesktopSidebar is only visible on `lg:` screens.
   - What's unclear: Whether Phase 5 should keep the desktop sidebar temporarily or remove it now.
   - Recommendation: Remove it in Phase 5 since the new ProfileHeader doesn't use the sidebar. For the interim (Phases 5-6 before Phase 7 finalizes desktop), the desktop view will simply show the mobile layout in a wider container. Phase 7 will add the max-w-480px centering.

3. **"Copied!" feedback mechanism for share fallback**
   - What we know: When Web Share API is unavailable, we copy to clipboard. User needs visual feedback.
   - What's unclear: How to show "Copied!" feedback without a toast system.
   - Recommendation: Use a brief local state change on the Share button itself (e.g., text changes to "Copied!" for 2 seconds, or a small inline tooltip). No need for a toast library.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected (no test config files in landing-page) |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (type-check + build) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PH-01 | Avatar, name, tagline render centered | manual-only | Visual inspection in browser | N/A |
| PH-02 | Status row shows open/closed, rating, distance | manual-only | Visual inspection in browser | N/A |
| PH-03 | Book button navigates to booking flow | manual-only | Tap button, verify navigation | N/A |
| PH-04 | Call/Map/Share quick actions work | manual-only | Tap each button, verify behavior | N/A |
| PH-05 | Language toggle accessible and functional | manual-only | Tap UZ/RU, verify locale switch | N/A |
| PG-01 | Photo strip displays horizontal thumbnails | manual-only | Visual inspection in browser | N/A |
| PG-02 | Thumbnail tap opens lightbox | manual-only | Tap thumbnail, verify lightbox opens | N/A |
| BUILD | Project builds without errors | smoke | `npm run build` | N/A |
| LINT | No linting errors | smoke | `npm run lint` | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches type errors and import issues)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Full build + lint green + manual visual verification

### Wave 0 Gaps
- No unit/integration test framework is set up for this project
- All requirements are UI-visual and best verified manually or with visual regression tools
- `npm run build` serves as the primary automated verification (TypeScript type-checking + Next.js compilation)

## Sources

### Primary (HIGH confidence)
- Project design document: `docs/plans/2026-03-09-tenant-page-redesign-design.md` -- complete spec for "The Clean Profile" design
- Existing codebase: All component files, types, translations, utilities read directly
- `ROADMAP.md` -- Phase 5 scope and success criteria
- `REQUIREMENTS.md` -- PH-01 through PH-05, PG-01, PG-02 definitions

### Secondary (MEDIUM confidence)
- [MDN Web Share API docs](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) -- navigator.share() interface and browser support
- [Google Maps URL parameters](https://developers.google.com/maps/documentation/urls/get-started) -- universal maps URL format

### Tertiary (LOW confidence)
- None -- all findings verified against codebase and official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, everything already installed and used
- Architecture: HIGH -- follows established project patterns, design doc is detailed and approved
- Pitfalls: HIGH -- based on direct code reading, known browser API limitations, and established patterns in codebase

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- no fast-moving dependencies)
