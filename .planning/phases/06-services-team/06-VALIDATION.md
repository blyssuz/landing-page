---
phase: 6
slug: services-team
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-09
---

# Phase 6 — Validation Strategy

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
| 06-01-01 | 01 | 1 | SV-01, SV-02, SV-03, SV-04 | smoke | `npm run build` | N/A | ⬜ pending |
| 06-02-01 | 02 | 2 | TM-01 | smoke | `npm run build` | N/A | ⬜ pending |
| 06-02-02 | 02 | 2 | — | smoke | `npm run build` | N/A | ⬜ pending |
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
| Flat service list with name, duration, price | SV-01 | Visual layout | Open tenant page, verify service rows show all 3 data points with dividers |
| Category pills filter services | SV-02 | Interactive behavior | Tap category pills, verify services filter instantly; verify "All" pill present |
| Service row expands with description + Book | SV-03 | Accordion animation | Tap expandable row, verify description + Book button appear; tap another, verify first closes |
| Non-expandable rows show Book always | SV-03 | Edge case | Find service without description, verify Book is always visible, no chevron |
| Book sets cookie and navigates | SV-04 | Cookie + navigation | Tap Book, verify cookie set and navigation to /booking |
| Team avatar strip 56px | TM-01 | Visual sizing | Verify avatars are 56px with name + role below |
| Team hidden for solo employee | TM-01 | Conditional render | Open business with 1 employee, verify no team section |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
