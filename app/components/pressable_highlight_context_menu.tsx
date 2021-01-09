import React, { Fragment } from 'react';
import { PressableHighlightProps } from './pressable_highlight';
import { ContextMenuView, ContextMenuItem } from './context_menu_view';

interface PressableHighlightContextMenuProps extends PressableHighlightProps {
  options: ContextMenuItem[];
  width?: number;
}

export function PressableHighlightContextMenu(
  props: PressableHighlightContextMenuProps,
): JSX.Element {
  const { width, options, ...pressableHighlightProps } = props;

  return <Fragment />;
}
