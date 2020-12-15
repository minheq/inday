import React from 'react';
import { View } from 'react-native';

interface ContextMenuCallback {
  onDismiss: () => void;
}
export interface ContextMenuProps {
  content: React.ReactNode | ((props: ContextMenuCallback) => React.ReactNode);
  contentHeight: number;
  children: React.ReactNode;
}

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { children } = props;

  return <View>{children}</View>;
}
