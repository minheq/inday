import React from 'react';
import { useDragDrop } from './drag_drop_provider';
import { Draggable, DraggableProps } from './draggable';
import { Measurements } from '../measurements/measurements';
import { View } from 'react-native';

export function useDraggable<T, K extends View>(
  props: DraggableProps<T>,
): [Draggable<T>, React.RefObject<K>] {
  const {
    onStart = () => {},
    onEnd = () => {},
    onCancel = () => {},
    onComplete = () => {},
    item,
  } = props;

  const { registerDraggable, unregisterDraggable } = useDragDrop();
  const ref = React.useRef<K>(null);
  const draggable = React.useRef(
    new Draggable<T>({
      item,
      onStart,
      onEnd,
      onCancel,
      onComplete,
    }),
  ).current;

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.measure((...measurementsArgs) => {
        draggable.measurements = Measurements.fromArray(measurementsArgs);
      });
    }
  });

  React.useEffect(() => {
    registerDraggable(draggable);

    return () => {
      unregisterDraggable(draggable);
    };
  }, [unregisterDraggable, registerDraggable, draggable]);

  return [draggable, ref];
}
