# Phase 6: Services & Team - Research

**Researched:** 2026-03-09
**Domain:** React component extraction, accordion UI pattern, horizontal scroll strips
**Confidence:** HIGH

## Summary

Phase 6 extracts the inline services section from TenantPage.tsx into proper components and replaces the old TeamSection/TeamCard with a compact avatar strip. The codebase already contains every pattern needed: the `WorkingHours.tsx` component demonstrates the exact expand/collapse animation pattern (AnimatePresence + height: 0/auto), `PhotoStrip.tsx` provides the horizontal scroll strip pattern, and the `Avatar` component supports className overrides for 56px sizing. No new dependencies are required.

The main work is: (1) extracting ~35 lines of inline services JSX from TenantPage into a `ServicesSection` component with expandable/non-expandable row logic, (2) replacing the v1.0 TeamSection/TeamCard with a simple avatar strip component, and (3) updating TenantPage to use the new components.

**Primary recommendation:** Follow the WorkingHours.tsx expand/collapse pattern exactly (AnimatePresence + motion.div with height: 0/auto + springs.gentle) for service row expansion. Reuse the PhotoStrip horizontal scroll pattern for the team avatar strip.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Tap anywhere on service row to expand (entire row is tappable)
- Subtle chevron icon rotates to indicate expanded/collapsed state
- Accordion behavior: only one row open at a time (opening a new row closes the previous)
- Expanded state shows: service description text + Book button
- Book button uses current outline pill style (rounded-full, stone border)
- Expand animation uses existing Motion library for smooth height transition
- If a service has no description, the row is NOT expandable (no chevron shown)
- Non-expandable rows show the Book button always visible on the right side (current behavior)
- Category pills are not sticky -- stay in natural position
- Instant swap when selecting a category (no animation/transition)
- Reuse existing "All" translation (Hammasi/Vse) from allPhotos key
- No service counts on pills -- just the category name
- Hide pills entirely when only one category exists
- Team strip: 56px avatar circles with name and role below
- Team strip is not tappable -- purely visual display
- Hide entire team section when business has 1 or fewer employees
- Keep section heading "Mutaxassislar/Spetsialisty" above the strip
- Horizontal scroll for overflow, consistent with PhotoStrip pattern
- 0 services: keep current centered empty state text
- Long service names: truncate with ellipsis at 1 line (line-clamp-1)
- Booking loading state: keep current spinner on Book button while navigating

### Claude's Discretion
- Exact expand/collapse animation timing and easing
- Service row internal spacing and typography sizes
- Whether to extract services into a separate ServicesSection component vs keep inline
- Team strip item width and gap sizing
- Chevron icon choice and size

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SV-01 | Visitor sees a flat list of services with name, duration, and price per row | Current inline code in TenantPage lines 96-117 already renders this; needs accordion logic added |
| SV-02 | Visitor can filter services by category pills when multiple categories exist | Category pills already implemented inline (lines 86-93); extract as-is into component |
| SV-03 | Visitor can tap a service row to expand it and reveal description + Book button | WorkingHours.tsx provides exact AnimatePresence + height:auto pattern to follow |
| SV-04 | Tapping Book sets booking intent cookie and navigates to booking flow | handleBookService() already implemented in TenantPage (lines 44-49); pass as prop |
| TM-01 | Visitor sees team members as a compact horizontal avatar strip (when >1 employee) | PhotoStrip.tsx provides scroll pattern; Avatar component supports className override for 56px |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.34.0 | Expand/collapse animations | Already used in TenantPage, WorkingHours, GalleryLightbox |
| lucide-react | 0.563.0 | ChevronDown icon for expand indicator | Already used across all components |
| React 19 | 19.2.3 | Component framework | Project standard |
| TailwindCSS 4 | ^4 | Styling | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @/app/components/ui/Avatar | existing | Avatar circles with gradient fallback | Team strip member avatars |
| @/app/components/ui/_lib/cn | existing | Class name merging | Conditional styles |
| @/lib/animations | existing | Spring transition presets | Expand/collapse animation timing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| AnimatePresence height animation | CSS max-height transition | CSS approach is jankier with unknown heights; motion already in bundle |
| Accordion state in parent | Each row manages own state | Accordion requires single-source state to close siblings |

**Installation:**
No new packages needed. All dependencies already present.

## Architecture Patterns

### Recommended Project Structure
```
app/[locale]/[tenant]/
  _components/
    ServicesSection.tsx     # NEW: extracted services + category pills + accordion rows
    TeamStrip.tsx           # NEW: replaces TeamSection.tsx + TeamCard.tsx
    TeamSection.tsx         # DEPRECATED: old v1.0 component
    TeamCard.tsx            # DEPRECATED: old v1.0 component
  TenantPage.tsx            # MODIFIED: uses new ServicesSection and TeamStrip
```

### Pattern 1: Accordion Expand/Collapse (from WorkingHours.tsx)
**What:** AnimatePresence wrapping a conditional motion.div that animates height from 0 to auto
**When to use:** Service row expansion
**Example:**
```typescript
// Source: app/[locale]/[tenant]/_components/WorkingHours.tsx lines 121-138
// Exact pattern already in codebase:
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@/lib/animations';

// Chevron rotation:
<motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
  <ChevronDown size={16} className="text-stone-400" />
</motion.div>

// Content expand/collapse:
<AnimatePresence>
  {expanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={springs.gentle}
      className="overflow-hidden"
    >
      {/* expanded content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Pattern 2: Horizontal Scroll Strip (from PhotoStrip.tsx)
**What:** Flex container with overflow-x-auto and scrollbar-hide for horizontal scrolling
**When to use:** Team avatar strip, category pills (already using this)
**Example:**
```typescript
// Source: app/[locale]/[tenant]/_components/PhotoStrip.tsx
<div className="flex gap-2 overflow-x-auto scrollbar-hide">
  {items.map((item) => (
    <div key={item.id} className="flex-shrink-0">
      {/* item content */}
    </div>
  ))}
</div>
```

### Pattern 3: Plain Function Export (from ProfileHeader.tsx)
**What:** v2.0 components use plain function exports, not forwardRef
**When to use:** All new components in this phase
**Example:**
```typescript
// Source: established in Phase 5 (STATE.md decision P5-01)
export function ServicesSection({ ... }: ServicesSectionProps) { ... }
// NOT: const ServicesSection = React.forwardRef(...)
```

### Pattern 4: Dual Row Mode (expandable vs flat)
**What:** Service rows have two display modes based on whether description exists
**When to use:** Every service row
**Logic:**
```typescript
const isExpandable = !!service.description && getText(service.description, locale).trim() !== '';
// Expandable: chevron shown, Book button hidden until expanded
// Flat (no description): no chevron, Book button always visible on right
```

### Anti-Patterns to Avoid
- **forwardRef on new components:** v2.0 decision is plain function exports (STATE.md P5-01)
- **CSS max-height for expand:** Use motion AnimatePresence pattern for consistent animation behavior
- **Multiple expanded rows:** Accordion must enforce single-open; use `expandedId` state, not boolean per row
- **Filtering with animation:** Category pill switch is instant (no transition/animation per CONTEXT.md)
- **Sticky pills:** CONTEXT.md explicitly says pills are NOT sticky

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Height expand animation | CSS max-height hack or custom JS | AnimatePresence + motion.div height:0/auto | Already proven in WorkingHours.tsx; handles cleanup, exit animation, and unknown heights |
| Avatar with fallback | Custom div with initial | `Avatar` component from `@/app/components/ui/Avatar` | Already handles gradient selection, initial letter, image loading |
| Spring timing presets | Inline transition objects | `springs` from `@/lib/animations` | Consistent feel across all animated components |
| Scroll strip CSS | Custom overflow handling | `overflow-x-auto scrollbar-hide flex gap-N` pattern | Proven in PhotoStrip and category pills |

**Key insight:** Every UI pattern needed for this phase already exists in the codebase. The work is extraction and composition, not invention.

## Common Pitfalls

### Pitfall 1: AnimatePresence without overflow-hidden
**What goes wrong:** Content visually overflows during height animation (0 to auto)
**Why it happens:** motion.div animates height but child content is visible outside bounds
**How to avoid:** Always add `className="overflow-hidden"` to the motion.div being animated
**Warning signs:** Content briefly visible below the collapsed row during animation

### Pitfall 2: Accordion state not closing previous row
**What goes wrong:** Multiple rows stay expanded simultaneously
**Why it happens:** Using boolean state per row instead of single expandedId
**How to avoid:** Use `const [expandedId, setExpandedId] = useState<string | null>(null)` and toggle: `setExpandedId(id === expandedId ? null : id)`
**Warning signs:** Two rows visually expanded at once

### Pitfall 3: Forgetting to check description is non-empty string
**What goes wrong:** Rows with empty description string still show as expandable
**Why it happens:** `service.description` is `MultilingualText | null`, but the MultilingualText could have empty strings
**How to avoid:** Check `getText(service.description, locale).trim() !== ''` not just `!!service.description`
**Warning signs:** Expandable row that reveals empty content

### Pitfall 4: Team section showing for single employee
**What goes wrong:** Team strip visible when there's only 1 employee (or zero)
**Why it happens:** Missing the `> 1` check (not `> 0`)
**How to avoid:** Condition: `employees.length > 1` per CONTEXT.md
**Warning signs:** Lonely single-person avatar strip

### Pitfall 5: Breaking existing booking flow
**What goes wrong:** `handleBookService` stops working after refactoring
**Why it happens:** Function depends on state in TenantPage (bookingServiceId, router, basePath); needs to be passed as prop
**How to avoid:** Pass `onBook: (service: Service) => void` and `bookingServiceId: string | null` as props to ServicesSection
**Warning signs:** Clicking Book does nothing or throws error

### Pitfall 6: Category pill "All" label inconsistency
**What goes wrong:** Wrong translation key used for "All" pill
**Why it happens:** Using a new key instead of existing `allPhotos` key
**How to avoid:** Use `t.allPhotos` which already has Hammasi/Vse translations
**Warning signs:** Untranslated "All" text

## Code Examples

Verified patterns from existing codebase:

### Service Row with Accordion (complete pattern)
```typescript
// Combines: TenantPage.tsx service row + WorkingHours.tsx expand pattern
// Source: both files in app/[locale]/[tenant]/

interface ServiceRowProps {
  service: Service;
  locale: Locale;
  isExpanded: boolean;
  onToggle: () => void;
  onBook: (service: Service) => void;
  isBooking: boolean;
  translations: { book: string; minute: string; hour: string; sum: string };
}

function ServiceRow({ service, locale, isExpanded, onToggle, onBook, isBooking, translations: t }: ServiceRowProps) {
  const description = getText(service.description, locale).trim();
  const isExpandable = description !== '';

  return (
    <div>
      <div
        onClick={isExpandable ? onToggle : undefined}
        className={cn(
          'flex items-center justify-between py-4',
          isExpandable && 'cursor-pointer'
        )}
      >
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-base font-medium text-stone-900 line-clamp-1">
            {getText(service.name, locale)}
          </h4>
          <p className="text-sm text-stone-500 mt-0.5">
            {formatDuration(service.duration_minutes, t.minute, t.hour)}
          </p>
          <p className="text-sm font-medium text-stone-900 mt-0.5">
            {formatPrice(service.price)} {t.sum}
          </p>
        </div>

        {/* Flat row: Book button always visible */}
        {!isExpandable && (
          <BookButton service={service} onBook={onBook} isBooking={isBooking} label={t.book} />
        )}

        {/* Expandable row: chevron indicator */}
        {isExpandable && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-stone-400" />
          </motion.div>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpandable && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.gentle}
            className="overflow-hidden"
          >
            <div className="pb-4">
              <p className="text-sm text-stone-500 mb-3">{description}</p>
              <BookButton service={service} onBook={onBook} isBooking={isBooking} label={t.book} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Team Avatar Strip (complete pattern)
```typescript
// Combines: PhotoStrip.tsx scroll pattern + Avatar component + TeamCard data extraction
// Source: PhotoStrip.tsx, Avatar.tsx, TeamCard.tsx

function TeamStrip({ employees, locale, translations: t }: TeamStripProps) {
  if (employees.length <= 1) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900 mb-4">{t.specialists}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {employees.map((employee) => {
          const name = [employee.first_name, employee.last_name].filter(Boolean).join(' ');
          const displayName = name || employee.position;
          const avatarName = employee.first_name || employee.position || '?';

          return (
            <div key={employee.id} className="flex flex-col items-center flex-shrink-0">
              <Avatar
                name={avatarName}
                size="xl"
                className="w-14 h-14 text-sm"  // 56px override
              />
              <p className="text-xs font-medium text-stone-900 mt-1.5 text-center line-clamp-1 w-16">
                {displayName}
              </p>
              {name && employee.position && (
                <p className="text-[11px] text-stone-500 text-center line-clamp-1 w-16 mt-0.5">
                  {employee.position}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Book Button (extracted helper)
```typescript
// Source: TenantPage.tsx lines 107-110 (current inline button)
function BookButton({ service, onBook, isBooking, label }: {
  service: Service;
  onBook: (s: Service) => void;
  isBooking: boolean;
  label: string;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onBook(service); }}
      disabled={isBooking}
      className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium border border-stone-200 text-stone-900 hover:bg-stone-50 transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5"
    >
      {isBooking && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {label}
    </button>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| forwardRef on all components | Plain function exports for v2.0 sections | Phase 5 (P5-01) | New components use `export function` |
| Tab navigation with refs | Vertical scroll with section headers | Phase 5 (P5-02) | No scroll-to-section refs needed |
| 120px team cards with snap | 56px avatar strip with horizontal scroll | This phase | Simpler, more compact team display |
| All services show Book button | Expandable rows hide Book until expanded | This phase | Cleaner list, description discovery |

**Deprecated/outdated:**
- `TeamSection.tsx` (v1.0): Uses forwardRef, 72-88px avatars, empty state handling. Will be replaced
- `TeamCard.tsx` (v1.0): Uses forwardRef, 120px card width, snap-start. Will be replaced
- Both old components can be deleted after new TeamStrip is in place

## Open Questions

1. **Extract ServicesSection or keep inline?**
   - What we know: CONTEXT.md marks this as Claude's discretion
   - Recommendation: **Extract.** The services section is ~35 lines of JSX with its own state (expandedId, activeCategory). Extracting makes TenantPage cleaner and follows the ProfileHeader/PhotoStrip pattern of one component per section.

2. **ChevronDown vs other chevron for expand indicator**
   - What we know: ChevronDown already used in WorkingHours.tsx for the same purpose
   - Recommendation: **Use ChevronDown** from lucide-react. Rotate 180 degrees when expanded (matching WorkingHours pattern). Size 18px for service rows.

3. **Team strip item width and gap**
   - What we know: CONTEXT.md specifies 56px circles. Old TeamCard used 120px width.
   - Recommendation: Avatar w-14 h-14 (56px), container width ~w-16 (64px) for text, gap-4 (16px). Similar density to PhotoStrip.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SV-01 | Flat list of services with name, duration, price | manual-only | Visual inspection in browser | N/A |
| SV-02 | Category pills filter when multiple categories | manual-only | Visual inspection: tap pills, verify filtering | N/A |
| SV-03 | Tap service row to expand description + Book | manual-only | Visual inspection: tap row, see expand animation | N/A |
| SV-04 | Book sets cookie and navigates to booking | manual-only | Click Book, verify cookie + navigation | N/A |
| TM-01 | Horizontal avatar strip for >1 employee | manual-only | Visual inspection with multi-employee business | N/A |

**Justification for manual-only:** No test framework is installed in this Next.js landing-page project. All requirements are visual/interactive UI behaviors that need browser-based verification. The project uses `npm run build` as its primary automated quality gate (TypeScript compilation catches type errors).

### Sampling Rate
- **Per task commit:** `npm run build` (TypeScript type checking)
- **Per wave merge:** `npm run build` + manual visual inspection
- **Phase gate:** Build passes + all 5 requirements visually verified

### Wave 0 Gaps
- No test framework installed; project relies on TypeScript compilation + manual testing
- Recommend `npm run build` as the automated validation gate for this phase

## Sources

### Primary (HIGH confidence)
- `app/[locale]/[tenant]/TenantPage.tsx` -- current inline services code, lines 80-118
- `app/[locale]/[tenant]/_components/WorkingHours.tsx` -- expand/collapse pattern with AnimatePresence
- `app/[locale]/[tenant]/_components/PhotoStrip.tsx` -- horizontal scroll strip pattern
- `app/[locale]/[tenant]/_components/TeamSection.tsx` + `TeamCard.tsx` -- old v1.0 components to replace
- `app/components/ui/Avatar.tsx` -- Avatar component with className override support
- `app/[locale]/[tenant]/_lib/types.ts` -- Service.description type is `MultilingualText | null`
- `app/[locale]/[tenant]/_lib/translations.ts` -- all UI_TEXT keys including allPhotos, specialists
- `lib/animations.ts` -- springs.gentle transition preset
- `.planning/phases/06-services-team/06-CONTEXT.md` -- locked decisions and discretion areas
- `.planning/STATE.md` -- accumulated project decisions

### Secondary (MEDIUM confidence)
- motion library v12.34.0 `package.json` -- version confirmed from node_modules

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already in use, no new dependencies
- Architecture: HIGH -- every pattern exists in codebase (WorkingHours, PhotoStrip, ProfileHeader)
- Pitfalls: HIGH -- derived from actual code analysis, real type definitions, and established patterns

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- no external dependencies or fast-moving APIs)
