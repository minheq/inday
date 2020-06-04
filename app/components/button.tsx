import React from 'react';
import { StyleSheet, Animated, GestureResponderEvent } from 'react-native';
import { Pressable } from './pressable';
import { tokens, useTheme } from '../theme';
import { Text } from './text';

interface ButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  title?: string;
}

export function Button(props: ButtonProps) {
  const { onPress = () => {}, title } = props;
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
        ];
      }}
      onPress={onPress}
    >
      <Text>{title}</Text>
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
});
