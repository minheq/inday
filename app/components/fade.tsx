import React from 'react';
import { Animated } from 'react-native';

interface FadeProps<T> {
  open?: boolean;
  value?: T;
  children?: React.ReactNode;
}

export function Fade<T>(props: FadeProps<T>): JSX.Element {
  const { open, value, children } = props;
  const opacity = React.useRef(new Animated.Value(open ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(opacity, {
      toValue: open ? 1 : 0,
      bounciness: 0,
      useNativeDriver: false,
    }).start();
  }, [open, opacity]);

  React.useEffect(() => {
    Animated.sequence([
      Animated.spring(opacity, {
        toValue: 0,
        speed: 100,
        bounciness: 0,
        useNativeDriver: false,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        speed: 100,
        bounciness: 0,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value, opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}
