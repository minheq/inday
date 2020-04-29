import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ContainerColor, useTheme } from '../theme';

interface ContainerProps {
  children?: React.ReactNode;
  color?: ContainerColor;
  maxWidth?: number | string;
  minWidth?: number | string;
  borderRadius?: number;
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

  return (
    <View
      testID={testID}
      style={[
        expanded && styles.expanded,
        shadow && theme.container.shadow,
        {
          borderWidth,
          backgroundColor: theme.container.color[color],
          width,
          maxWidth,
          minWidth,
          borderRadius,
          height,
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

const styles = StyleSheet.create({
  expanded: {
    width: '100%',
    height: '100%',
  },
});
