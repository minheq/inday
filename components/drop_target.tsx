import React from 'react';
import { Animated, View } from 'react-native';
import { useDropTarget } from './drag_drop/use_drop_target';
import { DropTargetProps } from './drag_drop/drop_target';

interface DropTargetComponentProps extends DropTargetProps {
  children?: React.ReactNode;
}

export function DropTarget(props: DropTargetComponentProps) {
  const { children, onEnter, onAccept, onHover, onLeave, onWillAccept } = props;

  const [, ref] = useDropTarget<View>({
    onAccept,
    onEnter,
    onHover,
    onLeave,
    onWillAccept,
  });

  return (
    <Animated.View
      // @ts-ignore
      ref={ref}
    >
      {children}
    </Animated.View>
  );
}
