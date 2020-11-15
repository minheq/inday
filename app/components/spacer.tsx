import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useParentContainer } from './container';

interface SpacerProps {
  size?: number;
  direction?: 'column' | 'row';
}

export function Spacer(props: SpacerProps): JSX.Element {
  const { size, direction: directionOverride } = props;
  const { direction } = useParentContainer();

  const effectiveDirection = directionOverride || direction;

  return (
    <View
      style={
        size
          ? effectiveDirection === 'column'
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
