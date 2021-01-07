import React from 'react';

import { PopoverCallback } from './popover';
import {
  PressableHighlight,
  PressableHighlightProps,
} from './pressable_highlight';
import { PopoverTrigger } from './popover_trigger';
import { StyleProp, ViewStyle } from 'react-native';

export interface PressableHighlightPopoverProps
  extends PressableHighlightProps {
  content: React.ReactNode | ((callbacks: PopoverCallback) => React.ReactNode);
  popoverContainerStyle?: StyleProp<ViewStyle>;
}

export function PressableHighlightPopover(
  props: PressableHighlightPopoverProps,
): JSX.Element {
  const {
    content,
    popoverContainerStyle,
    onPress,
    ...pressableHighlightProps
  } = props;

  return (
    <PopoverTrigger
      content={content}
      popoverContainerStyle={popoverContainerStyle}
    >
      {({ ref, onOpen }) => (
        <PressableHighlight
          ref={ref}
          onPress={(e) => {
            if (onPress !== undefined && onPress !== null) {
              onPress(e);
            }

            onOpen();
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...pressableHighlightProps}
        />
      )}
    </PopoverTrigger>
  );
}
