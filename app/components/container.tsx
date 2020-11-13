import React from 'react';
import { View } from 'react-native';
import { DynamicStyleSheet } from './stylesheet';
import { BackgroundColor, useTheme } from './theme';
import { tokens } from './tokens';

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
            backgroundColor: color ? theme.background[color] : undefined,
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

function isBackgroundColor(color: string): color is BackgroundColor {
  if (color === 'tint' || color === 'content' || color === 'default') {
    return true;
  }

  return false;
}

const styles = DynamicStyleSheet.create((theme) => ({
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
  shadow: theme.shadow,
  borderColor: {
    borderColor: theme.border.default,
  },
}));
