import React from 'react';

import { Pressable } from '../components';
import { StyleSheet } from 'react-native';

import { useTheme } from '../theme';
interface ToolbarButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
}

export function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress, children } = props;
  const theme = useTheme();

  return (
    <Pressable
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
