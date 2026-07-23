import { SupportedLocale } from '../context/I18nContext';

/**
 * Standardized Date and Time formatting utility powered by Intl.DateTimeFormat
 */
export const dateFormatter = {
  /**
   * Formats a date-time string or Date object into localized full date and time.
   * e.g.,
   *  zh-TW: 2026/7/23 下午07:45:12
   *  zh-CN: 2026/7/23 下午07:45:12
   *  en-US: 07/23/2026, 07:45:12 PM
   *  ja-JP: 2026/07/23 19:45:12
   */
  formatDateTime(input: string | Date | undefined | null, locale: SupportedLocale): string {
    if (!input) return '-';
    try {
      const date = typeof input === 'string' ? new Date(input.replace(' ', 'T')) : input;
      if (isNaN(date.getTime())) return String(input);

      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: locale === 'en-US' || locale === 'zh-TW',
      }).format(date);
    } catch {
      return String(input);
    }
  },

  /**
   * Formats chart day & date labels cleanly based on locale.
   * e.g. input ISO date '2026-07-17':
   *  zh-TW: 週一 (07/17)
   *  zh-CN: 周一 (07/17)
   *  en-US: Mon (07/17)
   *  ja-JP: 月 (07/17)
   */
  formatChartDay(dateStr: string, locale: SupportedLocale): string {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const weekdayStr = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
      const monthDayStr = new Intl.DateTimeFormat(locale, { month: '2-digit', day: '2-digit' }).format(date);

      if (locale === 'en-US') {
        return `${weekdayStr} (${monthDayStr})`;
      } else if (locale === 'ja-JP') {
        return `${monthDayStr} (${weekdayStr})`;
      } else if (locale === 'zh-CN') {
        return `${weekdayStr} (${monthDayStr})`;
      } else {
        // zh-TW
        return `${weekdayStr} (${monthDayStr})`;
      }
    } catch {
      return dateStr;
    }
  },

  /**
   * Formats short date (e.g. 2026/07/23)
   */
  formatDateShort(input: string | Date, locale: SupportedLocale): string {
    try {
      const date = typeof input === 'string' ? new Date(input.replace(' ', 'T')) : input;
      if (isNaN(date.getTime())) return String(input);

      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch {
      return String(input);
    }
  },
};
