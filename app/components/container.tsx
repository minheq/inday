import React from 'react';
import { View } from 'react-native';
import { ContainerColor, useTheme } from '../theme';

interface ContainerProps {
  children?: React.ReactNode;
  color?: ContainerColor;
  maxWidth?: number | string;
  minWidth?: number | string;
  borderRadius?: number;
  flex?: number;
  width?: number | string;
  height?: number | string;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderLeftWidth?: number;
  borderBottomWidth?: number;
  borderColor?: string;
  paddingRight?: number;
  paddingLeft?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  padding?: number;
  shadow?: boolean;
  expanded?: boolean;
  testID?: string;
}

/**
 * Provides padding, background decorations, border decorations, sizing and other box styles.
 */
export function Container(props: ContainerProps) {
  const {
    children,
    expanded,
    color = 'default',
    width,
    flex,
    maxWidth,
    minWidth,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderLeftWidth,
    borderBottomWidth,
    borderColor,
    borderRadius,
    paddingRight,
    paddingLeft,
    paddingTop,
    paddingBottom,
    paddingVertical,
    paddingHorizontal,
    padding,
    height,
    testID,
    shadow,
  } = props;

  const theme = useTheme();

  const effectiveWidth = width ?? (expanded ? '100%' : undefined);
  const effectiveHeight = height ?? (expanded ? '100%' : undefined);

  return (
    <View
      testID={testID}
      style={[
        shadow && theme.container.shadow,
        {
          borderWidth,
          backgroundColor: theme.container.color[color],
          width: effectiveWidth,
          flex,
          maxWidth,
          minWidth,
          borderRadius,
          height: effectiveHeight,
          paddingRight,
          paddingLeft,
          paddingTop,
          paddingBottom,
          paddingVertical,
          paddingHorizontal,
          padding,
          borderTopWidth,
          borderRightWidth,
          borderLeftWidth,
          borderBottomWidth,
          borderColor,
        },
      ]}
    >
      {children}
    </View>
  );
}
