import React from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Modal, ModalProps } from './modal';
import { usePressability, PressabilityConfig } from './pressability';
import { useTheme, tokens } from '../theme';

const OFFSET_TOP = 64;

interface DialogProps extends ModalProps {
  style?: StyleProp<ViewStyle>;
}

// TODO: Add 'fade' and 'none' animationType handlers
export function Dialog(props: DialogProps) {
  const {
    visible,
    onRequestClose = () => {},
    onShow,
    onDismiss,
    animationType = 'none',
    style,
    children,
  } = props;
  const { height } = useWindowDimensions();
  const theme = useTheme();
  const [internalIsOpen, setInternalIsOpen] = React.useState(visible);
  const slide = React.useRef(
    new Animated.Value(animationType === 'slide' ? height : OFFSET_TOP),
  ).current;
  const overlayFade = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const fade = React.useRef(
    new Animated.Value(animationType === 'fade' ? (visible ? 1 : 0) : 1),
  ).current;

  React.useEffect(() => {
    if (animationType !== 'fade') {
      return;
    }
    if (visible) {
      setInternalIsOpen(visible);
      Animated.parallel([
        Animated.spring(fade, {
          toValue: 1,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(overlayFade, {
          toValue: 1,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(overlayFade, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(fade, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [
    animationType,
    overlayFade,
    fade,
    visible,
    internalIsOpen,
    slide,
    height,
    onRequestClose,
  ]);

  React.useEffect(() => {
    if (animationType !== 'slide') {
      return;
    }
    if (visible) {
      setInternalIsOpen(visible);
      Animated.parallel([
        Animated.spring(slide, {
          toValue: OFFSET_TOP,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(overlayFade, {
          toValue: 1,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(overlayFade, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(slide, {
          toValue: height,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [
    animationType,
    overlayFade,
    visible,
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
      visible={visible}
      onRequestClose={onRequestClose}
      onShow={onShow}
      animationType={animationType === 'none' ? 'none' : 'fade'}
      transparent
      onDismiss={onDismiss}
    >
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: overlayFade.interpolate({
              inputRange: [0, 1],
              outputRange: [
                theme.container.color.default,
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
            style,
            {
              backgroundColor: theme.container.color.content,
              opacity: fade,
              transform: [{ translateY: slide }],
            },
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
  dialog: {
    maxHeight: '80%',
    maxWidth: '90%',
    borderRadius: tokens.radius,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
