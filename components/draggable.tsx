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

  const zIndex = React.useRef(new Animated.Value(0));

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, state) => {
        draggable.startDrag(state);
        zIndex.current.setValue(999);
      },
      onPanResponderMove: (event, state) => {
        draggable.drag(state);
      },
      onPanResponderRelease: (event, state) => {
        draggable.endDrag(state);
        zIndex.current.setValue(0);
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
        zIndex: zIndex.current,
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
