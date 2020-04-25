import React from 'react';
import {
  Animated,
  PanResponder,
  ViewStyle,
  PanResponderGestureState,
  GestureResponderEvent,
} from 'react-native';
import { useDraggable } from './drag_drop/use_draggable';
import { DraggableCallbacks, DragState } from './drag_drop/draggable';

interface DraggableProps extends DraggableCallbacks {
  children?: React.ReactNode;
  style?: ViewStyle;
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

export function Draggable(props: DraggableProps) {
  const { children, onComplete, onEnd, onStart, onCancel, style } = props;
  const pan = React.useRef(new Animated.ValueXY()).current;
  const draggable = useDraggable({
    onComplete: () => {
      console.log('onComplete');
    },
    onEnd: () => {
      console.log('onEnd');
    },
    onStart: () => {
      console.log('onStart');
    },
    onCancel: () => {
      console.log('onCancel');
    },
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
        // console.log(
        //   `pageX=${event.nativeEvent.pageX}`,
        //   `pageY=${event.nativeEvent.pageY}`,
        //   `locationX=${event.nativeEvent.locationX}`,
        //   `locationY=${event.nativeEvent.locationY}`,
        //   `dx=${state.dx}`,
        //   `dy=${state.dy}`,
        //   `moveX=${state.moveX}`,
        //   `moveY=${state.moveY}`,
        // );
        pan.setValue({
          x: state.dx,
          y: state.dy,
        });

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
      ref={draggable.ref}
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: zIndex.current,
          width: 100,
          height: 100,
          backgroundColor: 'pink',
        },
        style,
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
