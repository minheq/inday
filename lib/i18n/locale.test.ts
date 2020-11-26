import { defaultLocale, getSupportedLocale, SupportedLocale } from './locale';

describe('getSupportedLocale', () => {
  test.concurrent('invalid languages will use default locale', async () => {
    const locale = getSupportedLocale(['vi vi', 'fun', 'useless']);

    expect(locale).toBe(defaultLocale);
  });

  test.concurrent.each([
    ['vi-VN', SupportedLocale.viVN],
    ['vi-vn', SupportedLocale.viVN],
    ['vi', SupportedLocale.vi],
    ['en', SupportedLocale.en],
    ['en-US', SupportedLocale.enUS],
    ['en-us', SupportedLocale.enUS],
    ['en_us', SupportedLocale.enUS],
  ])('%s language returns %s', async (language, supportedLocale) => {
    expect(getSupportedLocale(language)).toBe(supportedLocale);
  });
});
