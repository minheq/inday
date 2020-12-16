import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleSheet,
  ColorSchemeName,
} from 'react-native';
import { useTheme } from './theme';
import { tokens } from './tokens';

export interface TextProps {
  children?: React.ReactNode;
  size?: TextSize;
  color?: TextColor;
  customColor?: string;
  align?: 'left' | 'right' | 'center';
  weight?: TextWeight;
  selectable?: boolean;
  testID?: string;
  numberOfLines?: number;
  decoration?: TextDecorationLine;
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

type TextDecorationLine =
  | 'none'
  | 'underline'
  | 'line-through'
  | 'underline line-through';

export type TextWeight =
  | 'normal'
  | 'bold'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

interface TextSizes {
  xl: TextStyle;
  lg: TextStyle;
  md: TextStyle;
  sm: TextStyle;
  xs: TextStyle;
}

export type TextSize = keyof TextSizes;

interface TextColors {
  default: string;
  success: string;
  primary: string;
  muted: string;
  error: string;
  contrast: string;
}

export type TextColor = keyof TextColors;

/**
 * Run of text with a single style.
 */
export function Text(props: TextProps): JSX.Element {
  const {
    align = 'left',
    children,
    color = 'default',
    customColor,
    size = 'md',
    selectable = false,
    testID,
    numberOfLines,
    decoration = 'none',
    transform = 'none',
    weight = 'normal',
  } = props;
  const theme = useTheme();

  return (
    <RNText
      testID={testID}
      style={[
        styles[align],
        styles[size],
        {
          color: fromTextColor(color, theme),
        },
        {
          ...(customColor !== undefined && {
            color: customColor,
          }),
          fontWeight: weight,
          textDecorationLine: decoration,
          textTransform: transform,
        },
      ]}
      selectable={selectable}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

export function fromTextColor(
  color: TextColor,
  theme: ColorSchemeName,
): string {
  switch (color) {
    case 'default':
      return theme === 'dark'
        ? tokens.colors.gray[100]
        : tokens.colors.gray[900];
    case 'primary':
      return theme === 'dark'
        ? tokens.colors.blue[400]
        : tokens.colors.blue[700];
    case 'muted':
      return theme === 'dark'
        ? tokens.colors.gray[400]
        : tokens.colors.gray[500];
    case 'error':
      return theme === 'dark' ? tokens.colors.red[200] : tokens.colors.red[700];
    case 'success':
      return tokens.colors.green[700];
    case 'contrast':
      return tokens.colors.base.white;
  }
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  xl: tokens.text.size.xl,
  // eslint-disable-next-line react-native/no-unused-styles
  lg: tokens.text.size.lg,
  // eslint-disable-next-line react-native/no-unused-styles
  md: tokens.text.size.md,
  // eslint-disable-next-line react-native/no-unused-styles
  sm: tokens.text.size.sm,
  // eslint-disable-next-line react-native/no-unused-styles
  xs: tokens.text.size.xs,
  // eslint-disable-next-line react-native/no-unused-styles
  left: {
    textAlign: 'left',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  right: {
    textAlign: 'right',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  center: {
    textAlign: 'center',
  },
});
