import React from 'react';
import { Animated } from 'react-native';

interface DropTargetProps {
  children?: React.ReactNode;

  /** Called when an acceptable piece of data was dropped over this drag target. */
  onAccept: () => {};

  /** Called when a given piece of data being dragged over this target leaves the target. */
  onLeave: () => {};

  /** Called to determine whether this widget is interested in receiving a given piece of data being dragged over this drag target. */
  onWillAccept: () => {};
}

export function DropTarget(props: DropTargetProps) {
  const { children } = props;

  return <Animated.View>{children}</Animated.View>;
}
