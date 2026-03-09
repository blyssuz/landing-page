---
phase: 2
slug: tenant-page-presentation-layout
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — UI presentation layer, no test framework installed |
| **Config file** | none |
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
| 02-01-01 | 01 | 1 | AR-01 | smoke | `npm run build` | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | TH-05, TH-06 | manual-only | Visual inspection | N/A | ⬜ pending |
| 02-01-03 | 01 | 1 | TH-01, TH-02 | manual-only | Visual + touch test | N/A | ⬜ pending |
| 02-01-04 | 01 | 1 | TH-03, TH-04 | manual-only | Touch + desktop test | N/A | ⬜ pending |
| 02-02-01 | 02 | 1 | TA-03 | manual-only | Scroll test | N/A | ⬜ pending |
| 02-02-02 | 02 | 1 | TR-01 | manual-only | Visual + scroll test | N/A | ⬜ pending |
| 02-02-03 | 02 | 1 | TR-02, TR-03, TR-04 | manual-only | Visual + click test | N/A | ⬜ pending |
| 02-02-04 | 02 | 1 | TA-01, TA-02 | manual-only | Visual + scroll test | N/A | ⬜ pending |
| 02-02-05 | 02 | 1 | TA-04 | manual-only | Visual at mobile | N/A | ⬜ pending |
| 02-02-06 | 02 | 1 | TA-05 | manual-only | Throttle network | N/A | ⬜ pending |
| 02-02-07 | 02 | 1 | TH-07 | manual-only | Click + URL verify | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework setup needed — validation is build-time type checking (`npm run build`) + ESLint (`npm run lint`) + manual visual inspection.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Desktop mosaic renders 5-photo grid | TH-01 | Visual layout — no programmatic assertion possible without visual regression | Open at lg+ breakpoint, verify 1-large + 4-small grid |
| Mobile carousel swipes with dot indicators | TH-02 | Touch interaction | Open at mobile width, swipe photos, verify dots update |
| Fullscreen lightbox with transitions | TH-03 | Animation quality + gesture behavior | Tap photo, verify shared-element transition, swipe navigation |
| "See all photos" button | TH-04 | Conditional UI | Verify button appears when >5 photos available |
| Header displays name, avatar, tagline | TH-05 | Visual hierarchy | Inspect typography, spacing, badge layout |
| Metadata badges | TH-06 | Visual + data correctness | Verify open/closed, rating, distance badges |
| Language switcher | TH-07 | Interactive + URL routing | Toggle RU/UZ, verify content changes + URL update |
| Team horizontal scroll | TR-01 | Scroll behavior + snap | Scroll team row, verify snap-center behavior |
| Aggregate rating with bars | TR-02 | Visual layout | Verify large number + 5-to-1 distribution bars |
| Individual review cards | TR-03 | Visual + data | Verify avatar, name, rating, date, comment, service tag |
| Show all / fewer reviews | TR-04 | Interactive toggle | Click "Show all", verify expansion; click "Show fewer" |
| About section | TA-01 | Visual layout | Verify hours, contact, location display |
| Desktop sticky sidebar | TA-02 | Scroll behavior | Scroll page at lg+, verify sidebar stays fixed |
| Sticky tabs + IO | TA-03 | Scroll + intersection | Scroll through sections, verify active tab updates |
| Mobile bottom nav | TA-04 | Visual + safe area | Open at mobile, verify 3-item nav with elevated CTA |
| Per-section skeletons | TA-05 | Loading states | Throttle network, verify skeleton placeholders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
