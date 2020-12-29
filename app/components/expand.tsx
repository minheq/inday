import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, LayoutChangeEvent } from 'react-native';
import { SpringConfig } from './animation';
import { tokens } from './tokens';

interface ExpandProps {
  open?: boolean;
  children?: React.ReactNode;
  config?: SpringConfig;
  onExpanded?: () => void;
  onCollapsed?: () => void;
}

export function Expand(props: ExpandProps): JSX.Element {
  const { open, children, onExpanded, onCollapsed, config } = props;
  const { bounciness, speed } = config || tokens.animation.default;
  const height = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [intrinsicHeight, setIntrinsicHeight] = useState(0);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setIntrinsicHeight(event.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(height, {
        toValue: open ? intrinsicHeight : 0,
        bounciness,
        speed,
        useNativeDriver: false,
      }),
      Animated.spring(translateY, {
        toValue: open ? 0 : -intrinsicHeight,
        bounciness,
        speed,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (open && onExpanded !== undefined) {
        onExpanded();
      } else if (onCollapsed !== undefined) {
        onCollapsed();
      }
    });
  }, [
    height,
    bounciness,
    speed,
    translateY,
    open,
    intrinsicHeight,
    onExpanded,
    onCollapsed,
  ]);

  return (
    <Animated.View style={[styles.base, { height }]}>
      <Animated.View
        onLayout={handleLayout}
        style={{ transform: [{ translateY }] }}
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
