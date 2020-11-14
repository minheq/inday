import { NativeModules, Platform } from 'react-native';
import { canUseDOM } from '../env';

export function getSystemLocale(): string {
  let locale = 'en_US';

  // iOS
  if (
    Platform.OS === 'ios' &&
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings &&
    NativeModules.SettingsManager.settings.AppleLanguages
  ) {
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    // Android
  } else if (Platform.OS === 'android' && NativeModules.I18nManager) {
    locale = NativeModules.I18nManager.localeIdentifier;
  } else if (Platform.OS === 'web' && canUseDOM) {
    if (window.navigator.languages) {
      locale = window.navigator.languages[0];
    } else {
      locale = window.navigator.language;
    }
  }

  return locale;
}
