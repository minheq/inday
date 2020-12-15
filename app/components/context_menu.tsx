import React from 'react';
import { View } from 'react-native';
import { TextColor, TextWeight } from './text';

export interface ContextMenuItem {
  color?: TextColor;
  weight?: TextWeight;
  onPress?: () => void;
  label: string;
}

export interface ContextMenuProps {
  options: ContextMenuItem[];
  width?: number;
  children: React.ReactNode;
}

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { children } = props;

  return <View>{children}</View>;
}
