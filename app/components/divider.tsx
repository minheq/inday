import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

interface DividerProps {}

/**
 * Visual separator between components.
 */
export function Divider(_props: DividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.base, { backgroundColor: theme.border.color.default }]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 1,
  },
});
