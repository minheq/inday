import React, { useCallback, useRef } from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  Animated,
  ViewStyle,
  StyleProp,
} from 'react-native';

export interface StateCallback {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
}

interface PressableProps {
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onDoublePress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode | ((props: StateCallback) => React.ReactNode);
  style?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        props: StateCallback,
      ) => Animated.WithAnimatedValue<StyleProp<ViewStyle>>);
}

export function Pressable(props: PressableProps) {
  const { children, style, onPress, onDoublePress, onLongPress } = props;
  const timeoutRef = useRef<number | null>(null);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (onDoublePress !== undefined) {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          if (onDoublePress) {
            onDoublePress(event);
          }
          return;
        }

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, 500);
      }

      if (onPress) {
        onPress(event);
      }
    },
    [timeoutRef, onPress, onDoublePress],
  );

  return (
    <RNPressable
      onLongPress={onLongPress}
      onPress={handlePress}
      // @ts-ignore
      style={style}
    >
      {children}
    </RNPressable>
  );
}
