import React from 'react';
import { Animated, StyleSheet, LayoutChangeEvent } from 'react-native';

interface ExpandProps {
  open?: boolean;
  children?: React.ReactNode;
}

export function Expand(props: ExpandProps) {
  const { open, children } = props;
  const height = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const [intrinsicHeight, setIntrinsicHeight] = React.useState(0);

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    setIntrinsicHeight(event.nativeEvent.layout.height);
  }, []);

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(height, {
        toValue: open ? intrinsicHeight : 0,
        bounciness: 0,
        useNativeDriver: false,
      }),
      Animated.spring(translateY, {
        toValue: open ? 0 : -intrinsicHeight,
        bounciness: 0,
        useNativeDriver: false,
      }),
    ]).start();
  }, [height, translateY, open, intrinsicHeight]);

  return (
    <Animated.View style={[styles.base, { height }]}>
      <Animated.View
        onLayout={handleLayout}
        style={[{ transform: [{ translateY }] }]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
