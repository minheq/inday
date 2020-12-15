import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from './button';
import { ContextMenuItem, ContextMenuProps } from './context_menu';
import { Popover, getPopoverAnchorAndHeight } from './popover';
import { Text } from './text';
import { tokens } from './tokens';

const ITEM_HEIGHT = 32;

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { options, children } = props;
  const contentHeight = useMemo((): number => {
    return options.length * ITEM_HEIGHT;
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
        <View style={styles.wrapper}>
          <ScrollView>
            {options.map((option) => (
              <ContextMenuButton
                onDismiss={handleRequestClose}
                key={option.label}
                option={option}
              />
            ))}
          </ScrollView>
        </View>
      </Popover>
      <View ref={ref}>{children}</View>
    </Fragment>
  );
}

interface ContextMenuButtonProps {
  option: ContextMenuItem;
  onDismiss: () => void;
}

function ContextMenuButton(props: ContextMenuButtonProps) {
  const { option, onDismiss } = props;
  const { onPress, weight, color, label } = option;

  const handlePress = useCallback(() => {
    if (onPress !== undefined) {
      onPress();
    }
    onDismiss();
  }, [onDismiss, onPress]);

  return (
    <Button key={label} onPress={handlePress} style={styles.button}>
      <Text weight={weight} color={color}>
        {label}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: tokens.border.radius.default,
    overflow: 'hidden',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    paddingHorizontal: 8,
  },
});
