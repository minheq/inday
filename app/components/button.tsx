import React from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { Pressable } from '../components';
import { tokens, useTheme } from '../theme';

interface ButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Button(props: ButtonProps) {
  const { onPress = () => {}, children, style } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed, hovered }) => {
        Animated.spring(background, {
          toValue: pressed ? 1 : hovered ? 0.5 : 0,
          useNativeDriver: true,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
});
