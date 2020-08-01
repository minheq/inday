import React from 'react';
import { Animated, StyleSheet } from 'react-native';

interface SlideProps {
  width: number;
  open?: boolean;
  children?: React.ReactNode;
  onSlide?: () => void;
  onCollapsed?: () => void;
}

export function Slide(props: SlideProps) {
  const {
    width: intrinsicWidth,
    open,
    children,
    onSlide = () => {},
    onCollapsed = () => {},
  } = props;
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
        onSlide();
      } else {
        onCollapsed();
      }
    });
  }, [width, opacity, open, intrinsicWidth, onSlide, onCollapsed]);

  return (
    <Animated.View style={[styles.base, { width, opacity }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
