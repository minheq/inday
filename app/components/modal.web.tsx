import React, { useEffect, useRef, useState } from 'react';
import RModal from 'react-modal';
import type { ModalProps } from './modal';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { tokens } from './tokens';
import { usePrevious } from '../hooks/use_previous';

RModal.setAppElement('#root');

export function Modal(props: ModalProps): JSX.Element {
  const {
    animationType = 'none',
    visible,
    onRequestClose,
    children,
    transparent = false,
    onShow,
    onDismiss,
  } = props;
  const prevVisible = usePrevious(visible);
  const [internalVisible, setInternalIsOpen] = useState(visible);
  const { height } = useWindowDimensions();
  const slide = useRef(
    new Animated.Value(animationType === 'slide' ? height : 0),
  ).current;
  const fade = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (animationType !== 'none') {
      return;
    }

    setInternalIsOpen(visible);
  }, [visible, internalVisible, fade, height, animationType, onRequestClose]);

  useEffect(() => {
    if (animationType !== 'fade' || prevVisible === visible) {
      return;
    }

    if (visible && internalVisible === false) {
      setInternalIsOpen(true);
      Animated.spring(fade, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    } else if (internalVisible === true) {
      Animated.spring(fade, {
        toValue: 1,
        bounciness: 0,
        useNativeDriver: true,
      }).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [
    prevVisible,
    visible,
    internalVisible,
    fade,
    height,
    animationType,
    onRequestClose,
  ]);

  useEffect(() => {
    if (animationType !== 'slide' || prevVisible === visible) {
      return;
    }

    if (visible && internalVisible === false) {
      setInternalIsOpen(true);
      Animated.spring(slide, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    } else if (internalVisible === true) {
      Animated.spring(slide, {
        toValue: height,
        bounciness: 0,
        useNativeDriver: true,
      }).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [
    prevVisible,
    visible,
    internalVisible,
    slide,
    height,
    animationType,
    onRequestClose,
  ]);

  return (
    <RModal
      onAfterOpen={onShow}
      onAfterClose={onDismiss}
      isOpen={internalVisible}
      onRequestClose={onRequestClose}
      shouldReturnFocusAfterClose={false}
      style={{
        content: webStyles.content,
        overlay: webStyles.overlay,
      }}
    >
      <Animated.View
        style={[
          styles.modal,
          transparent && styles.transparent,
          { transform: [{ translateY: slide }] },
        ]}
      >
        {children}
      </Animated.View>
    </RModal>
  );
}

const webStyles = {
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 'none',
    overflow: 'auto',
    borderRadius: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  overlay: {
    backgroundColor: 'transparent',
  },
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: tokens.colors.base.white,
    height: '100%',
    width: '100%',
  },
  transparent: {
    backgroundColor: tokens.colors.base.transparent,
  },
});
