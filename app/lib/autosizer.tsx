import React, { useCallback, useReducer } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { assertUnreached } from '../../lib/lang_utils';

interface AutoSizerProps {
  /**
   * If true, width can only resize to greater value than the initial width after mount.
   */
  resizeGreaterWidthOnly?: boolean;
  /**
   * If true, height can only resize to greater value than the initial height after mount.
   */
  resizeGreaterHeightOnly?: boolean;
  children: (size: { width: number; height: number }) => React.ReactNode;
}

interface State {
  ready: boolean;
  height: number;
  width: number;
}

type Action =
  | { type: 'SET_INITIAL'; width: number; height: number }
  | { type: 'RESIZE'; width: number; height: number }
  | { type: 'RESIZE_WIDTH'; width: number }
  | { type: 'RESIZE_HEIGHT'; height: number };

function reducer(prevState: State, action: Action): State {
  switch (action.type) {
    case 'SET_INITIAL':
      return {
        ...prevState,
        ready: true,
        width: action.width,
        height: action.height,
      };
    case 'RESIZE':
      return {
        ...prevState,
        width: action.width,
        height: action.height,
      };
    case 'RESIZE_WIDTH':
      return {
        ...prevState,
        width: action.width,
      };
    case 'RESIZE_HEIGHT':
      return {
        ...prevState,
        height: action.height,
      };
    default:
      assertUnreached(action);
  }
}

const initialState: State = {
  ready: false,
  height: 0,
  width: 0,
};

export function AutoSizer(props: AutoSizerProps): JSX.Element {
  const { children, resizeGreaterWidthOnly, resizeGreaterHeightOnly } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { ready, width, height } = state;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!ready) {
        dispatch({
          type: 'SET_INITIAL',
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        });
        return;
      }

      const resizeWidth = resizeGreaterWidthOnly
        ? event.nativeEvent.layout.width > width
        : true;
      const resizeHeight = resizeGreaterHeightOnly
        ? event.nativeEvent.layout.height > height
        : true;

      if (resizeWidth && resizeHeight) {
        dispatch({
          type: 'RESIZE',
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        });
      } else if (resizeWidth) {
        dispatch({
          type: 'RESIZE_WIDTH',
          width: event.nativeEvent.layout.width,
        });
      } else if (resizeHeight) {
        dispatch({
          type: 'RESIZE_HEIGHT',
          height: event.nativeEvent.layout.height,
        });
      }
    },
    [ready, resizeGreaterWidthOnly, resizeGreaterHeightOnly, width, height],
  );

  return (
    <View onLayout={handleLayout} style={styles.base}>
      {ready && children({ width, height })}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: '100%',
  },
});
