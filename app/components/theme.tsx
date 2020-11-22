import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { palette } from './palette';

export type ThemeScheme = 'dark' | 'light';

export interface Theme {
  scheme: ThemeScheme;
  text: TextColors;
  background: BackgroundColors;
  shadow: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
  };
  border: {
    transparent: string;
    default: string;
    dark: string;
    focus: string;
  };
}

interface TextColors {
  default: string;
  success: string;
  primary: string;
  muted: string;
  error: string;
  contrast: string;
}

export type TextColor = keyof TextColors;

interface BackgroundColors {
  default: string;
  content: string;
  tint: string;
  primary: string;
}

export type BackgroundColor = keyof BackgroundColors;

export const lightTheme: Theme = {
  scheme: 'light',
  background: {
    default: palette.base.transparent,
    content: palette.base.white,
    tint: palette.gray[100],
    primary: palette.blue[400],
  },
  shadow: {
    shadowColor: palette.gray[700],
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  text: {
    default: palette.gray[900],
    primary: palette.blue[700],
    muted: palette.gray[500],
    error: palette.red[700],
    success: palette.green[700],
    contrast: palette.base.white,
  },
  border: {
    transparent: palette.base.transparent,
    default: palette.gray[300],
    dark: palette.gray[400],
    focus: palette.blue[600],
  },
};

// TODO: Do dark theme
export const darkTheme = lightTheme;

export const ThemeContext = createContext<Theme>(lightTheme);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,
  );

  const onColorSchemeChange = useCallback(
    ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      if (colorScheme === 'dark') {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
    },
    [],
  );

  useEffect(() => {
    Appearance.addChangeListener(onColorSchemeChange);

    return () => {
      Appearance.removeChangeListener(onColorSchemeChange);
    };
  }, [onColorSchemeChange]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
