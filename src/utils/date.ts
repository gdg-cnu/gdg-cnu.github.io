import { SITE } from '@/site.config';

const longFormatter = new Intl.DateTimeFormat(SITE.locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: SITE.timeZone,
});

const shortFormatter = new Intl.DateTimeFormat(SITE.locale, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: SITE.timeZone,
});

/** 2026년 11월 5일 */
export function formatDate(date: Date): string {
  return longFormatter.format(date);
}

/** 2026. 11. 05. */
export function formatShortDate(date: Date): string {
  return shortFormatter.format(date);
}

/** <time datetime="..."> 용 ISO 문자열 */
export function isoDate(date: Date): string {
  return date.toISOString();
}
