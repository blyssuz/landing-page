import type { Locale, MultilingualText } from './types';

/**
 * Convert seconds since midnight to HH:MM string.
 */
export function secondsToTime(seconds: number): string {
  if (seconds >= 86399) return '24:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Get today's day key (e.g. 'monday', 'tuesday').
 */
export function getTodayKey(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

/**
 * Check if the business is currently open based on working hours.
 */
export function isOpenNow(
  workingHours?: Record<string, { start: number; end: number; is_open: boolean }>
): boolean {
  if (!workingHours) return false;
  const todayName = getTodayKey();
  const now = new Date();
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60;
  const todayHours = workingHours[todayName];
  if (!todayHours || !todayHours.is_open) return false;
  return currentSeconds >= todayHours.start && currentSeconds <= todayHours.end;
}

/**
 * Get today's closing time as HH:MM string, or null if closed.
 */
export function getClosingTime(
  workingHours?: Record<string, { start: number; end: number; is_open: boolean }>
): string | null {
  if (!workingHours) return null;
  const todayName = getTodayKey();
  const todayHours = workingHours[todayName];
  if (!todayHours || !todayHours.is_open) return null;
  return secondsToTime(todayHours.end);
}

/**
 * Get info about when the business next opens (day key + start time string).
 * Returns null if no open days found.
 */
export function getNextOpenInfo(
  workingHours?: Record<string, { start: number; end: number; is_open: boolean }>
): { dayKey: string; time: string } | null {
  if (!workingHours) return null;
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const todayIndex = now.getDay();
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60;

  for (let offset = 0; offset < 7; offset++) {
    const dayIndex = (todayIndex + offset) % 7;
    const dayKey = days[dayIndex];
    const hours = workingHours[dayKey];
    if (!hours?.is_open) continue;
    // If today, only count if we haven't passed the start time yet
    if (offset === 0 && currentSeconds >= hours.start) continue;
    return { dayKey, time: secondsToTime(hours.start) };
  }
  return null;
}

/**
 * Format a price number with space-separated thousands (e.g. 150 000).
 */
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Format duration in minutes to a localized string.
 * @param minutes - Duration in minutes
 * @param minuteLabel - Localized "min" label
 * @param hourLabel - Localized "h" label
 */
export function formatDuration(
  minutes: number,
  minuteLabel: string,
  hourLabel: string
): string {
  if (minutes < 60) return `${minutes} ${minuteLabel}`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0
    ? `${hours} ${hourLabel} ${mins} ${minuteLabel}`
    : `${hours} ${hourLabel}`;
}

/**
 * Get a relative date string (e.g. "Today", "3 days ago", "2 weeks ago").
 */
export function getRelativeDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale === 'ru' ? 'Сегодня' : 'Bugun';
  if (diffDays === 1) return locale === 'ru' ? 'Вчера' : 'Kecha';
  if (diffDays < 7) {
    return locale === 'ru' ? `${diffDays} дн. назад` : `${diffDays} kun oldin`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return locale === 'ru' ? `${weeks} нед. назад` : `${weeks} hafta oldin`;
  }
  return date.toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'uz-UZ',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );
}

/**
 * Extract text for the current locale from a MultilingualText object.
 */
export function getText(
  text: MultilingualText | string | null | undefined,
  locale: Locale
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[locale as keyof MultilingualText] || text.ru || text.uz || '';
}
