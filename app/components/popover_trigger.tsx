import React, { useCallback, useState, useRef, Fragment } from 'react';

import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { getPopoverAnchorAndHeight, Popover, PopoverCallback } from './popover';
import { useThemeStyles } from './theme';
import { tokens } from './tokens';

interface PopoverTriggerCallback {
  onOpen: () => void;
  ref: React.RefObject<View>;
}

export interface PopoverTriggerProps {
  children: (callbacks: PopoverTriggerCallback) => React.ReactNode;
  content: React.ReactNode | ((callbacks: PopoverCallback) => React.ReactNode);
  contentHeight: number;
  popoverContainerStyle?: StyleProp<ViewStyle>;
}

export function PopoverTrigger(props: PopoverTriggerProps): JSX.Element {
  const { contentHeight, content, popoverContainerStyle, children } = props;
  const ref = useRef<View>(null);

  const [state, setState] = useState({
    anchor: { x: 0, y: 0 },
    visible: false,
    popoverHeight: 0,
  });

  const handleRequestClose = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      visible: false,
    }));
  }, []);

  const handleOpen = useCallback(() => {
    if (ref.current !== null) {
      ref.current.measure((x, y, width, _height, pageX, pageY) => {
        const measurements = { width, height: _height, pageX, pageY };

        const [anchor, popoverHeight] = getPopoverAnchorAndHeight(
          measurements,
          contentHeight,
        );

        setState({
          visible: true,
          anchor,
          popoverHeight,
        });
      });
    }
  }, [ref, contentHeight]);

  return (
    <Fragment>
      {children({ onOpen: handleOpen, ref })}
      <Popover
        anchor={state.anchor}
        visible={state.visible}
        onRequestClose={handleRequestClose}
      >
        {({ onRequestClose }) => (
          <PopoverContainer popoverContainerStyle={popoverContainerStyle}>
            {typeof content === 'function'
              ? content({ onRequestClose })
              : content}
          </PopoverContainer>
        )}
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
    padding: 8,
    borderRadius: tokens.border.radius,
    borderWidth: 1,
  },
});
