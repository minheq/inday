import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ContextMenuProps } from './context_menu';

export interface ContextMenuViewProps extends ContextMenuProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ContextMenuView(props: ContextMenuViewProps): JSX.Element {
  const { children } = props;

  return <View>{children}</View>;
}
