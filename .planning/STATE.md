---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Tenant Page Redesign
status: planning
stopped_at: Completed 08-system-prompt-overhaul/08-01-PLAN.md
last_updated: "2026-03-11T20:15:02.669Z"
last_activity: 2026-03-12 — v3.0 roadmap created (Phases 8-9)
progress:
  total_phases: 9
  completed_phases: 4
  total_plans: 13
  completed_plans: 12
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-12)

**Core value:** Every page a customer sees should feel trustworthy and polished enough that they'd book without hesitation
**Current focus:** v3.0 AI Chat Experience Overhaul — Phase 8 (System Prompt Overhaul)

## Current Position

Phase: 8 of 9 in v3.0 (System Prompt Overhaul)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-03-12 — v3.0 roadmap created (Phases 8-9)

Progress: [░░░░░░░░░░] 0% (v3.0 phases 8-9 not started)

## Accumulated Context

### Decisions

- [v1.0]: Nunito Sans font, light mode only, cn() utility, native dialog for Modal
- [v1.0]: Phase 1 design system primitives reusable in v2.0
- [v2.0]: "The Clean Profile" design — avatar-centered, no hero, above-fold booking
- [v2.0]: Chat widget added with AI booking assistant (ChatWidget.tsx + chatAi.js)
- [v3.0]: All PROMPT-*, BTN-*, CONV-* requirements are changes to one file (chatAi.js) — grouped into Phase 8 (blyss-gcloud-api repo)
- [v3.0]: FE-* requirements are additive prop changes to ChatWidget.tsx — grouped into Phase 9 (landing-page repo)
- [v3.0]: Phase 8 and Phase 9 are explicitly independent; can execute in parallel
- [v3.0]: Phase 8 is risk-bearing — modifies live booking flow; end-to-end test required before marking complete
- [v3.0]: System prompt must stay under 800 tokens; critical OTP/phone ordering rules appear first
- [v3.0]: Buttons permitted only in 3 cases: quick-start greeting, structured choice (service/date/time), pre-booking confirmation
- [v3.0]: button.value must equal button.label for correct handleButtonClick behavior
- [Phase 08-system-prompt-overhaul]: buildWorkingHoursLine() formats hours as 'Dushanba: 09:00-19:00' comma-separated string injected into prompt identity block
- [Phase 08-system-prompt-overhaul]: payment_methods field does not exist on business Firestore document — use 'naqd pul yoki karta' as hardcoded fallback
- [Phase 08-system-prompt-overhaul]: Buttons restricted to 3 exact cases: quick-start greeting, structured choice, pre-booking confirmation — all others get empty array
- [Phase 08-system-prompt-overhaul]: History limit reduced from 30 to 20 messages for token budget compliance; prompt stays under ~3200 chars / 800 tokens

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 8]: Verify whether `payment_methods` exists as structured field on business Firestore document, or use "naqd yoki karta" default — check at implementation start
- [Phase 8]: Uzbek Cyrillic phrasing needs human native-speaker review during testing
- [Phase 8]: Measure actual per-call token counts during end-to-end booking flow test; reduce history from 30 to 20 messages

## Session Continuity

Last session: 2026-03-11T20:15:02.667Z
Stopped at: Completed 08-system-prompt-overhaul/08-01-PLAN.md
Resume file: None
