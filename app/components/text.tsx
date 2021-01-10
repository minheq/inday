import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useThemeStyles } from './theme';
import { tokens } from './tokens';

export interface TextProps {
  children?: React.ReactText;
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
    multiline,
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
  const themeStyles = useThemeStyles();

  return (
    <RNText
      testID={testID}
      style={[
        styles[align],
        styles[size],
        themeStyles.text[color],
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
