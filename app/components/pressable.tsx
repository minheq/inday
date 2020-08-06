import React from 'react';
import {
  Animated,
  ViewStyle,
  StyleProp,
  StyleSheet,
  Platform,
} from 'react-native';
import { usePressability, PressabilityConfig } from '../hooks/use_pressability';
import { useTheme } from './theme';

export interface PressableChildrenProps {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
}

interface PressableProps extends PressabilityConfig {
  children?:
    | React.ReactNode
    | ((props: PressableChildrenProps) => React.ReactNode);
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
    disabled,
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
  const theme = useTheme();
  const background = React.useRef(new Animated.Value(0)).current;
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      onPress,
      onHoverIn: (e) => {
        setHovered(true);
        onHoverIn(e);
      },
      onHoverOut: (e) => {
        setHovered(false);
        onHoverOut(e);
      },
      onFocus: (e) => {
        setFocused(true);
        propOnFocus(e);
      },
      onBlur: (e) => {
        setFocused(false);
        propOnBlur(e);
      },
      onPressIn: () => {
        setPressed(true);
      },
      onPressOut: () => {
        setPressed(false);
      },
    }),
    [
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
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

  const childrenProps: PressableChildrenProps = {
    pressed: pressed,
    focused: focused,
    hovered: !pressed && hovered,
  };

  Animated.spring(background, {
    toValue: pressed ? 1 : hovered ? 0.5 : 0,
    useNativeDriver: false,
    bounciness: 0,
  }).start();

  return (
    <Animated.View
      style={[
        styles.base,
        webStyle.outline,
        disabled && styles.disabled,
        {
          backgroundColor: background.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              theme.button.backgroundDefault,
              theme.button.backgroundHovered,
              theme.button.backgroundPressed,
            ],
          }),
        },
        typeof style === 'function' ? style(childrenProps) : style,
      ]}
      onResponderGrant={onResponderGrant}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
      onResponderTerminate={onResponderTerminate}
      onResponderTerminationRequest={onResponderTerminationRequest}
      onStartShouldSetResponder={onStartShouldSetResponder}
      accessible={!disabled}
      // @ts-ignore web event handlers
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onClick={onClick}
    >
      {typeof children === 'function' ? children(childrenProps) : children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // @ts-ignore
  base: {
    ...(Platform.OS === 'web' && {
      touchAction: 'manipulation',
      cursor: 'pointer',
      userSelect: 'none',
    }),
  },
  // @ts-ignore
  disabled: {
    ...(Platform.OS === 'web' && {
      cursor: 'auto',
    }),
  },
});

const webStyle = {
  outline: {
    outline: 'none',
  },
};
