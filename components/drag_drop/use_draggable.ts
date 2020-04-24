import React from 'react';
import { View } from 'react-native';
import { useDragDrop } from './drag_drop_provider';
import { Draggable, DraggableCallbacks } from './draggable';

export function useDraggable(props: DraggableCallbacks) {
  const {
    onDragStarted = () => {},
    onDragEnd = () => {},
    onDraggableCanceled = () => {},
    onDragCompleted = () => {},
  } = props;

  const { registerDraggable, unregisterDraggable } = useDragDrop();
  const draggableRef = React.useRef<View | null>(null);
  const draggable = React.useRef(
    new Draggable({
      ref: draggableRef,
    }),
  ).current;

  React.useEffect(() => {
    registerDraggable(draggable, {
      onDragStarted,
      onDragEnd,
      onDraggableCanceled,
      onDragCompleted,
    });

    return () => {
      unregisterDraggable(draggable);
    };
  }, [
    unregisterDraggable,
    registerDraggable,
    draggable,
    onDragStarted,
    onDragEnd,
    onDraggableCanceled,
    onDragCompleted,
  ]);

  return draggable;
}
