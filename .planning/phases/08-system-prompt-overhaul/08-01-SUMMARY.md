---
phase: 08-system-prompt-overhaul
plan: 01
subsystem: ai
tags: [openai, chatai, system-prompt, booking, uzbek, vitest, tdd]

# Dependency graph
requires: []
provides:
  - buildWorkingHoursLine() helper formatting working hours as human-readable Uzbek string
  - buildChatSystemPrompt() with SAVOLLARGA JAVOB Q&A rules for 9 question types
  - TASDIQLASH confirmation gate preventing create_booking before explicit user confirmation
  - BUTTONS section limiting button usage to FAQAT 3 HOLAT (3 exact cases)
  - Business context injection: working hours, conditional address, payment fallback
  - Nudge variation rules (Yozdiraysizmi? / Band qilaylikmi? etc.)
  - One-question-per-turn rule (CONV-01)
  - History limit reduced from 30 to 20 messages
  - 11 unit tests covering all system prompt requirements
affects: [09-chat-widget-overhaul]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD: write failing tests first, then implement to pass (RED → GREEN)"
    - "Test exports: export { fn as _fn } at module bottom for unit testing private functions"
    - "Conditional prompt injection: only include address line when address is non-empty"
    - "Payment fallback: businessData.payment_methods || 'naqd pul yoki karta'"

key-files:
  created:
    - /Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/utils/chatAi.test.js
  modified:
    - /Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/utils/chatAi.js

key-decisions:
  - "buildWorkingHoursLine() formats hours as 'Dushanba: 09:00-19:00' style comma-separated string injected into prompt identity block"
  - "Address injection is conditional: only add 'Manzil: {address}' if display_address or street_name is non-empty"
  - "payment_methods field does not exist on business Firestore document — use 'naqd pul yoki karta' as hardcoded fallback"
  - "Buttons restricted to exactly 3 cases: quick-start greeting, structured choice (service/date/time), pre-booking confirmation"
  - "button.value must equal button.label for correct handleButtonClick behavior"
  - "System prompt trimmed to ~3200 characters to stay under 800-token budget"
  - "History limit reduced from 30 to 20 messages for token efficiency"

patterns-established:
  - "Q&A rules follow format: '<question type> → <action>, keyin NUDGE (intensity)'"
  - "NUDGE is text only (not a button): cycle through Yozdiraysizmi? / Band qilaylikmi? / Yozilmoqchimisiz? / Yozib qo'yaymi?"
  - "Greetings/small talk get no nudge: salom/rahmat/xayr → short natural reply only"
  - "Unknown questions: redirect to phone number, do not guess"

requirements-completed:
  - PROMPT-01
  - PROMPT-02
  - PROMPT-03
  - PROMPT-04
  - PROMPT-05
  - PROMPT-06
  - PROMPT-07
  - PROMPT-08
  - PROMPT-09
  - BTN-01
  - BTN-02
  - BTN-03
  - BTN-04
  - CONV-01
  - CONV-02
  - CONV-03
  - CONV-04

# Metrics
duration: 15min
completed: 2026-03-12
---

# Phase 8 Plan 01: System Prompt Overhaul Summary

**AI chat system prompt rewritten with Q&A rules for 9 question types, TASDIQLASH confirmation gate, FAQAT 3 HOLAT button discipline, and business context injection (working hours, address, payment) via TDD**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-12T01:00:00Z
- **Completed:** 2026-03-12T01:15:00Z
- **Tasks:** 2 (TDD: RED + GREEN)
- **Files modified:** 2

## Accomplishments

- Added `buildWorkingHoursLine()` helper that formats working_hours object as "Dushanba: 09:00-19:00, ..." Uzbek string
- Rewrote `buildChatSystemPrompt()` with 8 structured sections: identity+context, conversation style, Q&A rules, booking flow, TASDIQLASH confirmation gate, BUTTONS discipline, INPUT_TYPE guide
- Reduced conversation history limit from 30 to 20 messages for token efficiency
- Created 11 unit tests (TDD RED → GREEN) covering all 17 requirements across PROMPT-*, BTN-*, CONV-* groups
- All 138 existing tests continue to pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing unit tests (RED)** - `d514829` (test)
2. **Task 2: Rewrite system prompt (GREEN)** - `fd68064` (feat)

_Note: TDD tasks have two commits (test → feat)_

## Files Created/Modified

- `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/utils/chatAi.test.js` - 11 vitest unit tests for buildChatSystemPrompt with mocked external deps
- `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/utils/chatAi.js` - Added buildWorkingHoursLine(), rewrote buildChatSystemPrompt() with Q&A/confirmation/button rules, reduced history limit to 20, added _buildWorkingHoursLine test export

## Decisions Made

- `payment_methods` confirmed not to exist on Firestore business document — hardcoded fallback "naqd pul yoki karta" used as planned
- Prompt trimmed from verbose ~120-line version to compact ~100-line version staying under 3200 char / 800 token budget
- Test exports use `export { fn as _fn }` pattern at bottom of module to avoid polluting the public API surface

## Deviations from Plan

None — plan was already partially executed (Task 1 RED commit and Task 2 GREEN implementation both existed as uncommitted/prior-committed work). Verified all tests pass and committed the GREEN implementation as specified.

## Issues Encountered

- `server.test.js` fails with "FATAL: JWT_SECRET environment variable is required" — this is a pre-existing issue unrelated to this plan. The test has always required environment setup. All 138 other tests pass.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 9 (Chat Widget Overhaul — landing-page repo) can proceed independently
- All PROMPT-*, BTN-*, CONV-* requirements are satisfied
- The AI will now answer working hours, prices, location, payment questions from business data before nudging toward booking
- The AI will never call create_booking without explicit user confirmation ("Ha, yozib qo'ying" or equivalent)

---
*Phase: 08-system-prompt-overhaul*
*Completed: 2026-03-12*
