// Value must be in lowercase separated by hyphen
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
  if (Object.values<string>(SupportedLocale).includes(language)) {
    return true;
  }

  return false;
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
  if (Array.isArray(languages)) {
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
