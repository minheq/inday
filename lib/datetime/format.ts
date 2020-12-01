import { enUS, vi } from 'date-fns/locale';
import { Date } from '../js_utils';
import { SupportedLocale } from '../i18n';

export function formatDate(
  date: Date,
  pattern: string,
  locale: SupportedLocale,
): string {
  let localeModule = enUS;

  switch (locale) {
    case SupportedLocale.vi:
    case SupportedLocale.viVN:
      localeModule = vi;
      break;
    case SupportedLocale.en:
    case SupportedLocale.enUS:
      localeModule = enUS;
      break;
    default:
      break;
  }

  return Date.format(date, pattern, { locale: localeModule });
}
