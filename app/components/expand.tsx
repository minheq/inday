import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, LayoutChangeEvent } from 'react-native';

interface ExpandProps {
  open?: boolean;
  children?: React.ReactNode;
  onExpanded?: () => void;
  onCollapsed?: () => void;
}

export function Expand(props: ExpandProps): JSX.Element {
  const { open, children, onExpanded, onCollapsed } = props;
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
        bounciness: 0,
        useNativeDriver: false,
      }),
      Animated.spring(translateY, {
        toValue: open ? 0 : -intrinsicHeight,
        bounciness: 0,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (open) {
        if (onExpanded !== undefined) {
          onExpanded();
        }
      } else {
        if (onCollapsed !== undefined) {
          onCollapsed();
        }
      }
    });
  }, [height, translateY, open, intrinsicHeight, onExpanded, onCollapsed]);

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
