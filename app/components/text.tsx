import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme, TextSize, TextColor, tokens } from '../theme';

export interface TextProps {
  children?: React.ReactNode;
  size?: TextSize;
  color?: TextColor;
  align?: 'left' | 'right' | 'center';
  bold?: boolean;
  testID?: string;
}

/**
 * Run of text with a single style.
 */
export function Text(props: TextProps) {
  const {
    align = 'left',
    children,
    color = 'default',
    size = 'md',
    testID,
    bold,
  } = props;
  const theme = useTheme();

  return (
    <RNText
      testID={testID}
      style={[
        styles[align],
        bold && styles.bold,
        theme.text.size[size],
        { color: theme.text.color[color] },
      ]}
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
    fontFamily: tokens.fontFamily,
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
  bold: {
    fontWeight: 'bold',
  },
});
