import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export const ThemeContext = createContext<ColorSchemeName>(
  Appearance.getColorScheme(),
);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  const onColorSchemeChange = useCallback(
    ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setTheme(colorScheme);
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

export function useTheme(): ColorSchemeName {
  return useContext(ThemeContext);
}
