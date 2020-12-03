import { NativeModules, Platform } from 'react-native';
import {
  defaultLocale,
  getSupportedLocale,
  SupportedLocale,
} from '../../../lib/i18n';
import { canUseDOM } from '../env';

export function getSystemLocale(): SupportedLocale {
  if (Platform.OS === 'ios') {
    return getSystemLocaleIOS();
  } else if (Platform.OS === 'android' && NativeModules.I18nManager) {
    return getSystemLocaleAndroid();
  } else if (Platform.OS === 'web' && canUseDOM) {
    return getSystemLocaleWeb();
  }

  return defaultLocale;
}

interface NativeModulesIOS {
  SettingsManager?: {
    settings?: {
      AppleLanguages?: string[];
    };
  };
}

function getSystemLocaleIOS() {
  const nativeModules = NativeModules as NativeModulesIOS;

  if (nativeModules.SettingsManager?.settings?.AppleLanguages) {
    const systemLocale = nativeModules.SettingsManager.settings.AppleLanguages;

    return getSupportedLocale(systemLocale);
  }

  return defaultLocale;
}

interface NativeModulesAndroid {
  I18nManager?: {
    localeIdentifier?: string;
  };
}

function getSystemLocaleAndroid() {
  const nativeModules = NativeModules as NativeModulesAndroid;

  if (nativeModules.I18nManager?.localeIdentifier) {
    const systemLocale = nativeModules.I18nManager?.localeIdentifier;

    return getSupportedLocale(systemLocale);
  }

  return defaultLocale;
}

function getSystemLocaleWeb() {
  if (window.navigator.language) {
    return getSupportedLocale(window.navigator.language);
  } else if (window.navigator.languages) {
    return getSupportedLocale(window.navigator.languages);
  }

  return defaultLocale;
}
