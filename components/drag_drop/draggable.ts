import { View, Animated } from 'react-native';
import { Measurements, measure } from './measurements';

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

export type DragEndCallback = (dragState: DragState) => Promise<void>;
export type DragCallback = (dragState: DragState) => Promise<void>;
export type DragStartCallback = (dragState: DragState) => Promise<void>;

export interface DragState {
  /** Horizontal distance moved from original position */
  dx: number;
  /** Vertical distance moved from original position */
  dy: number;
  /** X coordinate relative to page */
  pageX: number;
  /** Y coordinate relative to page */
  pageY: number;
}

let keySequence = 1;

export class Draggable {
  key: string;
  ref: React.MutableRefObject<View | null>;
  measurements: Measurements | null = null;
  pan: Animated.ValueXY = new Animated.ValueXY();
  isDragging: boolean = false;

  constructor(props: DraggableConstructorProps) {
    const { ref } = props;

    this.key = `${keySequence++}`;
    this.ref = ref;
  }

  _dragStartListeners: DragStartCallback[] = [];
  _dragListeners: DragCallback[] = [];
  _dragEndListeners: DragEndCallback[] = [];

  onDragStart = (fn: DragStartCallback) => {
    this._dragStartListeners.push(fn);
  };

  onDrag = (fn: DragCallback) => {
    this._dragListeners.push(fn);
  };

  onDragEnd = (fn: DragEndCallback) => {
    this._dragEndListeners.push(fn);
  };

  startDrag = (dragState: DragState) => {
    this._dragStartListeners.forEach(async (fn) => {
      await fn(dragState);
    });
  };

  drag = (dragState: DragState) => {
    this._dragListeners.forEach(async (fn) => {
      await fn(dragState);
    });
  };

  endDrag = (dragState: DragState) => {
    this._dragEndListeners.forEach(async (fn) => {
      await fn(dragState);
    });
  };

  measure = async () => {
    this.measurements = await measure(this.ref);
  };
}
