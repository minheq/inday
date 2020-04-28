import React from 'react';
import { ThemeProvider } from './theme';

interface AppProviderProps {
  children?: React.ReactNode;
}

export function AppProvider(props: AppProviderProps) {
  const { children } = props;

  return <ThemeProvider>{children}</ThemeProvider>;
}
