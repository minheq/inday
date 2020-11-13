import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

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
}

export type BackgroundColor = keyof BackgroundColors;

export const lightTheme: Theme = {
  scheme: 'light',
  background: {
    default: 'rgba(0, 0, 0, 0)',
    content: 'rgba(255, 255, 255, 1)',
    tint: 'rgba(240, 240, 240, 1)',
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
  },
  text: {
    default: 'rgba(34, 34, 34, 1)',
    primary: 'rgba(0, 102, 204, 1)',
    muted: 'rgba(134, 134, 139, 1)',
    error: 'rgba(234, 0, 68, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
  },
  border: {
    transparent: 'rgba(255, 255, 255, 0)',
    default: 'rgba(34, 34, 34, 0.15)',
    dark: 'rgba(34, 34, 34, 0.4)',
    focus: 'rgba(0, 102, 204, 1)',
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
