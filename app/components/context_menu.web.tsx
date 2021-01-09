import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet } from 'react-native';

import { ContextMenuProps } from './context_menu';
import { ContextMenuView, CONTEXT_MENU_ITEM_HEIGHT } from './context_menu_view';
import { Popover, getPopoverAnchorAndHeight } from './popover';
import { useThemeStyles } from './theme';
import { tokens } from './tokens';

export const ContextMenu = memo(function ContextMenu(
  props: ContextMenuProps,
): JSX.Element {
  const { options, children, width = 240 } = props;
  const contentHeight = useMemo((): number => {
    return options.length * CONTEXT_MENU_ITEM_HEIGHT;
  }, [options]);
  const ref = useRef<View>(null);
  const [state, setState] = useState({
    visible: false,
    height: 0,
    anchor: { x: 0, y: 0 },
  });

  const handleOpenContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      const measurements = {
        width,
        height: 0,
        pageX: event.clientX,
        pageY: event.clientY,
      };

      const [anchor, popoverHeight] = getPopoverAnchorAndHeight(measurements, {
        width,
        height: contentHeight + 16, // padding
      });

      setState({
        visible: true,
        anchor,
        height: popoverHeight,
      });
    },
    [contentHeight, width],
  );

  useEffect(() => {
    // @ts-ignore: View implementation uses `div`
    const node = ref.current as HTMLDivElement;
    if (node !== null) {
      node.addEventListener('contextmenu', handleOpenContextMenu);
    }

    return () => {
      if (node !== null) {
        node.removeEventListener('contextmenu', handleOpenContextMenu);
      }
    };
  }, [handleOpenContextMenu]);

  const handleRequestClose = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      visible: false,
    }));
  }, []);

  return (
    <Fragment>
      <Popover
        onRequestClose={handleRequestClose}
        anchor={state.anchor}
        visible={state.visible}
      >
        <PopoverContainer>
          <ContextMenuView
            onPressed={handleRequestClose}
            width={width}
            options={options}
          />
        </PopoverContainer>
      </Popover>
      <View ref={ref}>{children}</View>
    </Fragment>
  );
});

interface PopoverContainerProps {
  children: React.ReactNode;
}

function PopoverContainer(props: PopoverContainerProps): JSX.Element {
  const { children } = props;
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.popoverContainer,
        themeStyles.background.content,
        themeStyles.elevation.level1,
        themeStyles.border.default,
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
