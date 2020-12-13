import React, { createContext, useContext } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

export const ThemeContext = createContext<ColorSchemeName>(
  Appearance.getColorScheme(),
);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const { children } = props;
  const theme = useColorScheme();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ColorSchemeName {
  return useContext(ThemeContext);
}
