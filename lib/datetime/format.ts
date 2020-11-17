import { format } from 'date-fns';
import { enAU, enCA, enGB, enIN, enUS, vi } from 'date-fns/locale';
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
    case SupportedLocale.enAU:
      localeModule = enAU;
      break;
    case SupportedLocale.enUS:
      localeModule = enUS;
      break;
    case SupportedLocale.enIN:
      localeModule = enIN;
      break;
    case SupportedLocale.enCA:
      localeModule = enCA;
      break;
    case SupportedLocale.enGB:
      localeModule = enGB;
      break;
    default:
      break;
  }

  return format(date, pattern, { locale: localeModule });
}
