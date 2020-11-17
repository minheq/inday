export enum SupportedLocale {
  vi = 'vi',
  viVN = 'vi-VN',
  enAU = 'en-AU',
  enGB = 'en-GB',
  enUS = 'en-US',
  enCA = 'en-CA',
  enIN = 'en-IN',
}

export const defaultLocale = SupportedLocale.enUS;

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  if (locale in SupportedLocale) {
    return true;
  }

  return false;
}
