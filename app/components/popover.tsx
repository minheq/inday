import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { measure, initialMeasurements } from '../utils/measurements';
import { useTheme, tokens } from '../theme';
import { Modal } from './modal';
import { PressabilityConfig, usePressability } from './pressability';

export type PopoverPosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

export type PopoverAnchor = { top: number; left: number };

interface PopoverProps {
  visible?: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
  position?: PopoverPosition;
  anchor: PopoverAnchor;
}

interface PopoverLayout {
  left: number;
  top: number;
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
  paddingTop: number;
}

interface PopoverState {
  visible: boolean;
  layout: PopoverLayout;
}

interface Dimensions {
  height: number;
  width: number;
}

const initialLayout = {
  left: 0,
  top: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingTop: 0,
};

export function Popover(props: PopoverProps) {
  const {
    visible = false,
    position = 'top-center',
    onRequestClose = () => {},
    anchor,
    children,
  } = props;
  const show = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef<View | null>(null);
  const [measurements, setMeasurements] = React.useState(initialMeasurements);
  const [layout, setLayout] = React.useState(initialLayout);
  const [ready, setReady] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    if (measurements.height !== 0) {
      const l = calculatePopoverLayout(anchor, measurements, position);
      setLayout(l);
      setReady(true);
    }
  }, [measurements, visible, anchor, position]);

  React.useEffect(() => {
    if (ready) {
      Animated.spring(show, {
        toValue: visible ? 1 : 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, show, ready]);

  const handlePressBackground = React.useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((m) => setMeasurements(m));
  }, []);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      onPress: handlePressBackground,
    }),
    [handlePressBackground],
  );

  const eventHandlers = usePressability(config);

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      transparent
    >
      <View style={styles.base}>
        <View style={styles.background} {...eventHandlers} />
        <Animated.View
          // @ts-ignore
          ref={ref}
          onLayout={handleLayout}
          style={[
            layout,
            styles.popover,
            theme.container.shadow,
            { opacity: show },
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
  position: PopoverPosition,
): PopoverLayout {
  switch (position) {
    case 'top-center':
      return {
        top: -dimensions.height,
        left: dimensions.width / 2,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
      };
    case 'bottom-right':
      return {
        top: anchor.top,
        left: 0 - dimensions.width,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
      };
    case 'bottom-left':
      return {
        top: anchor.top,
        left: anchor.left,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
      };
    case 'bottom-center':
      return {
        top: anchor.top,
        left: dimensions.width / 2,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
      };
    default:
      return {
        top: -dimensions.height,
        left: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
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
