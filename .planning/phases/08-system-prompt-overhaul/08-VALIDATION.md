---
phase: 8
slug: system-prompt-overhaul
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest ^4.0.16 |
| **Config file** | none — vitest uses defaults |
| **Quick run command** | `cd /Users/shahzod/Projects/BLYSS/blyss-gcloud-api && npm test` |
| **Full suite command** | `cd /Users/shahzod/Projects/BLYSS/blyss-gcloud-api && npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd /Users/shahzod/Projects/BLYSS/blyss-gcloud-api && npm test`
- **After every plan wave:** Run `cd /Users/shahzod/Projects/BLYSS/blyss-gcloud-api && npm test` + manual E2E booking flow
- **Before `/gsd:verify-work`:** Full suite must be green + E2E booking flow verified
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | CONV-04, PROMPT-01 | unit | `npm test` | ❌ W0 | ⬜ pending |
| 08-01-02 | 01 | 1 | PROMPT-03, PROMPT-04 | unit | `npm test` | ❌ W0 | ⬜ pending |
| 08-01-03 | 01 | 1 | BTN-03, BTN-04 | unit (string contains) | `npm test` | ❌ W0 | ⬜ pending |
| 08-01-04 | 01 | 1 | BTN-01, BTN-02 | manual E2E | booking flow in browser | N/A | ⬜ pending |
| 08-01-05 | 01 | 1 | PROMPT-07, PROMPT-09 | manual E2E | 15-message test | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/utils/chatAi.test.js` — unit tests for `buildChatSystemPrompt()`: working hours injection, address injection with/without display_address, payment default, buttons section contains 3-case enumeration
- [ ] No framework install needed — vitest already installed and configured

*Wave 0 creates test stubs; implementation fills them.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Booking confirmation gate | BTN-01, BTN-02 | Requires live OpenAI API call + conversation flow | Run full booking flow: select service → date → time → verify summary + buttons appear → confirm → verify booking created |
| Nudge after Q&A only | PROMPT-09 | Requires evaluating AI response content | Send 15 representative messages: prices, hours, location, greetings, thanks, random → verify nudge on info answers only, not greetings/thanks |
| One question per turn | CONV-01 | Requires evaluating AI response content | Send 10 messages through full booking flow → verify each response has at most 1 question |
| Language matching | CONV-02 | Requires evaluating AI response language | Send messages in Uzbek Latin, Uzbek Cyrillic, Russian → verify response matches input language |
| Natural tone | CONV-03 | Subjective evaluation | Review 10 AI responses for robotic/formal language vs natural conversational tone |
| Unknown question redirect | PROMPT-08 | Requires evaluating AI decision-making | Ask off-topic questions → verify redirect to phone, no guessing |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
