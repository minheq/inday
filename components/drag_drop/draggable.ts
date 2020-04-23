export interface DraggableProps {
  /** Called when the draggable is dropped and accepted by a DragTarget. */
  onDragCompleted?: () => void;

  /** Called when the draggable is dropped. */
  onDragEnd?: () => void;

  /** Called when the draggable is dropped without being accepted by a DragTarget. */
  onDraggableCanceled?: () => void;

  /** Called when the draggable starts being dragged. */
  onDragStarted?: () => void;
}

export class Draggable {
  key: string;
  onDragCompleted: () => void;
  onDragEnd: () => void;
  onDraggableCanceled: () => void;
  onDragStarted: () => void;

  constructor(props: DraggableProps) {
    const {
      onDragCompleted = () => {},
      onDragEnd = () => {},
      onDraggableCanceled = () => {},
      onDragStarted = () => {},
    } = props;

    this.key = '';
    this.onDragCompleted = onDragCompleted;
    this.onDragEnd = onDragEnd;
    this.onDraggableCanceled = onDraggableCanceled;
    this.onDragStarted = onDragStarted;
  }
}
