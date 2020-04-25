import { View } from 'react-native';
import { Measurements, measure } from './measurements';

export interface DropTargetCallbacks {
  /** Called when an acceptable draggable was dropped over this drop target. */
  onAccept?: () => void;

  /** Called when a given draggable being dragged over this target leaves the target. */
  onLeave?: () => void;

  /** Called when a draggable is being dragged over this drop target. */
  onEnter?: () => void;

  /** Called when a draggable is hovering over this drop target. */
  onHover?: () => void;

  /** Called to determine whether this widget is interested in receiving a given draggable being dragged over this drop target. */
  onWillAccept?: () => boolean;
}

export interface DropTargetConstructorProps extends DropTargetCallbacks {
  ref: React.MutableRefObject<View | null>;
}

let keySequence = 1;

export class DropTarget {
  key: string;
  ref: React.MutableRefObject<View | null>;
  measurements: Measurements | null = null;

  onAccept: () => void = () => {};
  onLeave: () => void = () => {};
  onEnter: () => void = () => {};
  onHover: () => void = () => {};
  onWillAccept: () => boolean = () => true;

  constructor(props: DropTargetConstructorProps) {
    const {
      ref,
      onAccept = () => {},
      onLeave = () => {},
      onEnter = () => {},
      onHover = () => {},
      onWillAccept = () => true,
    } = props;

    this.key = `${keySequence++}`;
    this.ref = ref;
    this.onAccept = onAccept;
    this.onLeave = onLeave;
    this.onEnter = onEnter;
    this.onHover = onHover;
    this.onWillAccept = onWillAccept;
  }

  measure = async () => {
    this.measurements = await measure(this.ref);
  };
}
