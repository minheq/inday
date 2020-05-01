import React from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Modal, ModalProps } from './modal';
import { usePressability, PressabilityConfig } from './pressability';
import { useTheme, tokens } from '../theme';

const OFFSET_TOP = 64;

interface DialogProps extends ModalProps {
  size?: 'auto' | 'fill';
}

// TODO: Add 'fade' and 'none' animationType handlers
export function Dialog(props: DialogProps) {
  const {
    isOpen,
    onRequestClose = () => {},
    onShow,
    size = 'auto',
    animationType = 'none',
    children,
  } = props;
  const { height } = useWindowDimensions();
  const theme = useTheme();
  const [internalIsOpen, setInternalIsOpen] = React.useState(isOpen);
  const slide = React.useRef(
    new Animated.Value(animationType === 'slide' ? height : OFFSET_TOP),
  ).current;
  const fade = React.useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    if (animationType !== 'slide') {
      return;
    }
    if (isOpen) {
      setInternalIsOpen(isOpen);
      Animated.spring(slide, {
        toValue: OFFSET_TOP,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(fade, {
        toValue: 1,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(fade, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(slide, {
        toValue: height,
        bounciness: 0,
        useNativeDriver: true,
      }).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [
    animationType,
    fade,
    isOpen,
    internalIsOpen,
    slide,
    height,
    onRequestClose,
  ]);

  const handlePressOverlay = React.useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      onPress: handlePressOverlay,
    }),
    [handlePressOverlay],
  );

  const eventHandlers = usePressability(config);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onShow={onShow}
      animationType="fade"
      transparent
    >
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [
                theme.button.flat.backgroundDefault,
                'rgba(0, 0, 0, 0.3)',
              ],
            }),
          },
        ]}
      >
        <View style={[styles.overlay]} {...eventHandlers} />
        <Animated.View
          style={[
            styles.dialog,
            size === 'fill' && styles.fill,
            { transform: [{ translateY: slide }] },
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
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
  fill: {
    height: '90%',
  },
  dialog: {
    borderRadius: tokens.radius,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
