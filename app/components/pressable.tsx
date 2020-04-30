import React from 'react';
import { Animated, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { usePressability, PressabilityConfig } from './pressability';

interface PressableChildrenProps {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
}

interface PressableProps {
  children?: React.ReactNode;
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  style?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        props: PressableChildrenProps,
      ) => Animated.WithAnimatedValue<StyleProp<ViewStyle>>);
}

export function Pressable(props: PressableProps) {
  const {
    children,
    onPress = () => {},
    style,
    onHoverIn = () => {},
    onHoverOut = () => {},
    onFocus = () => {},
    onBlur = () => {},
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      onPress,
      onHoverIn: () => {
        setIsHovered(true);
        onHoverIn();
      },
      onHoverOut: () => {
        setIsHovered(false);
        onHoverOut();
      },
      onFocus: () => {
        setIsFocused(true);
        onFocus();
      },
      onBlur: () => {
        setIsFocused(false);
        onBlur();
      },
      onPressIn: () => {
        setIsPressed(true);
      },
      onPressOut: () => {
        setIsPressed(false);
      },
    }),
    [onPress, onHoverIn, onHoverOut, onFocus, onBlur],
  );

  const eventHandlers = usePressability(config);

  return (
    <Animated.View
      style={[
        styles.base,
        webStyle.outline,
        typeof style === 'function'
          ? style({
              pressed: isPressed,
              focused: isFocused,
              hovered: !isPressed && isHovered,
            })
          : style,
      ]}
      {...eventHandlers}
      accessible
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    // @ts-ignore
    touchAction: 'manipulation',
    cursor: 'pointer',
  },
});

const webStyle = {
  outline: {
    outline: 'none',
  },
};
