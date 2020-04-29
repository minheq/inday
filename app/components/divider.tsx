import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

interface DividerProps {
  children?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Visual separator between components.
 */
export function Divider(props: DividerProps) {
  const { children, orientation = 'horizontal' } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        styles[orientation],
        { backgroundColor: theme.border.color.default },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    height: 1,
  },
  vertical: {
    height: '100%',
    width: 1,
  },
});
