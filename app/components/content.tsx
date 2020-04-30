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

  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 1440,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
