import React from 'react';
import { ViewStyle, Animated } from 'react-native';
import { useDropTarget } from './drag_drop/use_drop_target';
import { DropTargetCallbacks } from './drag_drop/drop_target';

interface DropTargetProps extends DropTargetCallbacks {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function DropTarget(props: DropTargetProps) {
  const { children, onAccept, onHover, onLeave, onWillAccept, style } = props;

  const backgroundColor = React.useRef(new Animated.Value(0)).current;
  const dropTarget = useDropTarget({
    onAccept,
    onHover: () => {
      if (onHover) {
        onHover();
      }

      backgroundColor.setValue(1);
    },
    onLeave: () => {
      if (onLeave) {
        onLeave();
      }

      backgroundColor.setValue(0);
    },
    onWillAccept,
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
