import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { tokens } from './tokens';

export interface TextProps {
  children?: React.ReactNode;
  size?: TextSize;
  color?: TextColor;
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
    size = 'md',
    selectable = false,
    testID,
    numberOfLines,
    decoration = 'none',
    transform = 'none',
    weight = 'normal',
  } = props;

  return (
    <RNText
      testID={testID}
      style={[
        styles[align],
        styles[size],
        styles[color],
        {
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

export function fromTextColor(color: TextColor): string {
  switch (color) {
    case 'default':
      return tokens.colors.gray[900];
    case 'primary':
      return tokens.colors.blue[700];
    case 'muted':
      return tokens.colors.gray[500];
    case 'error':
      return tokens.colors.red[700];
    case 'success':
      return tokens.colors.green[700];
    case 'contrast':
      return tokens.colors.base.white;
    default:
      throw new Error('Not handled');
  }
}

const styles = StyleSheet.create({
  root: {
    margin: 0,
    padding: 0,
    fontWeight: 'normal',
    fontFamily: tokens.text.fontFamily,
  },
  xl: tokens.text.size.xl,
  lg: tokens.text.size.lg,
  md: tokens.text.size.md,
  sm: tokens.text.size.sm,
  xs: tokens.text.size.xs,
  default: {
    color: tokens.colors.gray[900],
  },
  primary: {
    color: tokens.colors.blue[700],
  },
  muted: {
    color: tokens.colors.gray[500],
  },
  error: {
    color: tokens.colors.red[700],
  },
  success: {
    color: tokens.colors.green[700],
  },
  contrast: {
    color: tokens.colors.base.white,
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
});
