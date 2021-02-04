import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { tokens } from './tokens';

interface SpringConfig {
  speed?: number;
  bounciness?: number;
}

interface DelayProps {
  children: React.ReactNode;
  config?: SpringConfig;
}

export function Delay(props: DelayProps): JSX.Element {
  const { children, config } = props;
  const [show, setShow] = useState(false);
  const { bounciness, speed } = config || tokens.animation.default;
  const placeholder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(placeholder, {
      toValue: 1,
      bounciness,
      speed,
      useNativeDriver: true,
    }).start((animation) => {
      if (animation.finished) {
        setShow(true);
      }
    });
  }, [placeholder, bounciness, speed]);

  return <Fragment>{show && children}</Fragment>;
}
