---
phase: 5
slug: profile-header-photo-strip
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-09
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (no test framework in landing-page) |
| **Config file** | none — no unit tests; build serves as type-check |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | PH-05 | smoke | `npm run build` | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | PH-01 | smoke | `npm run build` | N/A | ⬜ pending |
| 05-01-03 | 01 | 1 | PH-02 | smoke | `npm run build` | N/A | ⬜ pending |
| 05-01-04 | 01 | 1 | PH-03 | smoke | `npm run build` | N/A | ⬜ pending |
| 05-01-05 | 01 | 1 | PH-04 | smoke | `npm run build` | N/A | ⬜ pending |
| 05-01-06 | 01 | 1 | PG-01, PG-02 | smoke | `npm run build` | N/A | ⬜ pending |
| 05-02-01 | 02 | 1 | — | smoke | `npm run build` | N/A | ⬜ pending |
| BUILD | — | — | — | smoke | `npm run build` | N/A | ⬜ pending |
| LINT | — | — | — | smoke | `npm run lint` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework installation needed — `npm run build` provides TypeScript type-checking and Next.js compilation as automated verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Avatar 88px centered with gradient fallback | PH-01 | Visual rendering, size/position | Open tenant page, verify avatar is centered, 88px, has gradient when no image |
| Name + tagline visible above fold | PH-01 | Above-fold layout depends on viewport | Open on mobile viewport (375px), confirm name/tagline visible without scroll |
| Status row shows open/closed, rating, distance inline | PH-02 | Visual layout inspection | Verify single-line layout with dot separators |
| Book button full-width, primary color | PH-03 | Visual + navigation | Tap Book, verify it navigates to booking flow |
| Call opens phone dialer | PH-04 | Requires device interaction | Tap Call on mobile, verify dialer opens |
| Map opens Google Maps | PH-04 | External service | Tap Map, verify Google Maps opens with correct coordinates |
| Share triggers share/clipboard | PH-04 | Browser API interaction | Tap Share on mobile (verify native share) and desktop Firefox (verify clipboard copy) |
| Language toggle at top of page | PH-05 | Visual position + locale routing | Tap UZ/RU toggle, verify locale changes |
| Photo strip horizontal scroll | PG-01 | Scroll behavior | Verify thumbnails are horizontal, scrollable |
| Thumbnail opens lightbox | PG-02 | User interaction | Tap any thumbnail, verify fullscreen lightbox opens with swipe navigation |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
