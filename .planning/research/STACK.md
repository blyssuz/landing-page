# Stack Research — AI Chat Experience Improvements (v3.0)

**Domain:** AI conversational chat — prompt engineering and conversation quality for barbershop/salon booking
**Researched:** 2026-03-12
**Confidence:** HIGH

---

## Executive Decision

No new npm packages are required. Every improvement in this milestone — conversational tone, smart button patterns, response templates, AI-generated greeting — is achieved through prompt engineering and minor code changes in the two existing files: `blyss-gcloud-api/src/utils/chatAi.js` and `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx`.

The one actionable dependency change: **upgrade the openai SDK from 6.17.0 to ^6.27.0** in blyss-gcloud-api. This is not strictly required for the current ChatResponseSchema (which avoids discriminated unions) but closes a known Zod v4 compatibility gap in the SDK and aligns with current stable.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| openai (npm) | ^6.27.0 (upgrade from 6.17.0) | OpenAI Responses API, zodTextFormat, tool calling loop | Zod v4 support added in 6.7.0; 6.27.0 is current stable (March 2026). Current 6.17.0 works for the existing ChatResponseSchema but the upgrade is low-risk and closes the compatibility gap |
| zod | ^4.2.1 (current — stay pinned below 4.1.13 pattern, or stay at 4.2.1 exactly) | ChatResponseSchema structured output | 4.2.1 is installed. Safe for z.object + z.enum().nullable() patterns. CRITICAL: do not introduce z.discriminatedUnion() — it emits oneOf which OpenAI strict mode rejects with a 400 error until openai-node PR #1762 ships |
| OpenAI gpt-4.1-mini | current | AI model | Frozen per project constraints |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none new) | — | All improvements are pure prompt and code changes | No library can substitute for well-structured prompts |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| OpenAI Playground (platform.openai.com) | Iterate on system prompt before deploying | Set model to gpt-4.1-mini, add structured output format, test conversation scenarios — faster feedback loop than deploying to server |

---

## Installation

```bash
# In blyss-gcloud-api: upgrade openai SDK
cd blyss-gcloud-api
npm install openai@^6.27.0

# No other installs needed in either repo
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Prompt engineering in chatAi.js | LangChain / LlamaIndex | Only when you need multi-model orchestration, RAG pipelines, or a chain-of-thought DSL — overkill for a single-model system prompt rewrite |
| Prompt engineering in chatAi.js | Vercel AI SDK (`ai` package) | Only when you need streaming responses in the chat UI — current blocking pattern is acceptable for this use case and avoids restructuring the API response |
| Manual history (current: last 30 messages from Firestore) | `previous_response_id` chaining | When token cost becomes material at scale: stores the OpenAI response ID in Firestore conversation doc, passes it next turn instead of rebuilding full history — saves 70-90% of prompt-side tokens per OpenAI community reports. Adds complexity (30-day ID expiry, fallback logic) outside the current prompt-only scope |
| Hardcoded quick-start buttons in ChatWidget.tsx | AI-generated greeting via endpoint call | The AI-generated approach (call `/api/chat` with `is_greeting: true` flag on first open) gives more dynamic, business-aware greetings but adds latency and complexity. Hardcoded quick-start buttons are instantaneous, zero API cost, and sufficient for the milestone goal |
| Few-shot examples embedded in system prompt | Fine-tuning gpt-4.1-mini | Fine-tuning requires dataset curation, training cost, and retraining on each persona change. Few-shot examples are free, instantly adjustable, and produce equivalent persona consistency for this conversation volume |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| LangChain / LlamaIndex | Heavy dependency, opinionated abstractions, frequent breaking changes — adds complexity where plain OpenAI SDK already does the job | Current `openai.responses.parse()` loop in chatAi.js |
| OpenAI Assistants API | OpenAI's own guidance (2025) classifies Assistants as legacy; Responses API is the recommended successor | Already on Responses API — no change needed |
| `z.discriminatedUnion()` in ChatResponseSchema | Zod v4.1.13+ emits `oneOf` for discriminated unions; OpenAI strict mode rejects this with a 400 error. PR #1762 on openai-node is open as of March 2026 but not yet merged | Keep current `z.object` + `z.enum(['phone', 'otp', 'name']).nullable()` pattern |
| `previous_response_id` in this milestone | Requires storing OpenAI response IDs in Firestore conversation docs, plus expiry-handling fallback. The project constraint is "prompt/logic changes only" — no schema changes | Current 30-message history rebuild (already working) |
| Streaming responses | Would require restructuring `/api/chat` to SSE/streaming, updating ChatWidget fetch logic, and complicating the typing indicator pattern | Current blocking response with typing indicator |

---

## Stack Patterns by Variant

**For the system prompt rewrite (chatAi.js → buildChatSystemPrompt):**
- Use markdown headers to divide the prompt into named sections: `# Role & Objective`, `# Response Rules`, `# Tone Examples`, `# Button Rules`, `# Input Type Rules`, `# Booking Flow`, `# Response Templates`, `# Examples`
- GPT-4.1 follows markdown-organized prompts more reliably; instructions later in the prompt take precedence over earlier ones — put override rules last
- Add 6-10 concrete few-shot examples in the `# Examples` section using the actual JSON output format — this is the highest-leverage technique for tone consistency with gpt-4.1-mini

**For the AI-generated greeting:**
- Simplest approach: add 3-4 hardcoded quick-start buttons to ChatWidget.tsx that appear before the first user message (zero API cost, zero latency)
- These replace the static `t.greeting` string; render them as the same button style used for AI quick-reply buttons
- Suggested buttons: "Xizmatlar", "Narxlar", "Ish vaqti", "Band qilish" — covers the four most common first questions per the existing system prompt examples

**For smart button patterns:**
- Current buttons array rendering in ChatWidget.tsx is sufficient — buttons already render as pill chips with correct styling
- What is missing: the AI generates buttons inconsistently because the system prompt does not specify WHEN to generate them for non-booking scenarios (currently: only for bookings)
- Fix is in the prompt, not in the frontend: add explicit rules for yes/no confirmation buttons, quick-start topic buttons, and service-selection buttons

**For response templates:**
- Embed templates as `# Examples` entries in the system prompt — not as a separate "templates" section to interpolate
- GPT-4.1 replicates demonstrated JSON output patterns more reliably than it follows verbal descriptions like "answer like this"

**If conversation quality is still inconsistent after one prompt iteration:**
- Add the three agentic persistence reminders per OpenAI's GPT-4.1 prompting guide:
  1. Persistence: "Foydalanuvchi so'rovini to'liq bajarmasdan turib navbatingni yakunlama"
  2. Tool use: "Javobni taxmin qilma — ma'lumot kerak bo'lsa tool chaqir"
  3. Planning (optional): "Har bir qadamdan oldin rejalashtir"
- These three additions produce ~20% improvement in multi-step flow completion per OpenAI's own testing

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| openai@6.17.0 | zod@4.2.1 | Works for current ChatResponseSchema. zodTextFormat Zod v4 support was added in 6.7.0. |
| openai@6.27.0 | zod@4.2.1 | Safe upgrade — Zod v4 support stable since 6.7.0. Recommended path. |
| zod@4.2.1 | openai@6.17.0+ | ChatResponseSchema uses z.object + z.enum + z.array — no discriminated unions. Safe. |
| zod@4.1.13+ | openai@any | Discriminated unions (z.discriminatedUnion) will produce 400 errors in OpenAI strict mode. Avoid adding any discriminated union to ChatResponseSchema. |

---

## OpenAI API Techniques for This Milestone

These are not library choices — they are the core implementation surface for v3.0. Listed here because they directly determine what code to write.

### Technique 1: Structured System Prompt Sections

GPT-4.1 follows instructions more literally than predecessors and benefits from named sections with markdown headers. The current prompt uses `═══ SECTION ═══` ASCII dividers — switching to `#` headers improves reliability per OpenAI's official prompting guide.

Recommended section order for `buildChatSystemPrompt`:
```
# Role & Identity
# Current Context  ← business data, auth status, current time (dynamic)
# Response Rules
# Tone & Voice
# Quick-Reply Button Rules
# Input Type Rules
# Booking Flow
# Response Templates
# Examples
```

Instructions later in the prompt override earlier ones — put the most specific behavioral rules last.

### Technique 2: Few-Shot Examples (highest-leverage change)

Include 8-12 concrete input/output pairs in an `# Examples` section at the end of the system prompt. Use the actual JSON output format. GPT-4.1-mini matches demonstrated patterns reliably.

```
# Examples
<example>
user: salom
assistant: {"message": "Salom! 👋 Nima xizmat?", "buttons": [], "input_type": null}
</example>
<example>
user: narxi qancha
assistant: {"message": "Soch olish 30 000 so'm, taxminan 30 daqiqa. Band qilamizmi?", "buttons": [{"label": "Ha", "value": "Ha"}, {"label": "Keyinroq", "value": "Keyinroq"}], "input_type": null}
</example>
<example>
user: qayerdasiz
assistant: {"message": "Manzilingiz: [manzil]. Yo'l ko'rsatmasi kerakmi?", "buttons": [{"label": "Ha, ko'rsating", "value": "Ha, ko'rsating"}], "input_type": null}
</example>
```

### Technique 3: Explicit Button Generation Rules

The current prompt only specifies buttons for booking flow steps. Add explicit rules for every button pattern needed:

- **Quick-start buttons** (greeting context): show after greeting when no conversation history
- **Yes/No confirmation buttons**: show after any booking summary before `create_booking` is called
- **Topic shortcut buttons**: show after answering a general question to offer related topics
- **Never show buttons** when: phone input, OTP input, name input, or conversational free-text is expected

### Technique 4: Response Template as Examples

For every common Q&A scenario, add a demonstrated example — not a description. This covers: working hours, price inquiry, location/address, payment methods, cancellation policy, staff inquiry, "are you busy today". Each example shows the exact `buttons` and `input_type` to emit.

---

## Sources

- [GPT-4.1 Prompting Guide — OpenAI Cookbook](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide) — System prompt structure, few-shot examples, agentic persistence, tool use via API tools field (HIGH confidence — official OpenAI documentation)
- [zodTextFormat breaks with Zod 4 — openai-node #1602](https://github.com/openai/openai-node/issues/1602) — Fixed in openai-node 6.7.0, confirmed closed October 2025 (HIGH confidence)
- [Zod schema conversion broken for unions in Zod 4.1.13+ — openai-node #1709](https://github.com/openai/openai-node/issues/1709) — Discriminated union oneOf issue, open as of March 2026, workaround: avoid z.discriminatedUnion in structured output schemas (HIGH confidence)
- [Conversation state — OpenAI API docs](https://developers.openai.com/api/docs/guides/conversation-state/) — previous_response_id, 30-day storage, manual vs. chained history trade-offs (HIGH confidence)
- [openai npm package — npmjs.com](https://www.npmjs.com/package/openai) — Latest version 6.27.0 as of March 2026 (HIGH confidence)
- [OpenAI community: previous_response_id token savings](https://community.openai.com/t/responses-api-vs-completions-no-token-savings/1295425) — 70-90% prompt token reduction claim (MEDIUM confidence — community report, not official benchmark)

---

*Stack research for: AI chat conversational quality — BLYSS v3.0 milestone*
*Researched: 2026-03-12*
