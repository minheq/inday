import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useDropTarget } from './drag_drop/use_drop_target';
import { DropTargetCallbacks } from './drag_drop/drop_target';

interface DropTargetProps extends DropTargetCallbacks {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function DropTarget(props: DropTargetProps) {
  const { children, onAccept, onHover, onLeave, onWillAccept, style } = props;

  const dropTarget = useDropTarget({
    onAccept,
    onHover,
    onLeave,
    onWillAccept,
  });

  return (
    <View style={style} ref={dropTarget.ref}>
      {children}
    </View>
  );
}
