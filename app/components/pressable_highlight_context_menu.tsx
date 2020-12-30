import React from 'react';
import { PressableHighlightProps } from './pressable_highlight';
import { ContextMenuView, ContextMenuItem } from './context_menu_view';
import { PressableHighlightPopover } from './pressable_highlight_popover';

interface PressableHighlightContextMenuProps extends PressableHighlightProps {
  options: ContextMenuItem[];
  width?: number;
}

export function PressableHighlightContextMenu(
  props: PressableHighlightContextMenuProps,
): JSX.Element {
  const { width, options, ...pressableHighlightProps } = props;

  return (
    <PressableHighlightPopover
      content={({ onRequestClose }) => (
        <ContextMenuView
          onPressed={onRequestClose}
          options={options}
          width={width}
        />
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...pressableHighlightProps}
    />
  );
}
