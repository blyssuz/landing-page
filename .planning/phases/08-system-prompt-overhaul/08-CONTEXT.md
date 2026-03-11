# Phase 8: System Prompt Overhaul - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite the system prompt in `chatAi.js` (blyss-gcloud-api) so the AI answers all common customer questions naturally using injected business data, pauses for explicit confirmation before booking, and enforces disciplined button and conversation rules. Changes to `chatAi.js` only — no new API endpoints, no database schema changes, no frontend changes.

</domain>

<decisions>
## Implementation Decisions

### Pre-booking confirmation
- Show a minimal summary before creating a booking: service name + date + time only (price was already shown during flow)
- Confirmation buttons match the user's language (Uzbek or Russian), using action-specific labels like "Ha, yozib qo'ying" / "Vaqtni o'zgartiraman" for Uzbek, Russian equivalents for Russian speakers
- Flexible gate: both the confirm button AND a positive text reply ("ha", "да", "ok") trigger `create_booking`
- Ambiguous replies (anything not clearly positive) get a polite re-ask with the confirmation buttons shown again

### Booking nudge style
- Text-only nudge — no button attached (respects BTN-03 rule: buttons only in 3 scenarios)
- Nudge only after informational answers (prices, hours, location, services) — skip for greetings, thanks, small talk
- Vary the nudge phrase naturally: rotate between "Yozdiraysizmi?", "Band qilaylikmi?", "Yozilmoqchimisiz?" etc. — not the same phrase every time
- Nudge intensity varies by context: stronger after price questions, lighter after location/hours

### Unknown question handling
- If the question is not answerable from business data, always redirect to the business phone number — never guess
- Claude's discretion on redirect format (phone only vs phone + topic suggestions)
- Off-topic messages (jokes, politics, random) get ignored and redirected to business services — professional tone, no banter
- Include a booking nudge in the redirect only if the question was service-adjacent, not for totally random questions

### Claude's Discretion
- Q&A answer formatting (how working hours, prices, location answers are structured)
- Exact wording of redirect messages
- How to handle edge cases in language detection (mixed Uzbek/Russian messages)
- System prompt structure and section ordering (within the 800-token constraint)

</decisions>

<specifics>
## Specific Ideas

- The current system prompt is already in Uzbek with good/bad examples — keep that approach but expand coverage
- PROMPT-09 booking nudge should feel like a real receptionist ending a conversation, not a marketing CTA
- Confirmation step must happen between time selection and `create_booking` call — the AI should compose the summary, show it with buttons, and only call `create_booking` after explicit confirmation
- Button labels must always have `value === label` (existing constraint from current code)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `buildChatSystemPrompt()` (chatAi.js:555): Existing prompt builder — needs expansion, not replacement
- `ChatResponseSchema` (chatAi.js:15): Zod schema for structured output — already has message, buttons, input_type
- `DAY_NAMES` / `DAY_LABELS` (chatAi.js:23-24): Day name constants in uz/ru — reusable for working hours formatting
- `secsToHHMM()` (chatAi.js:37): Converts seconds to HH:MM — already used for slot display
- `localeName()` (chatAi.js:41): Locale-aware name extraction — can be used for service names in prompts

### Established Patterns
- System prompt is built as a template literal with business data interpolated
- Tool definitions include behavioral guidance in their `description` fields
- OpenAI Responses API with `zodTextFormat` for structured output
- Session state stored on conversation document (`conversationData.session`)
- Last 30 messages loaded as conversation history

### Integration Points
- `businessData.working_hours` — available on business document, needs injection into system prompt
- `businessData.address` or location fields — need to check what field name is used
- `businessData.payment_methods` — may not exist, fallback to "naqd yoki karta" default
- `create_booking` tool — confirmation step needs to be enforced in the system prompt instructions, not in tool code

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-system-prompt-overhaul*
*Context gathered: 2026-03-12*
