import React from 'react';
import { Animated, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { usePressability, PressabilityConfig } from './pressability';

export interface PressableChildrenProps {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
}

interface PressableProps extends PressabilityConfig {
  children?: React.ReactNode;
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
    delayHoverIn,
    delayHoverOut,
    delayLongPress,
    delayPressIn,
    delayPressOut,
    onHoverIn = () => {},
    onHoverOut = () => {},
    onFocus: propOnFocus = () => {},
    onBlur: propOnBlur = () => {},
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      delayPressIn,
      delayPressOut,
      onPress,
      onHoverIn: (e) => {
        setIsHovered(true);
        onHoverIn(e);
      },
      onHoverOut: (e) => {
        setIsHovered(false);
        onHoverOut(e);
      },
      onFocus: (e) => {
        setIsFocused(true);
        propOnFocus(e);
      },
      onBlur: (e) => {
        setIsFocused(false);
        propOnBlur(e);
      },
      onPressIn: () => {
        setIsPressed(true);
      },
      onPressOut: () => {
        setIsPressed(false);
      },
    }),
    [
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      delayPressIn,
      delayPressOut,
      onPress,
      onHoverIn,
      onHoverOut,
      propOnFocus,
      propOnBlur,
    ],
  );

  const {
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    // onClick,
    onResponderGrant,
    onResponderMove,
    onResponderRelease,
    onResponderTerminate,
    onResponderTerminationRequest,
    onStartShouldSetResponder,
  } = usePressability(config);

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
      onResponderGrant={onResponderGrant}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
      onResponderTerminate={onResponderTerminate}
      onResponderTerminationRequest={onResponderTerminationRequest}
      onStartShouldSetResponder={onStartShouldSetResponder}
      accessible
      // @ts-ignore web event handlers
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onClick={onClick}
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
    userSelect: 'none',
  },
});

const webStyle = {
  outline: {
    outline: 'none',
  },
};
