import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme, tokens } from './theme';
import { Modal } from './modal';
import { usePressability } from '../lib/pressability/use_pressability';
import { PressabilityConfig } from '../lib/pressability/pressability';

export const initialPopoverAnchor: PopoverAnchor = { y: 0, x: 0 };
export type PopoverAnchor = { y: number; x: number };

interface PopoverProps {
  visible?: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
  anchor: PopoverAnchor;
}

export function Popover(props: PopoverProps) {
  const {
    visible = false,
    onRequestClose = () => {},
    anchor,
    children,
  } = props;
  const opacity = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    Animated.spring(opacity, {
      toValue: visible ? 1 : 0,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  const handlePressBackground = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const config: PressabilityConfig = useMemo(
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
      animationType="none"
      transparent
    >
      <View style={styles.base}>
        <View style={styles.background} {...eventHandlers} />
        <Animated.View
          style={[
            styles.popover,
            theme.container.shadow,
            {
              top: anchor.y,
              left: anchor.x,
              opacity,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
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
