'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import type { Business, Service, Locale } from '../_lib/types';
import { formatPrice, formatDuration, secondsToTime, getText } from '../_lib/utils';
import { DAY_NAMES, DAY_ORDER } from '../_lib/translations';

type ChatLocale = 'uz' | 'ru';
type FlowState = 'language_select' | 'main_menu' | 'showing_response';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  buttons?: { label: string; action: string }[];
}

interface ChatWidgetProps {
  business: Business;
  services: Service[];
  locale: Locale;
  primaryColor: string;
}

const CHAT_TEXT = {
  uz: {
    title: 'Chat',
    greeting: "Assalomu alaykum! Qanday yordam bera olaman?",
    prices: 'Narxlar',
    services: 'Xizmatlar',
    location: 'Manzil',
    workingHours: 'Ish vaqti',
    contact: "Bog'lanish",
    backToMenu: 'Bosh menyu',
    bookNow: 'Band qilish',
    closed: 'Yopiq',
    phone: 'Telefon',
    instagram: 'Instagram',
    minute: 'daq',
    hour: 'soat',
    sum: "so'm",
    noServices: 'Xizmatlar haqida ma\'lumot mavjud emas',
    noAddress: 'Manzil ko\'rsatilmagan',
    noWorkingHours: 'Ish vaqti ko\'rsatilmagan',
    noContact: 'Bog\'lanish ma\'lumotlari mavjud emas',
  },
  ru: {
    title: 'Чат',
    greeting: 'Здравствуйте! Чем могу помочь?',
    prices: 'Цены',
    services: 'Услуги',
    location: 'Адрес',
    workingHours: 'Время работы',
    contact: 'Контакты',
    backToMenu: 'Главное меню',
    bookNow: 'Забронировать',
    closed: 'Закрыто',
    phone: 'Телефон',
    instagram: 'Instagram',
    minute: 'мин',
    hour: 'ч',
    sum: 'сум',
    noServices: 'Информация об услугах отсутствует',
    noAddress: 'Адрес не указан',
    noWorkingHours: 'Время работы не указано',
    noContact: 'Контактная информация отсутствует',
  },
} as const;

type ChatTextKey = typeof CHAT_TEXT[ChatLocale];

function generatePricesResponse(services: Service[], locale: ChatLocale, t: ChatTextKey): string {
  if (!services.length) return t.noServices;

  // Group by category if categories exist
  const categorized = new Map<string, Service[]>();
  for (const service of services) {
    const cat = service.category || '';
    if (!categorized.has(cat)) categorized.set(cat, []);
    categorized.get(cat)!.push(service);
  }

  const lines: string[] = [];
  for (const [category, categoryServices] of categorized) {
    if (category && categorized.size > 1) {
      lines.push(`\n${category}`);
    }
    for (const s of categoryServices) {
      const name = getText(s.name, locale);
      const duration = formatDuration(s.duration_minutes, t.minute, t.hour);
      const price = formatPrice(s.price);
      lines.push(`${name} — ${duration} — ${price} ${t.sum}`);
    }
  }

  return lines.join('\n').trim();
}

function generateServicesResponse(services: Service[], locale: ChatLocale, t: ChatTextKey): string {
  if (!services.length) return t.noServices;

  const lines: string[] = [];
  for (const s of services) {
    const name = getText(s.name, locale);
    const desc = s.description ? getText(s.description, locale) : '';
    if (desc) {
      lines.push(`${name} — ${desc}`);
    } else {
      lines.push(name);
    }
  }

  return lines.join('\n');
}

function generateLocationResponse(business: Business, t: ChatTextKey): string {
  if (business.location?.address) {
    return business.location.address;
  }
  return t.noAddress;
}

function generateWorkingHoursResponse(business: Business, locale: ChatLocale, t: ChatTextKey): string {
  if (!business.working_hours) return t.noWorkingHours;

  const dayNames = DAY_NAMES[locale];
  const lines: string[] = [];

  for (const dayKey of DAY_ORDER) {
    const dayName = dayNames[dayKey];
    const hours = business.working_hours[dayKey];
    if (!hours || !hours.is_open) {
      lines.push(`${dayName}: ${t.closed}`);
    } else {
      const start = secondsToTime(hours.start);
      const end = secondsToTime(hours.end);
      lines.push(`${dayName}: ${start} - ${end}`);
    }
  }

  return lines.join('\n');
}

function generateContactResponse(business: Business, t: ChatTextKey): string {
  const parts: string[] = [];

  if (business.business_phone_number) {
    parts.push(`${t.phone}: ${business.business_phone_number}`);
  }

  if (business.social_media?.instagram) {
    const handle = business.social_media.instagram.startsWith('@')
      ? business.social_media.instagram
      : `@${business.social_media.instagram}`;
    parts.push(`${t.instagram}: ${handle}`);
  }

  if (parts.length === 0) return t.noContact;
  return parts.join('\n');
}

let msgIdCounter = 0;
function nextMsgId(): string {
  return `msg_${Date.now()}_${++msgIdCounter}`;
}

export function ChatWidget({ business, services, locale, primaryColor }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [chatLocale, setChatLocale] = useState<ChatLocale | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('language_select');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  // Scroll on new messages or typing indicator change
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, typing, scrollToBottom]);

  const businessName = typeof business.name === 'object'
    ? getText(business.name as any, locale)
    : business.name;

  const getMainMenuButtons = useCallback((lang: ChatLocale) => {
    const t = CHAT_TEXT[lang];
    return [
      { label: t.prices, action: 'prices' },
      { label: t.services, action: 'services' },
      { label: t.location, action: 'location' },
      { label: t.workingHours, action: 'working_hours' },
      { label: t.contact, action: 'contact' },
    ];
  }, []);

  const addBotMessage = useCallback((text: string, buttons?: { label: string; action: string }[]) => {
    const msg: ChatMessage = {
      id: nextMsgId(),
      type: 'bot',
      text,
      buttons,
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: nextMsgId(),
      type: 'user',
      text,
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const showTypingThenRespond = useCallback((delayMs: number, text: string, buttons?: { label: string; action: string }[]) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addBotMessage(text, buttons);
    }, delayMs);
  }, [addBotMessage]);

  const handleLanguageSelect = useCallback((lang: ChatLocale) => {
    setChatLocale(lang);
    const langLabel = lang === 'uz' ? "O'zbekcha" : 'Русский';
    addUserMessage(langLabel);
    const t = CHAT_TEXT[lang];
    setFlowState('main_menu');
    showTypingThenRespond(600, t.greeting, getMainMenuButtons(lang));
  }, [addUserMessage, showTypingThenRespond, getMainMenuButtons]);

  const handleMenuAction = useCallback((action: string, label: string) => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    addUserMessage(label);
    setFlowState('showing_response');

    const delay = 500 + Math.floor(Math.random() * 500); // 500-1000ms

    let responseText: string;
    switch (action) {
      case 'prices':
        responseText = generatePricesResponse(services, chatLocale, t);
        break;
      case 'services':
        responseText = generateServicesResponse(services, chatLocale, t);
        break;
      case 'location':
        responseText = generateLocationResponse(business, t);
        break;
      case 'working_hours':
        responseText = generateWorkingHoursResponse(business, chatLocale, t);
        break;
      case 'contact':
        responseText = generateContactResponse(business, t);
        break;
      default:
        responseText = t.greeting;
    }

    showTypingThenRespond(delay, responseText, [
      { label: t.backToMenu, action: 'back_to_menu' },
    ]);
  }, [chatLocale, services, business, addUserMessage, showTypingThenRespond]);

  const handleBackToMenu = useCallback(() => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];
    addUserMessage(t.backToMenu);
    setFlowState('main_menu');
    showTypingThenRespond(400, t.greeting, getMainMenuButtons(chatLocale));
  }, [chatLocale, addUserMessage, showTypingThenRespond, getMainMenuButtons]);

  const handleButtonClick = useCallback((btn: { label: string; action: string }) => {
    if (typing) return; // Prevent clicks while typing indicator is active

    if (btn.action === 'lang_uz') {
      handleLanguageSelect('uz');
    } else if (btn.action === 'lang_ru') {
      handleLanguageSelect('ru');
    } else if (btn.action === 'back_to_menu') {
      handleBackToMenu();
    } else {
      handleMenuAction(btn.action, btn.label);
    }
  }, [typing, handleLanguageSelect, handleBackToMenu, handleMenuAction]);

  const chatTitle = chatLocale ? CHAT_TEXT[chatLocale].title : 'Chat';

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
            style={{ backgroundColor: primaryColor }}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 sm:bottom-0 sm:right-8 z-50 w-full sm:w-[420px] h-[100dvh] sm:h-[600px] bg-white sm:rounded-t-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3.5 text-white flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold truncate">{businessName}</h3>
                  <p className="text-[12px] opacity-70">{chatTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-white">
              {/* Language selection — shown only when no language is selected and no messages */}
              {!chatLocale && messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white text-neutral-800 text-[15px] border border-neutral-100 mb-3">
                      Tilni tanlang / Выберите язык
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleButtonClick({ label: "O'zbekcha", action: 'lang_uz' })}
                        className="px-6 py-3 text-[15px] font-semibold rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:scale-[0.97] transition-all"
                      >
                        O&apos;zbekcha
                      </button>
                      <button
                        onClick={() => handleButtonClick({ label: 'Русский', action: 'lang_ru' })}
                        className="px-6 py-3 text-[15px] font-semibold rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:scale-[0.97] transition-all"
                      >
                        Русский
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, idx) => {
                const isUser = msg.type === 'user';
                const isLast = idx === messages.length - 1;
                return (
                  <div key={msg.id}>
                    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[15px] ${
                          isUser
                            ? 'rounded-br-sm text-white'
                            : 'rounded-bl-sm bg-white text-neutral-800 border border-neutral-100'
                        }`}
                        style={isUser ? { backgroundColor: primaryColor } : undefined}
                      >
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                      </div>
                    </div>

                    {/* Buttons — only on last bot message */}
                    {!isUser && isLast && msg.buttons && msg.buttons.length > 0 && !typing && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                        {msg.buttons.map((btn, i) => (
                          <button
                            key={i}
                            onClick={() => handleButtonClick(btn)}
                            className="px-3.5 py-2 text-[13px] font-medium rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:scale-[0.97] transition-all"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex justify-start"
                  >
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-neutral-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
