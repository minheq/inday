import React from 'react';
import RModal from 'react-modal';
import type { ModalProps } from './modal';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';

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
  const [internalVisible, setInternalIsOpen] = React.useState(visible);
  const { height } = useWindowDimensions();
  const slide = React.useRef(
    new Animated.Value(animationType === 'slide' ? height : 0),
  ).current;
  const fade = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  React.useEffect(() => {
    if (animationType !== 'none') {
      return;
    }

    setInternalIsOpen(visible);
  }, [visible, internalVisible, fade, height, animationType, onRequestClose]);

  React.useEffect(() => {
    if (animationType !== 'fade') {
      return;
    }

    if (visible) {
      setInternalIsOpen(visible);
      Animated.spring(fade, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(fade, {
        toValue: 1,
        bounciness: 0,
        useNativeDriver: true,
      }).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [visible, internalVisible, fade, height, animationType, onRequestClose]);

  React.useEffect(() => {
    if (animationType !== 'slide') {
      return;
    }

    if (visible) {
      setInternalIsOpen(visible);
      Animated.spring(slide, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slide, {
        toValue: height,
        bounciness: 0,
        useNativeDriver: true,
      }).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [visible, internalVisible, slide, height, animationType, onRequestClose]);

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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: '100%',
    width: '100%',
  },
  transparent: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
});
