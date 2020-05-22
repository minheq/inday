import React from 'react';
import {
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import { Pressable, PressableChildrenProps } from './pressable';
import { tokens, useTheme } from '../theme';

interface ButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  children?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  style?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        props: PressableChildrenProps,
      ) => Animated.WithAnimatedValue<StyleProp<ViewStyle>>);
}

export function Button(props: ButtonProps) {
  const { onPress = () => {}, children, style, align = 'center' } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed, hovered }) => {
        Animated.spring(background, {
          toValue: pressed ? 1 : hovered ? 0.5 : 0,
          useNativeDriver: false,
          bounciness: 0,
          speed: 100,
        }).start();

        return [
          styles.base,
          styles[align],
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

const styles = StyleSheet.create({
  base: {
    height: 40,
    paddingHorizontal: 8,
    flexDirection: 'row',
    borderRadius: tokens.radius,
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
});
