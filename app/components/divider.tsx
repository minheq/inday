import React from 'react';
import { View } from 'react-native';
import { DynamicStyleSheet } from './stylesheet';

/**
 * Visual separator between components.
 */
export function Divider(): JSX.Element {
  return <View style={styles.base} />;
}

const styles = DynamicStyleSheet.create((theme) => ({
  base: {
    width: '100%',
    height: 1,
    borderColor: theme.border.default,
  },
}));
