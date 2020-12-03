import React from 'react';
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
  const width = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
      if (open) {
        if (onSlide !== undefined) {
          onSlide();
        }
      } else {
        if (onCollapsed !== undefined) {
          onCollapsed();
        }
      }
    });
  }, [width, opacity, open, intrinsicWidth, onSlide, onCollapsed]);

  return <Animated.View style={{ width, opacity }}>{children}</Animated.View>;
}
