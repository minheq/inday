import React from 'react';
import { Animated, StyleSheet, LayoutChangeEvent } from 'react-native';
import { isNonNullish } from '../../lib/js_utils';

interface ExpandProps {
  open?: boolean;
  children?: React.ReactNode;
  onExpanded?: () => void;
  onCollapsed?: () => void;
}

export function Expand(props: ExpandProps): JSX.Element {
  const { open, children, onExpanded, onCollapsed } = props;
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
    ]).start(() => {
      if (open) {
        if (isNonNullish(onExpanded)) {
          onExpanded();
        }
      } else {
        if (isNonNullish(onCollapsed)) {
          onCollapsed();
        }
      }
    });
  }, [height, translateY, open, intrinsicHeight, onExpanded, onCollapsed]);

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
