import React from 'react';
import {
  Animated,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import { Pressable, PressableChildrenProps } from './pressable';
import { useTheme } from './theme';

type ButtonState = 'default' | 'hovered' | 'active' | 'disabled';

interface ButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  state?: ButtonState;
  children?:
    | React.ReactNode
    | ((props: PressableChildrenProps) => React.ReactNode);
  style?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        props: PressableChildrenProps,
      ) => Animated.WithAnimatedValue<StyleProp<ViewStyle>>);
}

export function Button(props: ButtonProps) {
  const { onPress = () => {}, state, style, children } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      disabled={state === 'disabled'}
      style={({ pressed, hovered }) => {
        let toValue = 0;

        if (state === 'active') {
          toValue = 2;
        } else if (state === 'hovered') {
          toValue = 0.5;
        } else if (pressed === true) {
          toValue = 1;
        } else if (hovered === true) {
          toValue = 0.5;
        }

        Animated.spring(background, {
          toValue,
          useNativeDriver: false,
          bounciness: 0,
        }).start();

        return [
          {
            backgroundColor: background.interpolate({
              inputRange: [0, 0.5, 1, 2],
              outputRange: [
                theme.button.backgroundDefault,
                theme.button.backgroundHovered,
                theme.button.backgroundPressed,
                theme.button.backgroundActive,
              ],
            }),
          },
          style,
        ];
      }}
      onPress={onPress}
      children={children}
    />
  );
}
