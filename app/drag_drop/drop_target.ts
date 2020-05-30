import { Measurements } from '../utils/measurements';
import { Draggable, DragState } from './draggable';

export interface DropTargetProps {
  /** Called when an acceptable draggable was dropped over this drop target. */
  onAccept?: (draggable: Draggable) => void;

  /** Called when a given draggable being dragged over this target leaves the target. */
  onLeave?: (draggable: Draggable) => void;

  /** Called when a draggable is being dragged over this drop target. */
  onEnter?: (draggable: Draggable) => void;

  /** Called when a draggable is hovering over this drop target. */
  onHover?: (draggable: Draggable, dragState: DragState) => void;

  /** Called to determine whether this widget is interested in receiving a given draggable being dragged over this drop target. */
  onWillAccept?: (draggable: Draggable) => boolean;
}

let keySequence = 1;

export class DropTarget {
  key: string;
  measurements: Measurements | null = null;

  onAccept: (draggable: Draggable) => void = () => {};
  onLeave: (draggable: Draggable) => void = () => {};
  onEnter: (draggable: Draggable) => void = () => {};
  onHover: (draggable: Draggable, dragState: DragState) => void = () => {};
  onWillAccept: (draggable: Draggable) => boolean = () => true;

  constructor(props: DropTargetProps) {
    const {
      onAccept = () => {},
      onLeave = () => {},
      onEnter = () => {},
      onHover = () => {},
      onWillAccept = () => true,
    } = props;

    this.key = `${keySequence++}`;
    this.onAccept = onAccept;
    this.onLeave = onLeave;
    this.onEnter = onEnter;
    this.onHover = onHover;
    this.onWillAccept = onWillAccept;
  }
}
