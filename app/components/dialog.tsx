import React from 'react';
import {
  Animated,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
  Pressable,
} from 'react-native';
import { Modal, ModalProps } from './modal';
import { tokens } from './tokens';
import { DynamicStyleSheet } from './stylesheet';
import { isNonNullish } from '../../lib/js_utils';

const OFFSET_TOP = 64;

interface DialogProps extends ModalProps {
  style?: StyleProp<ViewStyle>;
}

// TODO: Add 'fade' and 'none' animationType handlers
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
  const [internalVisible, setInternalVisible] = React.useState(visible);
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
      setInternalVisible(visible);
      Animated.parallel([
        Animated.spring(fade, {
          toValue: 1,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
        Animated.spring(overlayFade, {
          toValue: 1,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(overlayFade, {
          toValue: 0,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
        Animated.spring(fade, {
          toValue: 0,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false);
      });
    }
  }, [
    animationType,
    overlayFade,
    fade,
    visible,
    internalVisible,
    slide,
    height,
    onRequestClose,
  ]);

  React.useEffect(() => {
    if (animationType !== 'slide') {
      return;
    }
    if (visible) {
      setInternalVisible(visible);
      Animated.parallel([
        Animated.spring(slide, {
          toValue: OFFSET_TOP,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
        Animated.spring(overlayFade, {
          toValue: 1,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(overlayFade, {
          toValue: 0,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
        Animated.spring(slide, {
          toValue: height,
          bounciness: tokens.animation.spring.bounciness,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false);
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

  const handlePressBackground = React.useCallback(() => {
    if (isNonNullish(onRequestClose)) {
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

const styles = DynamicStyleSheet.create((theme) => ({
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
    backgroundColor: theme.background.content,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));
