import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
} from 'react-native';
import { tokens } from './tokens';
import { Modal } from './modal';

export interface PopoverAnchor {
  y: number;
  x: number;
}
export interface PopoverCallback {
  onRequestClose: () => void;
}
interface PopoverProps {
  visible: boolean;
  onRequestClose: () => void;
  onShow?: () => void;
  children: React.ReactNode | ((callback: PopoverCallback) => React.ReactNode);
  anchor: PopoverAnchor;
}

export function Popover(props: PopoverProps): JSX.Element {
  const { visible = false, onShow, onRequestClose, anchor, children } = props;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(opacity, {
      toValue: visible ? 1 : 0,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

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
      animationType="none"
      transparent
    >
      <View style={styles.base}>
        <Pressable
          accessible={false}
          style={styles.background}
          onPress={handlePressBackground}
        />
        <Animated.View
          style={[
            styles.popover,
            {
              top: anchor.y,
              left: anchor.x,
              opacity,
            },
          ]}
        >
          {typeof children === 'function'
            ? children({ onRequestClose })
            : children}
        </Animated.View>
      </View>
    </Modal>
  );
}

interface OpenerMeasurements {
  pageY: number;
  pageX: number;
  height: number;
  width: number;
}

export function getPopoverAnchorAndHeight(
  measurements: OpenerMeasurements,
  contentHeight: number,
  pickerOffset = 4,
  screenOffset = 16,
): [PopoverAnchor, number] {
  const screenSize = Dimensions.get('window');

  const bottomY = measurements.pageY + measurements.height + pickerOffset;
  const topY = measurements.pageY - pickerOffset - contentHeight;

  const overflowsBottom = bottomY + contentHeight > screenSize.height;

  let anchor: PopoverAnchor = { x: 0, y: 0 };
  let popoverHeight = contentHeight;

  if (overflowsBottom) {
    const heightIfBottomY = screenSize.height - bottomY;
    const heightIfTopY = measurements.pageY;

    if (heightIfTopY < heightIfBottomY) {
      anchor = {
        x: measurements.pageX,
        y: bottomY,
      };

      if (screenSize.height - bottomY < contentHeight) {
        popoverHeight = screenSize.height - bottomY - screenOffset;
      }
    } else {
      if (topY < 0) {
        popoverHeight = measurements.pageY - screenOffset;
        anchor = {
          x: measurements.pageX,
          y: screenOffset,
        };
      } else {
        anchor = {
          x: measurements.pageX,
          y: topY,
        };
      }
    }
  } else {
    anchor = {
      x: measurements.pageX,
      y: bottomY,
    };
  }

  return [anchor, popoverHeight];
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
