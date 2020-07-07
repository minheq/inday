import React from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { Pressable, PressableChildrenProps } from './pressable';
import { useTheme } from '../theme';

type ButtonVariant = 'filled' | 'flat';
type ButtonColor = 'default' | 'primary';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  color?: ButtonColor;
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
  const {
    onPress = () => {},
    disabled,
    style,
    variant = 'flat',
    color = 'default',
    children,
  } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed, hovered }) => {
        Animated.spring(background, {
          toValue: pressed ? 1 : hovered ? 0.5 : 0,
          useNativeDriver: false,
          bounciness: 0,
          speed: 100,
        }).start();

        return [
          {
            backgroundColor: background.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                theme.button.flat.backgroundDefault,
                theme.button.flat.backgroundHovered,
                theme.button.flat.backgroundPressed,
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
