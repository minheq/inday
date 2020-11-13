import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme, TextColor } from './theme';
import { TextSize, tokens } from './tokens';

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
  const theme = useTheme();

  return (
    <RNText
      testID={testID}
      style={[
        styles[align],
        styles[size],
        {
          fontWeight: weight,
          color: theme.text[color],
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
