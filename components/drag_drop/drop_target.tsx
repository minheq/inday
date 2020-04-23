interface DropTargetProps {
  /** Called when an acceptable piece of data was dropped over this drag target. */
  onAccept: () => {};

  /** Called when a given piece of data being dragged over this target leaves the target. */
  onLeave: () => {};

  /** Called when a piece of data is being dragged over this drag target. */
  onHover: () => {};

  /** Called to determine whether this widget is interested in receiving a given piece of data being dragged over this drag target. */
  onWillAccept: () => boolean;
}

export class DropTarget {
  key: string;
  onAccept: () => void;
  onLeave: () => void;
  onHover: () => void;
  onWillAccept: () => void;

  constructor(props: DropTargetProps) {
    const {
      onAccept = () => {},
      onLeave = () => {},
      onHover = () => {},
      onWillAccept = () => {},
    } = props;

    this.key = '';
    this.onAccept = onAccept;
    this.onLeave = onLeave;
    this.onHover = onHover;
    this.onWillAccept = onWillAccept;
  }
}
