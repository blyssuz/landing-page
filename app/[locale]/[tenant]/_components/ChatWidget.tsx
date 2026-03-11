'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

interface Message {
  id: string;
  sender_type: 'user' | 'ai' | 'business_owner' | 'staff';
  sender_name: string;
  text: string;
  created_at: string;
}

const CHAT_TEXT = {
  uz: {
    title: 'Chat',
    placeholder: 'Xabar yozing...',
    greeting: "Salom! Qanday yordam bera olamiz?",
    namePlaceholder: 'Ismingiz (ixtiyoriy)',
  },
  ru: {
    title: 'Чат',
    placeholder: 'Напишите сообщение...',
    greeting: 'Здравствуйте! Чем можем помочь?',
    namePlaceholder: 'Ваше имя (необязательно)',
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

function setVisitorName(name: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blyss_visitor_name', name);
  }
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
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = CHAT_TEXT[locale];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load messages when opening
  useEffect(() => {
    if (!open || loaded) return;
    const visitorId = getVisitorId();
    setName(getVisitorName());

    fetch(`/api/chat?business_id=${businessId}&visitor_id=${visitorId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages?.length) {
          setMessages(data.messages);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded, businessId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, scrollToBottom]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Poll for new messages while chat is open
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
    }, 5000);
    return () => clearInterval(interval);
  }, [open, loaded, businessId, messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const visitorId = getVisitorId();
    if (name.trim()) setVisitorName(name.trim());

    // Optimistic add
    const tempMsg: Message = {
      id: `temp_${Date.now()}`,
      sender_type: 'user',
      sender_name: name.trim() || 'Visitor',
      text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          visitor_id: visitorId,
          visitor_name: name.trim() || undefined,
          message_text: text,
        }),
      });

      if (!res.ok) {
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      } else {
        const data = await res.json();
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempMsg.id ? { ...m, id: data.message_id } : m
          )
        );
        // Append AI reply if present
        if (data.ai_reply) {
          setMessages((prev) => [...prev, data.ai_reply]);
        }
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

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
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform"
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
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[380px] h-[100dvh] sm:h-[520px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageCircle size={20} />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">
                    {businessName}
                  </h3>
                  <p className="text-[11px] opacity-80">{t.title}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50">
              {/* Greeting */}
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-bl-sm bg-white text-stone-800 text-sm shadow-sm border border-stone-100">
                  {t.greeting}
                </div>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender_type === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                        isUser
                          ? 'rounded-br-sm text-white'
                          : 'rounded-bl-sm bg-white text-stone-800 shadow-sm border border-stone-100'
                      }`}
                      style={isUser ? { backgroundColor: primaryColor } : undefined}
                    >
                      {!isUser && (
                        <p className="text-[11px] font-medium opacity-60 mb-0.5">
                          {msg.sender_name}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isUser ? 'text-white/60' : 'text-stone-400'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString(
                          locale === 'uz' ? 'uz-UZ' : 'ru-RU',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Name input (shown only when no name set and first time) */}
            {!getVisitorName() && messages.length === 0 && (
              <div className="px-4 py-2 border-t border-stone-100 bg-white">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full text-sm px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-stone-100 bg-white flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                maxLength={2000}
                className="flex-1 text-sm px-3 py-2.5 rounded-full bg-stone-100 border-0 focus:bg-stone-50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
                aria-label="Send"
              >
                {sending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
