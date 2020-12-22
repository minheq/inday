import React, {
  useCallback,
  useRef,
  Fragment,
  useEffect,
  useReducer,
} from 'react';

import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { assertUnreached } from '../../lib/lang_utils';
import {
  getPopoverAnchorAndHeight,
  Popover,
  PopoverAnchor,
  PopoverCallback,
  PopoverContentMeasurements,
  PopoverTriggerMeasurements,
} from './popover';
import { useThemeStyles } from './theme';
import { tokens } from './tokens';

interface PopoverTriggerCallback {
  onOpen: () => void;
  ref: React.RefObject<View>;
}

export interface PopoverTriggerProps {
  children: (callbacks: PopoverTriggerCallback) => React.ReactNode;
  content: React.ReactNode | ((callbacks: PopoverCallback) => React.ReactNode);
  popoverContainerStyle?: StyleProp<ViewStyle>;
}

interface State {
  anchor: PopoverAnchor;
  ready: boolean;
  visible: boolean;
  height: number | undefined;
  tm: PopoverTriggerMeasurements;
  cm: PopoverContentMeasurements;
}

type Action =
  | { type: 'READY'; tm: PopoverTriggerMeasurements }
  | {
      type: 'VISIBLE';
      anchor: PopoverAnchor;
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
        visible: true,
        anchor: action.anchor,
        cm: action.cm,
        height: action.height,
      };
    case 'CLOSE':
      return {
        ...prevState,
        ready: false,
        visible: false,
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
  visible: false,
  tm: { pageX: 0, pageY: 0, width: 0, height: 0 },
  cm: { width: 0, height: 0 },
};

export function PopoverTrigger(props: PopoverTriggerProps): JSX.Element {
  const { content, popoverContainerStyle, children } = props;
  const ref = useRef<View>(null);
  const contentRef = useRef<View>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { ready, visible, anchor, height, tm } = state;
  const handleRequestClose = useCallback(() => {
    opacity.setValue(0);
    dispatch({ type: 'CLOSE' });
  }, [opacity]);

  const handleOpen = useCallback(() => {
    if (ref.current !== null) {
      ref.current.measure((tX, tY, tWidth, tHeight, tPageX, tPageY) => {
        dispatch({
          type: 'READY',
          tm: { width: tWidth, height: tHeight, pageX: tPageX, pageY: tPageY },
        });
      });
    }
  }, [ref]);

  const handleLayout = useCallback(() => {
    if (ready && !visible && contentRef.current !== null) {
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
  }, [tm, ready, visible]);

  useEffect(() => {
    if (visible) {
      Animated.spring(opacity, {
        toValue: 1,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, opacity]);

  return (
    <Fragment>
      {children({ onOpen: handleOpen, ref })}
      <Popover
        anchor={anchor}
        visible={ready}
        onRequestClose={handleRequestClose}
      >
        <Animated.View
          onLayout={handleLayout}
          ref={contentRef}
          style={{ opacity, height }}
        >
          <PopoverContainer popoverContainerStyle={popoverContainerStyle}>
            {typeof content === 'function'
              ? content({ onRequestClose: handleRequestClose })
              : content}
          </PopoverContainer>
        </Animated.View>
      </Popover>
    </Fragment>
  );
}

interface PopoverContainerProps {
  children: React.ReactNode;
  popoverContainerStyle?: StyleProp<ViewStyle>;
}

export function PopoverContainer(props: PopoverContainerProps): JSX.Element {
  const { popoverContainerStyle, children } = props;
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.popoverContainer,
        themeStyles.background.content,
        themeStyles.elevation.level1,
        themeStyles.border.default,
        popoverContainerStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  popoverContainer: {
    flex: 1,
    padding: 8,
    borderRadius: tokens.border.radius,
    borderWidth: 1,
  },
});
