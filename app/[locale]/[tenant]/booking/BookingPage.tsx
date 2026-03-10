'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import {
  ChevronLeft,
  Clock,
  Check,
  User,
  Plus,
  X,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashLoader } from 'react-spinners';
import {
  getAvailableSlots,
  getSlotEmployees,
  createBooking,
  getAuthStatus,
} from '../actions';
import { LoginModal } from '@/app/components/auth/LoginModal';

// ─── Interfaces ───

interface MultilingualText {
  uz: string;
  ru: string;
}

interface Service {
  id: string;
  name: MultilingualText;
  description?: MultilingualText | null;
  price: number;
  duration_minutes: number;
}

interface Employee {
  id: string;
  first_name: string | null;
  last_name: string | null;
  position: string;
  services: {
    id: string;
    service_id: string;
    name: string | null;
    price: number;
    duration_minutes: number;
  }[];
}

interface SlotEmployee {
  id: string;
  first_name: string;
  last_name: string;
  price: number;
  duration_minutes: number;
  original_price?: number;
  final_price?: number;
  discount?: {
    name: string;
    discount_type: string;
    discount_value: number;
    source: string;
  };
}

interface ServiceSlotData {
  service_id: string;
  name: MultilingualText;
  start_time: number;
  employees: SlotEmployee[];
  unavailable?: boolean;
  reason?: string;
}

interface WorkingHours {
  [day: string]: { start: number; end: number; is_open: boolean };
}

interface BookingPageProps {
  businessId: string;
  businessName: string;
  businessPhone: string;
  workingHours: WorkingHours | null;
  services: Service[];
  allServices: Service[];
  employees: Employee[];
  tenantSlug: string;
  locale: Locale;
  savedUser: { phone: string; first_name: string; last_name: string } | null;
  primaryColor?: string;
}

// ─── Translations ───

const UI: Record<Locale, Record<string, string>> = {
  uz: {
    bookAppointment: 'Uchrashuv band qilish',
    selectDate: 'Sanani tanlang',
    selectTime: 'Vaqtni tanlang',
    yourServices: 'Xizmatlar',
    noSlots: 'Bu kunga bo\'sh vaqt yo\'q',
    loading: 'Yuklanmoqda...',
    confirmBooking: 'Band qilish',
    total: 'Jami',
    sum: "SO'M",
    minute: 'daq',
    hour: 'soat',
    anySpecialist: 'Har qanday mutaxassis',
    today: 'Bugun',
    tomorrow: 'Ertaga',
    errorOccurred: 'Hozircha band qilib bo\'lmadi. Keyinroq qayta urinib ko\'ring yoki to\'g\'ridan-to\'g\'ri qo\'ng\'iroq qiling.',
    alreadyBooked: 'Siz allaqachon bu vaqtda band qilgansiz',
    bookingLimitReached: 'Sizda 3 ta tugallanmagan buyurtma bor. Yangi buyurtma berish uchun mavjud buyurtmalarni yakunlang yoki bekor qiling.',
    slotNotAvailable: 'Tanlangan vaqt band',
    noEmployeeAvailable: 'Bu vaqtda bo\'sh mutaxassis yo\'q',
    businessClosed: 'Bu kunda ish vaqti yo\'q',
    employeeNotWorking: 'Mutaxassis bu kuni ishlamaydi',
    employeeNotAvailable: 'Tanlangan mutaxassis bu vaqtda band',
    pastDate: 'O\'tgan sanaga buyurtma berish mumkin emas',
    exceedsBusinessHours: 'Tanlangan vaqt ish vaqtidan tashqarida',
    addService: 'Xizmat qo\'shish',
    change: 'O\'zgartirish',
    selectSpecialist: 'Mutaxassisni tanlang',
    notes: 'Izoh (ixtiyoriy)',
    notesPlaceholder: 'Tashrif bo\'yicha qo\'shimcha izoh yoki so\'rov',
    bookingConfirmed: 'Buyurtmangiz tasdiqlandi!',
    backToBusiness: 'Orqaga qaytish',
    viewBookings: 'Buyurtmalarim',
    addMoreServices: 'Xizmat qo\'shish',
    noEmployeeForService: 'Bu xizmatni bajaradigan mutaxassis yo\'q',
    morning: 'Ertalab',
    afternoon: 'Kunduzi',
    evening: 'Kechqurun',
  },
  ru: {
    bookAppointment: 'Записаться',
    selectDate: 'Выберите дату',
    selectTime: 'Выберите время',
    yourServices: 'Услуги',
    noSlots: 'Нет доступного времени',
    loading: 'Загрузка...',
    confirmBooking: 'Записаться',
    total: 'Итого',
    sum: 'СУМ',
    minute: 'мин',
    hour: 'ч',
    anySpecialist: 'Любой специалист',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    errorOccurred: 'Не удалось записать на это время. Попробуйте позже или позвоните напрямую.',
    alreadyBooked: 'У вас уже есть бронь на это время',
    bookingLimitReached: 'У вас 3 незавершённые записи. Чтобы создать новую, завершите или отмените существующие.',
    slotNotAvailable: 'Выбранное время уже занято',
    noEmployeeAvailable: 'Нет свободных специалистов на это время',
    businessClosed: 'В этот день не работает',
    employeeNotWorking: 'Специалист не работает в этот день',
    employeeNotAvailable: 'Выбранный специалист занят в это время',
    pastDate: 'Нельзя записаться на прошедшую дату',
    exceedsBusinessHours: 'Выбранное время за пределами рабочего времени',
    addService: 'Добавить услугу',
    change: 'Изменить',
    selectSpecialist: 'Выберите специалиста',
    notes: 'Комментарий (необязательно)',
    notesPlaceholder: 'Дополнительный комментарий или запрос по визиту',
    bookingConfirmed: 'Запись подтверждена!',
    backToBusiness: 'Вернуться',
    viewBookings: 'Мои записи',
    addMoreServices: 'Добавить услугу',
    noEmployeeForService: 'Нет специалиста для этой услуги',
    morning: 'Утро',
    afternoon: 'День',
    evening: 'Вечер',
  },
};

// ─── Constants ───

const DAY_NAMES_SHORT: Record<Locale, string[]> = {
  uz: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};

const MONTH_NAMES: Record<Locale, string[]> = {
  uz: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
};

const MONTH_NAMES_FULL: Record<Locale, string[]> = {
  uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
};

// ─── Helpers ───

function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatDateYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function generateNext7Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

// JS getDay(): 0=Sun,1=Mon,...,6=Sat → working_hours keys
const JS_DAY_TO_KEY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function isDayOpen(date: Date, workingHours: WorkingHours | null): boolean {
  if (!workingHours) return true; // no data = assume open
  const key = JS_DAY_TO_KEY[date.getDay()];
  const dayHours = workingHours[key];
  if (!dayHours || !dayHours.is_open) return false;

  // If this is today, check if working hours have already ended (Uzbekistan GMT+5)
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const uzbekNow = new Date(utcMs + 5 * 3600000);
    const currentSeconds = uzbekNow.getHours() * 3600 + uzbekNow.getMinutes() * 60;
    if (currentSeconds >= dayHours.end) return false;
  }

  return true;
}

// ─── Booking State Cookie ───

interface BookingState {
  selectedDate: string;
  selectedTime: number | null;
  selectedServiceIds: string[];
  selectedEmployees: Record<string, string | null>;
}

const COOKIE_KEY_PREFIX = 'blyss_booking_';
const COOKIE_MAX_AGE = 3600; // 1 hour

function getBookingCookieKey(businessId: string) {
  return `${COOKIE_KEY_PREFIX}${businessId}`;
}

function saveBookingState(businessId: string, state: BookingState) {
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${getBookingCookieKey(businessId)}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function loadBookingState(businessId: string): BookingState | null {
  const name = getBookingCookieKey(businessId) + '=';
  const cookies = document.cookie.split('; ');
  for (const c of cookies) {
    if (c.startsWith(name)) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(name.length)));
      } catch {
        return null;
      }
    }
  }
  return null;
}

function clearBookingState(businessId: string) {
  document.cookie = `${getBookingCookieKey(businessId)}=; path=/; max-age=0`;
}

// ─── Component ───

export function BookingPage({
  businessId,
  businessName,
  businessPhone,
  workingHours,
  services,
  allServices,
  employees,
  tenantSlug,
  locale,
  savedUser,
  primaryColor = '#088395',
}: BookingPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const isDirectRoute = pathSegments[1] === 'b';
  const basePath = isDirectRoute ? `/${locale}/b/${pathSegments[2]}` : `/${locale}`;
  const t = UI[locale];

  // ─── State ───

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [discountSlots, setDiscountSlots] = useState<Set<number>>(new Set());
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(services.map(s => s.id));
  const [serviceEmployees, setServiceEmployees] = useState<ServiceSlotData[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Record<string, string | null>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmployeeSheet, setShowEmployeeSheet] = useState(false);
  const [showAddServiceSheet, setShowAddServiceSheet] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<Record<string, unknown> | null>(null);

  const dates = generateNext7Days();
  const timeSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const datesScrollRef = useRef<HTMLDivElement>(null);

  // ─── Derived ───

  const currentServices = allServices.filter(s => selectedServiceIds.includes(s.id));
  const remainingServices = allServices.filter(s => !selectedServiceIds.includes(s.id));

  const getText = (text: MultilingualText | string | null | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[locale as keyof MultilingualText] || text.ru || text.uz || '';
  };

  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} ${t.minute}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ${t.hour} ${mins} ${t.minute}` : `${hours} ${t.hour}`;
  };

  const getServicePrice = (serviceId: string) => {
    const svcData = serviceEmployees.find(s => s.service_id === serviceId);
    const emp = svcData?.employees?.find(e => e.id === selectedEmployees[serviceId]);
    if (emp) {
      if (emp.final_price != null && emp.final_price < (emp.original_price ?? emp.price)) {
        return emp.final_price;
      }
      return emp.price;
    }
    return allServices.find(s => s.id === serviceId)?.price ?? 0;
  };

  const getServiceOriginalPrice = (serviceId: string) => {
    const svcData = serviceEmployees.find(s => s.service_id === serviceId);
    const emp = svcData?.employees?.find(e => e.id === selectedEmployees[serviceId]);
    if (emp) return emp.original_price ?? emp.price;
    return allServices.find(s => s.id === serviceId)?.price ?? 0;
  };

  const getServiceDuration = (serviceId: string) => {
    const svcData = serviceEmployees.find(s => s.service_id === serviceId);
    const emp = svcData?.employees?.find(e => e.id === selectedEmployees[serviceId]);
    if (emp) return emp.duration_minutes;
    return allServices.find(s => s.id === serviceId)?.duration_minutes ?? 0;
  };

  const totalPrice = selectedServiceIds.reduce((sum, sid) => sum + getServicePrice(sid), 0);
  const totalOriginalPrice = selectedServiceIds.reduce((sum, sid) => sum + getServiceOriginalPrice(sid), 0);
  const hasDiscount = totalOriginalPrice > totalPrice;

  // ─── Lock body scroll when sheets or modals are open ───

  useEffect(() => {
    const isOpen = showEmployeeSheet || showAddServiceSheet || showLoginModal;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showEmployeeSheet, showAddServiceSheet, showLoginModal]);

  // ─── Restore from cookie or auto-select first available date ───

  useEffect(() => {
    const saved = loadBookingState(businessId);

    if (saved) {
      // Validate saved services still exist
      const validServiceIds = saved.selectedServiceIds.filter(id => allServices.some(s => s.id === id));
      if (validServiceIds.length === 0) {
        clearBookingState(businessId);
        const firstOpen = dates.find(d => isDayOpen(d, workingHours));
        if (firstOpen) handleDateSelect(formatDateYMD(firstOpen));
        return;
      }

      // Validate saved date is still in the future and open
      const savedDateObj = new Date(saved.selectedDate + 'T00:00:00');
      const todayStr = formatDateYMD(new Date());
      const isDateValid = saved.selectedDate >= todayStr
        && dates.some(d => formatDateYMD(d) === saved.selectedDate)
        && isDayOpen(savedDateObj, workingHours);

      if (!isDateValid) {
        clearBookingState(businessId);
        setSelectedServiceIds(validServiceIds);
        const firstOpen = dates.find(d => isDayOpen(d, workingHours));
        if (firstOpen) handleDateSelect(formatDateYMD(firstOpen));
        return;
      }

      // Restore state and re-fetch slots to validate time
      setSelectedServiceIds(validServiceIds);
      setSelectedDate(saved.selectedDate);
      setSlotsLoading(true);

      (async () => {
        try {
          const slotsResult = await getAvailableSlots(businessId, saved.selectedDate, validServiceIds);
          const slots = slotsResult?.available_start_times || [];
          setAvailableSlots(slots);
          setDiscountSlots(new Set(slotsResult?.slots_with_discounts || []));

          // Validate saved time is still available
          if (saved.selectedTime !== null && slots.includes(saved.selectedTime)) {
            setSelectedTime(saved.selectedTime);

            // Re-fetch employees
            const empResult = await getSlotEmployees(businessId, saved.selectedDate, validServiceIds, saved.selectedTime, undefined, savedUser?.phone);
            if (empResult?.services) {
              setServiceEmployees(empResult.services);
              // Restore employee selections, fall back to first available
              const restoredEmployees: Record<string, string | null> = {};
              for (const svc of empResult.services) {
                const savedEmpId = saved.selectedEmployees[svc.service_id];
                const stillAvailable = savedEmpId && svc.employees?.some((e: SlotEmployee) => e.id === savedEmpId);
                restoredEmployees[svc.service_id] = stillAvailable ? savedEmpId : (svc.employees?.[0]?.id || null);
              }
              setSelectedEmployees(restoredEmployees);
            }
          }
        } catch {
          // On error, just show slots without time selected
        } finally {
          setSlotsLoading(false);
        }
      })();
    } else {
      // No saved state — auto-select first available date
      const firstOpen = dates.find(d => isDayOpen(d, workingHours));
      if (firstOpen) handleDateSelect(formatDateYMD(firstOpen));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Persist booking state to cookie ───

  useEffect(() => {
    if (!selectedDate) return; // don't save empty state
    saveBookingState(businessId, {
      selectedDate,
      selectedTime,
      selectedServiceIds,
      selectedEmployees,
    });
  }, [selectedDate, selectedTime, selectedServiceIds, selectedEmployees, businessId]);

  // ─── Scroll helpers ───

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // ─── Handlers ───

  const handleDateSelect = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(null);
    setServiceEmployees([]);
    setSelectedEmployees({});
    setAvailableSlots([]);
    setDiscountSlots(new Set());
    setError('');
    setSlotsLoading(true);

    try {
      const result = await getAvailableSlots(businessId, dateStr, selectedServiceIds);
      if (result?.available_start_times) {
        const slots = result.available_start_times;
        setAvailableSlots(slots);
        setDiscountSlots(new Set(result.slots_with_discounts || []));
      }
    } catch {
      setError(t.errorOccurred);
    } finally {
      setSlotsLoading(false);
    }

  };

  const handleTimeSelect = async (time: number) => {
    setSelectedTime(time);
    setError('');
    setLoading(true);

    try {
      const result = await getSlotEmployees(businessId, selectedDate, selectedServiceIds, time, undefined, savedUser?.phone);
      if (result?.services) {
        setServiceEmployees(result.services);
        const defaults: Record<string, string | null> = {};
        for (const svc of result.services) {
          if (svc.employees?.length > 0) {
            defaults[svc.service_id] = svc.employees[0].id;
          } else {
            defaults[svc.service_id] = null;
          }
        }
        setSelectedEmployees(defaults);
      }
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }

  };

  const handleAddService = async (serviceId: string) => {
    const newIds = [...selectedServiceIds, serviceId];
    setSelectedServiceIds(newIds);
    setShowAddServiceSheet(false);
    setError('');
    setLoading(true);

    try {
      // Re-fetch slots for updated service list
      const slotsResult = await getAvailableSlots(businessId, selectedDate, newIds);
      const newSlots = slotsResult?.available_start_times || [];
      setAvailableSlots(newSlots);
      setDiscountSlots(new Set(slotsResult?.slots_with_discounts || []));

      // If selected time is no longer valid, clear it
      if (selectedTime !== null && !newSlots.includes(selectedTime)) {
        setSelectedTime(null);
        setServiceEmployees([]);
        setSelectedEmployees({});
      } else if (selectedTime !== null) {
        // Re-fetch employees
        const empResult = await getSlotEmployees(businessId, selectedDate, newIds, selectedTime, undefined, savedUser?.phone);
        if (empResult?.services) {
          // Check if newly added service has any available employees
          const newSvcData = empResult.services.find((s: ServiceSlotData) => s.service_id === serviceId);
          if (!newSvcData?.employees || newSvcData.employees.length === 0) {
            // Revert: remove the service and restore previous state
            setSelectedServiceIds(selectedServiceIds);
            const revertSlots = await getAvailableSlots(businessId, selectedDate, selectedServiceIds);
            setAvailableSlots(revertSlots?.available_start_times || []);
            setDiscountSlots(new Set(revertSlots?.slots_with_discounts || []));
            setError(t.noEmployeeForService);
            return;
          }

          setServiceEmployees(empResult.services);
          const defaults: Record<string, string | null> = {};
          for (const svc of empResult.services) {
            if (selectedEmployees[svc.service_id] !== undefined) {
              const prevEmp = selectedEmployees[svc.service_id];
              const stillAvailable = svc.employees?.some((e: SlotEmployee) => e.id === prevEmp);
              defaults[svc.service_id] = stillAvailable ? prevEmp : (svc.employees?.[0]?.id || null);
            } else {
              defaults[svc.service_id] = svc.employees?.[0]?.id || null;
            }
          }
          setSelectedEmployees(defaults);
        }
      }
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    if (selectedServiceIds.length <= 1) return;
    const newIds = selectedServiceIds.filter(id => id !== serviceId);
    setSelectedServiceIds(newIds);
    setError('');

    // Remove from selected employees
    setSelectedEmployees(prev => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });

    // Re-fetch if we have a selected time
    if (selectedTime !== null) {
      setLoading(true);
      try {
        const slotsResult = await getAvailableSlots(businessId, selectedDate, newIds);
        const newSlots = slotsResult?.available_start_times || [];
        setAvailableSlots(newSlots);
        setDiscountSlots(new Set(slotsResult?.slots_with_discounts || []));

        if (!newSlots.includes(selectedTime)) {
          setSelectedTime(null);
          setServiceEmployees([]);
          setSelectedEmployees({});
        } else {
          const empResult = await getSlotEmployees(businessId, selectedDate, newIds, selectedTime, undefined, savedUser?.phone);
          if (empResult?.services) {
            setServiceEmployees(empResult.services);
          }
        }
      } catch {
        setError(t.errorOccurred);
      } finally {
        setLoading(false);
      }
    }
  };

  const openEmployeeSheet = (serviceId: string) => {
    setEditingServiceId(serviceId);
    setShowEmployeeSheet(true);
  };

  const selectEmployee = (serviceId: string, employeeId: string) => {
    setSelectedEmployees(prev => ({ ...prev, [serviceId]: employeeId }));
    setShowEmployeeSheet(false);
    setEditingServiceId(null);
  };

  const submitBooking = useCallback(async () => {
    if (!selectedTime) return;
    setError('');
    setLoading(true);

    try {
      const bookingServices = selectedServiceIds.map(sid => ({
        service_id: sid,
        employee_id: selectedEmployees[sid] || null,
      }));

      const result = await createBooking(
        businessId,
        selectedDate,
        selectedTime,
        bookingServices,
        notes || undefined,
      );

      if (result.success) {
        clearBookingState(businessId);
        setBookingResult(result.booking as Record<string, unknown>);
        setShowSuccess(true);
      } else {
        const errorMap: Record<string, string> = {
          USER_TIME_CONFLICT: t.alreadyBooked,
          BOOKING_LIMIT_REACHED: t.bookingLimitReached,
          SLOT_NOT_AVAILABLE: t.slotNotAvailable,
          NO_EMPLOYEE_AVAILABLE: t.noEmployeeAvailable,
          BUSINESS_CLOSED: t.businessClosed,
          EMPLOYEE_NOT_WORKING: t.employeeNotWorking,
          EMPLOYEE_NOT_AVAILABLE: t.employeeNotAvailable,
          PAST_DATE: t.pastDate,
          EXCEEDS_BUSINESS_HOURS: t.exceedsBusinessHours,
        };
        const code = result.error_code || '';
        setErrorCode(code);
        setError(errorMap[code] || t.errorOccurred);
      }
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [selectedTime, selectedServiceIds, selectedEmployees, businessId, selectedDate, notes, t]);

  const handleConfirmBooking = async () => {
    setError('');
    try {
      const authResult = await getAuthStatus();
      if (authResult.authenticated) {
        await submitBooking();
      } else {
        setShowLoginModal(true);
      }
    } catch {
      setError(t.errorOccurred);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const goBack = () => {
    router.push(basePath);
  };

  // ─── Render ───

  return (
    <div className="min-h-screen bg-white max-w-3xl mx-auto shadow-lg pb-4 px-4 lg:px-8" style={{ '--primary': primaryColor } as React.CSSProperties}>
      {/* ===== HEADER (sticky) ===== */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-stone-100">
        <div className="py-3 flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
          >
            <ChevronLeft size={24} className="text-stone-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-900">{t.bookAppointment}</h1>
            {/* <p className="text-base text-stone-500">{businessName}</p> */}
          </div>
        </div>
      </div>

      {/* ===== ERROR POPUP ===== */}
      {error && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setError('')}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <p className="text-stone-900 font-medium text-base mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              {errorCode === 'BOOKING_LIMIT_REACHED' && (
                <button
                  onClick={() => { setError(''); setErrorCode(''); router.push(`${basePath}/bookings`); }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-base font-medium hover:bg-primary/90 transition-colors"
                >
                  {t.viewBookings}
                </button>
              )}
              <button
                onClick={() => { setError(''); setErrorCode(''); }}
                className="px-8 py-2.5 rounded-xl bg-stone-900 text-white text-base font-medium hover:bg-stone-800 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DATE & TIME SECTION ===== */}
      {selectedTime !== null ? (
        <section className="pt-6">
          <button
            onClick={() => { setSelectedTime(null); setServiceEmployees([]); setSelectedEmployees({}); }}
            className="w-full flex items-center justify-between py-4 px-5 rounded-xl text-base font-bold border-2 border-primary"
          >
            <span>
              {(() => {
                const d = new Date(selectedDate + 'T00:00:00');
                const idx = dates.findIndex(dt => formatDateYMD(dt) === selectedDate);
                if (idx === 0) return `${t.today} · ${secondsToTime(selectedTime)}`;
                if (idx === 1) return `${t.tomorrow} · ${secondsToTime(selectedTime)}`;
                return `${DAY_NAMES_SHORT[locale][d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[locale][d.getMonth()]} · ${secondsToTime(selectedTime)}`;
              })()}
            </span>
            <span className="text-sm font-medium bg-stone-100 border border-stone-200 py-2 px-3 rounded-lg text-stone-600">{t.change}</span>
          </button>
        </section>
      ) : (
        <>
          <section className="pt-6">
            <div className="mb-3">
              <p className="text-2xl font-bold text-stone-900">
                {t.selectDate}
              </p>
            </div>
            <div ref={datesScrollRef} className="flex gap-4 overflow-x-auto py-2 scrollbar-hide -mx-4 px-4">
              {dates.map((date, idx) => {
                const dateStr = formatDateYMD(date);
                const isSelected = selectedDate === dateStr;
                const isToday = idx === 0;
                const isTomorrow = idx === 1;
                const isOpen = isDayOpen(date, workingHours);
                const dayName = isToday
                  ? t.today
                  : isTomorrow
                    ? t.tomorrow
                    : DAY_NAMES_SHORT[locale][date.getDay()];

                if (!isOpen) {
                  return (
                    <button
                      key={dateStr}
                      disabled
                      className="flex-shrink-0 flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed"
                    >
                      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-stone-300 line-through">{date.getDate()}</span>
                      </div>
                      <span className="text-base text-stone-400">{dayName}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateSelect(dateStr)}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 transition-all"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isSelected
                      ? 'bg-primary text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                      }`}>
                      <span className="text-2xl font-bold">{date.getDate()}</span>
                    </div>
                    <span className={`text-base ${isSelected ? 'text-primary font-semibold' : 'text-stone-500'}`}>
                      {dayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== TIME SLOTS SECTION ===== */}
          {selectedDate && (
            <section ref={timeSectionRef} className="pt-4 scroll-mt-20">
              {slotsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <HashLoader size={30} color={primaryColor} />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-16">
                  <Clock size={40} className="lg:hidden mx-auto text-stone-300 mb-3" />
                  <Clock size={60} className="hidden lg:block mx-auto text-stone-300 mb-4" />
                  <p className="text-stone-500 text-base">{t.noSlots}</p>
                </div>
              ) : (
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {availableSlots.map(time => {
                    const hasDiscount = discountSlots.has(time);
                    return (
                      <motion.button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className="flex items-center justify-between py-4 px-5 rounded-xl text-base font-bold hover:border-primary text-stone-900 border border-stone-200 transition-colors"
                        layout
                      >
                        <span>{secondsToTime(time)}</span>
                        {hasDiscount && <div className="bg-primary h-1.5 w-1.5 rounded-full" />}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </section>
          )}
        </>
      )}

      {/* ===== SELECTED SERVICES SECTION ===== */}
      {selectedTime !== null && (
        <section ref={servicesSectionRef} className="pt-8 scroll-mt-20">

          <h2 className="text-2xl font-bold text-stone-900 mb-3">{t.yourServices}</h2>

          {loading && serviceEmployees.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <HashLoader size={30} color={primaryColor} />
            </div>
          ) : (
            <div className="relative space-y-3 py-2">
              {loading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-2xl">
                  <HashLoader size={30} color={primaryColor} />
                </div>
              )}
              {/* Service cards */}
              {(() => {
                let timeOffset = 0;
                return selectedServiceIds.map(serviceId => {
                  const service = allServices.find(s => s.id === serviceId);
                  if (!service) return null;

                  const svcData = serviceEmployees.find(s => s.service_id === serviceId);
                  const selectedEmpId = selectedEmployees[serviceId];
                  const selectedEmp = svcData?.employees?.find(e => e.id === selectedEmpId);
                  const empName = selectedEmp
                    ? [selectedEmp.first_name, selectedEmp.last_name].filter(Boolean).join(' ')
                    : t.anySpecialist;
                  const price = selectedEmp?.price ?? service.price;
                  const duration = selectedEmp?.duration_minutes ?? service.duration_minutes;

                  const startSeconds = (selectedTime ?? 0) + timeOffset;
                  const endSeconds = startSeconds + duration * 60;
                  timeOffset += duration * 60;

                  return (
                    <div key={serviceId} className="bg-stone-50 rounded-2xl p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">

                          <div className='flex justify-between'>
                            <div className='flex flex-col text-start'>
                              <h4 className="text-lg font-semibold text-stone-900 -mb-0.5 line-clamp-1">
                                {getText(service.name)}
                              </h4>
                              <span className='text-base text-stone-500'>{secondsToTime(startSeconds)} - {secondsToTime(endSeconds)}</span>
                            </div>

                            <div className='flex flex-col text-end'>
                              {selectedEmp?.final_price != null && selectedEmp.final_price < (selectedEmp.original_price ?? selectedEmp.price) ? (
                                <>
                                  <h4 className="text-lg font-semibold text-green-600 -mb-0.5">
                                    {formatPrice(selectedEmp.final_price)}
                                  </h4>
                                  <span className="text-sm text-stone-400 line-through">
                                    {formatPrice(selectedEmp.original_price ?? selectedEmp.price)}
                                  </span>
                                </>
                              ) : (
                                <h4 className="text-lg font-semibold text-stone-900 -mb-0.5">
                                  {formatPrice(price)}
                                </h4>
                              )}
                              <span className='text-base'>{t.sum}</span>
                            </div>
                          </div>

                        </div>
                        {selectedServiceIds.length > 1 && (
                          <button
                            onClick={() => handleRemoveService(serviceId)}
                            className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Employee row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-stone-200 flex items-center justify-center">
                            <User size={18} className="lg:hidden text-stone-500" />
                            <User size={22} className="hidden lg:block text-stone-500" />
                          </div>
                          <span className="text-base text-stone-700">{empName}</span>
                        </div>
                        {svcData && svcData.employees && svcData.employees.length > 1 && (
                          <button
                            onClick={() => openEmployeeSheet(serviceId)}
                            className="text-sm font-medium bg-stone-100 border border-stone-200 py-2 px-3 rounded-lg text-stone-600"
                          >
                            {t.change}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}

              {/* Add service button */}
              {remainingServices.length > 0 && (
                <button
                  onClick={() => setShowAddServiceSheet(true)}
                  className="flex items-center justify-start gap-2 text-base font-medium text-primary cursor-pointer"
                >
                  <Plus size={16} />
                  {t.addService}
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* ===== NOTES SECTION ===== */}
      {selectedTime !== null && (
        <section className="pt-6 pb-32">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            className="w-full p-4 bg-stone-50 rounded-2xl border-0 resize-none text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
          />
          <p className="text-sm text-stone-400 mt-1.5 ml-1">{t.notes}</p>
        </section>
      )}

      {/* ===== FIXED BOTTOM BAR ===== */}
      {selectedTime !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-100 z-30">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <p className="text-base text-stone-500">{t.total}</p>
              {hasDiscount ? (
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(totalPrice)} {t.sum}
                  </p>
                  <p className="text-sm text-stone-400 line-through">
                    {formatPrice(totalOriginalPrice)} {t.sum}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-stone-900">
                  {formatPrice(totalPrice)} {t.sum}
                </p>
              )}
            </div>
            <button
              onClick={handleConfirmBooking}
              disabled={loading || selectedServiceIds.length === 0}
              className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <HashLoader size={18} color="#ffffff" />
              ) : (
                t.confirmBooking
              )}
            </button>
          </div>
        </div>
      )}

      {/* ===== SUCCESS OVERLAY ===== */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center px-6 max-w-md w-full">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6">
              <Check size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-2">{t.bookingConfirmed}</h2>
            <p className="text-lg lg:text-xl text-stone-500 mb-8">{businessName}</p>

            {/* Booking details */}
            {bookingResult && (
              <div className="space-y-3 mb-8 text-left">
                <div className="flex justify-between p-4 bg-stone-50 rounded-2xl">
                  <span className="text-base lg:text-lg text-stone-500">{t.selectDate}</span>
                  <span className="text-base lg:text-lg font-medium text-stone-900">
                    {(bookingResult.booking_date as string) || selectedDate}
                  </span>
                </div>
                {selectedTime !== null && (
                  <div className="flex justify-between p-4 bg-stone-50 rounded-2xl">
                    <span className="text-base lg:text-lg text-stone-500">{t.selectTime}</span>
                    <span className="text-base lg:text-lg font-medium text-stone-900">
                      {secondsToTime(selectedTime)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between p-4 bg-stone-50 rounded-2xl">
                  <span className="text-base lg:text-lg text-stone-500">{t.total}</span>
                  <span className="text-base lg:text-lg font-bold text-primary">
                    {formatPrice((bookingResult.total_price as number) ?? totalPrice)} {t.sum}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => router.push(`${basePath}/bookings`)}
                className="w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-base lg:text-lg transition-colors hover:bg-primary/90"
              >
                {t.viewBookings}
              </button>
              <button
                onClick={() => router.push(basePath)}
                className="w-full py-3.5 bg-stone-100 text-stone-700 rounded-2xl font-semibold text-base lg:text-lg transition-colors hover:bg-stone-200"
              >
                {t.backToBusiness}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EMPLOYEE SELECTION RIGHT DRAWER ===== */}
      <AnimatePresence>
        {showEmployeeSheet && editingServiceId && (
          <div className="fixed inset-0 z-50" onClick={() => {
            setShowEmployeeSheet(false);
            setEditingServiceId(null);
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-stone-900">{t.selectSpecialist}</h3>
                  <button
                    onClick={() => {
                      setShowEmployeeSheet(false);
                      setEditingServiceId(null);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100"
                  >
                    <X size={20} className="text-stone-500" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                {(() => {
                  const svcData = serviceEmployees.find(s => s.service_id === editingServiceId);
                  if (!svcData?.employees) return null;

                  return svcData.employees.map(emp => {
                    const isSelected = selectedEmployees[editingServiceId] === emp.id;
                    const empName =
                      [emp.first_name, emp.last_name].filter(Boolean).join(' ') || t.anySpecialist;
                    return (
                      <button
                        key={emp.id}
                        onClick={() => selectEmployee(editingServiceId, emp.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isSelected
                          ? 'border-2 border-primary bg-primary/5'
                          : 'border border-stone-200 hover:border-stone-400'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                            <User size={18} className="text-stone-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-base font-medium text-stone-900">{empName}</p>
                            <p className="text-sm text-stone-500">{formatDuration(emp.duration_minutes)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {emp.final_price != null && emp.final_price < (emp.original_price ?? emp.price) ? (
                            <span className="text-base font-medium">
                              <span className="text-stone-400 line-through mr-1">{formatPrice(emp.original_price ?? emp.price)}</span>
                              <span className="text-green-600">{formatPrice(emp.final_price)} {t.sum}</span>
                            </span>
                          ) : (
                            <span className="text-base font-medium text-stone-900">
                              {formatPrice(emp.price)} {t.sum}
                            </span>
                          )}
                          {isSelected && <Check size={18} className="text-primary" />}
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ===== ADD SERVICE BOTTOM SHEET ===== */}
      <AnimatePresence>
        {showAddServiceSheet && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddServiceSheet(false)}
          >
            <motion.div
              className="bg-white w-full lg:w-2xl rounded-t-[28px] lg:rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 lg:hidden">
                <div className="w-10 h-1 bg-stone-300 rounded-full" />
              </div>

              <div className="px-5 pt-5 pb-3 lg:px-8 lg:pt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl lg:text-3xl font-semibold text-stone-900">{t.addMoreServices}</h3>
                  <button
                    onClick={() => setShowAddServiceSheet(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100"
                  >
                    <X size={20} className="text-stone-500" />
                  </button>
                </div>
              </div>

              <div className="px-5 pb-6 lg:px-8 lg:pb-8">
                {remainingServices.map((service, idx) => (
                  <button
                    key={service.id}
                    onClick={() => handleAddService(service.id)}
                    className={`w-full flex items-center justify-between py-4 ${idx > 0 ? 'border-t border-stone-100' : ''} active:bg-stone-50 transition-colors`}
                  >
                    <div className="text-left flex-1 min-w-0 pr-4">
                      <p className="text-lg font-semibold text-stone-900 line-clamp-1">{getText(service.name)}</p>
                      <p className="text-base text-stone-500 mt-0.5">
                        {formatDuration(service.duration_minutes)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-base lg:text-lg font-semibold text-stone-900">
                        {formatPrice(service.price)} {t.sum}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus size={18} className="text-primary" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LOGIN MODAL ===== */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        locale={locale}
      />
    </div>
  );
}
