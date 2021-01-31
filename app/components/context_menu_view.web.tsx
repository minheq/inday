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

import { ContextMenuViewProps } from './context_menu_view';
import { ContextMenu, CONTEXT_MENU_ITEM_HEIGHT } from './context_menu';
import { PopoverOverlay, getPopoverAnchorAndHeight } from './popover';
import { tokens } from './tokens';
import { useThemeStyles } from './theme';

export const ContextMenuView = memo(function ContextMenuView(
  props: ContextMenuViewProps,
): JSX.Element {
  const { menuItems, children, style, width = 240 } = props;
  const themeStyles = useThemeStyles();
  const contentHeight = useMemo((): number => {
    return menuItems.length * CONTEXT_MENU_ITEM_HEIGHT;
  }, [menuItems]);
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
      <PopoverOverlay
        anchor={state.anchor}
        onRequestClose={handleRequestClose}
        visible={state.visible}
      >
        <View
          style={[
            styles.popoverContainer,
            themeStyles.background.content,
            themeStyles.border.default,
            themeStyles.elevation.level1,
            { height: state.height },
          ]}
        >
          <ContextMenu
            onPressMenuItem={handleRequestClose}
            width={width}
            menuItems={menuItems}
          />
        </View>
      </PopoverOverlay>
      <View style={style} ref={ref}>
        {children}
      </View>
    </Fragment>
  );
});

const styles = StyleSheet.create({
  popoverContainer: {
    borderWidth: 1,
    padding: 8,
    borderRadius: tokens.border.radius,
  },
});
