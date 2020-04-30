import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Hoverable } from '../components/hoverable';
import { useTheme, tokens } from '../theme';

interface HoverProps {
  children?: React.ReactNode;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export function Hover(props: HoverProps) {
  const { children, onHoverIn = () => {}, onHoverOut = () => {} } = props;
  const hover = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  const handleHoverIn = React.useCallback(() => {
    Animated.spring(hover, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      speed: 40,
    }).start();
    onHoverIn();
  }, [onHoverIn, hover]);

  const handleHoverOut = React.useCallback(() => {
    Animated.spring(hover, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 40,
    }).start();
    onHoverOut();
  }, [onHoverOut, hover]);

  return (
    <Hoverable onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: hover.interpolate({
              inputRange: [0, 1],
              outputRange: [
                theme.container.color.default,
                theme.container.color.hover,
              ],
            }),
          },
        ]}
      >
        {children}
      </Animated.View>
    </Hoverable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius,
  },
});
