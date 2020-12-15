import React, { useCallback, useState, useRef, Fragment } from 'react';

import { View } from 'react-native';
import { Popover, getPopoverAnchorAndHeight, PopoverCallback } from './popover';
import { Button, ButtonProps } from './button';

export interface PopoverButtonProps extends ButtonProps {
  content: React.ReactNode | ((callbacks: PopoverCallback) => React.ReactNode);
  contentHeight: number;
}

export function PopoverButton(props: PopoverButtonProps): JSX.Element {
  const {
    contentHeight,
    content,
    onPress,
    disabled,
    children,
    style,
    containerStyle,
  } = props;
  const ref = useRef<View>(null);

  const [state, setState] = useState({
    anchor: { x: 0, y: 0 },
    visible: false,
    buttonWidth: 0,
    popoverHeight: 0,
  });

  const handleRequestClose = useCallback(() => {
    setState((prevPopoverButton) => ({
      ...prevPopoverButton,
      visible: false,
    }));
  }, []);

  const handlePress = useCallback(() => {
    if (ref.current !== null) {
      ref.current.measure((x, y, width, _height, pageX, pageY) => {
        const measurements = { width, height: _height, pageX, pageY };

        const [anchor, popoverHeight] = getPopoverAnchorAndHeight(
          measurements,
          contentHeight,
        );

        setState({
          visible: true,
          buttonWidth: measurements.width,
          anchor,
          popoverHeight,
        });
      });
    }

    if (onPress !== undefined) {
      onPress();
    }
  }, [ref, contentHeight, onPress]);

  return (
    <Fragment>
      <View ref={ref}>
        <Button
          onPress={handlePress}
          disabled={disabled}
          style={style}
          containerStyle={containerStyle}
        >
          {children}
        </Button>
      </View>
      <Popover
        anchor={state.anchor}
        visible={state.visible}
        onRequestClose={handleRequestClose}
      >
        {content}
      </Popover>
    </Fragment>
  );
}
