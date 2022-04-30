import React, { forwardRef } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "./theme";

export interface PressableHighlightProps extends PressableProps {
  children?:
    | React.ReactNode
    | ((callback: PressableStateCallback) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
}

export interface PressableStateCallback {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}

export const PressableHighlight = forwardRef<View, PressableHighlightProps>(
  function PressableHighlight(props, ref): JSX.Element {
    const { children, style, ...restProps } = props;
    const theme = useTheme();

    return (
      <Pressable
        ref={ref}
        style={(state) => {
          const { hovered, pressed } = state as PressableStateCallback;
          let backgroundColor = theme.button.flatDefault;

          if (hovered) {
            backgroundColor = theme.button.flatHovered;
          } else if (pressed) {
            backgroundColor = theme.button.flatPressed;
          }

          return [{ backgroundColor }, style];
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
      >
        {children}
      </Pressable>
    );
  }
);
