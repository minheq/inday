import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { SpringConfig } from './animation';
import { tokens } from './tokens';

interface SlideProps {
  width: number;
  visible: boolean;
  children?: React.ReactNode;
  config?: SpringConfig;
  onSlide?: () => void;
  onCollapsed?: () => void;
}

export function Slide(props: SlideProps): JSX.Element {
  const {
    width: intrinsicWidth,
    visible,
    children,
    config,
    onSlide,
    onCollapsed,
  } = props;
  const { speed, bounciness } = config || tokens.animation.default;
  const width = useRef(new Animated.Value(visible ? intrinsicWidth : 0))
    .current;
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(width, {
        toValue: visible ? intrinsicWidth : 0,
        speed,
        bounciness,
        useNativeDriver: false,
      }),
      Animated.spring(opacity, {
        toValue: visible ? 1 : 0,
        speed,
        bounciness,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (visible && onSlide !== undefined) {
        onSlide();
      } else if (onCollapsed !== undefined) {
        onCollapsed();
      }
    });
  }, [
    speed,
    bounciness,
    width,
    opacity,
    visible,
    intrinsicWidth,
    onSlide,
    onCollapsed,
  ]);

  return <Animated.View style={{ width, opacity }}>{children}</Animated.View>;
}
