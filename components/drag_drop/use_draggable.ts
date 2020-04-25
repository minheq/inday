import React from 'react';
import { View } from 'react-native';
import { useDragDrop } from './drag_drop_provider';
import { Draggable, DraggableCallbacks } from './draggable';

export function useDraggable(props: DraggableCallbacks) {
  const {
    onStart = () => {},
    onEnd = () => {},
    onCancel = () => {},
    onComplete = () => {},
  } = props;

  const { registerDraggable, unregisterDraggable } = useDragDrop();
  const draggableRef = React.useRef<View | null>(null);
  const draggable = React.useRef(
    new Draggable({
      ref: draggableRef,
      onStart,
      onEnd,
      onCancel,
      onComplete,
    }),
  ).current;

  React.useEffect(() => {
    registerDraggable(draggable);

    return () => {
      unregisterDraggable(draggable);
    };
  }, [unregisterDraggable, registerDraggable, draggable]);

  return draggable;
}
