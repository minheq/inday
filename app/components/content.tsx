import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ContentProps {
  children?: React.ReactNode;
}

/**
 * Contents of a screen
 */
export function Content(props: ContentProps): JSX.Element {
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
    maxWidth: 1280,
    padding: 16,
  },
});
