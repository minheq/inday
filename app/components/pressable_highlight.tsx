import React, { forwardRef } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Pressable } from "./pressable";
import { theme } from "./theme";

export interface PressableHighlightProps {
  children?:
    | React.ReactNode
    | ((callback: PressableStateCallback) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
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

export const PressableHighlight = forwardRef<View, PressableHighlightProps>(
  function PressableHighlight(props, ref): JSX.Element {
    const { children, style, onPress, disabled, onHoverIn, onHoverOut } = props;

    return (
      <Pressable
        ref={ref}
        style={(state) => {
          const { hovered, pressed } = state;
          return [style, hovered && styles.hovered, pressed && styles.pressed];
        }}
        onPress={onPress}
        disabled={disabled}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
      >
        {children}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  hovered: {
    backgroundColor: theme.neutral[100],
  },
  pressed: {
    backgroundColor: theme.neutral[200],
  },
});
