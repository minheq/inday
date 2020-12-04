import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Measurements } from '../measurements';
import { useDragDrop } from './drag_drop';

export interface DraggableProps<T> {
  /** The item this draggable corresponds to */
  item: T;

  /** Called when the draggable starts being dragged. */
  onStart?: () => void;

  /** Called when the draggable is dropped. */
  onEnd?: () => void;

  /** Called when the draggable is dropped without being accepted by a DragTarget. */
  onCancel?: () => void;

  /** Called when the draggable is dropped and accepted by a DragTarget. */
  onComplete?: () => void;
}

export type DragEndCallback = (dragState: DragState) => void;
export type DragCallback = (dragState: DragState) => void;
export type DragStartCallback = (dragState: DragState) => void;

export interface DragState {
  /** X-coordinate delta moved from original position */
  dx: number;
  /** Y-coordinate delta moved from original position */
  dy: number;
  /** X-coordinate relative to page */
  pageX: number;
  /** Y-coordinate relative to page */
  pageY: number;
}

let keySequence = 1;

export class Draggable<T> {
  key: string;
  item: T;
  measurements: Measurements | null = null;

  onStart: () => void = () => {
    return;
  };
  onEnd: () => void = () => {
    return;
  };
  onCancel: () => void = () => {
    return;
  };
  onComplete: () => void = () => {
    return;
  };

  constructor(props: DraggableProps<T>) {
    const {
      item,
      onStart = () => {
        return;
      },
      onEnd = () => {
        return;
      },
      onCancel = () => {
        return;
      },
      onComplete = () => {
        return;
      },
    } = props;

    this.item = item;
    this.key = `${keySequence++}`;
    this.onStart = onStart;
    this.onEnd = onEnd;
    this.onCancel = onCancel;
    this.onComplete = onComplete;
  }

  _dragStartListeners: DragStartCallback[] = [];
  _dragListeners: DragCallback[] = [];
  _dragEndListeners: DragEndCallback[] = [];

  addDragStartListener = (fn: DragStartCallback): void => {
    this._dragStartListeners.push(fn);
  };

  addDragListener = (fn: DragCallback): void => {
    this._dragListeners.push(fn);
  };

  addDragEndListener = (fn: DragEndCallback): void => {
    this._dragEndListeners.push(fn);
  };

  startDrag = (dragState: DragState): void => {
    this._dragStartListeners.forEach((fn) => {
      fn(dragState);
    });
  };

  drag = (dragState: DragState): void => {
    this._dragListeners.forEach((fn) => {
      fn(dragState);
    });
  };

  endDrag = (dragState: DragState): void => {
    this._dragEndListeners.forEach((fn) => {
      fn(dragState);
    });
  };
}

export function useDraggable<T, K extends View>(
  props: DraggableProps<T>,
): [Draggable<T>, React.RefObject<K>] {
  const { onStart, onEnd, onCancel, onComplete, item } = props;

  const { registerDraggable, unregisterDraggable } = useDragDrop();
  const ref = useRef<K>(null);
  const draggable = useRef(
    new Draggable<T>({
      item,
      onStart,
      onEnd,
      onCancel,
      onComplete,
    }),
  ).current;

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.measure((...measurementsArgs) => {
        draggable.measurements = Measurements.fromArray(measurementsArgs);
      });
    }
  });

  useEffect(() => {
    registerDraggable(draggable);

    return () => {
      unregisterDraggable(draggable);
    };
  }, [unregisterDraggable, registerDraggable, draggable]);

  return [draggable, ref];
}
