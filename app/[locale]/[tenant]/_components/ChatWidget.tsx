'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

interface ChatButton {
  label: string;
  value: string;
}

interface Message {
  id: string;
  sender_type: 'user' | 'ai' | 'business_owner' | 'staff';
  sender_name: string;
  text: string;
  created_at: string;
  buttons?: ChatButton[];
  input_type?: 'phone' | 'otp' | 'name' | null;
}

const CHAT_TEXT = {
  uz: {
    title: 'Chat',
    placeholder: 'Xabar yozing...',
    greeting: 'Salom! Qanday yordam bera olamiz? 😊',
    phonePlaceholder: '+998 90 123 45 67',
    otpPlaceholder: 'Tasdiqlash kodi',
    namePlaceholder: 'Ismingiz',
    yourNamePlaceholder: 'Ismingiz (ixtiyoriy)',
  },
  ru: {
    title: 'Чат',
    placeholder: 'Напишите сообщение...',
    greeting: 'Здравствуйте! Чем можем помочь? 😊',
    phonePlaceholder: '+998 90 123 45 67',
    otpPlaceholder: 'Код подтверждения',
    namePlaceholder: 'Ваше имя',
    yourNamePlaceholder: 'Ваше имя (необязательно)',
  },
} as const;

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('blyss_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('blyss_visitor_id', id);
  }
  return id;
}

function getVisitorName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('blyss_visitor_name') || '';
}

function setVisitorNameLS(name: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blyss_visitor_name', name);
  }
}

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  // Ensure it starts with 998
  let d = digits;
  if (d.startsWith('998')) d = d.slice(3);
  else if (d.startsWith('8')) d = d.slice(1);

  let formatted = '+998';
  if (d.length > 0) formatted += ' ' + d.slice(0, 2);
  if (d.length > 2) formatted += ' ' + d.slice(2, 5);
  if (d.length > 5) formatted += ' ' + d.slice(5, 7);
  if (d.length > 7) formatted += ' ' + d.slice(7, 9);
  return formatted;
}

function extractPhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, '');
  return '+' + digits;
}

export function ChatWidget({
  businessId,
  businessName,
  locale,
  primaryColor,
}: {
  businessId: string;
  businessName: string;
  locale: Locale;
  primaryColor: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [sending, setSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [inputType, setInputType] = useState<'phone' | 'otp' | 'name' | null>(null);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = CHAT_TEXT[locale as keyof typeof CHAT_TEXT];

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  // Load messages when opening
  useEffect(() => {
    if (!open || loaded) return;
    const visitorId = getVisitorId();
    setVisitorName(getVisitorName());

    fetch(`/api/chat?business_id=${businessId}&visitor_id=${visitorId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages?.length) {
          setMessages(data.messages);
          // Restore input_type from last AI message
          const lastAi = [...data.messages].reverse().find((m: Message) => m.sender_type !== 'user');
          if (lastAi?.input_type) setInputType(lastAi.input_type);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded, businessId]);

  // Scroll on new messages or when typing indicator changes
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, aiTyping, scrollToBottom]);



  // Poll for new messages (for staff replies)
  useEffect(() => {
    if (!open || !loaded) return;
    const interval = setInterval(() => {
      const visitorId = getVisitorId();
      fetch(`/api/chat?business_id=${businessId}&visitor_id=${visitorId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.messages?.length && data.messages.length > messages.length) {
            setMessages(data.messages);
          }
        })
        .catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [open, loaded, businessId, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    const visitorId = getVisitorId();
    const name = visitorName.trim();
    if (name) setVisitorNameLS(name);

    // Optimistic user message
    const tempMsg: Message = {
      id: `temp_${Date.now()}`,
      sender_type: 'user',
      sender_name: name || 'Visitor',
      text: text.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput('');
    setInputType(null); // Reset input type after sending
    setSending(true);
    setAiTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          visitor_id: visitorId,
          visitor_name: name || undefined,
          message_text: text.trim(),
        }),
      });

      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      } else {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? { ...m, id: data.message_id } : m))
        );
        if (data.ai_reply) {
          setMessages((prev) => [...prev, data.ai_reply]);
          // Update input type from AI response
          if (data.ai_reply.input_type) {
            setInputType(data.ai_reply.input_type);
          }
        }
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setSending(false);
      setAiTyping(false);
    }
  };

  const handleSend = () => {
    if (inputType === 'phone') {
      const phone = extractPhone(input);
      if (phone.length === 13) sendMessage(phone);
    } else {
      sendMessage(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleButtonClick = (btn: ChatButton) => {
    sendMessage(btn.label);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (inputType === 'phone') {
      setInput(formatPhoneInput(e.target.value));
    } else if (inputType === 'otp') {
      setInput(e.target.value.replace(/\D/g, '').slice(0, 5));
    } else {
      setInput(e.target.value);
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'phone': return t.phonePlaceholder;
      case 'otp': return t.otpPlaceholder;
      case 'name': return t.namePlaceholder;
      default: return t.placeholder;
    }
  };

  const getInputMode = (): 'text' | 'tel' | 'numeric' => {
    switch (inputType) {
      case 'phone': return 'tel';
      case 'otp': return 'numeric';
      default: return 'text';
    }
  };

  const canSend = () => {
    if (sending) return false;
    if (inputType === 'phone') return extractPhone(input).length === 13;
    if (inputType === 'otp') return input.length === 5;
    return input.trim().length > 0;
  };

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  // Focus textarea when opening
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [open]);

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
            onClick={() => { setOpen(true); setUnread(0); }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
            style={{ backgroundColor: primaryColor }}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[11px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
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
            className="fixed bottom-0 right-0 sm:bottom-0 sm:right-8 z-50 w-full sm:w-[420px] h-[100dvh] sm:h-[600px] bg-white sm:rounded-t-2xl flex flex-col overflow-hidden border border-neutral-200"
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
                  <p className="text-[12px] opacity-70">{t.title}</p>
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
              {/* Greeting */}
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white text-neutral-800 text-[15px] border border-neutral-100">
                  {t.greeting}
                </div>
              </div>

              {/* Name input — shown before first message */}
              {!getVisitorName() && messages.length === 0 && (
                <div className="flex justify-end">
                  <div className="max-w-[80%]">
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder={t.yourNamePlaceholder}
                      className="w-full text-sm px-3.5 py-2.5 rounded-2xl bg-white border border-neutral-200 focus:border-neutral-300 focus:outline-none transition-colors text-neutral-700 placeholder:text-neutral-400"
                    />
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => {
                const isUser = msg.sender_type === 'user';
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

                    {/* Buttons — only for last AI message */}
                    {!isUser && isLast && msg.buttons && msg.buttons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                        {msg.buttons.map((btn, i) => (
                          <button
                            key={i}
                            onClick={() => handleButtonClick(btn)}
                            disabled={sending || aiTyping}
                            className="px-3.5 py-2 text-[13px] font-medium rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:scale-[0.97] transition-all disabled:opacity-50"
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
                {aiTyping && (
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

            {/* Input area */}
            <div className=" bg-white flex-shrink-0 pb-3 lg:pb-6">
              <div className="flex items-end gap-2 border-t border-neutral-200 px-3 py-2 focus-within:border-neutral-300 transition-colors">
                {inputType === 'phone' || inputType === 'otp' ? (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    inputMode={getInputMode()}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder()}
                    maxLength={inputType === 'otp' ? 5 : 17}
                    className="flex-1 text-[15px] py-1.5 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none resize-none text-neutral-800 placeholder:text-neutral-400"
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder()}
                    maxLength={2000}
                    rows={1}
                    className="flex-1 text-[15px] px-2 py-3.5 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none resize-none text-neutral-800 placeholder:text-neutral-400 leading-relaxed max-h-[120px] [&:focus]:outline-none"
                  />
                )}
                <button
                  onClick={handleSend}
                  disabled={!canSend()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white disabled:opacity-30 active:scale-95 transition-all flex-shrink-0 mb-0.5"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Send"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
