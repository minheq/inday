export enum SupportedLocale {
  vi = 'vi',
  viVN = 'vi-VN',
  en = 'en',
  enUS = 'en-US',
}

export const defaultLocale = SupportedLocale.enUS;

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  if (locale in SupportedLocale) {
    return true;
  }

  return false;
}
