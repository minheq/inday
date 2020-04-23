import React from 'react';
import { View } from 'react-native';
import { useDragDrop } from './drag_drop_context';
import { Draggable, DraggableProps } from './draggable';

export function useDraggable(props: DraggableProps) {
  const {
    onDragCompleted = () => {},
    onDragEnd = () => {},
    onDraggableCanceled = () => {},
    onDragStarted = () => {},
  } = props;

  const { registerDraggable, unregisterDraggable } = useDragDrop();
  const draggableRef = React.useRef<View | null>(null);
  const draggable = React.useRef(
    new Draggable({
      onDragCompleted,
      onDragEnd,
      onDraggableCanceled,
      onDragStarted,
    }),
  ).current;

  const { startDrag, drag, endDrag } = registerDraggable(draggable);

  React.useEffect(() => {
    return () => {
      unregisterDraggable(draggable);
    };
  }, [unregisterDraggable, draggable]);

  return {
    startDrag,
    drag,
    endDrag,
    draggableRef,
  };
}
