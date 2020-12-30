import React, {
  forwardRef,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from './theme';

export interface PressableHighlightProps extends PressableProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface PressableStateCallback {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}

export const PressableHighlight = forwardRef<View, PressableHighlightProps>(
  function PressableHighlight(props, ref): JSX.Element {
    const { children, style, ...restProps } = props;
    const theme = useTheme();
    const [state, setState] = useState<PressableStateCallback>({
      hovered: false,
      pressed: false,
      focused: false,
    });

    const pressedStyle = useMemo((): StyleProp<ViewStyle> => {
      const { hovered, pressed } = state;
      let backgroundColor = theme.button.flatDefault;

      if (hovered) {
        backgroundColor = theme.button.flatHovered;
      } else if (pressed) {
        backgroundColor = theme.button.flatPressed;
      }

      return [{ backgroundColor }, style];
    }, [state, theme, style]);

    return (
      <Pressable
        ref={ref}
        style={[pressedStyle, style]}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
      >
        {(_state: PressableStateCallback) => (
          <Fragment>
            <PressableStateCallback state={_state} onStateChange={setState} />
            {children}
          </Fragment>
        )}
      </Pressable>
    );
  },
);

interface PressableStateCallbackProps {
  state: PressableStateCallback;
  onStateChange: (state: PressableStateCallback) => void;
}

function PressableStateCallback(
  props: PressableStateCallbackProps,
): JSX.Element {
  const { state, onStateChange } = props;

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  return <Fragment />;
}
