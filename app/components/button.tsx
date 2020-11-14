import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button(props: ButtonProps): JSX.Element {
  const { onPress, children, style, disabled = false } = props;
  const state = useRef(new Animated.Value(0)).current;

  return (
    <Pressable disabled={disabled} onPress={onPress}>
      {({ hovered, pressed }: any) => {
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
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0.03)',
                    'rgba(0, 0, 0, 0.06)',
                  ],
                }),
              },
              style,
            ]}
          >
            {children}
          </Animated.View>
        );
      }}
    </Pressable>
  );
}
