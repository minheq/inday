import React from 'react';
import { Animated } from 'react-native';
import { isNonNullish } from '../../lib/js_utils';

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
        if (isNonNullish(onSlide)) {
          onSlide();
        }
      } else {
        if (isNonNullish(onCollapsed)) {
          onCollapsed();
        }
      }
    });
  }, [width, opacity, open, intrinsicWidth, onSlide, onCollapsed]);

  return <Animated.View style={[{ width, opacity }]}>{children}</Animated.View>;
}
