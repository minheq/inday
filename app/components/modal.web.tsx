import React from 'react';
import RModal from 'react-modal';
import type { ModalProps } from './modal';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';

RModal.setAppElement('#root');

export function Modal(props: ModalProps) {
  const {
    isOpen,
    onRequestClose = () => {},
    children,
    transparent = false,
    onShow,
  } = props;
  const [internalIsOpen, setInternalIsOpen] = React.useState(isOpen);
  const { height } = useWindowDimensions();
  const slide = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (isOpen) {
      setInternalIsOpen(isOpen);
      Animated.spring(slide, {
        toValue: 0,
        bounciness: 0,
        speed: 24,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slide, {
        toValue: height,
        bounciness: 0,
        speed: 24,
        useNativeDriver: true,
      }).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [isOpen, internalIsOpen, slide, height, onRequestClose]);

  return (
    <RModal
      onAfterOpen={onShow}
      isOpen={internalIsOpen}
      onRequestClose={onRequestClose}
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
    backgroundColor: 'rgba(255,255,255,1)',
    height: '100%',
    width: '100%',
  },
  transparent: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
