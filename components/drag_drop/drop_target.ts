import { View } from 'react-native';

export interface DropTargetCallbacks {
  /** Called when an acceptable piece of data was dropped over this drag target. */
  onAccept?: () => void;

  /** Called when a given piece of data being dragged over this target leaves the target. */
  onLeave?: () => void;

  /** Called when a piece of data is being dragged over this drag target. */
  onHover?: () => void;

  /** Called to determine whether this widget is interested in receiving a given piece of data being dragged over this drag target. */
  onWillAccept?: () => boolean;
}

export interface DropTargetConstructorProps {
  ref: React.MutableRefObject<View | null>;
}

let keySequence = 1;

export class DropTarget {
  key: string;
  ref: React.MutableRefObject<View | null>;

  constructor(props: DropTargetConstructorProps) {
    const { ref } = props;

    this.key = `${keySequence++}`;
    this.ref = ref;
  }
}
