import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useParentContainer } from './container';

interface SpacerProps {
  size?: number;
  direction?: 'column' | 'row';
}

/**
 * By default, creates vertical space
 */
export function Spacer(props: SpacerProps): JSX.Element {
  const { size, direction: directionOverride } = props;
  const { direction } = useParentContainer();

  const effectiveDirection = directionOverride || direction;

  return (
    <View
      style={
        size
          ? effectiveDirection === 'row'
            ? { width: size }
            : { height: size }
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
