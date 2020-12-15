import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface SlideProps {
  width: number;
  open?: boolean;
  children?: React.ReactNode;
  onSlide?: () => void;
  onCollapsed?: () => void;
}

export function Slide(props: SlideProps): JSX.Element {
  const { width: intrinsicWidth, open, children, onSlide, onCollapsed } = props;
  const width = useRef(new Animated.Value(open ? intrinsicWidth : 0)).current;
  const opacity = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(width, {
        toValue: open ? intrinsicWidth : 0,
        bounciness: 0,
        useNativeDriver: false,
      }),
      Animated.spring(opacity, {
        toValue: open ? 1 : 0,
        bounciness: 0,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (open === true && onSlide !== undefined) {
        onSlide();
      } else if (onCollapsed !== undefined) {
        onCollapsed();
      }
    });
  }, [width, opacity, open, intrinsicWidth, onSlide, onCollapsed]);

  return <Animated.View style={{ width, opacity }}>{children}</Animated.View>;
}
