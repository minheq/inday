import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './theme';

/**
 * Visual separator between components.
 */
export function Divider(): JSX.Element {
  const theme = useTheme();

  return <View style={[styles.base, { borderColor: theme.border.default }]} />;
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 1,
  },
});
