import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { measure } from '../utils/measurements';
import { useTheme, tokens } from './theme';
import { Modal } from './modal';
import { PressabilityConfig, usePressability } from './pressability';

export type PopoverPlacement =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

export type PopoverAnchor = { y: number; x: number };

interface PopoverProps {
  visible?: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
  placement?: PopoverPlacement;
  anchor: PopoverAnchor;
}

interface PopoverLayout {
  top: number;
  left: number;
  fromX: number;
  fromY: number;
}

interface Dimensions {
  height: number;
  width: number;
}

const initialLayout: PopoverLayout = {
  top: 0,
  left: 0,
  fromX: 0,
  fromY: 0,
};

export function Popover(props: PopoverProps) {
  const {
    visible = false,
    placement = 'top-center',
    onRequestClose = () => {},
    anchor,
    children,
  } = props;
  const show = React.useRef(new Animated.Value(0)).current;
  const position = React.useRef(new Animated.ValueXY()).current;
  const ref = React.useRef<View | null>(null);
  const [layout, setLayout] = React.useState(initialLayout);
  const [ready, setReady] = React.useState(false);
  const [internalVisible, setInternalVisible] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    if (visible === true) {
      if (internalVisible === false) {
        setInternalVisible(true);
      }

      if (ready) {
        position.setValue({
          x: layout.fromX,
          y: layout.fromY,
        });

        Animated.parallel([
          Animated.spring(show, {
            toValue: 1,
            bounciness: tokens.animation.spring.bounciness,
            speed: 48,
            useNativeDriver: true,
          }),
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            bounciness: tokens.animation.spring.bounciness,
            speed: 48,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      Animated.parallel([
        Animated.spring(show, {
          toValue: 0,
          bounciness: tokens.animation.spring.bounciness,
          speed: 48,
          useNativeDriver: true,
        }),
        Animated.spring(position, {
          toValue: { x: layout.fromX, y: layout.fromY },
          bounciness: tokens.animation.spring.bounciness,
          speed: 48,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false);
      });
    }
  }, [visible, show, ready, layout, position, internalVisible]);

  const handlePressBackground = React.useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((measurements) => {
      const l = calculatePopoverLayout(anchor, measurements, placement);
      setLayout(l);
      setReady(true);
    });
  }, [anchor, placement]);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      onPress: handlePressBackground,
    }),
    [handlePressBackground],
  );

  const eventHandlers = usePressability(config);

  return (
    <Modal
      visible={internalVisible}
      onRequestClose={onRequestClose}
      animationType="none"
      transparent
    >
      <View style={styles.base}>
        <View style={styles.background} {...eventHandlers} />
        <Animated.View
          // @ts-ignore
          ref={ref}
          onLayout={handleLayout}
          style={[
            styles.popover,
            theme.container.shadow,
            {
              top: layout.top,
              left: layout.left,
              transform: [
                { scale: show },
                { translateX: position.x },
                { translateY: position.y },
              ],
              opacity: show,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

function calculatePopoverLayout(
  anchor: PopoverAnchor,
  dimensions: Dimensions,
  placement: PopoverPlacement,
): PopoverLayout {
  switch (placement) {
    case 'bottom-right':
      return {
        top: anchor.y,
        left: anchor.x,
        fromX: -dimensions.width,
        fromY: -dimensions.height,
      };
    default:
      return {
        top: 0,
        left: 0,
        fromX: 0,
        fromY: 0,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  popover: {
    position: 'absolute',
    zIndex: 1,
    borderRadius: tokens.radius,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
