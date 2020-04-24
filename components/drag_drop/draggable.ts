import { View, Animated } from 'react-native';

export interface DraggableCallbacks {
  /** Called when the draggable starts being dragged. */
  onDragStarted?: () => void;

  /** Called when the draggable is dropped. */
  onDragEnd?: () => void;

  /** Called when the draggable is dropped without being accepted by a DragTarget. */
  onDraggableCanceled?: () => void;

  /** Called when the draggable is dropped and accepted by a DragTarget. */
  onDragCompleted?: () => void;
}

export interface DraggableConstructorProps extends DraggableCallbacks {
  ref: React.MutableRefObject<View | null>;
}

let keySequence = 1;

type DragEndCallback = (state: DragState) => void;
type DragCallback = (state: DragState) => void;
type DragStartCallback = (state: DragState) => void;

interface DragState {
  dx: number;
  dy: number;
}

export class Draggable {
  key: string;
  ref: React.MutableRefObject<View | null>;
  pan: Animated.ValueXY = new Animated.ValueXY();
  isDragging: boolean = false;

  constructor(props: DraggableConstructorProps) {
    const { ref } = props;

    this.key = `${keySequence++}`;
    this.ref = ref;
  }

  _dragEndListeners: DragEndCallback[] = [];
  _dragListeners: DragCallback[] = [];
  _dragStartListeners: DragStartCallback[] = [];

  onDragStart = (fn: DragStartCallback) => {
    this._dragStartListeners.push(fn);
  };

  onDrag = (fn: DragCallback) => {
    this._dragListeners.push(fn);
  };

  onDragEnd = (fn: DragEndCallback) => {
    this._dragEndListeners.push(fn);
  };

  startDrag = (state: DragState) => {
    this._dragStartListeners.forEach((fn) => {
      fn(state);
    });
  };

  drag = (state: DragState) => {
    this._dragListeners.forEach((fn) => {
      fn(state);
    });
  };

  endDrag = (state: DragState) => {
    this._dragEndListeners.forEach((fn) => {
      fn(state);
    });
  };
}
