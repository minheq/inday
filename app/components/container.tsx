import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ContainerColor, useTheme, tokens } from './theme';

type Shape = 'rounded' | 'square' | 'pill';

type Direction = 'column' | 'row';
interface ContainerContext {
  direction: Direction;
}

const ContainerContext = React.createContext<ContainerContext>({
  direction: 'column',
});

interface ContainerProviderProps {
  children?: React.ReactNode;
  direction: Direction;
}

export function ContainerProvider(props: ContainerProviderProps) {
  const { children, direction } = props;

  return (
    <ContainerContext.Provider value={{ direction }}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useParentContainer() {
  return React.useContext(ContainerContext);
}

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
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  shadow?: boolean;
  center?: boolean;
  overflow?: 'visible' | 'hidden' | 'scroll';
  expanded?: boolean;
  testID?: string;
  shape?: Shape;
  zIndex?: number;
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
    position,
    top,
    right,
    bottom,
    left,
    overflow,
    height,
    shape,
    testID,
    shadow,
    center,
    zIndex,
  } = props;

  const theme = useTheme();

  const effectiveWidth = width ?? (expanded ? '100%' : undefined);
  const effectiveHeight = height ?? (expanded ? '100%' : undefined);

  return (
    <ContainerProvider direction="column">
      <View
        testID={testID}
        style={[
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
            position,
            top,
            right,
            bottom,
            left,
            borderTopWidth,
            borderRightWidth,
            borderLeftWidth,
            borderBottomWidth,
            borderColor: borderColor ?? theme.border.color.default,
            overflow,
            zIndex,
          },
          shadow && theme.container.shadow,
          center && styles.center,
          shape && styles[shape],
        ]}
      >
        {children}
      </View>
    </ContainerProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {},
  rounded: {
    borderRadius: tokens.radius,
  },
  pill: {
    borderRadius: 999,
  },
});
