import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CenterProps {
  children?: React.ReactNode;
}

/**
 * Centers its child within itself.
 */
export function Center(props: CenterProps) {
  const { children } = props;

  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
