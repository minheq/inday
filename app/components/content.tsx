import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ContentProps {
  children?: React.ReactNode;
}

/**
 * Contents of a screen
 */
export function Content(props: ContentProps) {
  const { children } = props;

  return (
    <View style={styles.root}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 1366,
    padding: 16,
  },
});
