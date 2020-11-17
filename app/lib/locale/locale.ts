import { NativeModules, Platform } from 'react-native';
import {
  defaultLocale,
  isSupportedLocale,
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
    const systemLocale =
      nativeModules.SettingsManager.settings.AppleLanguages[0];
    if (isSupportedLocale(systemLocale)) {
      return systemLocale;
    }
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
    if (isSupportedLocale(systemLocale)) {
      return systemLocale;
    }
  }

  return defaultLocale;
}

function getSystemLocaleWeb() {
  if (
    window.navigator.language &&
    canUseDOM &&
    isSupportedLocale(window.navigator.language)
  ) {
    return window.navigator.language;
  }

  return defaultLocale;
}
