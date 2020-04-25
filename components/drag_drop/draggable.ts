import { Measurements } from './measurements';

export interface DraggableProps<TItem = any> {
  /** The item this draggable corresponds to */
  item?: TItem;

  /** Called when the draggable starts being dragged. */
  onStart?: () => void;

  /** Called when the draggable is dropped. */
  onEnd?: () => void;

  /** Called when the draggable is dropped without being accepted by a DragTarget. */
  onCancel?: () => void;

  /** Called when the draggable is dropped and accepted by a DragTarget. */
  onComplete?: () => void;
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

export class Draggable<TItem = any> {
  key: string;
  item: TItem;
  measurements: Measurements | null = null;

  onStart: () => void = () => {};
  onEnd: () => void = () => {};
  onCancel: () => void = () => {};
  onComplete: () => void = () => {};

  constructor(props: DraggableProps) {
    const {
      item,
      onStart = () => {},
      onEnd = () => {},
      onCancel = () => {},
      onComplete = () => {},
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

  addDragStartListener = (fn: DragStartCallback) => {
    this._dragStartListeners.push(fn);
  };

  addDragListener = (fn: DragCallback) => {
    this._dragListeners.push(fn);
  };

  addDragEndListener = (fn: DragEndCallback) => {
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
}
