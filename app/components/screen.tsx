import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useThemeStyles } from './theme';

interface ScreenProps {
  children?: React.ReactNode;
}

export function Screen(props: ScreenProps): JSX.Element {
  const { children } = props;
  const themeStyles = useThemeStyles();

  return (
    <SafeAreaView style={[styles.root, themeStyles.background.content]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
