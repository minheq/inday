import React, { useEffect, useRef } from "react";
import { useDragDrop } from "./drag_drop";

import { Draggable, DragState } from "./draggable";

interface DropTargetMeasurements {
  x: number;
  y: number;
  pageY: number;
  pageX: number;
  height: number;
  width: number;
}

export interface DropTargetProps {
  /** Called when an acceptable draggable was dropped over this drop target. */
  onAccept?: <T>(draggable: Draggable<T>) => void;

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
  measurements: DropTargetMeasurements | null = null;

  onAccept: <T>(draggable: Draggable<T>) => void = () => {};
  onLeave: <T>(draggable: Draggable<T>) => void = () => {};
  onEnter: <T>(draggable: Draggable<T>) => void = () => {};
  onHover: <T>(draggable: Draggable<T>, dragState: DragState) => void =
    () => {};
  onWillAccept: <T>(draggable: Draggable<T>) => boolean = () => true;

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

export function useDropTarget<T>(
  props: DropTargetProps
): [DropTarget, React.RefObject<T>] {
  const {
    onEnter,
    onAccept,
    onHover,
    onLeave,
    onWillAccept = () => true,
  } = props;

  const { registerDropTarget, unregisterDropTarget } = useDragDrop();
  const ref = useRef<T>(null);
  const dropTarget = useRef(
    new DropTarget({
      onEnter,
      onAccept,
      onHover,
      onLeave,
      onWillAccept,
    })
  ).current;

  useEffect(() => {
    registerDropTarget(dropTarget);

    return () => {
      unregisterDropTarget(dropTarget);
    };
  }, [
    unregisterDropTarget,
    registerDropTarget,
    dropTarget,
    onAccept,
    onHover,
    onLeave,
    onWillAccept,
  ]);

  return [dropTarget, ref];
}
