import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { ContextMenuProps } from './context_menu';
import { Popover, getPopoverAnchorAndHeight } from './popover';

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { content, contentHeight, children } = props;
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
        width: 0,
        height: 0,
        pageX: event.clientX,
        pageY: event.clientY,
      };

      const [anchor, popoverHeight] = getPopoverAnchorAndHeight(
        measurements,
        contentHeight,
      );

      setState({
        visible: true,
        anchor,
        height: popoverHeight,
      });
    },
    [contentHeight],
  );

  useEffect(() => {
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
        {typeof content === 'function'
          ? content({ onDismiss: handleRequestClose })
          : content}
      </Popover>
      <View ref={ref}>{children}</View>
    </Fragment>
  );
}
