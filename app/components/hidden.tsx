import React from 'react';
import { StyleSheet, View } from 'react-native';

interface HiddenProps {
  hidden: boolean;
  children: React.ReactNode;
}

export function Hidden(props: HiddenProps): JSX.Element {
  const { hidden, children } = props;

  return (
    <View style={hidden ? styles.hidden : styles.visible}>{children}</View>
  );
}

const styles = StyleSheet.create({
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
});
