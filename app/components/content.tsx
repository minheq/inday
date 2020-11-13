import React from 'react';
import { StyleSheet, View } from 'react-native';
import { tokens } from './tokens';

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
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    flex: 1,
    maxWidth: tokens.contentWidth,
    padding: 16,
  },
});
