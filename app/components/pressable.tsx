import React, { forwardRef } from "react";
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

export interface PressableProps {
  accessible?: boolean;
  pointerEvents?: "auto" | "box-none";
  children?:
    | React.ReactNode
    | ((callback: PressableStateCallback) => React.ReactNode);
  style?:
    | StyleProp<ViewStyle>
    | ((callback: PressableStateCallback) => StyleProp<ViewStyle>);
  onPress?: () => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressMove?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  disabled?: boolean;
}

export interface PressableStateCallback {
  hovered: boolean;
  pressed: boolean;
}

export const Pressable = forwardRef<View, PressableProps>(function Pressable(
  props,
  ref
): JSX.Element {
  const {
    children,
    style,
    onPress,
    disabled,
    onPressIn,
    onPressMove,
    onPressOut,
    onHoverIn,
    onHoverOut,
  } = props;

  return (
    <RNPressable
      ref={ref}
      onPress={onPress}
      disabled={disabled}
      // @ts-ignore available in react-native-web
      style={style}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onPressIn={onPressIn}
      onPressMove={onPressMove}
      onPressOut={onPressOut}
    >
      {children}
    </RNPressable>
  );
});
