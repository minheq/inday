import React from 'react';

import { PopoverCallback } from './popover';
import { Button, ButtonProps } from './button';
import { PopoverTrigger } from './popover_trigger';
import { StyleProp, ViewStyle } from 'react-native';

export interface PopoverButtonProps extends ButtonProps {
  content: React.ReactNode | ((callbacks: PopoverCallback) => React.ReactNode);
  contentHeight: number;
  popoverContainerStyle?: StyleProp<ViewStyle>;
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
    popoverContainerStyle,
  } = props;

  return (
    <PopoverTrigger
      content={content}
      contentHeight={contentHeight}
      popoverContainerStyle={popoverContainerStyle}
    >
      {({ ref, onOpen }) => (
        <Button
          ref={ref}
          onPress={() => {
            if (onPress !== undefined) {
              onPress();
            }

            onOpen();
          }}
          disabled={disabled}
          style={style}
          containerStyle={containerStyle}
        >
          {children}
        </Button>
      )}
    </PopoverTrigger>
  );
}
