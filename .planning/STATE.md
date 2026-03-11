---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: AI Chat Experience Overhaul
status: ready_to_plan
stopped_at: null
last_updated: "2026-03-12"
last_activity: 2026-03-12 — Roadmap created for v3.0 (Phases 8-9). Ready to plan Phase 8.
progress:
  total_phases: 2
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
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

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 8]: Verify whether `payment_methods` exists as structured field on business Firestore document, or use "naqd yoki karta" default — check at implementation start
- [Phase 8]: Uzbek Cyrillic phrasing needs human native-speaker review during testing
- [Phase 8]: Measure actual per-call token counts during end-to-end booking flow test; reduce history from 30 to 20 messages

## Session Continuity

Last session: 2026-03-12
Stopped at: Roadmap created for v3.0 (Phases 8-9). Ready to plan Phase 8.
Resume file: None
