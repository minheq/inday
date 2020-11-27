import React from 'react';
import { View } from 'react-native';
import { DynamicStyleSheet } from './stylesheet';
import { tokens } from './tokens';

interface BackgroundColors {
  default: string;
  content: string;
  tint: string;
  primary: string;
}

export type BackgroundColor = keyof BackgroundColors;

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

export function ContainerProvider(props: ContainerProviderProps): JSX.Element {
  const { children, direction } = props;

  return (
    <ContainerContext.Provider value={{ direction }}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useParentContainer(): ContainerContext {
  return React.useContext(ContainerContext);
}

interface ContainerProps {
  children?: React.ReactNode;
  maxWidth?: number | string;
  minWidth?: number | string;
  color?: BackgroundColor;
  borderRadius?: number;
  borderTopRightRadius?: number;
  borderTopLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
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
export function Container(props: ContainerProps): JSX.Element {
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
    borderTopRightRadius,
    borderTopLeftRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
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

  const effectiveWidth = width ?? (expanded ? '100%' : undefined);
  const effectiveHeight = height ?? (expanded ? '100%' : undefined);

  return (
    <ContainerProvider direction="column">
      <View
        testID={testID}
        style={[
          {
            borderWidth,
            width: effectiveWidth,
            flex,
            maxWidth,
            minWidth,
            borderTopRightRadius,
            borderTopLeftRadius,
            borderBottomRightRadius,
            borderBottomLeftRadius,
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
            borderColor,
            overflow,
            zIndex,
          },
          (borderWidth ||
            borderBottomWidth ||
            borderLeftWidth ||
            borderRightWidth) &&
            styles.borderColor,
          color && styles[color],
          shadow && styles.shadow,
          center && styles.center,
          shape && styles[shape],
        ]}
      >
        {children}
      </View>
    </ContainerProvider>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {},
  rounded: {
    borderRadius: tokens.border.radius.default,
  },
  pill: {
    borderRadius: 999,
  },
  default: {
    backgroundColor: tokens.colors.base.transparent,
  },
  content: {
    backgroundColor: tokens.colors.base.white,
  },
  tint: {
    backgroundColor: tokens.colors.gray[100],
  },
  primary: {
    backgroundColor: tokens.colors.blue[400],
  },
  shadow: tokens.shadow.elevation1,
  borderColor: {
    borderColor: tokens.colors.gray[300],
  },
}));
