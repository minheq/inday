import React from 'react';
import { Animated, PanResponder } from 'react-native';
import { useDraggable } from './drag_drop/use_draggable';
import { DraggableProps as ClassDraggableProps } from './drag_drop/draggable';

interface DraggableProps extends ClassDraggableProps {
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

  const { startDrag, drag, endDrag, draggableRef } = useDraggable({
    onDragCompleted,
    onDragEnd,
    onDragStarted,
    onDraggableCanceled,
  });

  const pan = React.useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startDrag();
        // pan.setOffset({
        //   x: pan.x._value,
        //   y: pan.y._value,
        // });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        listener: () => drag(),
        useNativeDriver: true,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        endDrag();
      },
    }),
  ).current;

  return (
    <Animated.View
      // @ts-ignore
      ref={draggableRef}
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
