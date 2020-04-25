import React from 'react';
import { ViewStyle, Animated } from 'react-native';
import { useDropTarget } from './drag_drop/use_drop_target';
import { DropTargetCallbacks } from './drag_drop/drop_target';

interface DropTargetProps extends DropTargetCallbacks {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function DropTarget(props: DropTargetProps) {
  const {
    children,
    onEnter,
    onAccept,
    onHover,
    onLeave,
    onWillAccept,
    style,
  } = props;

  const backgroundColor = React.useRef(new Animated.Value(0)).current;
  const dropTarget = useDropTarget({
    onAccept: () => {
      console.log('onAccept');
      backgroundColor.setValue(0);
    },
    onEnter: () => {
      console.log('onEnter');
      backgroundColor.setValue(1);
    },
    onHover: () => {
      console.log('onHover');
    },
    onLeave: () => {
      console.log('onLeave');

      backgroundColor.setValue(0);
    },
    onWillAccept: () => {
      console.log('onWillAccept');
      return true;
    },
  });

  return (
    <Animated.View
      // @ts-ignore
      ref={dropTarget.ref}
      style={[
        {
          width: 100,
          height: 100,
          backgroundColor: backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['yellow', 'teal'],
          }),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
