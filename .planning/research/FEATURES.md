# Feature Research

**Domain:** AI chat experience for salon/barbershop booking (v3.0 milestone)
**Researched:** 2026-03-12
**Confidence:** HIGH (direct codebase analysis) / MEDIUM (industry research)
**Scope:** NEW features only — what does not yet exist in the v2.0 chat widget

---

## Context: What Already Exists

The existing chat already handles:
- Service selection via buttons
- Date and time slot selection via buttons
- Phone OTP authentication
- Booking creation
- `input_type` switching (phone / otp / name)

The existing system prompt is booking-flow-only. It lacks: Q&A, natural greeting, quick-start buttons, smart contextual button patterns, and handling of all real customer questions.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume any "chat with business" should handle. Missing these means the chat fails the "feels like texting the receptionist" test.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Answer working hours questions | #1 most common pre-booking question. "Bugun qachongacha ishlayveri?" or "Shanba kunlari ishlasveri?" Real receptionists get this 20x a day. | LOW | Business `working_hours` already in Firestore. Prompt needs to be taught to look up today's day and answer confidently, not just redirect to booking. |
| Answer services and pricing questions | "Soch olish qancha turadi?", "Boda olish ham qilasizlarmi?" — customers verify the menu before committing to a visit. | LOW | `get_services` tool already exists. Prompt needs to know when to call it for info queries (not just booking) and format prices clearly: "Soch olish — 35 000 so'm, 30 daqiqa." |
| Answer location and address questions | "Qayerdasiz?", "Manzil yuboring", "Metroga yaqinmi?" — location is a booking prerequisite for new customers. | LOW | Business address is in Firestore `businessData`. Currently not exposed in system prompt. Must be added to context block. |
| Answer payment method questions | "Kartaga to'lasa bo'ladimi?", "Naqd pul kerakmi?" — Uzbekistan market: not obvious. Mix of cash and terminal. | LOW | No payment info in current system prompt or data. Need to expose payment fields from business profile, or have a standard "naqd yoki karta" default answer. |
| Handle greeting naturally | "Salom", "Assalomu alaykum", "Привет" — first message users send. Current response can feel robotic if prompt triggers booking flow too fast. | LOW | Prompt already has good examples for "salom" → "Salom! Nima xizmat?" — needs reinforcement, not redesign. |
| Handle small talk and goodbyes | "Rahmat", "Xayr", "Spasibo" — conversation closure. Users expect a warm, brief ack, not silence or another question. | LOW | Short response rules. "Marhamat! Kutib qolamiz 😊" pattern is correct — needs to be taught explicitly as a category in the prompt. |
| Answer cancellation questions | "Bekor qilsam bo'ladimi?", "Yozuvni o'chirib qo'yish uchun nima qilaman?" — standard concern especially for new customers. | LOW | No cancellation handling in current prompt. AI should explain the process (visit /my-bookings or contact the salon). No backend tool needed — just a written response template. |
| Confirm booking before creating it | Before calling `create_booking`, show a summary: "Unda yozib qo'yaman: [sana], [vaqt], [xizmat]. To'g'rimi?" with Yes/No/Change buttons. | MEDIUM | The current flow calls `create_booking` without showing a summary. This is the highest-friction point — users feel like something was booked without their explicit sign-off. Requires prompt instruction + button pattern. |
| AI-generated greeting with quick-start buttons | First message when chat opens: dynamic greeting from AI based on business context, paired with 3-4 quick-start buttons ("Yozilish", "Narxlar", "Manzil", "Ish vaqti"). Currently hardcoded static text in frontend. | MEDIUM | Requires: (a) frontend sends `type: "greeting"` message or fetches initial greeting endpoint on open, (b) prompt generates context-aware opener. Alternatively: initial message fetched from API on chat open. |
| Walk-in policy answers | "Navbatsiz kelsa bo'ladimi?", "Hozir boshqa odam bormikan?" — customers in Uzbekistan often prefer walk-ins. | LOW | No current handling. Standard answer template: "Navbat bo'lsa qabul qilamiz, lekin online yozilgan yaxshiroq." Custom per-business if `accepts_walkins` field exists. |

### Differentiators (Competitive Advantage)

Features that make BLYSS chat feel premium — like a real receptionist, not a booking form.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Action-labeled confirmation buttons instead of Yes/No | "Tasdiqlash" + "O'zgartirish" + "Bekor qilish" is clearer than "Ha" + "Yo'q". UX research (NN/G, 2025) shows action labels reduce misclicks vs abstract Yes/No by eliminating the mental mapping step. | LOW | Prompt change only. Teach the AI to use action-specific button labels at confirmation step: `[{label: "Ha, yozib qo'ying", value: "Ha, yozib qo'ying"}, {label: "Vaqtni o'zgartiraman", value: "Vaqtni o'zgartiraman"}]`. |
| Contextual quick-start on fresh chat | When the chat is opened for the first time, show 3-4 buttons that reflect the most common reasons people open this chat: "Yozilish", "Narxlar va xizmatlar", "Manzil va ish vaqti". Reduces the cold-start "what do I type?" friction dramatically. | MEDIUM | Frontend needs to send a special "fresh open" signal to the API, or the API detects zero message history and returns quick-start buttons with the initial greeting. The backend prompt can be taught to return these on first turn with no history. |
| Free-text-first with button fallback | When user types freely (not from a button), AI responds in natural language first, then offers buttons only when a structured choice is needed (date, time, service list). When user presses a button, AI continues from that context without re-asking. | LOW | Current prompt mostly does this. Needs reinforcement: never show service picker buttons if user already named the service. |
| Scope-declaring intro | "Men shu salon haqida savollarga javob bera olaman: yozilish, narxlar, manzil, ish vaqti" — brief capability statement at greeting tells users what they can ask. Reduces mismatched expectations. | LOW | Part of the greeting system prompt. One sentence scope declaration added to initial message generation instructions. |
| One-question-per-turn discipline | Each AI response asks at most one question. "Soch oldirmoqchisizmi? Qaysi kunga qulay?" is two questions — it halts users who haven't thought about the date. "Yaxshi! Qaysi kunga yozay?" is one. | LOW | Already in current prompt ("Maksimal 1-2 ta jumla"), but not enforced for the confirmation/booking flow. Needs explicit rule: "har bir xabarda FAQAT BITTA savol". |
| Error recovery with helpful re-routing | When AI doesn't know something (e.g., product availability, staff bio, specific barber preferences), instead of "Bilmayman", offer actionable alternatives: "Buning uchun to'g'ridan-to'g'ri bog'lansangiz yaxshiroq. Telefon: [raqam]." | LOW | Prompt addition: "unknown question" handling template with redirect to phone number. |
| Style consultation questions | "Qanday uslubda soch qistirmoqchisiz?", "Avvalgi masteringiz kim bo'lgan?" — answers these intelligently to guide booking to the right specialist. | HIGH | Requires business-specific knowledge base (which staff does which styles). Not feasible without per-business FAQ data. Defer. |
| Proactive upsell nudge | After booking a haircut: "Soqol ham oldirmoqchimisiz? Birga yozib qo'yishim mumkin." | HIGH | Requires multi-service booking logic in `create_booking`. Current tool is single-service. Out of scope for v3.0 (tool changes excluded per PROJECT.md). Defer to v4.0. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Show all services as buttons immediately on chat open | Seems helpful — "let the user just pick a service." | 8-12 service buttons as first message is overwhelming. Cognitive overload kills engagement. Users who want to book already know what they want. Users who are browsing are better served by free-text Q&A. | Quick-start with 3-4 category buttons ("Soch xizmatlari", "Soqol xizmatlari") only when user is genuinely browsing. When user says "soch olish" — skip to dates. |
| Yes / No confirmation buttons | Simple, obvious to implement. | Abstract. Forces user to mentally map "Yes" to "book it" — causes hesitation. Research shows action-specific labels ("Ha, yozib qo'ying" / "Yo'q, o'zgartiraman") are clearer. | Action-labeled buttons at every confirmation point. |
| Timestamps on every message | Feels "complete" from a chat log perspective. | In a WhatsApp-style conversational chat, timestamps add visual noise that makes the chat feel more like a support ticket than a conversation. Heavy timestamp presence = "you're talking to a system." | Remove timestamps entirely (already done in v2.0). Do not re-add. |
| Multi-turn clarification before answering simple questions | Feels "thorough." "Qaysi xizmat haqida so'raylapsiz? 1) Soch, 2) Soqol, 3) Boshqa" — when user asked "narx qancha?" | Interrupts natural flow. User wanted a price, got a quiz. | Call `get_services` internally to list all prices, then summarize them directly in the reply: "Soch olish 35 000, soqol olish 20 000, ..." |
| Typing delays (artificial "..." before response) | Makes AI seem more "human-like." | Intercom's own research (2021) recommends against fake typing delays — they don't add humanness, they add latency frustration. The typing indicator while the API call runs is real and sufficient. | Keep the real `aiTyping` indicator (3 bouncing dots while API is processing). Remove any added artificial delays. |
| Persistent "Book Now" button in every AI message | Never loses booking CTA. | Forces users back to booking path when they may be asking informational questions. The "Yozilish" quick-start button at greeting serves this. | Include booking CTA in greeting quick-start buttons only. Let subsequent messages guide organically. |
| Multi-language system prompt | "More inclusive." | Doubles the prompt length, complicates testing, increases token cost, introduces translation inconsistencies. The current approach (Uzbek-primary prompt, auto-detect user language) already handles this correctly. | Keep: Uzbek-primary system prompt with explicit Uzbek → Kirill/Lotin detection. The AI handles language switching in output automatically. |
| Product recommendations (hair care retail) | "Revenue opportunity." | Requires per-business product inventory data that doesn't exist in the current data model. | Out of scope. Standard "usta maslahat beradi" response if product questions arise. |

---

## Feature Dependencies

```
Contextual Quick-Start on Fresh Chat
    └──requires──> Greeting message generated by AI (not hardcoded in frontend)
                       └──requires──> Frontend sends open-chat event to API
                                          OR
                                      API detects empty conversation history and returns greeting + buttons on first user message

Booking Confirmation Summary
    └──requires──> Booking state collected (service, date, time, user confirmed)
    └──requires──> AI prompt knows to pause before create_booking and show summary
    └──requires──> Action-labeled buttons (not Yes/No)

Answer Location Questions
    └──requires──> Business address in system prompt context block (currently missing)

Answer Payment Questions
    └──requires──> Payment methods field in business data (may need to be added)
                   OR default template answer in system prompt

Answer Cancellation Questions
    └──depends on──> No new tool needed — pure prompt Q&A response template

Error Recovery ("Bilmayman" → redirect to phone)
    └──depends on──> Business phone number already in system prompt context block (already present)
```

### Dependency Notes

- **Quick-start greeting requires system prompt + frontend change:** The frontend currently shows a hardcoded greeting. For AI-generated greetings with context-aware quick-start buttons, the frontend must request the first message from the API instead of rendering it locally. This is the only frontend change required by this milestone.
- **Booking confirmation summary is pure prompt engineering:** No schema or tool changes. The AI is instructed to always compose a summary message with action-labeled confirmation buttons before calling `create_booking`.
- **Location and payment answers require context block additions:** The system prompt currently has business phone, name, bio. Must also include address and payment_methods. These fields exist in Firestore `businessData`.

---

## MVP Definition

This is a v3.0 milestone on an existing product. "MVP" here means the minimum scope that achieves the goal: "AI chat that handles all common customer questions naturally, not just booking forms."

### Launch With (v3.0 core — prompt/logic changes only)

These are achievable entirely through changes to `chatAi.js` (system prompt + context block) and minimal frontend changes to `ChatWidget.tsx`.

- [ ] **Comprehensive Q&A system prompt** — working hours, services + pricing, location/address, payment methods, walk-in policy, cancellation flow, small talk / goodbye — teaches the AI to answer all common questions without triggering the booking flow prematurely
- [ ] **Business context block additions** — expose address + payment_methods from `businessData` in the `buildChatSystemPrompt` function so AI can answer location and payment questions from actual data
- [ ] **Booking pre-confirmation step** — before `create_booking`, AI shows summary message + action-labeled buttons ("Ha, yozib qo'ying" / "Vaqtni o'zgartiraman") — pure prompt instruction, no schema change
- [ ] **Action-labeled buttons everywhere** — replace implicit Yes/No confirmation patterns with descriptive action verbs in button labels throughout the booking flow
- [ ] **AI-generated greeting with quick-start buttons** — frontend sends first turn with empty message or "greeting" signal; prompt generates context-aware opener + 3-4 quick-start buttons; eliminates hardcoded `t.greeting` in `ChatWidget.tsx`
- [ ] **One-question-per-turn enforcement** — explicit prompt rule preventing double-questions in a single AI turn
- [ ] **Error recovery templates** — when AI can't answer, graceful redirect to phone number or "usta bilan gaplashing"

### Add After Validation (v3.x)

Features that require slightly more investment but no architectural changes.

- [ ] **Per-business custom FAQ knowledge base** — a `chat_faq` Firestore field where business owners can add custom Q&A pairs (hours, parking, etc.) injected into the system prompt. Trigger: user feedback shows AI giving wrong info for specific businesses.
- [ ] **Cancellation via chat** — if user has an active booking, allow them to cancel through the chat. Requires adding a `cancel_booking` tool. Trigger: significant user requests for this flow.

### Future Consideration (v4.0+)

Features requiring tool changes, schema changes, or multi-service booking support — all out of scope for v3.0 per PROJECT.md.

- [ ] **Multi-service booking in single chat flow** — "Soch + soqol" combo. Requires `create_booking` tool to accept multiple items. Complex slot conflict resolution.
- [ ] **Proactive upsell nudge** — suggest add-ons after primary service is booked. Depends on multi-service booking.
- [ ] **Style consultation (face shape, hair type guidance)** — needs per-business staff expertise knowledge base.
- [ ] **Rebooking from history** — "Oxirgi marta nima qildingiz?" using booking history. Requires user auth before greeting.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Comprehensive Q&A (hours, location, pricing) | HIGH | LOW (prompt only) | P1 |
| Business context block (address, payment) | HIGH | LOW (2-3 lines in prompt builder) | P1 |
| Booking pre-confirmation summary | HIGH | LOW (prompt instruction) | P1 |
| Action-labeled buttons | MEDIUM | LOW (prompt + button label style) | P1 |
| AI-generated greeting + quick-start buttons | HIGH | MEDIUM (frontend event + prompt change) | P1 |
| One-question-per-turn discipline | HIGH | LOW (prompt rule) | P1 |
| Error recovery templates | MEDIUM | LOW (prompt template) | P1 |
| Walk-in and cancellation answer templates | MEDIUM | LOW (prompt template) | P2 |
| Per-business FAQ knowledge base | HIGH | MEDIUM (Firestore field + injection) | P2 |
| Cancel booking via chat | MEDIUM | HIGH (new tool + backend) | P3 |
| Multi-service booking | HIGH | HIGH (tool rewrite) | P3 |

**Priority key:**
- P1: Required for v3.0 — achievable with prompt + minimal frontend changes
- P2: Add when P1 is validated and stable
- P3: Architectural investment — defer to next major milestone

---

## Competitor Feature Analysis

| Capability | Fresha | Booksy | WhatsApp Business Bots | BLYSS v3.0 Target |
|------------|--------|--------|----------------------|-------------------|
| Book via chat | Yes (coming 2026 via AI receptionist) | No native chat | Yes (via n8n/Zapier integrations) | Yes (already built) |
| Answer hours questions | No chat; FAQs on profile page | No chat | Yes, via templated quick reply | Yes — teach AI from `working_hours` data |
| Answer pricing questions | Service list on profile page | Service list on profile page | Yes, via hardcoded templates | Yes — `get_services` tool already fetches prices |
| Answer location questions | Address on profile page | Address on profile page | Yes | Yes — add address to system prompt context |
| Quick-start buttons on greeting | No (form-based booking flow) | No (app-based, no chat widget) | Yes (3-button pattern: Book / Info / Hours) | Yes — AI-generated greeting with 3-4 action buttons |
| Pre-booking confirmation | Yes (Fresha booking summary screen) | Yes (booking summary step) | Varies by implementation | Yes — summary message + action buttons before `create_booking` |
| Natural language understanding | Google Gemini integration (marketplace) | No | Limited (template-based) | Yes — GPT-4.1-mini with Uzbek/Russian understanding |
| 24/7 availability | No (manual scheduling only) | No | Yes | Yes |
| Cancellation handling | Via app/web UI | Via app/web UI | Yes, if configured | Partial (answer questions; actual cancel via /my-bookings) |

---

## Real Customer Questions by Category

Compiled from direct barbershop FAQ analysis (Parker's Barbershop, Bishops Co, Made Man, Sacred Barbers), WhatsApp Business bot patterns, and salon AI receptionist research. These are the questions the system prompt must handle.

### Category 1: Hours & Availability (HIGH frequency)
- "Bugun qachongacha ishlayveri?"
- "Yakshanba kuni ishlavsizmi?"
- "Soat necha da yopilasiz?"
- "Dam olish kunlari ham ishlaysizlarmi?"
- "Hozir bo'sh joy bormi?"

### Category 2: Services & Pricing (HIGH frequency)
- "Soch olish qancha turadi?"
- "Soqol olish xizmatingiz bormi?"
- "Qanday xizmatlar bor?"
- "Narxlar ro'yxatini yuboring"
- "Bolalar soch olishini ham qilasizmi?"

### Category 3: Location & Getting There (MEDIUM-HIGH frequency)
- "Qayerdasiz?"
- "Manzilingizni yuboring"
- "Metroga yaqinmi?"
- "Qanday borsa bo'ladi?"
- "Parking bormi?"

### Category 4: Booking & Appointment (HIGH frequency — core flow)
- "Yozilmoqchiman"
- "Bugunga bo'sh vaqt bormi?"
- "Ertaga soat 14:00 ga yozib qo'ying"
- "Online yozilsa bo'ladimi?"
- "Qaysi masterga borish kerak?"

### Category 5: Payment (MEDIUM frequency)
- "Kartaga to'lasa bo'ladimi?"
- "Naqd pul kerakmi?"
- "To'lov qanday amalga oshiriladi?"

### Category 6: Cancellation & Changes (MEDIUM frequency)
- "Yozuvimni bekor qilmoqchiman"
- "Vaqtni o'zgartirish mumkinmi?"
- "Kelolmasam nima bo'ladi?"
- "Qancha oldin bekor qilish kerak?"

### Category 7: Walk-ins (MEDIUM frequency — Uzbekistan-specific)
- "Navbatsiz kelsa bo'ladimi?"
- "Hozir kelsam qabul qilasizmi?"
- "Qancha kutish kerak bo'ladi?"

### Category 8: Staff & Specialization (LOW-MEDIUM frequency)
- "Qaysi usta yaxshiroq?"
- "Falonchi usta bu kuni ishlayaptimi?"
- "Kim fade qiladi?"

### Category 9: Small Talk & Closure (LOW frequency but HIGH impact on "human" feel)
- "Salom" / "Assalomu alaykum" / "Привет"
- "Rahmat" / "Spasibo"
- "Yaxshi" / "OK"
- "Xayr" / "Paka"

---

## Button Pattern Taxonomy

Based on research into WhatsApp Business UX, Intercom/Drift bot design, and chatbot UX studies (NN/G, Parallelhq, Netguru 2025). Maximum 3-5 buttons per message is the industry standard.

### Pattern 1: Quick-Start Buttons (greeting only)
Purpose: Eliminate cold-start friction. Tell users what they can do.
Max: 4 buttons. Labels are action phrases, not nouns.
```
"Yozilish"                    → triggers booking flow
"Narxlar va xizmatlar"        → triggers get_services and formats price list
"Manzil va ish vaqti"         → answers location + hours
"Boshqa savol"                → opens free-text mode
```

### Pattern 2: Choice Buttons (structured selection)
Purpose: Replace typed input when options are countable and finite.
Used for: service list, dates, time slots.
Max: 6 for services, 7 for dates, 12 for time slots (per existing prompt rules — validated).
```
Service:  "Soch olish"   "Soqol olish"   "Boshqa"
Date:     "Bugun"  "Ertaga"  "Seshanba"  "Chorshanba" ...
Time:     "10:00"  "11:00"  "12:00" ... (max 12)
```

### Pattern 3: Confirmation Buttons (action-labeled)
Purpose: Pre-booking confirmation and any destructive/irreversible action.
Max: 2-3 buttons. Labels describe the action that will happen, not abstract Yes/No.
```
Booking confirm:   "Ha, yozib qo'ying"    "Vaqtni o'zgartiraman"
Error recovery:    "Qayta urinish"         "Operator bilan bog'lanish"
Cancellation:      "Ha, bekor qilaman"     "Yo'q, qoldiraman"
```

### Pattern 4: No Buttons (free-text scenarios)
Used when: user needs to type phone, OTP, name, or free-form question.
Rule: Never show buttons when `input_type` is set. Never show buttons when AI is asking "what is your question?"

---

## What Makes Chat Feel Like Texting vs. Form-Filling

Research synthesis from Intercom bot design principles, Botpress conversation design experts, and chatbot UX studies.

### Texting Feel (DO)
1. **Short bursts** — 1-2 sentences per message. Like real texts.
2. **Response mirrors register** — user sends "salom" → AI responds "Salom! Nima xizmat?" not "Assalomu alaykum! Sizga qanday yordam bera olaman?"
3. **First-person natural** — "Yozib qo'yaman" not "Yozilish mumkin"
4. **Implicit confirmation** — AI moves forward: "Yaxshi, bugun 15:00 ga yozib qo'ydim! 🎉" is better than "Bronlash tasdiqlandi."
5. **Human imperfections** — light emoji (0-1 per message), colloquial phrasing matches Uzbek texting style
6. **One ask at a time** — "Qaysi kunga?" is one question. Never "Qaysi kunda va qaysi vaqtda?"
7. **Never repeat information user already gave** — if user said "soch olish", AI never asks "Qaysi xizmatni xohlaysiz?"

### Form-Filling Feel (AVOID)
1. **Bullet lists of options without prior question** — "Quyidagilardan birini tanlang: 1) Soch olish 2) Soqol olish..."
2. **Formal register** — "Xush kelibsiz! Sizga qanday xizmat ko'rsatishim mumkin?"
3. **Re-asking confirmed info** — user said "bugun 14:00" → AI: "Siz qaysi kuni kelmoqchisiz?"
4. **All-caps labels or system-speak** — "BOOKING_CONFIRMED: service_id=abc123"
5. **More than 2 questions in one message**
6. **Generic fallbacks** — "Uzr, tushunmadim. Qayta yozing." with no guidance

---

## Sources

**HIGH confidence (direct analysis):**
- Codebase: `blyss-gcloud-api/src/utils/chatAi.js` — direct analysis of current system prompt, tools, and flow logic
- Codebase: `landing-page/app/[locale]/[tenant]/_components/ChatWidget.tsx` — direct analysis of frontend rendering, button handling, input_type switching
- `.planning/PROJECT.md` — v3.0 milestone scope, constraints, out-of-scope list

**MEDIUM confidence (industry research, verified across multiple sources):**
- [Parker's Barbershop FAQ](https://parkersbarbershop.com/barber-shop-faqs/) — real barbershop FAQ taxonomy
- [Bishops Co FAQ](https://bishops.co/faq/) — appointment, hours, walk-in questions
- [NN/G: Confirmation Dialogs Can Prevent User Errors](https://www.nngroup.com/articles/confirmation-dialog/) — action-labeled buttons vs Yes/No
- [Chatbot Conversation Design UX Patterns — youngju.dev 2026](https://www.youngju.dev/blog/chatbot/2026-03-07-chatbot-conversation-design-ux-patterns-production.en) — dialog state machines, booking confirmation flow, error recovery hierarchy
- [Intercom Principles of Bot Design](https://www.intercom.com/blog/principles-bot-design/) — short messages, emoji engagement, transparency
- [Intercom Botiquette](https://www.intercom.com/blog/botiquette-designing-impactful-chatbots/) — focused bots outperform broad bots
- [Botpress Conversation Design 2026](https://botpress.com/blog/conversation-design) — natural vs formal tone, quick replies instead of open prompts
- [Parallelhq Chatbot UX](https://www.parallelhq.com/blog/chatbot-ux-design) — menu-first vs free-text-first vs hybrid patterns, button cognitive load
- [WhatsApp Interactive Buttons (Infobip)](https://www.infobip.com/blog/how-to-use-whatsapp-interactive-buttons) — max 3 reply buttons, list messages up to 10 options
- [upfirst.ai: Best Prompts to Train AI Receptionist](https://upfirst.ai/blog/best-prompts-train-ai-receptionist) — Q&A categories for salon receptionist AI
- [Fresha AI Strategy 2025 (Diginomica)](https://diginomica.com/how-freshas-ai-strategy-keeps-its-looking-its-best-competitive-market) — AI receptionist coming in 2026, current booking-first approach
- [Fresha AI Revolution in Selfcare](https://www.prnewswire.com/news-releases/the-ai-revolution-in-selfcare-fresha-reports-1-in-4-bookings-driven-by-google-gemini-and-ai-agents-as-marketplace-roi-hits-9x-302694734.html) — LLM-driven bookings growing 50% MoM in 2025
- [Agentive AIQ: 7 Best AI Chatbots for Barbershops](https://agentiveaiq.com/listicles/7-best-smart-ai-chatbots-for-barbershops) — feature taxonomy across barbershop chatbot platforms
- [Jotform Chatbot Design Challenges 2026](https://www.jotform.com/ai/agents/chatbot-design/) — overcomplicated flows, error handling gaps

---

*Feature research for: BLYSS v3.0 AI Chat Experience*
*Researched: 2026-03-12*
*Prior FEATURES.md scope: UI rebuild (v1.0 / v2.0) — this file covers ONLY the v3.0 AI chat milestone*
