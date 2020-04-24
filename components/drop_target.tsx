import React from 'react';
import { View } from 'react-native';
import { useDropTarget } from './drag_drop/use_drop_target';
import { DropTargetProps as ClassDropTargetProps } from './drag_drop/drop_target';

interface DropTargetProps extends ClassDropTargetProps {
  children?: React.ReactNode;
}

export function DropTarget(props: DropTargetProps) {
  const { children, onAccept, onHover, onLeave, onWillAccept } = props;

  const dropTarget = useDropTarget({
    onAccept,
    onHover,
    onLeave,
    onWillAccept,
  });

  return <View ref={dropTarget.ref}>{children}</View>;
}
