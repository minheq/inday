import React from 'react';
import { View } from 'react-native';
import { ContextMenuViewProps } from './context_menu_view';

export interface ContextMenuProps extends ContextMenuViewProps {
  children: React.ReactNode;
}

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { children } = props;

  return <View>{children}</View>;
}
