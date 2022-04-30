import React, { forwardRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "./theme";

export interface PressableHighlightProps {
  children?:
    | React.ReactNode
    | ((callback: PressableStateCallback) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

export interface PressableStateCallback {
  hovered: boolean;
  pressed: boolean;
}

export const PressableHighlight = forwardRef<View, PressableHighlightProps>(
  function PressableHighlight(props, ref): JSX.Element {
    const { children, style, onPress, disabled } = props;

    return (
      <Pressable
        ref={ref}
        style={(state) => {
          const { hovered, pressed } = state as PressableStateCallback;
          return [style, hovered && styles.hovered, pressed && styles.pressed];
        }}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  hovered: {
    backgroundColor: theme.neutral.lightest,
  },
  pressed: {
    backgroundColor: theme.neutral.light,
  },
});
