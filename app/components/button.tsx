import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';
import { palette } from './palette';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  children?:
    | React.ReactNode
    | ((state: { hovered: boolean; pressed: boolean }) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Button(props: ButtonProps): JSX.Element {
  const { onPress, children, style, containerStyle, disabled = false } = props;
  const state = useRef(new Animated.Value(0)).current;

  return (
    <Pressable style={containerStyle} disabled={disabled} onPress={onPress}>
      {({ hovered, pressed }: { hovered: boolean; pressed: boolean }) => {
        Animated.spring(state, {
          toValue: pressed ? 2 : hovered ? 1 : 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 40,
        }).start();

        return (
          <Animated.View
            style={[
              {
                backgroundColor: state.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    palette.base.transparent,
                    palette.gray[50],
                    palette.gray[100],
                  ],
                }),
              },
              style,
            ]}
          >
            {typeof children === 'function'
              ? children({ hovered, pressed })
              : children}
          </Animated.View>
        );
      }}
    </Pressable>
  );
}
