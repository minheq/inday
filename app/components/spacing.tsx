import React from 'react';
import { View } from 'react-native';

interface SpacingProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
}

/**
 * Creates a visual whitespace with given width or height
 */
export function Spacing(props: SpacingProps) {
  const { children, width, height } = props;

  return <View style={{ width, height }}>{children}</View>;
}
