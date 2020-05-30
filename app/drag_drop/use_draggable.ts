import React from 'react';
import { useDragDrop } from './drag_drop_provider';
import { Draggable, DraggableProps } from './draggable';
import { measure } from '../utils/measurements';

export function useDraggable<TItem = any, TElement = any>(
  props: DraggableProps<TItem>,
): [Draggable<TItem>, React.RefObject<TElement>] {
  const {
    onStart = () => {},
    onEnd = () => {},
    onCancel = () => {},
    onComplete = () => {},
    item,
  } = props;

  const { registerDraggable, unregisterDraggable } = useDragDrop();
  const ref = React.useRef<TElement>(null);
  const draggable = React.useRef(
    new Draggable<TItem>({
      item,
      onStart,
      onEnd,
      onCancel,
      onComplete,
    }),
  ).current;

  React.useEffect(() => {
    measure(ref).then((measurements) => {
      draggable.measurements = measurements;
    });
  });

  React.useEffect(() => {
    registerDraggable(draggable);

    return () => {
      unregisterDraggable(draggable);
    };
  }, [unregisterDraggable, registerDraggable, draggable]);

  return [draggable, ref];
}
