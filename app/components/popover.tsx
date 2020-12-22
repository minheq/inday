import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
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
        <View
          style={[
            styles.popover,
            {
              top: anchor.y,
              left: anchor.x,
            },
          ]}
        >
          {typeof children === 'function'
            ? children({ onRequestClose })
            : children}
        </View>
      </View>
    </Modal>
  );
}

export interface PopoverTriggerMeasurements {
  pageY: number;
  pageX: number;
  height: number;
  width: number;
}

export interface PopoverContentMeasurements {
  height: number;
  width: number;
}

export function getPopoverAnchorAndHeight(
  tm: PopoverTriggerMeasurements,
  cm: PopoverContentMeasurements,
  triggerOffset = 4,
  windowOffset = 16,
): [PopoverAnchor, number] {
  const scaledSize = Dimensions.get('window');

  const bottomY = tm.pageY + tm.height + triggerOffset;
  const topY = tm.pageY - triggerOffset - cm.height;

  const overflowsBottom = bottomY + cm.height > scaledSize.height;

  let anchor: PopoverAnchor = { x: 0, y: 0 };
  let popoverHeight = cm.height;

  if (overflowsBottom) {
    const heightIfBottomY = scaledSize.height - bottomY;
    const heightIfTopY = tm.pageY;

    if (heightIfTopY < heightIfBottomY) {
      anchor = {
        x: tm.pageX,
        y: bottomY,
      };

      if (scaledSize.height - bottomY < cm.height) {
        popoverHeight = scaledSize.height - bottomY - windowOffset;
      }
    } else {
      if (topY < 0) {
        popoverHeight = tm.pageY - windowOffset;
        anchor = {
          x: tm.pageX,
          y: windowOffset,
        };
      } else {
        anchor = {
          x: tm.pageX,
          y: topY,
        };
      }
    }
  } else {
    anchor = {
      x: tm.pageX,
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
