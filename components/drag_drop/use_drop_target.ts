import React from 'react';
import { View } from 'react-native';
import { useDragDrop } from './drag_drop_provider';
import { DropTarget, DropTargetProps } from './drop_target';

export function useDropTarget(props: DropTargetProps) {
  const {
    onAccept = () => {},
    onHover = () => {},
    onLeave = () => {},
    onWillAccept = () => true,
  } = props;

  const { registerDropTarget, unregisterDropTarget } = useDragDrop();
  const dropTargetRef = React.useRef<View | null>(null);
  const dropTarget = React.useRef(
    new DropTarget({
      ref: dropTargetRef,
      onAccept,
      onHover,
      onLeave,
      onWillAccept,
    }),
  ).current;

  React.useEffect(() => {
    registerDropTarget(dropTarget);

    return () => {
      unregisterDropTarget(dropTarget);
    };
  }, [unregisterDropTarget, registerDropTarget, dropTarget]);

  return dropTarget;
}
