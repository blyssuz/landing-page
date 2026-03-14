'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import type { Business, Service, Employee, SavedUser, Locale } from '../_lib/types';
import { formatPrice, formatDuration, secondsToTime, getText } from '../_lib/utils';
import { DAY_NAMES, DAY_ORDER } from '../_lib/translations';
import { getAvailableSlots, getSlotEmployees, getAuthStatus, sendOtp, verifyOtp, registerUser, createBooking } from '../actions';

type ChatLocale = 'uz' | 'ru';
type FlowState =
  | 'language_select' | 'main_menu' | 'showing_response'
  | 'service_select' | 'date_select' | 'time_select'
  | 'employee_select' | 'booking_summary'
  | 'phone_input' | 'otp_input' | 'name_input' | 'booking_success';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  buttons?: { label: string; action: string }[];
}

interface ChatWidgetProps {
  business: Business;
  services: Service[];
  employees: Employee[];
  businessId: string;
  tenantSlug: string;
  savedUser: SavedUser | null;
  locale: Locale;
  primaryColor: string;
}

interface BookingState {
  serviceId: string | null;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string | null;
  dateLabel: string;
  time: number | null;
  timeLabel: string;
  employeeId: string | null;
  employeeName: string;
}

const DEFAULT_BOOKING: BookingState = {
  serviceId: null,
  serviceName: '',
  servicePrice: 0,
  serviceDuration: 0,
  date: null,
  dateLabel: '',
  time: null,
  timeLabel: '',
  employeeId: null,
  employeeName: '',
};

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
    // Booking flow
    book: 'Band qilish',
    selectService: 'Xizmatni tanlang',
    selectDate: 'Kunni tanlang',
    selectTime: 'Vaqtni tanlang',
    selectEmployee: 'Mutaxassisni tanlang',
    anySpecialist: 'Har qanday mutaxassis',
    bookingSummary: 'Buyurtma ma\'lumotlari',
    confirm: 'Tasdiqlash',
    service: 'Xizmat',
    date: 'Sana',
    time: 'Vaqt',
    specialist: 'Mutaxassis',
    noSlotsAvailable: "Bu kunga bo'sh vaqt yo'q",
    loadingSlots: 'Yuklanmoqda...',
    today: 'Bugun',
    tomorrow: 'Ertaga',
    comingSoon: 'Tez kunda...',
    // Auth flow
    enterPhone: 'Telefon raqamingizni kiriting',
    phonePlaceholder: '90 123 45 67',
    sendCode: 'Kod yuborish',
    enterOtp: 'SMS orqali yuborilgan 5 xonali kodni kiriting',
    enterOtpTelegram: 'Telegram orqali yuborilgan 5 xonali kodni kiriting',
    verifyCode: 'Tasdiqlash',
    enterName: 'Ismingizni kiriting',
    namePlaceholder: 'Ism',
    registerBtn: 'Davom etish',
    bookingSuccess: 'Buyurtmangiz tasdiqlandi!',
    bookingDetails: 'Buyurtma tafsilotlari',
    errorOccurred: 'Xatolik yuz berdi. Qaytadan urinib ko\'ring',
    invalidPhone: 'Telefon raqam noto\'g\'ri',
    invalidOtp: 'Noto\'g\'ri kod kiritildi',
    invalidName: 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak',
  },
  ru: {
    title: 'Chat',
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
    // Booking flow
    book: 'Записаться',
    selectService: 'Выберите услугу',
    selectDate: 'Выберите дату',
    selectTime: 'Выберите время',
    selectEmployee: 'Выберите специалиста',
    anySpecialist: 'Любой специалист',
    bookingSummary: 'Детали записи',
    confirm: 'Подтвердить',
    service: 'Услуга',
    date: 'Дата',
    time: 'Время',
    specialist: 'Специалист',
    noSlotsAvailable: 'Нет свободного времени на этот день',
    loadingSlots: 'Загрузка...',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    comingSoon: 'Скоро...',
    // Auth flow
    enterPhone: 'Введите номер телефона',
    phonePlaceholder: '90 123 45 67',
    sendCode: 'Отправить код',
    enterOtp: 'Введите 5-значный код из SMS',
    enterOtpTelegram: 'Введите 5-значный код из Telegram',
    verifyCode: 'Подтвердить',
    enterName: 'Введите ваше имя',
    namePlaceholder: 'Имя',
    registerBtn: 'Продолжить',
    bookingSuccess: 'Запись подтверждена!',
    bookingDetails: 'Детали записи',
    errorOccurred: 'Произошла ошибка. Попробуйте ещё раз',
    invalidPhone: 'Неверный номер телефона',
    invalidOtp: 'Неверный код',
    invalidName: 'Имя должно содержать минимум 2 буквы',
  },
} as const;

type ChatTextKey = typeof CHAT_TEXT[ChatLocale];

const OTP_ERROR_CODES: Record<ChatLocale, Record<string, string>> = {
  uz: {
    INVALID_OTP: "Noto'g'ri kod kiritildi",
    OTP_EXPIRED: "Kod muddati tugagan, qaytadan yuboring",
    RATE_LIMITED: "Ko'p urinishlar, keyinroq qaytadan urinib ko'ring",
    OTP_MAX_ATTEMPTS: "Kod urinishlari tugadi. Yangi kod so'rang",
  },
  ru: {
    INVALID_OTP: 'Неверный код',
    OTP_EXPIRED: 'Код истёк, запросите новый',
    RATE_LIMITED: 'Слишком много попыток, попробуйте позже',
    OTP_MAX_ATTEMPTS: 'Исчерпаны попытки ввода кода. Запросите новый',
  },
};

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '');
  let result = '';
  if (d.length > 0) result += d.slice(0, 2);
  if (d.length > 2) result += ' ' + d.slice(2, 5);
  if (d.length > 5) result += ' ' + d.slice(5, 7);
  if (d.length > 7) result += ' ' + d.slice(7, 9);
  return result;
}

function generatePricesResponse(services: Service[], locale: ChatLocale, t: ChatTextKey): string {
  if (!services.length) return t.noServices;

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

/**
 * Generate next 7 days as date buttons, filtering by business working hours.
 */
function generateDateButtons(
  business: Business,
  locale: ChatLocale,
  t: ChatTextKey
): { label: string; action: string }[] {
  const buttons: { label: string; action: string }[] = [];
  const now = new Date();
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);

    const dayKey = dayKeys[date.getDay()];
    const hours = business.working_hours?.[dayKey];

    // Skip days the business is closed
    if (!hours || !hours.is_open) continue;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    let label: string;
    if (offset === 0) {
      label = t.today;
    } else if (offset === 1) {
      label = t.tomorrow;
    } else {
      const dayName = DAY_NAMES[locale][dayKey];
      label = `${dayName}, ${dd}.${mm}`;
    }

    buttons.push({ label, action: `select_date_${dateStr}` });
  }

  return buttons;
}

let msgIdCounter = 0;
function nextMsgId(): string {
  return `msg_${Date.now()}_${++msgIdCounter}`;
}

export function ChatWidget({ business, services, employees, businessId, tenantSlug, savedUser, locale, primaryColor }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [chatLocale, setChatLocale] = useState<ChatLocale | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('language_select');
  const [booking, setBooking] = useState<BookingState>({ ...DEFAULT_BOOKING });
  const [availableSlots, setAvailableSlots] = useState<{ start_time: number; end_time: number }[]>([]);
  const [slotEmployees, setSlotEmployees] = useState<{ id: string; first_name: string; last_name: string; price: number; duration_minutes: number }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth-related state
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [authPhone, setAuthPhone] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  // Scroll on new messages or typing indicator change
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, typing, flowState, scrollToBottom]);

  // Auto-focus inputs when transitioning to input states
  useEffect(() => {
    if (flowState === 'phone_input') {
      setTimeout(() => phoneInputRef.current?.focus(), 100);
    } else if (flowState === 'otp_input') {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } else if (flowState === 'name_input') {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [flowState]);

  const businessName = typeof business.name === 'object'
    ? getText(business.name as any, locale)
    : business.name;

  const getMainMenuButtons = useCallback((lang: ChatLocale) => {
    const t = CHAT_TEXT[lang];
    return [
      { label: t.book, action: 'book' },
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

  const resetAuthState = useCallback(() => {
    setPhoneInput('');
    setOtpInput('');
    setNameInput('');
    setOtpId(null);
    setAuthPhone('');
    setIsAuthenticated(false);
    setAuthLoading(false);
  }, []);

  const handleBackToMenu = useCallback(() => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];
    addUserMessage(t.backToMenu);
    setFlowState('main_menu');
    setBooking({ ...DEFAULT_BOOKING });
    resetAuthState();
    showTypingThenRespond(400, t.greeting, getMainMenuButtons(chatLocale));
  }, [chatLocale, addUserMessage, showTypingThenRespond, getMainMenuButtons, resetAuthState]);

  // ─── Booking creation flow ───

  const createBookingFlow = useCallback(async () => {
    if (!chatLocale || !booking.serviceId || !booking.date || booking.time === null) return;
    const t = CHAT_TEXT[chatLocale];

    setTyping(true);

    try {
      const result = await createBooking(
        businessId,
        booking.date,
        booking.time,
        [{ service_id: booking.serviceId, employee_id: booking.employeeId }]
      );

      setTyping(false);

      if (result.success) {
        setFlowState('booking_success');
        const successText = `${t.bookingSuccess}\n\n${t.service}: ${booking.serviceName}\n${t.date}: ${booking.dateLabel}\n${t.time}: ${booking.timeLabel}\n${t.specialist}: ${booking.employeeName}`;
        addBotMessage(successText, [
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
      } else {
        addBotMessage(t.errorOccurred, [
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
      }
    } catch {
      setTyping(false);
      addBotMessage(CHAT_TEXT[chatLocale].errorOccurred, [
        { label: CHAT_TEXT[chatLocale].backToMenu, action: 'back_to_menu' },
      ]);
    }
  }, [chatLocale, booking, businessId, addBotMessage]);

  // ─── Auth flow handlers ───

  const handlePhoneSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    const digits = phoneInput.replace(/\D/g, '');
    if (digits.length !== 9) {
      addBotMessage(t.invalidPhone);
      return;
    }

    const fullPhone = '+998' + digits;
    setAuthPhone(fullPhone);
    setAuthLoading(true);

    addUserMessage(`+998 ${formatPhoneDisplay(digits)}`);
    setTyping(true);

    try {
      const result = await sendOtp(fullPhone);
      setTyping(false);
      setAuthLoading(false);

      if (result.success) {
        setFlowState('otp_input');
        const otpMessage = result.delivery_method === 'telegram' ? t.enterOtpTelegram : t.enterOtp;
        addBotMessage(otpMessage);
      } else {
        const errorMsg = (result.error_code && OTP_ERROR_CODES[chatLocale][result.error_code]) || t.errorOccurred;
        addBotMessage(errorMsg, [
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
      }
    } catch {
      setTyping(false);
      setAuthLoading(false);
      addBotMessage(t.errorOccurred, [
        { label: t.backToMenu, action: 'back_to_menu' },
      ]);
    }
  }, [chatLocale, phoneInput, addUserMessage, addBotMessage]);

  const handleOtpSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    const code = otpInput.replace(/\D/g, '');
    if (code.length !== 5) {
      addBotMessage(t.invalidOtp);
      return;
    }

    setAuthLoading(true);
    addUserMessage('*****');
    setTyping(true);

    try {
      const result = await verifyOtp(authPhone, parseInt(code, 10));
      setTyping(false);
      setAuthLoading(false);

      if (result.success) {
        if (result.needs_registration) {
          setOtpId(result.otp_id);
          setFlowState('name_input');
          addBotMessage(t.enterName);
        } else {
          setIsAuthenticated(true);
          // Cookies already set by server action, proceed to booking
          createBookingFlow();
        }
      } else {
        const errorMsg = (result.error_code && OTP_ERROR_CODES[chatLocale][result.error_code]) || t.invalidOtp;
        addBotMessage(errorMsg);
        setOtpInput('');
      }
    } catch {
      setTyping(false);
      setAuthLoading(false);
      addBotMessage(t.errorOccurred, [
        { label: t.backToMenu, action: 'back_to_menu' },
      ]);
    }
  }, [chatLocale, otpInput, authPhone, addUserMessage, addBotMessage, createBookingFlow]);

  const handleNameSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatLocale || !otpId) return;
    const t = CHAT_TEXT[chatLocale];

    const name = nameInput.trim();
    if (name.length < 2) {
      addBotMessage(t.invalidName);
      return;
    }

    setAuthLoading(true);
    addUserMessage(name);
    setTyping(true);

    try {
      const result = await registerUser(otpId, authPhone, name, '');
      setTyping(false);
      setAuthLoading(false);

      if (result.success) {
        setIsAuthenticated(true);
        createBookingFlow();
      } else {
        addBotMessage(t.errorOccurred, [
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
      }
    } catch {
      setTyping(false);
      setAuthLoading(false);
      addBotMessage(t.errorOccurred, [
        { label: t.backToMenu, action: 'back_to_menu' },
      ]);
    }
  }, [chatLocale, otpId, nameInput, authPhone, addUserMessage, addBotMessage, createBookingFlow]);

  // ─── Booking flow handlers ───

  const handleBookAction = useCallback(() => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    addUserMessage(t.book);
    setFlowState('service_select');
    setBooking({ ...DEFAULT_BOOKING });

    const serviceButtons = services.map(s => {
      const name = getText(s.name, chatLocale);
      const price = formatPrice(s.price);
      const duration = formatDuration(s.duration_minutes, t.minute, t.hour);
      return {
        label: `${name} — ${price} ${t.sum} — ${duration}`,
        action: `select_service_${s.id}`,
      };
    });

    serviceButtons.push({ label: t.backToMenu, action: 'back_to_menu' });
    showTypingThenRespond(500, t.selectService, serviceButtons);
  }, [chatLocale, services, addUserMessage, showTypingThenRespond]);

  const handleServiceSelect = useCallback((serviceId: string, label: string) => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const serviceName = getText(service.name, chatLocale);
    addUserMessage(label);

    setBooking(prev => ({
      ...prev,
      serviceId: service.id,
      serviceName,
      servicePrice: service.price,
      serviceDuration: service.duration_minutes,
    }));

    setFlowState('date_select');

    const dateButtons = generateDateButtons(business, chatLocale, t);
    dateButtons.push({ label: t.backToMenu, action: 'back_to_menu' });

    showTypingThenRespond(500, t.selectDate, dateButtons);
  }, [chatLocale, services, business, addUserMessage, showTypingThenRespond]);

  const handleDateSelect = useCallback(async (dateStr: string, label: string) => {
    if (!chatLocale || !booking.serviceId) return;
    const t = CHAT_TEXT[chatLocale];

    addUserMessage(label);
    setBooking(prev => ({ ...prev, date: dateStr, dateLabel: label }));
    setFlowState('time_select');
    setLoadingSlots(true);
    setTyping(true);

    try {
      const result = await getAvailableSlots(businessId, dateStr, [booking.serviceId]);
      setTyping(false);
      setLoadingSlots(false);

      if (!result || !result.slots || result.slots.length === 0) {
        addBotMessage(t.noSlotsAvailable, [
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
        return;
      }

      setAvailableSlots(result.slots);

      const timeButtons = result.slots.map((slot: { start_time: number; end_time: number }) => ({
        label: secondsToTime(slot.start_time),
        action: `select_time_${slot.start_time}`,
      }));

      timeButtons.push({ label: t.backToMenu, action: 'back_to_menu' });
      addBotMessage(t.selectTime, timeButtons);
    } catch {
      setTyping(false);
      setLoadingSlots(false);
      addBotMessage(t.noSlotsAvailable, [
        { label: t.backToMenu, action: 'back_to_menu' },
      ]);
    }
  }, [chatLocale, booking.serviceId, businessId, addUserMessage, addBotMessage]);

  const handleTimeSelect = useCallback(async (startTime: number, label: string) => {
    if (!chatLocale || !booking.serviceId || !booking.date) return;
    const t = CHAT_TEXT[chatLocale];

    addUserMessage(label);
    setBooking(prev => ({ ...prev, time: startTime, timeLabel: label }));
    setFlowState('employee_select');
    setTyping(true);

    try {
      const result = await getSlotEmployees(businessId, booking.date, [booking.serviceId], startTime);
      setTyping(false);

      if (!result || !result.employees || result.employees.length === 0) {
        // No employees available - skip to summary with "any"
        setBooking(prev => ({ ...prev, time: startTime, timeLabel: label, employeeId: null, employeeName: t.anySpecialist }));
        setFlowState('booking_summary');

        const summaryText = `${t.bookingSummary}:\n\n${t.service}: ${booking.serviceName}\n${t.date}: ${booking.dateLabel}\n${t.time}: ${label}\n${t.specialist}: ${t.anySpecialist}`;
        addBotMessage(summaryText, [
          { label: t.confirm, action: 'confirm_booking' },
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
        return;
      }

      setSlotEmployees(result.employees);

      // If only one employee, auto-select them
      if (result.employees.length === 1) {
        const emp = result.employees[0];
        const empName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
        setBooking(prev => ({ ...prev, time: startTime, timeLabel: label, employeeId: emp.id, employeeName: empName }));
        setFlowState('booking_summary');

        const summaryText = `${t.bookingSummary}:\n\n${t.service}: ${booking.serviceName}\n${t.date}: ${booking.dateLabel}\n${t.time}: ${label}\n${t.specialist}: ${empName}`;
        addBotMessage(summaryText, [
          { label: t.confirm, action: 'confirm_booking' },
          { label: t.backToMenu, action: 'back_to_menu' },
        ]);
        return;
      }

      // Multiple employees — show selection
      const employeeButtons: { label: string; action: string }[] = [
        { label: t.anySpecialist, action: 'select_employee_any' },
      ];

      for (const emp of result.employees) {
        const empName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
        const price = formatPrice(emp.price);
        employeeButtons.push({
          label: `${empName} — ${price} ${t.sum}`,
          action: `select_employee_${emp.id}`,
        });
      }

      employeeButtons.push({ label: t.backToMenu, action: 'back_to_menu' });
      addBotMessage(t.selectEmployee, employeeButtons);
    } catch {
      setTyping(false);
      addBotMessage(t.noSlotsAvailable, [
        { label: t.backToMenu, action: 'back_to_menu' },
      ]);
    }
  }, [chatLocale, booking.serviceId, booking.date, booking.serviceName, booking.dateLabel, businessId, addUserMessage, addBotMessage]);

  const handleEmployeeSelect = useCallback((employeeId: string | null, label: string) => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    addUserMessage(label);

    let empName: string;
    if (employeeId === null) {
      empName = t.anySpecialist;
    } else {
      const emp = slotEmployees.find(e => e.id === employeeId);
      empName = emp ? `${emp.first_name || ''} ${emp.last_name || ''}`.trim() : label;
    }

    setBooking(prev => ({ ...prev, employeeId, employeeName: empName }));
    setFlowState('booking_summary');

    const summaryText = `${t.bookingSummary}:\n\n${t.service}: ${booking.serviceName}\n${t.date}: ${booking.dateLabel}\n${t.time}: ${booking.timeLabel}\n${t.specialist}: ${empName}`;

    showTypingThenRespond(400, summaryText, [
      { label: t.confirm, action: 'confirm_booking' },
      { label: t.backToMenu, action: 'back_to_menu' },
    ]);
  }, [chatLocale, booking.serviceName, booking.dateLabel, booking.timeLabel, slotEmployees, addUserMessage, showTypingThenRespond]);

  const handleConfirmBooking = useCallback(async () => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];
    addUserMessage(t.confirm);
    setTyping(true);

    try {
      const authResult = await getAuthStatus();
      setTyping(false);

      if (authResult.authenticated) {
        setIsAuthenticated(true);
        createBookingFlow();
      } else {
        // Need authentication - transition to phone input
        setFlowState('phone_input');
        resetAuthState();
        addBotMessage(t.enterPhone);
      }
    } catch {
      setTyping(false);
      setFlowState('phone_input');
      resetAuthState();
      addBotMessage(CHAT_TEXT[chatLocale].enterPhone);
    }
  }, [chatLocale, addUserMessage, addBotMessage, createBookingFlow, resetAuthState]);

  // ─── Menu action handler (existing info queries) ───

  const handleMenuAction = useCallback((action: string, label: string) => {
    if (!chatLocale) return;
    const t = CHAT_TEXT[chatLocale];

    addUserMessage(label);
    setFlowState('showing_response');

    const delay = 500 + Math.floor(Math.random() * 500);

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

  // ─── Main button click dispatcher ───

  const handleButtonClick = useCallback((btn: { label: string; action: string }) => {
    if (typing || authLoading) return;

    if (btn.action === 'lang_uz') {
      handleLanguageSelect('uz');
    } else if (btn.action === 'lang_ru') {
      handleLanguageSelect('ru');
    } else if (btn.action === 'back_to_menu') {
      handleBackToMenu();
    } else if (btn.action === 'book') {
      handleBookAction();
    } else if (btn.action.startsWith('select_service_')) {
      const serviceId = btn.action.replace('select_service_', '');
      handleServiceSelect(serviceId, btn.label);
    } else if (btn.action.startsWith('select_date_')) {
      const dateStr = btn.action.replace('select_date_', '');
      handleDateSelect(dateStr, btn.label);
    } else if (btn.action.startsWith('select_time_')) {
      const startTime = parseInt(btn.action.replace('select_time_', ''), 10);
      handleTimeSelect(startTime, btn.label);
    } else if (btn.action === 'select_employee_any') {
      handleEmployeeSelect(null, btn.label);
    } else if (btn.action.startsWith('select_employee_')) {
      const employeeId = btn.action.replace('select_employee_', '');
      handleEmployeeSelect(employeeId, btn.label);
    } else if (btn.action === 'confirm_booking') {
      handleConfirmBooking();
    } else {
      handleMenuAction(btn.action, btn.label);
    }
  }, [typing, authLoading, handleLanguageSelect, handleBackToMenu, handleBookAction, handleServiceSelect, handleDateSelect, handleTimeSelect, handleEmployeeSelect, handleConfirmBooking, handleMenuAction]);

  const chatTitle = chatLocale ? CHAT_TEXT[chatLocale].title : 'Chat';
  const t = chatLocale ? CHAT_TEXT[chatLocale] : null;
  const isInputState = flowState === 'phone_input' || flowState === 'otp_input' || flowState === 'name_input';

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
              {/* Language selection -- shown only when no language is selected and no messages */}
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
                const showButtons = !isUser && isLast && msg.buttons && msg.buttons.length > 0 && !typing && !isInputState;
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

                    {/* Buttons -- only on last bot message, not during input states */}
                    {showButtons && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                        {msg.buttons!.map((btn, i) => (
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

            {/* Input area for auth steps */}
            {isInputState && t && (
              <div className="px-4 py-3 border-t border-neutral-100 bg-white flex-shrink-0">
                {flowState === 'phone_input' && (
                  <form onSubmit={handlePhoneSubmit} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-500 flex-shrink-0">+998</span>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="numeric"
                      value={formatPhoneDisplay(phoneInput)}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder={t.phonePlaceholder}
                      className="flex-1 px-3 py-2.5 text-[15px] border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-300"
                      autoFocus
                      disabled={authLoading}
                    />
                    <button
                      type="submit"
                      disabled={phoneInput.replace(/\D/g, '').length !== 9 || authLoading}
                      className="px-4 py-2.5 text-[13px] font-semibold rounded-xl text-white disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {authLoading ? '...' : t.sendCode}
                    </button>
                  </form>
                )}
                {flowState === 'otp_input' && (
                  <form onSubmit={handleOtpSubmit} className="flex items-center gap-2">
                    <input
                      ref={otpInputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="12345"
                      className="flex-1 px-3 py-2.5 text-[15px] text-center tracking-[0.3em] font-mono border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-300"
                      autoFocus
                      disabled={authLoading}
                    />
                    <button
                      type="submit"
                      disabled={otpInput.replace(/\D/g, '').length !== 5 || authLoading}
                      className="px-4 py-2.5 text-[13px] font-semibold rounded-xl text-white disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {authLoading ? '...' : t.verifyCode}
                    </button>
                  </form>
                )}
                {flowState === 'name_input' && (
                  <form onSubmit={handleNameSubmit} className="flex items-center gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="flex-1 px-3 py-2.5 text-[15px] border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-300"
                      autoFocus
                      disabled={authLoading}
                    />
                    <button
                      type="submit"
                      disabled={nameInput.trim().length < 2 || authLoading}
                      className="px-4 py-2.5 text-[13px] font-semibold rounded-xl text-white disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {authLoading ? '...' : t.registerBtn}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
