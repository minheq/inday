import { test } from '../../lib/testing';

import { defaultLocale, getSupportedLocale, SupportedLocale } from './locale';

test('uses default locale', (t) => {
  const locale = getSupportedLocale(['vi vi', 'fun', 'useless']);

  t.equal(locale, defaultLocale);
});

test('case insensitive', (t) => {
  t.equal(getSupportedLocale('vi-VN'), SupportedLocale.viVN);
  t.equal(getSupportedLocale('vi-vn'), SupportedLocale.viVN);
  t.equal(getSupportedLocale('vi'), SupportedLocale.vi);
  t.equal(getSupportedLocale('en'), SupportedLocale.en);
  t.equal(getSupportedLocale('en-US'), SupportedLocale.enUS);
  t.equal(getSupportedLocale('en-us'), SupportedLocale.enUS);
  t.equal(getSupportedLocale('en_us'), SupportedLocale.enUS);
});
