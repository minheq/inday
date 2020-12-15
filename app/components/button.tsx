import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from './theme';
import { tokens } from './tokens';

export interface ButtonProps {
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
  const theme = useTheme();

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
                  outputRange:
                    theme === 'dark'
                      ? [
                          tokens.colors.gray[900],
                          tokens.colors.gray[800],
                          tokens.colors.gray[700],
                        ]
                      : [
                          tokens.colors.base.white,
                          tokens.colors.gray[50],
                          tokens.colors.gray[100],
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
