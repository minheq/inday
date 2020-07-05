import React from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { Pressable } from './pressable';
import { useTheme } from '../theme';

interface ButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}

export function Button(props: ButtonProps) {
  const { onPress = () => {}, disabled, style, children } = props;
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
    >
      {children}
    </Pressable>
  );
}
