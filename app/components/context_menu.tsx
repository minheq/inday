import React from 'react';
import { View } from 'react-native';
import { ContextMenuContentProps } from './context_menu_content';

export interface ContextMenuProps extends ContextMenuContentProps {
  children: React.ReactNode;
}

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { children } = props;

  return <View>{children}</View>;
}
