---
phase: 01
slug: design-system-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No test framework — build-time TypeScript + lint validation |
| **Config file** | none — no test framework installed |
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
| 01-01-01 | 01 | 1 | DS-09, DS-10 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | DS-09 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | DS-01 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | DS-02 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | DS-04 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-04 | 02 | 1 | DS-05 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-05 | 02 | 1 | DS-06 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-06 | 02 | 1 | DS-07 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-07 | 02 | 1 | DS-08 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-08 | 02 | 1 | DS-03 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-09 | 02 | 1 | AR-02, AR-03 | smoke | directory structure check | ❌ W0 | ⬜ pending |
| 01-02-10 | 02 | 1 | DS-10, DS-11 | smoke | `grep` anti-pattern check | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers build + lint validation
- No test framework installation needed for this phase (presentational components)
- Anti-pattern smoke scripts (hardcoded hex, `dark:` classes, `gray-*` usage) can be run ad-hoc

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Modal scroll lock on iOS Safari | DS-03 | Requires real iOS device/simulator | Open modal, attempt to scroll background on iPhone |
| Modal focus trap | DS-03 | Requires browser tab focus testing | Open modal, press Tab repeatedly, verify focus stays within |
| Typography visual consistency | DS-09 | Visual design assessment | Compare headings, body, caption across all components |
| Warm visual language cohesion | DS-11 | Aesthetic judgment | Review all components for consistent stone palette, warm shadows, rounded corners |
| Mobile-first responsive | IX-04 | Viewport testing | Check all components at 375px, 768px, 1024px breakpoints |
| Skeleton shimmer animation | DS-06 | CSS animation requires visual check | Verify shimmer gradient moves smoothly left-to-right |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
