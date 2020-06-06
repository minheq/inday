import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { measure } from '../utils/measurements';

export type PopoverPosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

interface UsePopoverProps {
  open?: boolean;
  padding?: number;
  position?: PopoverPosition;
  popoverRef: React.MutableRefObject<View | null>;
  openerRef: React.MutableRefObject<View | null>;
}

interface PopoverLayout {
  left: number;
  top: number;
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
  paddingTop: number;
}

interface PopoverData {
  visible: boolean;
  layout: PopoverLayout;
}

interface PopoverState {
  visible: boolean;
  opacity: number;
  layout: PopoverLayout;
}

interface Dimensions {
  height: number;
  width: number;
}

const initialLayout = {
  left: 0,
  top: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingTop: 0,
};

export function usePopover(props: UsePopoverProps): PopoverData {
  const {
    open = false,
    openerRef,
    popoverRef,
    position = 'top-center',
    padding = 4,
  } = props;
  const [state, setState] = React.useState<PopoverState>({
    visible: open,
    opacity: open ? 1 : 0,
    layout: initialLayout,
  });

  React.useEffect(() => {
    if (open) {
      setState({ visible: true, opacity: 0, layout: initialLayout });

      Promise.all([measure(openerRef), measure(popoverRef)]).then((result) => {
        const [openerDimensions, popoverDimensions] = result;

        if (!openerDimensions || !popoverDimensions) {
          return;
        }

        const layout = calculatePopoverLayout(
          openerDimensions,
          popoverDimensions,
          padding,
          position,
        );

        setState({ visible: true, opacity: 1, layout });

        popoverRef.current?.focus();
      });
    } else {
      setState({ visible: false, opacity: 0, layout: initialLayout });
    }
  }, [open, position, openerRef, popoverRef, padding]);

  return {
    visible: state.visible,
    layout: {
      top: state.layout.top,
      left: state.layout.left,
      paddingLeft: state.layout.paddingLeft,
      paddingRight: state.layout.paddingRight,
      paddingBottom: state.layout.paddingBottom,
      paddingTop: state.layout.paddingTop,
    },
  };
}

function calculatePopoverLayout(
  openerDimensions: Dimensions,
  popoverDimensions: Dimensions,
  padding: number,
  position: PopoverPosition,
): PopoverLayout {
  switch (position) {
    case 'top-center':
      return {
        top: -popoverDimensions.height - padding,
        left: openerDimensions.width / 2 - popoverDimensions.width / 2,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: padding,
        paddingTop: 0,
      };
    case 'bottom-right':
      return {
        top: openerDimensions.height,
        left: 0 - (popoverDimensions.width - openerDimensions.width),
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: padding,
      };
    case 'bottom-left':
      return {
        top: openerDimensions.height,
        left: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: padding,
      };
    default:
      return {
        top: -popoverDimensions.height,
        left: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
      };
  }
}
interface PopoverChildrenProps {
  ref: React.MutableRefObject<View | null>;
}

interface PopoverProps {
  autoFocus?: boolean;
  open?: boolean;
  onRequestClose?: () => void;
  content?: React.ReactNode;
  position?: PopoverPosition;
  children: (props: PopoverChildrenProps) => React.ReactNode;
}

export function Popover(props: PopoverProps) {
  const { open, content, children, position = 'bottom-left' } = props;
  const fade = React.useRef(new Animated.Value(open ? 1 : 0)).current;
  const popoverRef = React.useRef<View | null>(null);
  const openerRef = React.useRef<View | null>(null);

  // const handleKeyDown = React.useCallback(
  //   (event) => {
  //     const ESC_KEY = 27;
  //     if (event.keyCode === ESC_KEY) {
  //       event.stopPropagation();
  //       onRequestClose();
  //     }
  //   },
  //   [onRequestClose],
  // );

  // const handleBlur = React.useCallback(
  //   (event: React.FocusEvent) => {
  //     if (
  //       // @ts-ignore: if an element was pressed within the popover
  //       !event.currentTarget?.contains(event.relatedTarget) &&
  //       // @ts-ignore: if the press was on element within the opener
  //       !openerRef.current?.contains(event.relatedTarget) &&
  //       // if the press was on the opener
  //       event.relatedTarget !== openerRef.current
  //     ) {
  //       onRequestClose();
  //     }
  //   },
  //   [onRequestClose],
  // );

  const popover = usePopover({
    open,
    openerRef,
    popoverRef,
    position,
  });

  React.useEffect(() => {
    Animated.spring(fade, {
      toValue: popover.visible ? 1 : 0,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }, [popover.visible, fade]);

  return (
    <>
      {children({ ref: openerRef })}
      <Animated.View
        // @ts-ignore
        ref={popoverRef}
        accessible
        style={[
          styles.content,
          popover.layout,
          popover.visible && styles.visible,
          { opacity: fade },
        ]}
      >
        {content}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    zIndex: 1,
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
});
