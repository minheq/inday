import { isArray } from "./array_utils";
// Value must be in lowercase separated by hyphen
/* eslint-disable-next-line */
export enum SupportedLocale {
  vi = "vi",
  viVN = "vi-vn",
  en = "en",
  enUS = "en-us",
}

export const defaultLocale = SupportedLocale.enUS;

export function isSupportedLocale(
  language: string
): language is SupportedLocale {
  return Object.values<string>(SupportedLocale).includes(language);
}

/**
 * Makes sure that the casing and format of the language is found in SupportedLocale. e.g.
 * vi_VN -> vi-vn
 * en-US -> en-us
 * en-us -> en-us
 */
function normalizeLanguage(language: string) {
  return language.toLowerCase().replace("_", "-");
}

export function getSupportedLocale(
  languages: readonly string[] | string
): SupportedLocale {
  if (isArray<string>(languages)) {
    for (const language of languages) {
      const normalizedLanguage = normalizeLanguage(language);
      if (isSupportedLocale(normalizedLanguage)) {
        return normalizedLanguage;
      }
    }
  } else if (typeof languages === "string") {
    const normalizedLanguage = normalizeLanguage(languages);

    if (isSupportedLocale(normalizedLanguage)) {
      return normalizedLanguage;
    }
  }

  return defaultLocale;
}
