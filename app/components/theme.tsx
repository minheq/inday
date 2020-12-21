import React, { createContext, useContext } from 'react';
import {
  ColorSchemeName,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import { palette } from './palette';

/* eslint-disable react-native/no-color-literals */

export interface Theme {
  colorScheme: ColorSchemeName;
  button: {
    primaryDefault: string;
    primaryHovered: string;
    primaryPressed: string;
    flatDefault: string;
    flatHovered: string;
    flatPressed: string;
  };
  background: {
    content: string;
    tint: string;
    primary: string;
    lightPrimary: string;
  };
  text: {
    default: string;
    /** On dark background */
    contrast: string;
    success: string;
    primary: string;
    muted: string;
    error: string;
  };
  border: {
    default: string;
    primary: string;
    focused: string;
  };
  elevation: {
    level1: string;
  };
}

const lightTheme: Theme = {
  colorScheme: 'light',
  button: {
    primaryDefault: palette.blue[700],
    primaryHovered: palette.blue[800],
    primaryPressed: palette.blue[900],
    flatDefault: palette.base.white,
    flatHovered: palette.gray[50],
    flatPressed: palette.gray[100],
  },
  background: {
    content: palette.base.white,
    tint: palette.gray[200],
    primary: palette.blue[500],
    lightPrimary: palette.blue[50],
  },
  text: {
    default: palette.gray[900],
    contrast: palette.gray[50],
    success: palette.emerald[900],
    primary: palette.blue[800],
    muted: palette.gray[700],
    error: palette.red[900],
  },
  border: {
    default: palette.gray[300],
    primary: palette.blue[700],
    focused: palette.blue[800],
  },
  elevation: {
    level1: 'rgba(63, 63, 70, 0.08)',
  },
};

const darkTheme: Theme = {
  colorScheme: 'dark',
  button: {
    primaryDefault: palette.blue[50],
    primaryHovered: palette.blue[100],
    primaryPressed: palette.blue[200],
    flatDefault: palette.gray[900],
    flatHovered: palette.gray[700],
    flatPressed: palette.gray[600],
  },
  background: {
    content: palette.gray[900],
    tint: palette.gray[700],
    primary: palette.blue[500],
    lightPrimary: palette.blue[50],
  },
  text: {
    default: palette.gray[100],
    contrast: palette.gray[800],
    success: palette.emerald[400],
    primary: palette.blue[400],
    muted: palette.gray[400],
    error: palette.red[400],
  },
  border: {
    default: palette.gray[300],
    primary: palette.blue[800],
    focused: palette.blue[600],
  },
  elevation: {
    level1: 'rgba(255, 255, 255, 0.08)',
  },
};

export const lightStyles = StyleSheet.create({
  elevation1: {
    shadowColor: lightTheme.elevation.level1,
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowRadius: 24,
  },
  buttonPrimaryDefault: {
    backgroundColor: lightTheme.button.primaryDefault,
  },
  buttonPrimaryHovered: {
    backgroundColor: lightTheme.button.primaryHovered,
  },
  buttonPrimaryPressed: {
    backgroundColor: lightTheme.button.primaryPressed,
  },
  buttonFlatDefault: {
    backgroundColor: lightTheme.button.flatDefault,
  },
  buttonFlatHovered: {
    backgroundColor: lightTheme.button.flatHovered,
  },
  buttonFlatPressed: {
    backgroundColor: lightTheme.button.flatPressed,
  },
  backgroundContent: {
    backgroundColor: lightTheme.background.content,
  },
  backgroundTint: {
    backgroundColor: lightTheme.background.tint,
  },
  backgroundPrimary: {
    backgroundColor: lightTheme.background.primary,
  },
  backgroundLightPrimary: {
    backgroundColor: lightTheme.background.lightPrimary,
  },
  textDefault: {
    color: lightTheme.text.default,
  },
  textContrast: {
    color: lightTheme.text.contrast,
  },
  textSuccess: {
    color: lightTheme.text.success,
  },
  textPrimary: {
    color: lightTheme.text.primary,
  },
  textMuted: {
    color: lightTheme.text.muted,
  },
  textError: {
    color: lightTheme.text.error,
  },
  borderDefault: {
    borderColor: lightTheme.border.default,
  },
  borderPrimary: {
    borderColor: lightTheme.border.primary,
  },
  borderFocused: {
    borderColor: lightTheme.border.focused,
  },
});

export const darkStyles = StyleSheet.create({
  elevation1: {
    shadowColor: darkTheme.elevation.level1,
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowRadius: 24,
  },
  buttonPrimaryDefault: {
    backgroundColor: darkTheme.button.primaryDefault,
  },
  buttonPrimaryHovered: {
    backgroundColor: darkTheme.button.primaryHovered,
  },
  buttonPrimaryPressed: {
    backgroundColor: darkTheme.button.primaryPressed,
  },
  buttonFlatDefault: {
    backgroundColor: darkTheme.button.flatDefault,
  },
  buttonFlatHovered: {
    backgroundColor: darkTheme.button.flatHovered,
  },
  buttonFlatPressed: {
    backgroundColor: darkTheme.button.flatPressed,
  },
  backgroundContent: {
    backgroundColor: darkTheme.background.content,
  },
  backgroundTint: {
    backgroundColor: darkTheme.background.tint,
  },
  backgroundPrimary: {
    backgroundColor: darkTheme.background.primary,
  },
  backgroundLightPrimary: {
    backgroundColor: darkTheme.background.lightPrimary,
  },
  textDefault: {
    color: darkTheme.text.default,
  },
  textContrast: {
    color: darkTheme.text.contrast,
  },
  textSuccess: {
    color: darkTheme.text.success,
  },
  textPrimary: {
    color: darkTheme.text.primary,
  },
  textMuted: {
    color: darkTheme.text.muted,
  },
  textError: {
    color: darkTheme.text.error,
  },
  borderDefault: {
    borderColor: darkTheme.border.default,
  },
  borderPrimary: {
    borderColor: darkTheme.border.primary,
  },
  borderFocused: {
    borderColor: darkTheme.border.focused,
  },
});

export interface ThemeStyles {
  colorScheme: ColorSchemeName;
  button: {
    primaryDefault: ViewStyle;
    primaryHovered: ViewStyle;
    primaryPressed: ViewStyle;
    flatDefault: ViewStyle;
    flatHovered: ViewStyle;
    flatPressed: ViewStyle;
  };
  background: {
    content: ViewStyle;
    tint: ViewStyle;
    primary: ViewStyle;
    lightPrimary: ViewStyle;
  };
  text: {
    default: TextStyle;
    /** On dark background */
    contrast: TextStyle;
    success: TextStyle;
    primary: TextStyle;
    muted: TextStyle;
    error: TextStyle;
  };
  border: {
    default: ViewStyle;
    primary: ViewStyle;
    focused: ViewStyle;
  };
  elevation: {
    level1: ViewStyle;
  };
}

const darkThemeStyles: ThemeStyles = {
  colorScheme: 'dark',
  button: {
    primaryDefault: darkStyles.buttonPrimaryDefault,
    primaryHovered: darkStyles.buttonPrimaryHovered,
    primaryPressed: darkStyles.buttonPrimaryPressed,
    flatDefault: darkStyles.buttonFlatDefault,
    flatHovered: darkStyles.buttonFlatHovered,
    flatPressed: darkStyles.buttonFlatPressed,
  },
  background: {
    content: darkStyles.backgroundContent,
    tint: darkStyles.backgroundTint,
    primary: darkStyles.backgroundPrimary,
    lightPrimary: darkStyles.backgroundLightPrimary,
  },
  text: {
    default: darkStyles.textDefault,
    contrast: darkStyles.textContrast,
    success: darkStyles.textSuccess,
    primary: darkStyles.textPrimary,
    muted: darkStyles.textMuted,
    error: darkStyles.textError,
  },
  border: {
    default: darkStyles.borderDefault,
    primary: darkStyles.borderPrimary,
    focused: darkStyles.borderFocused,
  },
  elevation: {
    level1: darkStyles.elevation1,
  },
};

const lightThemeStyles: ThemeStyles = {
  colorScheme: 'light',
  button: {
    primaryDefault: lightStyles.buttonPrimaryDefault,
    primaryHovered: lightStyles.buttonPrimaryHovered,
    primaryPressed: lightStyles.buttonPrimaryPressed,
    flatDefault: lightStyles.buttonFlatDefault,
    flatHovered: lightStyles.buttonFlatHovered,
    flatPressed: lightStyles.buttonFlatPressed,
  },
  background: {
    content: lightStyles.backgroundContent,
    tint: lightStyles.backgroundTint,
    primary: lightStyles.backgroundPrimary,
    lightPrimary: lightStyles.backgroundLightPrimary,
  },
  text: {
    default: lightStyles.textDefault,
    contrast: lightStyles.textContrast,
    success: lightStyles.textSuccess,
    primary: lightStyles.textPrimary,
    muted: lightStyles.textMuted,
    error: lightStyles.textError,
  },
  border: {
    default: lightStyles.borderDefault,
    primary: lightStyles.borderPrimary,
    focused: lightStyles.borderFocused,
  },
  elevation: {
    level1: lightStyles.elevation1,
  },
};

export const ThemeContext = createContext<Theme>(lightTheme);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const colorScheme = useColorScheme();

  return (
    <ThemeContext.Provider
      value={colorScheme === 'dark' ? darkTheme : lightTheme}
    >
      <ThemeStylesProvider>{children}</ThemeStylesProvider>
    </ThemeContext.Provider>
  );
}

export const ThemeStylesContext = createContext<ThemeStyles>(lightThemeStyles);

interface ThemeStylesProviderProps {
  children?: React.ReactNode;
}

export function useThemeStyles(): ThemeStyles {
  return useContext(ThemeStylesContext);
}

export function ThemeStylesProvider(
  props: ThemeStylesProviderProps,
): JSX.Element {
  const { children } = props;
  const colorScheme = useColorScheme();

  return (
    <ThemeStylesContext.Provider
      value={colorScheme === 'dark' ? darkThemeStyles : lightThemeStyles}
    >
      {children}
    </ThemeStylesContext.Provider>
  );
}
