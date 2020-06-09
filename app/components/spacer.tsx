import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useParentContainer } from './container';

interface SpacerProps {
  size?: number;
}

export function Spacer(props: SpacerProps) {
  const { size } = props;
  const { direction } = useParentContainer();

  return (
    <View
      style={
        size
          ? direction === 'column'
            ? { height: size }
            : { width: size }
          : styles.base
      }
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
