import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Modal, ModalProps } from './modal';
import { tokens } from './tokens';

const OFFSET_TOP = 64;

interface DialogProps extends ModalProps {
  style?: StyleProp<ViewStyle>;
}

export function Dialog(props: DialogProps): JSX.Element {
  const {
    visible,
    onRequestClose,
    onShow,
    onDismiss,
    animationType = 'none',
    style,
    children,
  } = props;
  const { height } = useWindowDimensions();
  const [internalVisible, setInternalVisible] = useState(visible);
  const slide = useRef(
    new Animated.Value(animationType === 'slide' ? height : OFFSET_TOP),
  ).current;
  const overlayFade = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const opacity = useRef(
    new Animated.Value(animationType === 'fade' ? (visible ? 1 : 0) : 1),
  ).current;

  useEffect(() => {
    if (animationType !== 'none') {
      return;
    }

    if (visible) {
      setInternalVisible(visible);

      opacity.setValue(1);
      overlayFade.setValue(1);
    } else {
      setInternalVisible(false);
      opacity.setValue(0);
      overlayFade.setValue(0);
    }
  }, [
    animationType,
    overlayFade,
    opacity,
    visible,
    internalVisible,
    slide,
    height,
    onRequestClose,
  ]);

  useEffect(() => {
    if (animationType !== 'fade') {
      return;
    }

    if (visible) {
      setInternalVisible(visible);

      Animated.parallel([
        Animated.spring(opacity, {
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
        Animated.spring(opacity, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start((animation) => {
        if (animation.finished) {
          setInternalVisible(false);
        }
      });
    }
  }, [
    animationType,
    overlayFade,
    opacity,
    visible,
    internalVisible,
    slide,
    height,
    onRequestClose,
  ]);

  useEffect(() => {
    if (animationType !== 'slide') {
      return;
    }
    if (visible) {
      setInternalVisible(visible);
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
      ]).start((animation) => {
        if (animation.finished) {
          setInternalVisible(false);
        }
      });
    }
  }, [
    animationType,
    overlayFade,
    visible,
    internalVisible,
    slide,
    height,
    onRequestClose,
  ]);

  const handlePressBackground = useCallback(() => {
    if (onRequestClose !== undefined) {
      onRequestClose();
    }
  }, [onRequestClose]);

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
              outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)'],
            }),
          },
        ]}
      >
        <Pressable
          accessible={false}
          style={styles.background}
          onPress={handlePressBackground}
        />
        <Animated.View
          style={[
            styles.dialog,
            style,
            {
              opacity,
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
    borderRadius: tokens.border.radius,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
