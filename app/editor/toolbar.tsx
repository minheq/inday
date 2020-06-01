import React from 'react';

import { Pressable } from '../components';
import { StyleSheet } from 'react-native';

import { useTheme } from '../theme';
interface ToolbarButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress, disabled, children } = props;
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      style={[styles.root, { borderColor: theme.border.color.default }]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
