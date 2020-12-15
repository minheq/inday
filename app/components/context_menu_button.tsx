import React, { useMemo } from 'react';
import { ButtonProps } from './button';
import {
  ContextMenuContent,
  ContextMenuItem,
  CONTEXT_MENU_ITEM_HEIGHT,
} from './context_menu_content';
import { PopoverButton } from './popover_button';

interface ContextMenuButtonProps extends ButtonProps {
  options: ContextMenuItem[];
  width?: number;
}

export function ContextMenuButton(props: ContextMenuButtonProps): JSX.Element {
  const {
    width,
    options,
    onPress,
    disabled,
    style,
    containerStyle,
    children,
  } = props;

  const contentHeight = useMemo((): number => {
    return options.length * CONTEXT_MENU_ITEM_HEIGHT;
  }, [options]);

  return (
    <PopoverButton
      content={({ onRequestClose }) => (
        <ContextMenuContent
          onPressed={onRequestClose}
          options={options}
          width={width}
        />
      )}
      contentHeight={contentHeight}
      onPress={onPress}
      disabled={disabled}
      style={style}
      containerStyle={containerStyle}
    >
      {children}
    </PopoverButton>
  );
}
