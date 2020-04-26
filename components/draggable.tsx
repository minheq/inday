import React from 'react';
import {
  Animated,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
  View,
} from 'react-native';
import { useDraggable } from './drag_drop/use_draggable';
import { DraggableProps, DragState } from './drag_drop/draggable';

interface DraggableComponentProps<TItem = any> extends DraggableProps<TItem> {
  children?: React.ReactNode;
  direction?: 'horizontal' | 'vertical' | 'any';
}

function toDragState(
  event: GestureResponderEvent,
  state: PanResponderGestureState,
): DragState {
  return {
    dx: state.dx,
    dy: state.dy,
    pageX: event.nativeEvent.pageX,
    pageY: event.nativeEvent.pageY,
  };
}

export function Draggable<TItem = any>(props: DraggableComponentProps<TItem>) {
  const {
    children,
    onComplete,
    onEnd,
    onStart,
    onCancel,
    item,
    direction = 'any',
  } = props;
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [draggable, ref] = useDraggable<TItem, View>({
    item,
    onComplete,
    onEnd,
    onStart,
    onCancel,
  });

  const zIndex = React.useRef(new Animated.Value(0));

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, state) => {
        draggable.startDrag(toDragState(event, state));
        zIndex.current.setValue(999);
      },
      onPanResponderMove: (event, state) => {
        if (direction === 'vertical') {
          pan.setValue({
            x: 0,
            y: state.dy,
          });
        } else if (direction === 'horizontal') {
          pan.setValue({
            x: state.dx,
            y: 0,
          });
        } else {
          pan.setValue({
            x: state.dx,
            y: state.dy,
          });
        }

        draggable.drag(toDragState(event, state));
      },
      onPanResponderRelease: (event, state) => {
        draggable.endDrag(toDragState(event, state));
        pan.setValue({
          x: 0,
          y: 0,
        });
        zIndex.current.setValue(0);
      },
    }),
  ).current;

  return (
    <Animated.View
      // @ts-ignore
      ref={ref}
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: zIndex.current,
          userSelect: 'none',
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
