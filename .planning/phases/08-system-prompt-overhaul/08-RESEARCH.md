# Phase 8: System Prompt Overhaul - Research

**Researched:** 2026-03-12
**Domain:** OpenAI function-calling chat with structured output — system prompt engineering for a multilingual booking assistant
**Confidence:** HIGH (all findings come from reading actual codebase source files)

## Summary

Phase 8 is a single-file change: rewrite `buildChatSystemPrompt()` in `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/utils/chatAi.js`. No schema changes, no new routes, no frontend changes. All 17 requirements (PROMPT-01 through BTN-04, CONV-01 through CONV-04) are satisfiable purely through prompt text changes within the existing architecture.

The existing prompt is already in Uzbek with good/bad examples and a multi-section structure. It already handles language detection, basic booking flow, and button rules. The overhaul adds: (1) injected working hours, address, and payment data into the business context block, (2) a pre-booking confirmation step before `create_booking` is called, (3) disciplined button-only-in-3-cases rule enforced by prompt text, (4) a booking nudge after informational Q&A answers, and (5) graceful handling of unknown questions and small talk.

The hard constraint is **800 tokens maximum** for the system prompt. The current prompt is approximately 550-600 tokens. With business data injection (working hours as a formatted string, display_address, payment default) and new Q&A rules, the budget is tight but achievable with careful section ordering.

**Primary recommendation:** Expand `buildChatSystemPrompt()` to inject business context data (working hours, address, payment), add a `=== TASDIQLASH (PRE-BOOKING CONFIRMATION) ===` section, tighten the `=== BUTTONS ===` section to exactly 3 allowed cases, add a `=== SAVOLLARGA JAVOB ===` Q&A rules section, and add booking nudge and conversational rules. Measure tokens after writing; reduce history limit from 30 to 20 messages if needed.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Pre-booking confirmation:**
- Show a minimal summary before creating a booking: service name + date + time only (price was already shown during flow)
- Confirmation buttons match the user's language (Uzbek or Russian), using action-specific labels like "Ha, yozib qo'ying" / "Vaqtni o'zgartiraman" for Uzbek, Russian equivalents for Russian speakers
- Flexible gate: both the confirm button AND a positive text reply ("ha", "да", "ok") trigger `create_booking`
- Ambiguous replies (anything not clearly positive) get a polite re-ask with the confirmation buttons shown again

**Booking nudge style:**
- Text-only nudge — no button attached (respects BTN-03 rule: buttons only in 3 scenarios)
- Nudge only after informational answers (prices, hours, location, services) — skip for greetings, thanks, small talk
- Vary the nudge phrase naturally: rotate between "Yozdiraysizmi?", "Band qilaylikmi?", "Yozilmoqchimisiz?" etc. — not the same phrase every time
- Nudge intensity varies by context: stronger after price questions, lighter after location/hours

**Unknown question handling:**
- If the question is not answerable from business data, always redirect to the business phone number — never guess
- Off-topic messages (jokes, politics, random) get ignored and redirected to business services — professional tone, no banter
- Include a booking nudge in the redirect only if the question was service-adjacent, not for totally random questions

### Claude's Discretion
- Q&A answer formatting (how working hours, prices, location answers are structured)
- Exact wording of redirect messages
- How to handle edge cases in language detection (mixed Uzbek/Russian messages)
- System prompt structure and section ordering (within the 800-token constraint)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROMPT-01 | AI answers working hours questions using actual business `working_hours` data | `businessData.working_hours` is a structured object with `{monday: {start, end, is_open}, ...}`. Existing `secsToHHMM()` and `DAY_LABELS` helpers already format it. Build a pre-formatted working hours string at prompt-build time and inject it. |
| PROMPT-02 | AI answers services and pricing questions by calling `get_services` and formatting results naturally | `get_services` tool already exists and returns `name_uz`, `name_ru`, `price`, `duration_minutes`. Prompt needs to instruct: call `get_services`, then answer naturally, then append nudge. |
| PROMPT-03 | AI answers location/address questions using business address data injected into prompt | `businessData.location.display_address` field exists on Firestore document (confirmed in `public.js` line 549). Inject into system prompt as plain text. |
| PROMPT-04 | AI answers payment method questions (from business data or sensible default) | No `payment_methods` field in business schema. Use `"naqd pul yoki karta"` (cash or card) as default, overridable if `businessData.payment_methods` exists. |
| PROMPT-05 | AI answers walk-in policy questions naturally | Pure prompt rule — no data needed. Add as a standard policy answer: walk-ins depend on current availability, recommend booking in advance. Append nudge. |
| PROMPT-06 | AI answers cancellation/rebooking questions with actionable guidance | Pure prompt rule. Instruct: for cancellation/rebooking, give the phone number and advise calling in advance. Append nudge. |
| PROMPT-07 | AI handles greetings and small talk naturally without triggering booking flow | Pure prompt rule. Existing prompt already has examples. Strengthen: greetings/thanks/farewells get a single short reply, no booking flow triggered, no nudge appended. |
| PROMPT-08 | AI gracefully handles unknown questions by redirecting to phone/contact | Pure prompt rule. Add explicit: if question cannot be answered from available business data, redirect to `business_phone_number` — never hallucinate. |
| PROMPT-09 | AI appends a booking nudge after every non-booking Q&A answer | Pure prompt rule. Define nudge as text-only (no button). Vary among: "Yozdiraysizmi?", "Band qilaylikmi?", "Yozilmoqchimisiz?", "Yozib qo'yaymi?" etc. Skip nudge for: greetings, thanks, farewells, off-topic redirects. |
| BTN-01 | AI shows action-labeled confirmation buttons before creating a booking | Add a `=== TASDIQLASH ===` section in prompt. Between time selection and `create_booking`, compose summary (service + date + time), show 2 buttons with action labels, wait for confirmation before calling tool. |
| BTN-02 | All confirmation buttons use action-specific labels, never abstract Yes/No | Prompt explicitly forbids "Ha/Yo'q" or "Да/Нет" as button labels. Must use "Ha, yozib qo'ying" / "Vaqtni o'zgartiraman" (Uzbek) or Russian equivalents. |
| BTN-03 | Buttons only appear in 3 scenarios: quick-start greeting, structured choice (service/date/time), and pre-booking confirmation | Existing prompt has partial button rules. Rewrite `=== BUTTONS ===` section to be explicit: ONLY 3 cases, enumerate them. Any other case = `buttons: []`. |
| BTN-04 | AI never shows buttons when asking for phone, OTP, or name input | Already partially enforced. Strengthen with explicit negative rule in button section. |
| CONV-01 | AI enforces one-question-per-turn | Add explicit rule: each response asks at most one question. |
| CONV-02 | AI responds in the user's language (Uzbek Lotin, Uzbek Kirill, or Russian) automatically | Existing TIL section handles this. Keep and reinforce. |
| CONV-03 | AI tone is natural and informal — like texting a real receptionist | Existing YAXSHI/YOMON MISOLLAR section handles this. Keep and extend examples. |
| CONV-04 | Business context block includes address, working hours, and payment info from Firestore data | Requires data injection at build time: `buildChatSystemPrompt()` must format `working_hours` as human-readable, inject `location.display_address`, and inject payment info (default or from data). |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| openai | ^6.17.0 | OpenAI Responses API with function calling | Already in production; `zodTextFormat` for structured output |
| zod | ^4.2.1 | Schema validation for structured AI output | ChatResponseSchema already defined |

No new libraries needed. Phase 8 is pure prompt engineering within the existing stack.

### Existing Helpers Available in chatAi.js
| Helper | Location | Purpose |
|--------|----------|---------|
| `secsToHHMM(s)` | chatAi.js:37 | Converts seconds-from-midnight to "HH:MM" |
| `DAY_NAMES` | chatAi.js:23 | `['sunday', 'monday', ...]` — maps JS getDay() to Firestore keys |
| `DAY_LABELS.uz` | chatAi.js:24 | Uzbek day names array indexed by getDay() |
| `DAY_LABELS.ru` | chatAi.js:24 | Russian day names array indexed by getDay() |
| `localeName(nameObj, lang)` | chatAi.js:41 | Extracts locale-aware string from `{uz, ru}` objects |
| `uzbekNow()` | chatAi.js:28 | Current time in UTC+5 (Tashkent) |

### Business Data Fields Available in chatAi.js
All available on `businessData` (from `db.collection('businesses').doc(businessId).get()`):

| Field | Type | Notes |
|-------|------|-------|
| `working_hours` | `{monday: {start, end, is_open}, ...}` | All 7 days; start/end are seconds from midnight |
| `location` | `{lat, lng, display_address?, city?, street_name?}` | `display_address` is optional; may be undefined for old records |
| `business_phone_number` | string | Digits only (e.g., `998901234567`) |
| `business_name` | string | Already injected |
| `bio` | string | Already injected |
| `tenant_url` | string | Already injected |
| `is_solo` | boolean | Already injected |
| `payment_methods` | NOT in schema | Does not exist as a structured field — use default fallback |

**Address field discovery (HIGH confidence):** `businessData.location.display_address` is used in `public.js` lines 549 and 682. May be undefined for older Firestore documents — use `|| ''` fallback and omit from prompt if empty.

**Payment methods (HIGH confidence):** Not in business schema or Firestore structure. Use hardcoded fallback: `"naqd pul yoki karta"` (cash or card).

---

## Architecture Patterns

### How buildChatSystemPrompt() Works

```
function buildChatSystemPrompt(businessData, businessId, session) {
    // 1. Compute derived values (now, auth status, urls)
    // 2. Return template literal with all sections
}
```

The function returns a single string. It is called once per API request in `getChatAiReply()`. Business data is already loaded from Firestore before this call. Session data (auth state) is also available.

### Pre-Build Working Hours Formatter

Build a human-readable working hours string inside `buildChatSystemPrompt()`:

```javascript
// Source: chatAi.js existing helpers (secsToHHMM, DAY_NAMES, DAY_LABELS)
function formatWorkingHours(working_hours, lang = 'uz') {
    const labels = DAY_LABELS[lang] || DAY_LABELS.uz;
    return DAY_NAMES.map((day, i) => {
        const h = working_hours?.[day];
        if (!h || !h.is_open) return `${labels[i]}: yopiq`;
        return `${labels[i]}: ${secsToHHMM(h.start)}-${secsToHHMM(h.end)}`;
    }).join(', ');
}
```

Since the prompt is always Uzbek-primary (with auto-detect at runtime), format in Uzbek: `"Dushanba: 09:00-19:00, Seshanba: 09:00-19:00, ..., Yakshanba: yopiq"`.

### Recommended System Prompt Section Order (800-token constraint)

Priority: most safety-critical rules first (prevents booking without auth/confirmation), informational rules last.

```
1. Identity + Business Context (name, bio, phone, address, hours, payment, solo/team) — ~120 tokens
2. QANDAY GAPLASHISH (tone + good/bad examples) — ~120 tokens
3. SAVOLLARGA JAVOB (Q&A rules: hours, prices, location, payment, walk-in, cancellation, unknown, small talk) — ~80 tokens
4. BOOKING FLOW (numbered steps with pre-confirmation step) — ~120 tokens
5. TASDIQLASH (pre-booking confirmation rules) — ~60 tokens
6. BUTTONS (exactly 3 cases + explicit prohibitions) — ~80 tokens
7. INPUT_TYPE — ~30 tokens
8. TIL (language detection) — ~30 tokens
```

### Pre-Booking Confirmation Step

The confirmation step must be inserted between step 3 (time selected) and step 8 (create_booking) in the booking flow. The prompt must instruct:

```
After user selects time:
- Compose summary: "<Xizmat nomi>, <kun sana>, soat <HH:MM>"
- Show 2 buttons: ["Ha, yozib qo'ying", "Vaqtni o'zgartiraman"] (Uzbek) or ["Да, запишите", "Изменить время"] (Russian)
- Set buttons, input_type: null
- WAIT for confirmation — do NOT call create_booking yet
- If user sends confirm button or positive text (ha, ok, yes, да, хорошо) → call create_booking
- If ambiguous → re-ask with same buttons
```

### Anti-Patterns to Avoid
- **Injecting raw JSON into the prompt:** Format `working_hours` as a comma-separated human-readable string, not as a JSON dump. LLMs respond better to natural language data.
- **Parallel data injection for both languages:** The prompt is Uzbek-primary with runtime language detection. Format working hours in Uzbek; the model will translate what it says to the user's language naturally.
- **Over-specifying nudge phrases:** Provide 4-5 example nudge phrases and instruct to vary them. Don't enumerate all possible phrases — let the model be natural within the constraint.
- **Putting button rules after booking flow:** Button rules must come after the booking flow so the model learns the confirmation buttons within flow context.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Working hours formatting | Custom formatter with edge cases | Use existing `secsToHHMM()` + `DAY_LABELS` already in scope | Both already correct and tested in production |
| Language detection in code | Runtime language classifier | Prompt instruction + example patterns | OpenAI models detect Uzbek Latin/Cyrillic/Russian natively; no code needed |
| Confirmation state machine | Session field `awaiting_confirmation: true` | Prompt-enforced flow | Confirmation state is implicit in conversation history — no new session fields needed |
| Token counting | tiktoken or similar | Manual estimate + manual testing | This is a one-time sizing problem, not a runtime concern |

---

## Common Pitfalls

### Pitfall 1: 800-Token Budget Overrun
**What goes wrong:** Adding too many examples and rules causes the system prompt to exceed 800 tokens, increasing cost and reducing model attention on critical rules.
**Why it happens:** Good/bad examples are expensive in tokens. Each example pair costs ~15-25 tokens.
**How to avoid:** Keep examples to 3-4 of the highest-value pairs. Use condensed rule format ("FAQAT", "HECH QACHON") instead of multi-sentence explanations. After writing, count tokens: `Math.ceil(prompt.length / 4)` as rough estimate, or use tiktoken.
**Warning signs:** Prompt string longer than 3200 characters.

### Pitfall 2: Confirmation Gate Bypass
**What goes wrong:** Model calls `create_booking` before showing confirmation summary and buttons. This creates real bookings without user review.
**Why it happens:** Model may interpret "time selected = ready to book" if the booking flow section isn't explicit about the confirmation gate.
**How to avoid:** In the booking flow section, make step N explicitly: "vaqt tanlangach → TASDIQLASH qadami kerak, UNDAN KEYIN create_booking". In the confirmation section, repeat: "create_booking ni FAQAT tasdiqlangandan keyin chaqir".
**Warning signs:** End-to-end test shows `create_booking` called without prior confirmation response.

### Pitfall 3: Buttons on Informational Answers
**What goes wrong:** Model adds service/date/time buttons on answers to "narxi qancha?" or "qachon ishlaysiz?", cluttering the UI.
**Why it happens:** The model conflates "informational answer + nudge" with "booking step that needs buttons".
**How to avoid:** BTN-03 rule must explicitly state: Q&A answers (hours, prices, location, payment) get `buttons: []` always. Booking nudge is text-only.
**Warning signs:** Success criterion #4 fails (more than 5 responses with buttons in 15-message test).

### Pitfall 4: display_address Field May Be Absent
**What goes wrong:** `businessData.location.display_address` is undefined for older Firestore records. Prompt interpolation produces "Manzil: undefined" which the model echoes to users.
**Why it happens:** `display_address` is populated from Google Places when business is created with a `place_id`, but some older records may lack it.
**How to avoid:** Always use fallback: `businessData.location?.display_address || businessData.location?.street_name || ''`. If both are empty, omit the address line from the prompt entirely (conditional injection with `address ? `\nManzil: ${address}` : ''`).
**Warning signs:** AI tells users "Manzil: undefined" or "Manzil: ".

### Pitfall 5: Nudge After Every Response (Including Greetings)
**What goes wrong:** AI appends "Yozdiraysizmi?" after "Salom! Nima xizmat?" or after "Marhamat, ko'rishguncha!".
**Why it happens:** PROMPT-09 says "after every non-booking Q&A answer" but "non-booking" can be misread to include greetings.
**How to avoid:** Explicitly enumerate skip cases: greetings, thanks (rahmat), farewells (xayr, ko'rishguncha), small talk, off-topic redirects.
**Warning signs:** Success criterion #5 fails.

### Pitfall 6: Payment Methods Hallucination
**What goes wrong:** AI says "We accept Visa, Mastercard, PayPal, and crypto" when no payment data is available.
**Why it happens:** Model fills gaps from training data.
**How to avoid:** Inject explicit payment default in prompt: `To'lov: ${businessData.payment_methods || 'naqd pul yoki karta'}`. Model will answer from injected data, not from imagination.

### Pitfall 7: Working Hours as "Today Only"
**What goes wrong:** AI only mentions today's hours when asked "qachon ishlaysizlar?" instead of showing the full week.
**Why it happens:** Prompt may only inject today's hours for brevity.
**How to avoid:** Inject all 7 days as a compact comma-separated string. The model will format it appropriately for the question asked (today's hours vs full week).

---

## Code Examples

### Working Hours Injection (buildChatSystemPrompt)
```javascript
// Source: chatAi.js (secsToHHMM and DAY_LABELS are already in scope)
function buildWorkingHoursLine(working_hours) {
    const wh = working_hours || {};
    return DAY_NAMES.map((day, i) => {
        const h = wh[day];
        if (!h || !h.is_open) return `${DAY_LABELS.uz[i]}: yopiq`;
        return `${DAY_LABELS.uz[i]}: ${secsToHHMM(h.start)}-${secsToHHMM(h.end)}`;
    }).join(', ');
}

// Used inside buildChatSystemPrompt():
const workingHoursLine = buildWorkingHoursLine(businessData.working_hours);
const addressLine = businessData.location?.display_address
    || businessData.location?.street_name
    || '';
const paymentLine = businessData.payment_methods || 'naqd pul yoki karta';
```

### Business Context Block in Prompt Template
```
Biznes: ${businessData.business_name || ''}
${businessData.bio || ''}
Telefon: ${businessData.business_phone_number || 'N/A'}
${addressLine ? `Manzil: ${addressLine}` : ''}
Ish vaqti: ${workingHoursLine}
To'lov: ${paymentLine}
${isSolo ? 'Bu yakka tartibdagi usta. "Men" deb gapir.' : 'Bu jamoa. "Biz" deb gapir.'}
```

### Confirmation Step in Booking Flow (prompt text)
```
TASDIQLASH (vaqt tanlangach, create_booking DAN AVVAL):
Qisqa xulosa ko'rsat: "<Xizmat nomi>, <sana>, soat <HH:MM>"
Uzbekcha tugmalar: ["Ha, yozib qo'ying", "Vaqtni o'zgartiraman"]
Ruscha tugmalar: ["Да, запишите", "Изменить время"]
Tasdiqlash: tugma bosilsa YOKI "ha", "ok", "да", "хорошо", "yaxshi" yozilsa → create_booking chaqir
Noaniq javob → qayta so'ra, shu tugmalarni ko'rsat
HECH QACHON create_booking ni tasdiqlashdan oldin chaqirma
```

### Button Rule Section (prompt text)
```
BUTTONS — FAQAT 3 HOLAT:
1. Birinchi salomlashuvda: ["Yozilish", "Narxlar", "Manzil va ish vaqti"]
2. Xizmat/kun/vaqt tanlashda: tegishli tugmalar ro'yxati
3. Tasdiqlash bosqichida: ["Ha, yozib qo'ying", "Vaqtni o'zgartiraman"]
BOSHQA BARCHA HOLLARDA: buttons: []
Narx/manzil/ish vaqti savollariga javob berganingizda: buttons: []
Telefon/OTP/ism so'raganda: HECH QACHON button qo'yma
"value" DOIM "label" bilan bir xil bo'lsin
```

### Q&A Rules Section (prompt text)
```
SAVOLLARGA JAVOB:
- Ish vaqti: ish vaqti ma'lumotlaridan javob ber, keyin nudge
- Narx: get_services chaqir, natijani tabiiy ayt, keyin nudge
- Manzil: manzil ma'lumotidan javob ber, keyin nudge
- To'lov: to'lov ma'lumotidan javob ber, keyin nudge
- Walk-in: "Joy bo'lsa, albatta! Lekin band qilib kelgan ma'qul." keyin nudge
- Bekor qilish: "Buning uchun [telefon] ga qo'ng'iroq qiling." nudge — faqat xizmat tegishli bo'lsa
- Noma'lum savol: "[telefon] ga murojaat qiling" — hech qachon taxmin qilma
- Salom/rahmat/xayr: qisqa tabiiy javob, booking flow yo'q, nudge yo'q
- Mavzusiz gaplar: "Biz faqat [xizmat turi] bilan shug'ullanamiz" — kaltakka olmang

NUDGE (matn, button emas): "Yozdiraysizmi?" / "Band qilaylikmi?" / "Yozilmoqchimisiz?" — doim aylanib o'zgartir
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| GPT-3.5 free-form JSON output | GPT-4.1-mini with `zodTextFormat` structured output | Already implemented; guarantees schema compliance |
| Static prompt, no business data | Dynamic prompt with business data injected | Phase 8 adds more fields (hours, address, payment) |
| No confirmation gate | Confirmation gate (Phase 8 adds this) | Critical safety improvement |
| Buttons on any response | Buttons only in 3 defined cases | Phase 8 enforces this |

---

## Open Questions

1. **`display_address` field population**
   - What we know: Field is used in `public.js` at lines 549, 682. Field name is `businessData.location.display_address`.
   - What's unclear: Whether all existing Firestore business documents have this field populated, or only those created via Google Places search.
   - Recommendation: Use optional chaining + fallback: `businessData.location?.display_address || businessData.location?.street_name || ''`. If both empty, omit the address line. State this as a known limitation in implementation notes.

2. **Token budget measurement**
   - What we know: Current prompt is ~550-600 characters × 4 ≈ 140-150 tokens. Wait — current prompt is much longer. Rough estimate: 3400 chars / 4 = ~850 tokens (already near limit).
   - What's unclear: Whether the current prompt already exceeds 800 tokens, and what the actual gpt-4.1-mini context window is.
   - Recommendation: Count tokens manually after writing. If over budget, trim the good/bad examples section (most expensive). The 800-token constraint was a project decision based on cost, not a technical limit.

3. **History limit reduction**
   - What we know: STATE.md flags: "Measure actual per-call token counts during end-to-end booking flow test; reduce history from 30 to 20 messages". Currently loads last 30 messages.
   - What's unclear: What the actual token count is during a full booking flow (can reach 8-10 messages).
   - Recommendation: Reduce to 20 messages as a plan task. This is a `getChatAiReply()` change, not a system prompt change — 1 line in the history loading code.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest ^4.0.16 |
| Config file | none (vitest uses defaults; package.json `"test": "vitest run"`) |
| Quick run command | `cd /Users/shahzod/Projects/BLYSS/blyss-gcloud-api && npm test` |
| Full suite command | `cd /Users/shahzod/Projects/BLYSS/blyss-gcloud-api && npm test` |

### Phase Requirements → Test Map

Phase 8 requirements are behavioral/conversational — they depend on live OpenAI API calls and are not unit-testable without mocking the model. The testable surface is:

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONV-04 | `buildChatSystemPrompt()` injects working hours, address, payment into output string | unit | `npm test` (after adding test) | ❌ Wave 0 |
| BTN-03/04 | Prompt string contains BUTTONS section with correct 3-case enumeration | unit (string contains) | `npm test` (after adding test) | ❌ Wave 0 |
| PROMPT-01 | Working hours formatted string matches expected pattern from known input | unit | `npm test` (after adding test) | ❌ Wave 0 |
| PROMPT-03 | display_address injected when available, omitted when empty | unit | `npm test` (after adding test) | ❌ Wave 0 |
| BTN-01/02 | Confirmation summary + correct button labels appear | manual E2E | Run full booking flow in browser | N/A |
| PROMPT-09 | Nudge appears on informational answers, not on greetings | manual E2E | Test 15 representative messages | N/A |
| All CONV-* | Natural tone, one question per turn, language matching | manual E2E | Test with Uzbek/Russian/Cyrillic inputs | N/A |

**E2E test is the primary validation gate** (as noted in STATE.md: "Phase 8 is risk-bearing — modifies live booking flow; end-to-end test required before marking complete").

### Sampling Rate
- **Per task commit:** `npm test` (existing CORS + server tests pass)
- **Per wave merge:** `npm test` + manual E2E booking flow
- **Phase gate:** Full E2E booking flow in browser — must confirm no booking created without confirmation step

### Wave 0 Gaps
- [ ] `src/utils/chatAi.test.js` — unit tests for `buildChatSystemPrompt()` covering: working hours injection (CONV-04/PROMPT-01), address injection with/without `display_address` (PROMPT-03), prompt contains BUTTONS 3-case section (BTN-03)
- [ ] No framework install needed — vitest already installed

---

## Sources

### Primary (HIGH confidence)
- `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/utils/chatAi.js` — full source read; all helper functions, tool definitions, buildChatSystemPrompt, getChatAiReply
- `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/schemas/business.js` — business Firestore schema; confirmed no `payment_methods` field
- `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/src/routes/public.js` — lines 541-560 and 680-684 confirm `location.display_address` field name
- `/Users/shahzod/Projects/BLYSS/landing-page/.planning/phases/08-system-prompt-overhaul/08-CONTEXT.md` — all user locked decisions
- `/Users/shahzod/Projects/BLYSS/landing-page/.planning/STATE.md` — project decisions (800-token constraint, 3 button cases, history limit concern)

### Secondary (MEDIUM confidence)
- `/Users/shahzod/Projects/BLYSS/blyss-gcloud-api/package.json` — confirmed vitest ^4.0.16 and openai ^6.17.0

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all from source code, no assumptions
- Architecture patterns: HIGH — derived from reading actual function implementations
- Pitfalls: HIGH (confirmation bypass, token budget) / MEDIUM (display_address availability) — sourced from schema analysis and existing code behavior
- Validation: HIGH — vitest presence and test patterns confirmed from source

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable stack; OpenAI API patterns stable)
