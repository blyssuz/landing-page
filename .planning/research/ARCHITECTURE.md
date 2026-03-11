# Architecture Research: AI Chat Experience Integration

**Domain:** AI conversational chat integration for multi-tenant salon booking
**Researched:** 2026-03-12
**Confidence:** HIGH (all findings from direct codebase analysis, no speculative sources needed)
**Milestone:** v3.0 AI Chat Experience Overhaul

---

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          landing-page (Next.js 16)                           │
│                                                                              │
│  app/[locale]/[tenant]/page.tsx (Server Component)                          │
│    └── _components/ChatWidget.tsx (Client Component, 'use client')           │
│          │  state: messages[], inputType, aiTyping, sending, loaded          │
│          │  localStorage: blyss_visitor_id, blyss_visitor_name               │
│          │                                                                   │
│          ├── GET  /api/chat?business_id=&visitor_id=    (load history)       │
│          └── POST /api/chat  { business_id, visitor_id, message_text }      │
│                 │                                                            │
│  app/api/chat/route.ts (Next.js Route Handler — thin proxy)                  │
│    └── signedFetch → blyss-gcloud-api                                        │
└───────────────────────────────────────────────────────────────────────────────┘
                          │ HMAC-signed HTTP
┌──────────────────────────────────────────────────────────────────────────────┐
│                       blyss-gcloud-api (Express.js v5)                       │
│                                                                              │
│  src/routes/public.js                                                        │
│    POST /public/businesses/:businessId/chat                                  │
│      1. Validate visitor_id + message_text                                   │
│      2. Upsert conversation doc in Firestore                                 │
│      3. Write user message to messages subcollection                         │
│      4. Call getChatAiReply()  ← THE INTEGRATION POINT                      │
│      5. Write AI message with metadata { buttons, input_type }               │
│      6. Return { message_id, ai_reply: { text, buttons, input_type } }       │
│                                                                              │
│    GET /public/businesses/:businessId/chat/:visitorId/messages               │
│      Returns messages array with metadata (buttons, input_type) restored    │
│                                                                              │
│  src/utils/chatAi.js  ← ALL PROMPT WORK HAPPENS HERE                        │
│    buildChatSystemPrompt(businessData, businessId, session)                  │
│    getChatAiReply(businessId, conversationRef, conversationData, userMsg)    │
│      ├── Loads businessData from Firestore                                   │
│      ├── Loads session = conversationData.session || {}                      │
│      ├── Loads last 30 messages as conversation history                      │
│      ├── Runs OpenAI Responses API tool-calling loop (max 6 iterations)      │
│      │     model: gpt-4.1-mini, zodTextFormat(ChatResponseSchema)            │
│      ├── Executes 7 tool functions (get_services, get_available_dates,       │
│      │     get_available_slots, send_verification_code, verify_code,         │
│      │     register_user, create_booking)                                    │
│      └── Returns { message, buttons[], input_type }                          │
└──────────────────────────────────────────────────────────────────────────────┘
                          │ Firestore reads/writes
┌──────────────────────────────────────────────────────────────────────────────┐
│                            Firestore                                         │
│                                                                              │
│  businesses/{businessId}                                                     │
│    .business_name, .bio, .working_hours, .business_phone_number,             │
│    .location { city, street_name, display_address, lat, lng }                │
│    .tenant_url, .is_solo                                                     │
│                                                                              │
│  businesses/{businessId}/customer_conversations/web_{visitorId}              │
│    .visitor_id, .source, .first_name, .session {}  ← auth state lives here  │
│    /messages/{msgId}                                                         │
│      .sender_type, .text, .created_at                                        │
│      .metadata { buttons[], input_type }  ← button/input state              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

| Component | File | Responsibility | What Changes in v3.0 |
|-----------|------|----------------|----------------------|
| ChatWidget | `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx` | UI shell, message rendering, button clicks, input modes, polling | Replace hardcoded greeting with AI greeting from first message; no structural changes needed |
| chat route (Next.js) | `landing-page/app/api/chat/route.ts` | Thin HMAC-signed proxy from frontend to API | No changes |
| public.js chat endpoints | `blyss-gcloud-api/src/routes/public.js` | HTTP handler: validates, persists, calls chatAi, returns ai_reply | No changes |
| chatAi.js | `blyss-gcloud-api/src/utils/chatAi.js` | System prompt, tool calling loop, structured output | PRIMARY CHANGE FILE for v3.0 |
| Firestore conversation doc | runtime | Conversation root: stores session state (phone, user_id, otp_id) | No schema changes; existing session fields sufficient |
| Firestore message doc | runtime | Stores text + metadata { buttons, input_type } | No schema changes; existing metadata field sufficient |

---

## Integration Points: New vs Modified

### Modified: `chatAi.js` — buildChatSystemPrompt()

This is the only function that changes in the API. Everything else in the data flow is unchanged.

**Current state:**
- Single function returning one long string
- Covers: conversational tone, booking flow, button rules, input_type rules, language detection
- Missing: working hours Q&A, location/address responses, price inquiry handling, cancellation policy, payment info, quick-start greeting buttons, confirmation step before booking

**v3.0 changes:**
- Same function signature: `buildChatSystemPrompt(businessData, businessId, session)`
- Prompt grows to cover all customer question types
- Adds greeting instruction: on first message (empty history), return a personalized greeting with 3-4 quick-start buttons
- Adds confirmation step instruction: before calling `create_booking`, show a summary message with yes/no buttons
- Adds response templates for: hours, location, payment, cancellation, price without service list, "who works here"
- Working hours data is already available in `businessData.working_hours` — prompt just needs to format and use it
- Location data is already available in `businessData.location.display_address` — already passed to prompt via bio field or needs explicit inclusion

**Key constraint:** `buildChatSystemPrompt` receives `businessData` which contains:
- `business_name`, `bio`, `business_phone_number`, `tenant_url`, `is_solo`
- `working_hours` (keyed by day name, with `is_open`, `start`, `end` in seconds)
- `location` (city, street_name, display_address, lat, lng)

The `location` object and `working_hours` formatting are NOT currently included in the system prompt text. They must be added in v3.0 to enable location and hours Q&A without tool calls.

### New: Greeting Flow

**Current state:** ChatWidget renders a hardcoded greeting string from the `CHAT_TEXT` locale constant. No buttons on initial open.

**v3.0 approach:** Two options with different tradeoffs:

**Option A (API-driven greeting):** On first open with empty history, ChatWidget automatically fires a `POST /api/chat` with a special hidden initialization message (e.g., `"__init__"`). The AI returns a greeting with quick-start buttons. The greeting is stored as the first message in Firestore.

- Pro: AI generates greeting from real business data (name, services context), buttons are context-aware
- Con: Adds one API call latency on first open; user sees typing indicator before greeting appears
- Con: Requires ChatWidget to handle "don't show init message as user bubble" logic

**Option B (Static greeting + dynamic buttons via initial load):** Keep hardcoded greeting text. Add a new GET endpoint that returns pre-defined quick-start buttons for the business. ChatWidget shows greeting immediately + loads buttons.

- Pro: Instant greeting, no latency
- Con: Buttons are not AI-generated; needs a new endpoint or a new field on the business doc

**Recommendation: Option A** — The AI-generated greeting is the core feature. The latency is acceptable (1-2s with typing indicator already implemented). The init message approach is clean.

**Implementation detail for Option A:** ChatWidget checks `messages.length === 0 && loaded === true` and triggers a single init call with `message_text: "__greeting__"`. The system prompt handles this trigger: "If user message is exactly `__greeting__`, respond with a warm personalized greeting and 3-4 quick-start button options. Do not show `__greeting__` in history context."

**Alternative init approach:** The GET history endpoint (`/chat/:visitorId/messages`) could return a special `greeting` field on empty conversations. ChatWidget renders it as the static greeting + pre-set buttons. No POST needed for greeting. This avoids a second POST on open. Cleaner but requires a small route change.

**Actual recommended approach: Static greeting + API provides initial buttons.** The GET messages response already returns empty `[]` for new conversations. Modify the GET endpoint to return `suggested_buttons: [...]` when messages are empty, based on the business. This requires a small change in `public.js` GET handler only — no chatAi changes for greeting. The AI greeting proper activates on the user's first real message.

### New: Confirmation Step Before Booking

**Current state:** The AI calls `create_booking` directly after collecting date + time. No confirmation message shown to user.

**v3.0 change:** System prompt instruction added: "Before calling `create_booking`, send a confirmation message that summarizes the booking (service, date, time, price) with two buttons: 'Tasdiqlash' / 'Bekor qilish'. Wait for user confirmation. Only call `create_booking` when user confirms."

**Data available for confirmation summary:** All booking parameters (service_name, date, time, price) are collected during the tool-calling loop and available in the conversation messages. The AI can compose the summary from data already in context — no new tool needed.

**Session state coordination:** The session object on the conversation doc already tracks `user_id`, `phone_number`, `otp_id`. For the confirmation step, pending booking details (service_id, date, start_time) do not need to be persisted in session — they exist in the conversation message history and the AI can reference them within the same function-calling loop.

### Not Changing: Everything Else

| Component | Reason |
|-----------|--------|
| `ChatResponseSchema` (Zod) | `{ message, buttons[], input_type }` is already flexible enough for all new button patterns |
| 7 tool function definitions | No new tools needed; prompt changes use existing tools differently |
| Tool executor implementations | No logic changes; booking params, availability, OTP all unchanged |
| `public.js` POST handler | Calls `getChatAiReply` and stores result; no structural change needed |
| `landing-page/app/api/chat/route.ts` | Pure proxy; nothing to change |
| Firestore data model | `session` object and `metadata` field on messages already support all needed state |
| Authentication flow | OTP + JWT unchanged; prompt wording improves but mechanics stay |

---

## Data Flow: v3.0 Scenarios

### Scenario 1: First Open (Greeting)

```
User opens ChatWidget
  ↓
ChatWidget: messages.length === 0 && loaded === true
  ↓
ChatWidget renders static "Salom!" greeting from CHAT_TEXT
ChatWidget renders quick-start buttons from businessData prop
  (buttons passed from server-rendered page.tsx via ChatWidget props)
  OR
  ↓ (if not passed via props)
GET /api/chat?business_id=&visitor_id= returns { messages: [], suggested_buttons: [...] }
ChatWidget renders static greeting + suggested_buttons
```

**Decision:** Pass `initialButtons` as a prop to ChatWidget from the server component page.tsx (or TenantPage.tsx). The server already has the business data and can generate static quick-start buttons at render time. No extra API call on open.

```
page.tsx (Server Component) has businessData
  ↓ prop
ChatWidget: initialButtons={['Narxlar', 'Ish vaqti', 'Yozilish', 'Qo\'ng\'iroq qilish']}
```

This is the cleanest approach: zero extra API calls, instant buttons, no chatAi changes needed for greeting.

### Scenario 2: General Q&A (Hours, Location, Price)

```
User: "Ish vaqtlari qanday?"
  ↓ POST /api/chat { message_text: "Ish vaqtlari qanday?" }
  ↓ getChatAiReply()
  ↓ buildChatSystemPrompt() — includes working_hours formatted as text in prompt
  ↓ OpenAI call (no tool needed — answer is in system prompt)
  ↓ Returns { message: "Dushanba–Shanba 9:00–20:00, Yakshanba dam olish kuni", buttons: [], input_type: null }
  ↓ ChatWidget renders reply
```

Key: Working hours and address must be pre-formatted into the system prompt text so the AI can answer without a tool call. This reduces latency (no extra Firestore read per Q&A question).

### Scenario 3: Booking with Confirmation

```
User: "Soch oldirmoqchiman, bugun 15:00 ga"
  → AI collects service (get_services → service_id)
  → AI collects availability (get_available_dates → date confirmed)
  → AI: "Yaxshi! 15:00 da Soch olish — 30 000 so'm. Tasdiqlaysizmi?"
        buttons: [{ label: "Ha, tasdiqlash", value: "Ha, tasdiqlash" },
                  { label: "Yo'q, bekor", value: "Yo'q, bekor" }]
  ↓ User clicks "Ha, tasdiqlash"
  → User message: "Ha, tasdiqlash"
  → AI sees confirmation → calls send_verification_code (if not authenticated)
  → OTP flow...
  → AI calls create_booking
  → AI: "Band qildim! ✅ Bugun 15:00 da Soch olish. Kutib qolamiz!"
```

Note: The confirmation step happens within the tool-calling loop. The AI sends a confirmation message (structured output response, not a tool call), waits for the next user turn, then proceeds. This is a natural conversation turn, not a special mechanism.

### Scenario 4: State Restoration on Reopen

```
User closes and reopens ChatWidget
  ↓
GET /api/chat?business_id=&visitor_id= returns existing messages with metadata
  ↓
ChatWidget: restores inputType from lastAi.metadata.input_type
  (if user was mid-OTP, input field shows numeric OTP mode)
ChatWidget: renders buttons ONLY on last AI message (existing behavior, no change)
```

This works today. No changes needed for state restoration.

---

## Prompt Organization: Single vs Modular

**Decision: Single function, internally sectioned with visual dividers.**

The current `buildChatSystemPrompt()` already uses `═══ SECTION ═══` dividers. This works well because:

1. The prompt is dynamically built from runtime data (business name, auth status, working hours) — string concatenation in one function is the right pattern
2. The AI reads the entire prompt as one context; there is no runtime cost to "modularity"
3. Splitting into multiple functions that get concatenated adds complexity without benefit

**Recommended internal sections for v3.0 prompt:**

```
Section 1: Identity + Business Info
  - Business name, bio, phone
  - Address (from location.display_address)
  - Working hours (formatted: "Mon–Sat 09:00–20:00, Sunday closed")
  - Booking link
  - Solo vs team

Section 2: Auth Status (dynamic)
  - User authenticated as [name] / not authenticated

Section 3: Conversational Tone Rules
  - Natural, short, human (existing — keep)
  - Good/bad examples (existing — keep)
  - Language detection (existing — keep)

Section 4: General Q&A Templates
  - NEW: How to answer hours questions (use data from Section 1)
  - NEW: How to answer location/address questions
  - NEW: How to answer price questions (answer directly if known, call get_services if not)
  - NEW: How to answer payment method questions (cash/card — from businessData or default)
  - NEW: How to answer cancellation questions (standard policy)

Section 5: Booking Flow (existing — extend)
  - Existing flow steps 1–8
  - NEW: Confirmation step before create_booking
  - Existing phone/OTP handling

Section 6: Button Rules
  - Existing rules (services, dates, slots, yes/no)
  - NEW: Quick-start button examples
  - NEW: Confirmation button pattern

Section 7: Input Type Rules (existing — keep)

Section 8: Language Rules (existing — keep)
```

**Prompt length estimate:** Current prompt is ~1,200 characters. v3.0 adds Q&A templates, working hours block, address, and confirmation instructions. Estimated ~2,500–3,000 characters. Well within gpt-4.1-mini's context window. No performance concern.

---

## Cross-Repo Change Map

Both repos require changes. Changes are independent — can be built and tested separately.

### blyss-gcloud-api changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/utils/chatAi.js` | Modify | `buildChatSystemPrompt()`: add location + working hours to prompt text; add Q&A response templates; add confirmation step instruction; add quick-start button guidance |

That's the only file that changes in the API repo.

### landing-page changes

| File | Change Type | Description |
|------|-------------|-------------|
| `app/[locale]/[tenant]/_components/ChatWidget.tsx` | Modify | Accept `initialButtons` prop; render initial buttons below greeting when messages are empty; possibly adjust greeting text |
| `app/[locale]/[tenant]/page.tsx` or `TenantPage.tsx` | Modify | Pass `initialButtons` prop to ChatWidget based on business type / common questions |

**No new files required in either repo for the core features.**

---

## Architectural Patterns for the Prompt

### Pattern 1: Data-in-Prompt for Static Facts

**What:** Inject working hours and address directly into the system prompt as formatted text, rather than creating new tools.

**When to use:** When data is static per-conversation (doesn't change mid-conversation) and the answer requires no computation.

**Why not a tool:** A `get_business_info` tool would add a round-trip to OpenAI and a Firestore read for every hours/address question. The data is already loaded (`businessData` is fetched at the start of `getChatAiReply`).

**Implementation:**
```javascript
// In buildChatSystemPrompt():
const wh = businessData.working_hours || {};
const hoursLines = DAY_NAMES.map((day, i) => {
    const h = wh[day];
    if (!h?.is_open) return `${DAY_LABELS.uz[i]}: yopiq`;
    return `${DAY_LABELS.uz[i]}: ${secsToHHMM(h.start)}–${secsToHHMM(h.end)}`;
}).join('\n');

const address = businessData.location?.display_address || businessData.location?.street_name || '';
```

Then embed `hoursLines` and `address` in the Section 1 block of the prompt.

### Pattern 2: Button Value Equals Label

**What:** The `value` field in every button object always equals the `label` field.

**Why:** ChatWidget calls `handleButtonClick(btn)` which calls `sendMessage(btn.label)`. The value is currently unused but exists for forward compatibility. All AI-generated buttons must follow label === value.

**Prompt rule to reinforce:**
```
TUGMALAR: "value" DOIM "label" bilan bir xil bo'lsin.
```

### Pattern 3: Confirmation as Conversation Turn

**What:** The confirmation step before booking is a normal AI response with yes/no buttons — not a special UI mode or new schema field.

**When:** After AI has collected service + date + time + (optionally) employee, but before calling `create_booking`.

**Why this works:** gpt-4.1-mini with function calling will generate a text response (structured output) instead of a tool call when the prompt instructs it to wait for user confirmation. The conversation history preserves the booking details across the turn. On the next user message ("Ha, tasdiqlash"), the AI reads history, sees the pending booking intent, and proceeds with the tool call.

**Risk:** If the AI "forgets" to wait and calls `create_booking` directly, bookings will be created without confirmation. The prompt must be explicit: "HECH QACHON create_booking ni mijoz tasdiqlamasdan chaqirma."

### Pattern 4: Session for Auth State Only

**What:** The `session` object on the Firestore conversation doc persists authentication state between messages: `phone_number`, `otp_id`, `user_id`, `first_name`, `needs_registration`.

**What NOT to put in session:** Pending booking details (service_id, date, time). These exist in conversation history and should not be duplicated in session. Keeping session minimal reduces Firestore write frequency and avoids stale state bugs.

**Why:** If pending booking details are stored in session and the user changes their mind mid-conversation, the session would have stale data that contradicts the conversation history. The AI reads conversation history on every call and can reconstruct booking intent from it.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: New Tools for Static Data

**What people do:** Create a `get_business_hours` tool or `get_business_address` tool that the AI calls when users ask about hours or location.

**Why it's wrong:** Every tool call adds ~1-2s to response time (OpenAI round-trip + Firestore read). For static data that is already loaded at the start of `getChatAiReply`, this is pure overhead. The data should be in the system prompt.

**Do this instead:** Pre-format hours and address into the system prompt text in `buildChatSystemPrompt`. The AI reads it once and answers directly.

### Anti-Pattern 2: Hardcoded Greeting with No Business Context

**What people do:** Keep the current `CHAT_TEXT.uz.greeting` hardcoded string that says "Salom! Qanday yordam bera olamiz? 😊" regardless of which business it is.

**Why it's wrong:** Every barbershop feels the same. Misses the opportunity to surface business name and quick-start actions.

**Do this instead:** Pass `initialButtons` as a prop computed from business data. Keep the greeting text personalized (include business name). Possible: `Salom! ${businessName} ga xush kelibsiz 👋` + quick buttons.

### Anti-Pattern 3: Storing Conversation Context Twice

**What people do:** Save pending booking details (service, date, time) in both the session object and the conversation messages.

**Why it's wrong:** Two sources of truth for the same data. When they diverge (user changes mind), the AI may use stale session data over the conversation history the user just provided.

**Do this instead:** Session stores only authentication state. Booking details flow entirely through conversation history. The function-calling loop always has access to the full 30-message history.

### Anti-Pattern 4: Frontend Driving Button Logic

**What people do:** Add special logic in ChatWidget to detect "booking confirmation" state and render a custom confirmation UI component separate from the normal button array.

**Why it's wrong:** Creates a parallel state machine between frontend and AI. Any time the AI behavior changes, the frontend logic must also be updated. Tight coupling across repos.

**Do this instead:** All button presentation logic lives in the AI response. ChatWidget renders whatever buttons the AI returns, universally. The AI controls when yes/no confirmation buttons appear. ChatWidget does not know or care what the buttons mean.

### Anti-Pattern 5: Prompt Modularization via Function Composition

**What people do:** Split `buildChatSystemPrompt` into `buildToneSection()`, `buildBookingSection()`, `buildQASection()` etc., each returning a string that gets concatenated.

**Why it's wrong:** Adds indirection with zero runtime benefit. The AI reads the prompt as one string. The internal sectioning with `═══` dividers is sufficient for human readability and maintenance.

**Do this instead:** Keep `buildChatSystemPrompt` as a single function. Use `═══ SECTION ═══` dividers for readability within the function body. Extract only reusable helper computations (like hours formatting) into small local functions.

---

## Build Order for v3.0

Dependencies are minimal. The two repos are independent.

### Step 1: API — `chatAi.js` prompt expansion (blyss-gcloud-api)

Modify `buildChatSystemPrompt()`:
1. Add location + formatted working hours to Section 1
2. Add Q&A response templates section
3. Add confirmation step instruction to booking flow section
4. Add quick-start button guidance to button rules section

No other files change in API repo.

**Test:** Use the existing chat widget in dev to verify all question types return correct responses before touching the frontend.

### Step 2: Frontend — ChatWidget greeting + initial buttons (landing-page)

1. Add `initialButtons?: ChatButton[]` prop to ChatWidget
2. Render `initialButtons` below the greeting when `messages.length === 0 && loaded`
3. Update greeting text to include business name: `Salom! {businessName} 👋`
4. Pass `initialButtons` from TenantPage.tsx with hardcoded common questions for the business type

**These steps are parallel (Step 2 can start before Step 1 is tested) because they don't depend on each other.**

### Step 3: Integration test

Test the full flow: greeting buttons → general Q&A → booking flow → confirmation → create booking.

No deployment sequence required. Both repos deploy independently (separate Dockerfiles). Deploy API first (prompt changes are backward compatible with old frontend) then deploy frontend.

---

## Firestore Document Shape (Unchanged)

```
businesses/{businessId}/customer_conversations/web_{visitorId}
{
  visitor_id: string,
  source: "web",
  first_name: string | null,
  last_name: null,
  created_at: Timestamp,
  last_message_at: Timestamp,
  session: {
    // Auth state only — set by chatAi.js tool executors
    phone_number?: string,      // set by execSendOtp
    otp_id?: string,            // set by execSendOtp
    user_id?: string,           // set by execVerifyOtp / execRegisterUser
    first_name?: string,        // set by execVerifyOtp / execRegisterUser
    needs_registration?: bool,  // set by execVerifyOtp
  }
}

businesses/{businessId}/customer_conversations/web_{visitorId}/messages/{msgId}
{
  sender_type: "user" | "ai",
  sender_id: null,
  sender_name: string,
  text: string,
  created_at: Timestamp,
  // Only on AI messages:
  metadata?: {
    buttons: [{ label: string, value: string }],
    input_type: "phone" | "otp" | "name" | null,
  }
}
```

No schema changes needed. The existing `metadata` field on AI messages already stores buttons and input_type. The existing `session` field handles auth state. v3.0 adds no new Firestore fields.

---

## Scaling Considerations

| Scale | AI Chat Architecture |
|-------|---------------------|
| Current (few businesses) | Single chatAi.js, synchronous function call per message, adequate |
| 100 businesses, moderate traffic | Rate limiter (20 req/min/IP) already in place; OpenAI API is the bottleneck, not Firestore |
| 1000+ businesses, high traffic | Consider queue-based AI processing (message goes to queue, frontend polls); current synchronous model will hit OpenAI rate limits before Firestore limits |

For v3.0 (milestone scope), current synchronous architecture is correct. No scaling changes warranted.

---

## Integration Point Summary for Roadmap

| Integration Point | Repo | File | Type | Priority |
|-------------------|------|------|------|----------|
| Working hours + address in prompt | blyss-gcloud-api | `src/utils/chatAi.js` | Modify | Phase 1 |
| Q&A response templates in prompt | blyss-gcloud-api | `src/utils/chatAi.js` | Modify | Phase 1 |
| Confirmation step instruction | blyss-gcloud-api | `src/utils/chatAi.js` | Modify | Phase 1 |
| Quick-start button guidance | blyss-gcloud-api | `src/utils/chatAi.js` | Modify | Phase 1 |
| ChatWidget initial buttons prop | landing-page | `ChatWidget.tsx` | Modify | Phase 2 |
| ChatWidget greeting personalization | landing-page | `ChatWidget.tsx` | Modify | Phase 2 |
| Pass initialButtons from TenantPage | landing-page | `TenantPage.tsx` (or page.tsx) | Modify | Phase 2 |

**No new files. No new API endpoints. No schema changes. No new tools.**

---

## Sources

- Direct codebase analysis: `blyss-gcloud-api/src/utils/chatAi.js` (full file read)
- Direct codebase analysis: `blyss-gcloud-api/src/routes/public.js` (chat endpoints)
- Direct codebase analysis: `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx`
- Direct codebase analysis: `landing-page/app/api/chat/route.ts`
- Direct codebase analysis: `blyss-gcloud-api/src/routes/conversations.js`
- Project context: `.planning/PROJECT.md`

---

*Architecture research for: AI chat experience integration (v3.0)*
*Researched: 2026-03-12*
