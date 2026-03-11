# Project Research Summary

**Project:** BLYSS AI Chat Experience Improvements (v3.0)
**Domain:** AI conversational chat for multi-tenant salon/barbershop booking SaaS
**Researched:** 2026-03-12
**Confidence:** HIGH

## Executive Summary

BLYSS v3.0 is a prompt-engineering and UX-improvement milestone on top of an already-functional AI booking chat. The existing system handles the full booking flow (service selection, date/time picking, OTP authentication, booking creation) using gpt-4.1-mini, structured Zod output, and a 7-tool calling loop. What it lacks is the receptionist quality that makes users trust it: answers to common pre-booking questions (hours, location, pricing, payment, walk-in policy), a natural greeting with actionable quick-start buttons, and an explicit booking confirmation step before committing. The key insight from research is that all P1 improvements are achievable with zero new packages, zero schema changes, and zero new API endpoints — the surface area is strictly `chatAi.js` (system prompt and context block) plus one prop addition to `ChatWidget.tsx`.

The recommended approach is a two-track execution. Track 1 (API-only): expand `buildChatSystemPrompt()` in `blyss-gcloud-api` to include formatted working hours and address, comprehensive Q&A response templates with few-shot examples, a mandatory confirmation step before `create_booking`, and tightened button-generation rules. Track 2 (Frontend-only): add an `initialButtons` prop to `ChatWidget.tsx` populated server-side from business data, and personalize the greeting with the business name. Both tracks are independent and can be developed in parallel, with Track 1 deployable before Track 2 since prompt improvements are backward compatible with the current frontend.

The primary risks are all prompt-engineering risks, not integration risks: system prompt bloat degrading the booking flow's critical OTP/phone ordering; button overuse making the chat feel like a form; and expanded Q&A adding "exits" that break the booking funnel. All three are mitigated by the same discipline — keep the system prompt under 800 tokens, define button-permitted scenarios as a closed explicit list (not "when appropriate"), and append a booking nudge after every general Q&A answer. A secondary risk is prompt injection, which is partially mitigated by the existing structured Zod output and function-level session guards, but requires an explicit defensive instruction added to the system prompt and a 500-character message length limit enforced at the API route level.

---

## Key Findings

### Recommended Stack

No new npm packages are required for this milestone. The existing stack — openai@6.17.0 with zodTextFormat, zod@4.2.1, gpt-4.1-mini — handles all v3.0 requirements. A low-risk upgrade of the openai SDK from 6.17.0 to ^6.27.0 is recommended to close a known Zod v4 compatibility gap (openai-node PR #1762), but is not blocking for v3.0 delivery.

**Core technologies:**
- `openai@^6.27.0` (upgrade from 6.17.0): Responses API, zodTextFormat, tool calling loop — Zod v4 support stable since 6.7.0; upgrade closes the discriminated union bug
- `zod@4.2.1` (stay pinned): ChatResponseSchema structured output — CRITICAL: do not introduce `z.discriminatedUnion()`, it produces 400 errors in OpenAI strict mode until PR #1762 ships
- `gpt-4.1-mini`: AI model — frozen per project constraints; responds well to markdown-sectioned prompts and few-shot JSON examples

**Key technique:** GPT-4.1-mini follows markdown-structured prompts more reliably than ASCII-divider prompts. Switching from `=== SECTION ===` dividers to `#` headers plus 8-12 concrete few-shot `<example>` blocks is the highest-leverage change for tone consistency. Instructions later in the prompt override earlier ones — critical safety rules (OTP ordering, never fabricate data) should appear both early (primacy) and as close to the examples section as possible.

See `.planning/research/STACK.md` for full version compatibility matrix and API techniques.

### Expected Features

The existing chat already handles service/date/time selection, OTP authentication, and booking creation. The v3.0 milestone adds the "receptionist layer" that makes the chat feel natural rather than form-like.

**Must have — table stakes (v3.0 core, prompt and minimal frontend changes only):**
- Comprehensive Q&A: working hours, services and pricing, location/address, payment methods, walk-in policy, cancellation guidance, small talk and goodbye — users expect to text a salon and get answers to these questions without entering the booking flow
- Business context block additions: expose `location.display_address` and `working_hours` from `businessData` in `buildChatSystemPrompt` — currently missing, blocks hours and location Q&A entirely
- Booking pre-confirmation step: before `create_booking`, AI shows summary with action-labeled buttons ("Ha, yozib qo'ying" / "Vaqtni o'zgartiraman") — pure prompt instruction, no schema or tool change
- AI-generated greeting with quick-start buttons: initial buttons derived from server-side business data passed as prop to `ChatWidget.tsx` — eliminates generic hardcoded greeting
- One-question-per-turn enforcement: explicit prompt rule, enforced especially in the booking and confirmation flow
- Action-labeled confirmation buttons: replaces abstract Yes/No with descriptive action verbs at all confirmation points throughout the booking flow
- Error recovery templates: graceful redirect to phone number when AI cannot answer a question

**Should have — differentiators (v3.x after P1 validation):**
- Per-business custom FAQ knowledge base: `chat_faq` Firestore field injected into system prompt at runtime
- Cancellation via chat: requires a new `cancel_booking` tool (out of scope for v3.0 per PROJECT.md)

**Defer to v4.0+:**
- Multi-service booking in single chat flow: requires `create_booking` tool rewrite
- Proactive upsell nudge: depends on multi-service booking
- Style consultation (face shape, hair type guidance): requires per-business staff expertise data
- Rebooking from history: requires user auth before the greeting message

**Anti-features to avoid:** Timestamps on messages (removed in v2.0 — do not re-add), persistent "Book Now" button in every AI message, bulk service list as the opening message (cognitive overload), multi-language system prompt (doubles length, complicates testing — current Uzbek-primary with auto-detect is correct).

See `.planning/research/FEATURES.md` for full feature prioritization matrix and button pattern taxonomy.

### Architecture Approach

The architecture is intentionally minimal: all prompt work is isolated to one function in one file (`buildChatSystemPrompt` in `blyss-gcloud-api/src/utils/chatAi.js`), and all frontend changes are additive props on `ChatWidget.tsx`. No new files, no new endpoints, no Firestore schema changes are required for P1. The data flow is unchanged: `ChatWidget` — Next.js proxy route — Express `public.js` — `getChatAiReply()` — OpenAI tool-calling loop — Firestore.

**Major components and their v3.0 change surface:**

1. `blyss-gcloud-api/src/utils/chatAi.js` — PRIMARY CHANGE FILE: expand `buildChatSystemPrompt()` with formatted hours and address (injected as text, not via tool), Q&A templates, confirmation step instruction, tightened button rules, and few-shot examples. This is the only API file that changes.
2. `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx` — add `initialButtons?: ChatButton[]` prop; render quick-start buttons when `messages.length === 0 && loaded`; personalize greeting text with business name.
3. `landing-page/app/[locale]/[tenant]/page.tsx` or `TenantPage.tsx` — pass `initialButtons` prop computed server-side from `businessData` at render time (zero extra API calls, instant display, context-aware buttons).

**Key architectural patterns:**
- Data-in-prompt for static facts: working hours and address injected as formatted text into the system prompt, not via new tools — avoids 1-2s tool round-trip per factual question since the data is already loaded in `getChatAiReply`
- Button value equals label: all AI-generated buttons must have `value === label` for correct `handleButtonClick` behavior (sends `btn.label` as message text)
- Confirmation as normal conversation turn: the pre-booking confirmation is a standard AI response with action buttons — no new schema field or UI mode; the AI controls when confirmation appears, ChatWidget renders it universally
- Session for auth state only: `session` object stores `phone_number`, `otp_id`, `user_id` — pending booking details (service, date, time) stay in conversation history to prevent stale state divergence

See `.planning/research/ARCHITECTURE.md` for full data flow diagrams, greeting implementation options, build order, and anti-patterns with rationale.

### Critical Pitfalls

1. **System prompt bloat degrades instruction following** — Adding Q&A coverage is the highest-risk change. The "lost in the middle" effect (ACL 2024) causes LLMs to follow instructions buried in the middle of a long prompt less reliably. As the prompt grows, critical OTP/phone ordering rules get less attention weight and the AI starts skipping them. Keep the prompt under 800 tokens measured with tiktoken. Use terse structured examples instead of prose templates. Put critical booking flow rules first.

2. **Button overuse turns chat into a form** — The natural interpretation of "add smart button patterns" is "add buttons to more responses." 60% of chatbot sessions fail when success depends on button clicks. The button-generation rule must be a closed prescriptive list, not permissive: "only show buttons in these 3 specific cases: quick-start on greeting, structured choice (service/date/time), and confirmation immediately before `create_booking`." Validation test: run 15 common user messages — no more than 5 should return buttons.

3. **General Q&A breaks booking flow reliability** — Adding answers to many question types gives the AI more "exits" from the booking funnel. After satisfying a general question, the AI waits for re-initiation; users often do not re-initiate and the session ends without a booking. Fix: add an explicit rule — after every non-booking answer, end with a booking nudge ("Yozib qo'yaymi siz uchun?") unless the user already has a booking in progress.

4. **Prompt injection via user messages** — OWASP ranks this as the #1 LLM vulnerability. The current system passes `userMessageText` directly to the AI input array. The structured Zod output provides partial protection (cannot return arbitrary tool calls) but does not prevent the AI from being convinced to skip booking flow steps. Mitigations: explicit defensive instruction in the system prompt, 500-character message length limit at the API route level (currently only on ChatWidget textarea), and verification that existing session-based function guards in `execCreateBooking` remain intact after prompt changes.

5. **Token budget exhausted by history and tool results** — A full booking flow (6 tool calls) combined with 30-message history and an expanded system prompt can reach 4000-6000 tokens input per API call. Mitigation: reduce conversation history load from 30 to 20 messages, add tool result trimming at the function level (slot lists are already capped at 12 in the prompt — enforce this in code too), and log input token counts during end-to-end testing of a full booking flow.

See `.planning/research/PITFALLS.md` for the full 10-pitfall list with phase-to-prevention mapping, "looks done but isn't" checklist, and recovery strategies.

---

## Implications for Roadmap

Based on combined research, the natural phase structure follows the dependency chain: API prompt changes first (independent, backward compatible with current frontend), then frontend greeting changes (additive prop passing, does not depend on API changes), then integration testing across the full conversation flow.

### Phase 1: System Prompt Overhaul (API)

**Rationale:** All P1 features are either prompt-only or require adding existing data to the prompt context block. This phase is independent of frontend changes and deployable first without any frontend coordination. It is also the highest-risk phase because it modifies the live booking flow — it must be tested end-to-end before Phase 2 is considered complete.

**Delivers:** AI that answers all common customer questions (hours, location, pricing, payment, walk-in policy, cancellation), pauses for confirmation before booking, uses action-labeled buttons, enforces one-question-per-turn, and recovers gracefully from unknown questions.

**Addresses (from FEATURES.md):** Comprehensive Q&A system prompt, business context block additions (address and payment methods), booking pre-confirmation step, action-labeled buttons, one-question-per-turn enforcement, error recovery templates.

**Avoids (from PITFALLS.md):** System prompt bloat (#1 — token budget discipline, critical rules first), button overuse (#2 — closed button rule list), Q&A breaking booking flow (#3 — booking nudge after every Q&A answer), prompt injection (#4 — defensive instruction and API-level length limit), token exhaustion (#6 — history trim to 20 messages and tool result truncation), runaway tool loop (#9 — deduplication guard before tool execution), session concurrency (#10 — `is_processing` lock on conversation doc).

**Files changed:** `blyss-gcloud-api/src/utils/chatAi.js` only.

**Research flag:** Standard pattern — no additional research needed. GPT-4.1 prompting techniques, few-shot examples, and Zod structured output patterns are covered by high-confidence official documentation.

### Phase 2: Frontend Greeting and Quick-Start Buttons

**Rationale:** This phase is independent of Phase 1 and can be developed in parallel, but should be validated after Phase 1 is deployed because the quick-start buttons must accurately reflect the services the AI will handle. Depends on business data being available server-side in `page.tsx` (already true).

**Delivers:** Context-aware quick-start buttons on first chat open derived from actual business services, personalized greeting with business name, correct button rendering when `messages.length === 0`.

**Addresses (from FEATURES.md):** AI-generated greeting with quick-start buttons (implemented via server-side prop, zero extra API calls), contextual quick-start on fresh chat, scope-declaring intro.

**Avoids (from PITFALLS.md):** Hardcoded greeting bypass (#7 — buttons must come from business data, not a hardcoded list that may show services the business does not offer).

**Files changed:** `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx`, `landing-page/app/[locale]/[tenant]/page.tsx` or `TenantPage.tsx`.

**Research flag:** Standard pattern — Next.js App Router server-to-client prop passing is well-established.

### Phase 3: Integration Testing and Edge Cases

**Rationale:** After both API and frontend changes are deployed independently, the full end-to-end conversation flow must be tested with realistic scripts covering all new Q&A paths, the booking confirmation flow, and multi-language scenarios.

**Delivers:** Verified chat behavior across all P1 features: greeting to Q&A to booking to confirmation to booking creation; Russian and Uzbek Cyrillic tone consistency; injection resistance; long-conversation context stability; rapid double-send session integrity.

**Addresses:** The "looks done but isn't" checklist from PITFALLS.md — 10 items: token count measurement, button test battery (15 messages, max 5 with buttons), Russian tone (5+ messages), Uzbek Cyrillic (3+ messages), full booking flow end-to-end, injection attempt, 20-message long conversation, quick-start button accuracy against actual business services, tool loop iteration limit, session concurrency under rapid double-send.

**Research flag:** No research needed — test execution against the defined checklist.

### Phase 4: Validation-Gated v3.x Features (Conditional)

**Rationale:** Only proceed after Phase 1-3 validates that P1 features are stable and producing correct answers for real businesses. These features require slightly more scope than prompt-only changes.

**Delivers:** Per-business custom FAQ knowledge base (`chat_faq` Firestore field injected into system prompt at runtime), refined walk-in and cancellation answer templates based on production feedback.

**Addresses (from FEATURES.md):** Per-business FAQ knowledge base (P2), walk-in policy answers, cancellation template refinements.

**Research flag:** Light spike needed on `chat_faq` Firestore field structure and prompt injection pattern — low complexity but needs a defined schema to avoid Firestore field proliferation on the business document.

### Phase Ordering Rationale

- Phases 1 and 2 are explicitly parallel by design. ARCHITECTURE.md confirms: "These steps are parallel (Step 2 can start before Step 1 is tested) because they don't depend on each other." Both are backward compatible with the currently deployed state of the other repo.
- Phase 1 is the risk-bearing phase. Prompt changes affect the live booking flow. End-to-end testing after Phase 1 is mandatory before Phase 1 is considered complete.
- Phase 3 is a forcing function: no v3.x feature ships until the Phase 3 checklist passes. This prevents shipping complexity on top of an untested foundation.
- Phase 4 is contingent on production feedback signals, not a timeline. It unlocks when evidence shows businesses are using Q&A and wanting business-specific customization.

### Research Flags

Phases needing deeper research during planning:
- **Phase 4:** Light spike on `chat_faq` Firestore field design and prompt injection pattern before implementation — not complex, but a defined schema is needed to avoid uncontrolled field growth on the business document.

Phases with standard patterns (skip research-phase):
- **Phase 1:** GPT-4.1 prompting techniques, few-shot examples, and Zod structured output are covered by high-confidence official documentation.
- **Phase 2:** Next.js App Router server-component to client-component prop passing is a well-established pattern.
- **Phase 3:** Test execution against a defined checklist — no research required.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All findings from direct codebase analysis and official OpenAI documentation. Zod discriminated union issue verified against an open GitHub issue with reproduction steps. |
| Features | HIGH (direct) / MEDIUM (industry) | Table stakes and P1 features derived from direct codebase analysis of current system. Industry benchmarks (Fresha AI competitor analysis, NN/G UX research, chatbot session failure rates) are MEDIUM — multiple sources agree but from observational rather than controlled studies. |
| Architecture | HIGH | 100% direct codebase analysis. All component responsibilities, data flows, and Firestore document shapes verified by reading actual source files. No speculative architecture required. |
| Pitfalls | HIGH | Critical pitfalls grounded in direct code analysis plus well-cited research: OWASP LLM01:2025, ACL "Lost in the Middle" paper (2024), OpenAI agent safety documentation. Community-sourced claims (token savings from `previous_response_id`) marked MEDIUM. |

**Overall confidence: HIGH**

### Gaps to Address

- **Payment methods field availability:** FEATURES.md identifies that the AI needs to answer payment method questions, but `payment_methods` may not exist as a structured field on the business Firestore document. During Phase 1 implementation, verify whether this field exists or whether a default template answer ("naqd yoki karta") is needed as a fallback.

- **Uzbek Cyrillic phrasing validation:** No Uzbek Cyrillic native speakers were consulted during research. The AI's tone consistency in Cyrillic script is documented as a risk but the "correct" natural Cyrillic Uzbek phrasing cannot be validated without a native reviewer. Flag for human review during Phase 3 testing.

- **Token cost baseline:** STACK.md notes that `previous_response_id` chaining instead of full history rebuild could reduce prompt tokens by 70-90% (MEDIUM confidence, community claim). Not needed for v3.0, but worth measuring actual per-call token counts during Phase 3 to inform whether this becomes a v3.x priority or remains premature optimization.

- **Concurrent request probability at scale:** PITFALLS.md Pitfall 10 recommends adding an `is_processing` lock on the conversation Firestore document. This is a low-probability issue at current scale but the risk window grows with longer AI response times. Confirm the priority of this guard during Phase 1 implementation planning.

---

## Sources

### Primary — HIGH Confidence

- Direct codebase analysis: `blyss-gcloud-api/src/utils/chatAi.js` (768 lines, full read)
- Direct codebase analysis: `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx` (473 lines)
- Direct codebase analysis: `blyss-gcloud-api/src/routes/public.js`, `landing-page/app/api/chat/route.ts`
- [GPT-4.1 Prompting Guide — OpenAI Cookbook](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide) — system prompt structure, few-shot examples, agentic persistence reminders
- [zodTextFormat breaks with Zod 4 — openai-node #1602](https://github.com/openai/openai-node/issues/1602) — fixed in 6.7.0
- [Zod discriminated union oneOf issue — openai-node #1709](https://github.com/openai/openai-node/issues/1709) — open as of March 2026, workaround confirmed
- [LLM01:2025 Prompt Injection — OWASP Gen AI Security Project](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Lost in the Middle: How Language Models Use Long Contexts — ACL Anthology 2024](https://aclanthology.org/2024.tacl-1.9/) — primacy/recency bias, instruction degradation with prompt length
- [Safety in building agents — OpenAI Platform Docs](https://platform.openai.com/docs/guides/agent-builder-safety) — structured output as injection mitigation
- [Conversation state — OpenAI API docs](https://platform.openai.com/docs/guides/conversation-state) — previous_response_id, 30-day storage, history tradeoffs

### Secondary — MEDIUM Confidence

- [NN/G: Confirmation Dialogs Can Prevent User Errors](https://www.nngroup.com/articles/confirmation-dialog/) — action-labeled buttons vs abstract Yes/No
- [Chatbot Conversation Design UX Patterns — youngju.dev 2026](https://www.youngju.dev/blog/chatbot/2026-03-07-chatbot-conversation-design-ux-patterns-production.en) — dialog state machines, confirmation flow, error recovery
- [Intercom Principles of Bot Design](https://www.intercom.com/blog/principles-bot-design/) — message length, emoji use, transparency
- [Botpress Conversation Design 2026](https://botpress.com/blog/conversation-design) — natural vs formal tone, quick replies vs open prompts
- [Parallelhq Chatbot UX](https://www.parallelhq.com/blog/chatbot-ux-design) — menu-first vs free-text-first vs hybrid patterns, button cognitive load research
- [Fresha AI Strategy 2025 — Diginomica](https://diginomica.com/how-freshas-ai-strategy-keeps-its-looking-its-best-competitive-market) — competitor AI receptionist roadmap, coming 2026
- [The Impact of Prompt Bloat on LLM Output Quality — MLOps Community](https://home.mlops.community/public/blogs/the-impact-of-prompt-bloat-on-llm-output-quality) — token count and quality tradeoffs
- [Multilingual Chatbot Tone Consistency — Cobbai Blog](https://cobbai.com/blog/multilingual-customer-service-chatbot) — brand voice across languages
- [Push The Button: Quick Replies and the Chatbot Experience — RoboRobo](https://medium.com/roborobo-magazine/push-the-button-quick-replies-and-the-chatbot-experience-453ef33f28e0) — 60% session failure when button-dependent

### Tertiary — Needs Validation

- [OpenAI community: previous_response_id token savings](https://community.openai.com/t/responses-api-vs-completions-no-token-savings/1295425) — 70-90% prompt token reduction claim; community report, not official benchmark

---

*Research completed: 2026-03-12*
*Ready for roadmap: yes*
