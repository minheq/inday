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

/**
 * Gets the anchor and height of the popover.
 *
 * TODO: Should convert this into test...
 * If the content overflows the whole height of the window, cap the height to window size
 * If the content overflows bottom of window from the bottom of the trigger, try to display content above the trigger
 * If the content still overflow top of window, try to display the content
 */
export function getPopoverAnchorAndHeight(
  tm: PopoverTriggerMeasurements,
  cm: PopoverContentMeasurements,
  triggerOffset = 4,
  windowOffset = 16,
): [PopoverAnchor, number] {
  const windowSize = Dimensions.get('window');
  const triggerBottomY = tm.pageY + tm.height + triggerOffset;
  const triggerTopY = tm.pageY - triggerOffset;

  let height = cm.height;
  let y = 0;
  let x = 0;

  const overflowsWindowHeight =
    cm.height > windowSize.height - windowOffset * 2;
  const overflowsWindowBottom = triggerBottomY + cm.height > windowSize.height;

  if (overflowsWindowHeight) {
    y = windowOffset;
    height = windowSize.height - windowOffset * 2;
    // Overflow bottom from trigger's triggerBottomY
  } else if (overflowsWindowBottom) {
    const overflowsWindowTop = triggerTopY < cm.height;

    if (overflowsWindowTop) {
      y = windowSize.height - windowOffset - cm.height;
    } else {
      y = triggerTopY - triggerOffset - cm.height;
    }
  } else {
    y = triggerBottomY;
  }

  x = tm.pageX;

  const overflowsWindowRight =
    windowSize.width - windowOffset - tm.pageX < cm.width;

  if (overflowsWindowRight) {
    x = windowSize.width - cm.width - windowOffset;
  }

  return [{ x, y }, height];
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
