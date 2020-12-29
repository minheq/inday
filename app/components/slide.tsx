import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface SlideProps {
  width: number;
  visible: boolean;
  children?: React.ReactNode;
  onSlide?: () => void;
  onCollapsed?: () => void;
}

export function Slide(props: SlideProps): JSX.Element {
  const {
    width: intrinsicWidth,
    visible,
    children,
    onSlide,
    onCollapsed,
  } = props;
  const width = useRef(new Animated.Value(visible ? intrinsicWidth : 0))
    .current;
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(width, {
        toValue: visible ? intrinsicWidth : 0,
        speed: 80,
        bounciness: 0,
        useNativeDriver: false,
      }),
      Animated.spring(opacity, {
        toValue: visible ? 1 : 0,
        speed: 80,
        bounciness: 0,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (visible) {
        if (onSlide !== undefined) {
          onSlide();
        }
      } else {
        if (onCollapsed !== undefined) {
          onCollapsed();
        }
      }
    });
  }, [width, opacity, visible, intrinsicWidth, onSlide, onCollapsed]);

  return <Animated.View style={{ width, opacity }}>{children}</Animated.View>;
}
