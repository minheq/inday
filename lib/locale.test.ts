import { defaultLocale, getSupportedLocale, SupportedLocale } from "./locale";

test("uses default locale", () => {
  const locale = getSupportedLocale(["vi vi", "fun", "useless"]);

  expect(locale).toEqual(defaultLocale);
});

test("case insensitive", () => {
  const table = [
    [getSupportedLocale("vi-VN"), SupportedLocale.viVN],
    [getSupportedLocale("vi-vn"), SupportedLocale.viVN],
    [getSupportedLocale("vi"), SupportedLocale.vi],
    [getSupportedLocale("en"), SupportedLocale.en],
    [getSupportedLocale("en-US"), SupportedLocale.enUS],
    [getSupportedLocale("en-us"), SupportedLocale.enUS],
    [getSupportedLocale("en_us"), SupportedLocale.enUS],
  ];

  for (const data of table) {
    const [locale, want] = data;

    expect(locale).toEqual(want);
  }
});
