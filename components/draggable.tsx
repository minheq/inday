import React from 'react';
import { Animated, PanResponder } from 'react-native';
import { useDraggable } from './drag_drop/use_draggable';
import { DraggableCallbacks } from './drag_drop/draggable';

interface DraggableProps extends DraggableCallbacks {
  children?: React.ReactNode;
}

export function Draggable(props: DraggableProps) {
  const {
    children,
    onDragCompleted,
    onDragEnd,
    onDragStarted,
    onDraggableCanceled,
  } = props;

  const draggable = useDraggable({
    onDragCompleted,
    onDragEnd,
    onDragStarted,
    onDraggableCanceled,
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, state) => {
        draggable.startDrag();
      },
      onPanResponderMove: (event, state) => {
        draggable.drag(state);
      },
      onPanResponderRelease: (event, state) => {
        draggable.endDrag();
      },
    }),
  ).current;

  return (
    <Animated.View
      // @ts-ignore
      ref={draggable.ref}
      style={{
        transform: [
          { translateX: draggable.pan.x },
          { translateY: draggable.pan.y },
        ],
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
