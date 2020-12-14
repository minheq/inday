import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from './theme';
import { tokens } from './tokens';

interface ScreenProps {
  children?: React.ReactNode;
}

export function Screen(props: ScreenProps): JSX.Element {
  const { children } = props;
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.root,
        theme === 'dark' ? styles.rootDark : styles.rootLight,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootDark: {
    backgroundColor: tokens.colors.gray[900],
  },
  rootLight: {
    backgroundColor: tokens.colors.base.white,
  },
});
