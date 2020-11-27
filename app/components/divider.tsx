import React from 'react';
import { View } from 'react-native';
import { DynamicStyleSheet } from './stylesheet';
import { tokens } from './tokens';

/**
 * Visual separator between components.
 */
export function Divider(): JSX.Element {
  return <View style={styles.base} />;
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    width: '100%',
    height: 1,
    borderColor: tokens.colors.gray[300],
  },
}));
