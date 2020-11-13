import React, { Fragment, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { DynamicStyleSheet } from './stylesheet';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  radius?: number;
}

export function Button(props: ButtonProps): JSX.Element {
  const { onPress, children, radius = 8, disabled = false } = props;
  const state = useRef(new Animated.Value(0)).current;

  return (
    <Pressable
      disabled={disabled}
      style={[styles.root, { borderRadius: radius }]}
      onPress={onPress}
    >
      {({ hovered, pressed }: any) => {
        Animated.spring(state, {
          toValue: pressed ? 2 : hovered ? 1 : 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 40,
        }).start();

        return (
          <Fragment>
            <Animated.View
              style={[
                styles.background,
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
              ]}
            />
            {children}
          </Fragment>
        );
      }}
    </Pressable>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  root: {},
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
}));
