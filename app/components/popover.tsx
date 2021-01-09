import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { tokens } from './tokens';
import { Modal } from './modal';
import { assertUnreached } from '../../lib/lang_utils';
import { usePrevious } from '../hooks/use_previous';
import { useThemeStyles } from './theme';

export interface PopoverProps {
  visible: boolean;
  targetRef: React.RefObject<View>;
  content: React.ReactNode;
  onRequestClose: () => void;
}

interface State {
  anchor: PopoverOverlayAnchor;
  ready: boolean;
  actuallyVisible: boolean;
  height: number | undefined;
  tm: PopoverTriggerMeasurements;
  cm: PopoverContentMeasurements;
}

type Action =
  | { type: 'READY'; tm: PopoverTriggerMeasurements }
  | {
      type: 'VISIBLE';
      anchor: PopoverOverlayAnchor;
      height: number;
      cm: PopoverContentMeasurements;
    }
  | { type: 'CLOSE' };

function reducer(prevState: State, action: Action): State {
  switch (action.type) {
    case 'READY':
      return {
        ...prevState,
        ready: true,
        tm: action.tm,
      };
    case 'VISIBLE':
      return {
        ...prevState,
        actuallyVisible: true,
        anchor: action.anchor,
        cm: action.cm,
        height: action.height,
      };
    case 'CLOSE':
      return {
        ...prevState,
        ready: false,
        actuallyVisible: false,
        height: undefined,
      };
    default:
      assertUnreached(action);
  }
}

const initialState: State = {
  anchor: { x: 0, y: 0 },
  height: undefined,
  ready: false,
  actuallyVisible: false,
  tm: { pageX: 0, pageY: 0, width: 0, height: 0 },
  cm: { width: 0, height: 0 },
};

export function Popover(props: PopoverProps): JSX.Element {
  const { content, visible, onRequestClose, targetRef } = props;
  const contentRef = useRef<View>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const [state, dispatch] = useReducer(reducer, initialState);
  const themeStyles = useThemeStyles();
  const prevVisible = usePrevious(visible);
  const { ready, actuallyVisible, anchor, height, tm } = state;

  const handleHide = useCallback(() => {
    opacity.setValue(0);
    dispatch({ type: 'CLOSE' });
  }, [opacity]);

  const handleOpen = useCallback(() => {
    if (targetRef.current !== null) {
      targetRef.current.measure((tX, tY, tWidth, tHeight, tPageX, tPageY) => {
        dispatch({
          type: 'READY',
          tm: { width: tWidth, height: tHeight, pageX: tPageX, pageY: tPageY },
        });
      });
    }
  }, [targetRef]);

  const handleLayout = useCallback(() => {
    if (ready && !actuallyVisible && contentRef.current !== null) {
      contentRef.current.measure((cX, cY, cWidth, cHeight) => {
        const _cm = { width: cWidth, height: cHeight };
        const [pAnchor, pHeight] = getPopoverAnchorAndHeight(tm, _cm);

        dispatch({
          type: 'VISIBLE',
          anchor: pAnchor,
          height: pHeight,
          cm: _cm,
        });
      });
    }
  }, [tm, ready, actuallyVisible]);

  useEffect(() => {
    if (actuallyVisible) {
      Animated.spring(opacity, {
        toValue: 1,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [actuallyVisible, opacity]);

  useEffect(() => {
    if (prevVisible === visible) {
      return;
    }

    if (visible) {
      handleOpen();
    } else {
      handleHide();
    }
  }, [visible, prevVisible, handleOpen, handleHide]);

  return (
    <PopoverOverlay
      anchor={anchor}
      visible={ready}
      onRequestClose={onRequestClose}
    >
      <Animated.View
        onLayout={handleLayout}
        ref={contentRef}
        style={[
          styles.popoverContainer,
          themeStyles.background.content,
          themeStyles.border.default,
          themeStyles.elevation.level1,
          { opacity, height },
        ]}
      >
        {typeof content === 'function' ? content({ onRequestClose }) : content}
      </Animated.View>
    </PopoverOverlay>
  );
}

interface PopoverOverlayAnchor {
  y: number;
  x: number;
}

interface PopoverOverlayCallback {
  onRequestClose: () => void;
}

interface PopoverOverlayProps {
  visible: boolean;
  onRequestClose: () => void;
  onShow?: () => void;
  children:
    | React.ReactNode
    | ((callback: PopoverOverlayCallback) => React.ReactNode);
  anchor: PopoverOverlayAnchor;
}

function PopoverOverlay(props: PopoverOverlayProps): JSX.Element {
  const { visible, onShow, onRequestClose, anchor, children } = props;

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
): [PopoverOverlayAnchor, number] {
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
  popoverContainer: {
    borderWidth: 1,
    padding: 8,
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
