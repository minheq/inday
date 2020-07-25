import React from 'react';
import { Animated, StyleSheet, View, findNodeHandle } from 'react-native';
import { tokens, useTheme } from '../../components/theme';
import { measure } from '../../utils/measurements';
import { useEditor } from './editor';
import { LinkValue } from './editable/nodes/link';
import { SelectionToolbar } from './selection_toolbar';
import { usePrevious } from '../../hooks/use_previous';
import { LinkToolbar } from './link_toolbar';

export interface HoverableToolbarData {
  type: 'toolbar';
}

export interface HoverableLinkData {
  type: 'link';
  data: LinkValue;
}

export type Hoverable = HoverableToolbarData | HoverableLinkData;

export interface State {
  isVisible: boolean;
  hoverable: Hoverable | null;
  position: Animated.ValueXY;
  opacity: Animated.Value;
}

const initialState: State = {
  isVisible: false,
  hoverable: null,
  position: new Animated.ValueXY(),
  opacity: new Animated.Value(0),
};

export function Hoverable() {
  const theme = useTheme();
  const editor = useEditor();
  const ref = React.useRef<View | null>(null);
  const [state, setState] = React.useState<State>(initialState);
  const { selection, measurements } = editor;
  const prevSelection = usePrevious(selection);

  const getPosition = React.useCallback(async () => {
    if (!selection || !ref.current) {
      throw new Error('Selection and node expected');
    }

    const handle = findNodeHandle(ref.current);

    if (!handle) {
      throw new Error('Node handle not found');
    }

    const { width, height } = await measure(ref);
    const y = selection.top - measurements.pageY - height - 4;
    const x =
      selection.left - measurements.pageX + selection.width / 2 - width / 2;

    return { x, y };
  }, [selection, measurements]);

  const show = React.useCallback(
    async (hoverable: Hoverable) => {
      // If there was no change in selection, early return
      if (state.isVisible) {
        const position = await getPosition();
        state.position.setValue(position);
        return;
      }

      // Set hoverable state first so that we can measure its dimensions
      const newState: State = {
        hoverable,
        isVisible: true,
        position: new Animated.ValueXY(),
        opacity: new Animated.Value(0),
      };
      setState(newState);

      // Update its position
      const position = await getPosition();
      newState.position.setValue(position);

      Animated.timing(newState.opacity, {
        toValue: 1,
        useNativeDriver: true,
        duration: 100,
      }).start();
    },
    [getPosition, state],
  );

  const hide = React.useCallback(() => {
    if (!state.isVisible) {
      return;
    }

    Animated.timing(state.opacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      setState(initialState);
    });
  }, [state]);

  React.useEffect(() => {
    if (!ref.current || !selection) {
      return;
    }

    if (selection.height === 0 || selection.width === 0) {
      hide();
      return;
    }

    if (selection.dragging) {
      hide();
      return;
    }

    // If the selection has changed, hide previous hoverable first
    if (
      prevSelection &&
      selection &&
      prevSelection.link === null &&
      selection.link
    ) {
      hide();
    }

    if (selection.link) {
      show({
        type: 'link',
        data: selection.link,
      });
    } else {
      show({
        type: 'toolbar',
      });
    }
  }, [selection, prevSelection, show, hide, state]);

  return (
    <Animated.View
      style={[
        styles.hoverable,
        theme.container.shadow,
        {
          borderColor: theme.border.color.default,
          backgroundColor: theme.container.color.content,
          transform: [
            { translateX: state.position.x },
            { translateY: state.position.y },
          ],
          opacity: state.opacity,
        },
      ]}
    >
      <View testID="hello" ref={ref}>
        {state.hoverable?.type === 'link' && (
          <LinkToolbar value={state.hoverable.data} />
        )}
        {state.hoverable?.type === 'toolbar' && <SelectionToolbar />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hoverable: {
    position: 'absolute',
    borderRadius: tokens.radius,
    zIndex: 1,
    borderWidth: 1,
  },
  placeholder: {
    position: 'absolute',
    zIndex: -1,
  },
});
