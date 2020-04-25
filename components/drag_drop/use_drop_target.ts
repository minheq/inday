import React from 'react';
import { useDragDrop } from './drag_drop_provider';
import { DropTarget, DropTargetProps } from './drop_target';
import { measure } from './measurements';

export function useDropTarget<TElement = any>(
  props: DropTargetProps,
): [DropTarget, React.RefObject<TElement>] {
  const {
    onEnter = () => {},
    onAccept = () => {},
    onHover = () => {},
    onLeave = () => {},
    onWillAccept = () => true,
  } = props;

  const { registerDropTarget, unregisterDropTarget } = useDragDrop();
  const ref = React.useRef<TElement>(null);
  const dropTarget = React.useRef(
    new DropTarget({
      onEnter,
      onAccept,
      onHover,
      onLeave,
      onWillAccept,
    }),
  ).current;

  React.useEffect(() => {
    measure(ref).then((measurements) => {
      dropTarget.measurements = measurements;
    });
  });

  React.useEffect(() => {
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
