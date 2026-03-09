# Phase 6: Services & Team - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors can browse services, filter by category, expand for details, and book -- plus see the team at a glance. This phase extracts the inline services code from TenantPage into proper components, adds expand/collapse behavior, and replaces the old TeamSection/TeamCard with a compact avatar strip. No new data fetching or routing changes.

</domain>

<decisions>
## Implementation Decisions

### Service row expand/collapse
- Tap anywhere on the row to expand (entire row is tappable)
- Subtle chevron icon rotates to indicate expanded/collapsed state
- Accordion behavior: only one row open at a time (opening a new row closes the previous)
- Expanded state shows: service description text + Book button
- Book button uses current outline pill style (rounded-full, stone border)
- Expand animation uses existing Motion library for smooth height transition

### Non-expandable services
- If a service has no description, the row is NOT expandable (no chevron shown)
- Non-expandable rows show the Book button always visible on the right side (current behavior)
- This means rows can be in two modes: expandable (with description) and flat (without)

### Category pills
- Not sticky -- pills stay in their natural position, don't float when scrolling
- Instant swap when selecting a category (no animation/transition)
- Reuse existing "All" translation (Hammasi/Все) from allPhotos key
- No service counts on pills -- just the category name
- Hide pills entirely when only one category exists (already the case in current code)

### Team strip
- 56px avatar circles with name and role below
- Not tappable -- purely visual display
- Hide the entire team section when business has 1 or fewer employees
- Keep section heading "Mutaxassislar/Специалисты" above the strip
- Horizontal scroll for overflow, consistent with PhotoStrip pattern

### Edge states
- 0 services: keep current centered empty state text ("Xizmatlar mavjud emas")
- Long service names: truncate with ellipsis at 1 line (line-clamp-1)
- Booking loading state: keep current spinner on Book button while navigating

### Claude's Discretion
- Exact expand/collapse animation timing and easing
- Service row internal spacing and typography sizes
- Whether to extract services into a separate ServicesSection component vs keep inline
- Team strip item width and gap sizing
- Chevron icon choice and size

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Avatar` component: Already supports gradient+initial fallback, used in TeamCard (needs 56px override via className)
- `Button` component: Available but current Book buttons use custom styled elements
- `cn()` utility: Class name merging, used everywhere
- `Motion` (framer-motion): Already imported in TenantPage for service row stagger animations
- `setBookingIntent()` server action: Booking cookie logic, already wired in TenantPage
- `formatPrice()`, `formatDuration()`, `getText()`: Utility functions in `_lib/utils.ts`
- `UI_TEXT` translations: All service/team keys already exist

### Established Patterns
- Horizontal scroll strips: PhotoStrip uses `overflow-x-auto scrollbar-hide flex gap-2` pattern
- Service grouping: `groupedServices` reduce already implemented in TenantPage (lines 51-57)
- Category pills: Already inline in TenantPage with activeCategory state (lines 86-93)
- Booking flow: `handleBookService()` sets cookie + navigates (lines 44-49)

### Integration Points
- TenantPage.tsx lines 80-118: Services section currently inline -- needs extraction or refactoring
- TenantPage.tsx lines 121-125: TeamSection currently renders old v1.0 component
- TeamSection.tsx + TeamCard.tsx: Old v1.0 components to be replaced (forwardRef pattern, 120px cards)
- `_lib/types.ts`: Service.description is `MultilingualText | null` -- null check drives expandable vs flat

</code_context>

<specifics>
## Specific Ideas

- Non-expandable rows (no description) keep the Book button always visible -- expandable rows hide Book until expanded
- Accordion pattern: only one service expanded at a time, keeps list compact
- Team strip follows same horizontal scroll pattern as PhotoStrip (visual consistency)

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 06-services-team*
*Context gathered: 2026-03-09*
