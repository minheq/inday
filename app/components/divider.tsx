import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from './tokens';

/**
 * Visual separator between components.
 */
export function Divider(): JSX.Element {
  return <View style={styles.base} />;
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 1,
    borderColor: tokens.colors.gray[300],
  },
});
