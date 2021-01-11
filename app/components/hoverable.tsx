import React, { useCallback, useState } from 'react';
import { canUseDOM } from '../lib/execution_environment';

interface HoverableProps {
  children: React.ReactElement | ((hovered: boolean) => React.ReactElement);
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export function Hoverable(props: HoverableProps): JSX.Element {
  const { children, onHoverIn, onHoverOut } = props;
  const { handlers, hovered } = useHoverable({ onHoverIn, onHoverOut });
  const {
    onMouseEnter,
    onMouseLeave,
    onResponderGrant,
    onResponderRelease,
    onPressIn,
    onPressOut,
  } = handlers;

  const child = typeof children === 'function' ? children(hovered) : children;

  return React.cloneElement(React.Children.only(child), {
    onMouseEnter,
    onMouseLeave,
    // prevent hover showing while responder
    onResponderGrant,
    onResponderRelease,
    // if child is Pressable
    onPressIn,
    onPressOut,
  });
}

interface UseHoverableProps {
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

interface UseHoverableHandlers {
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onResponderGrant: () => void;
    onResponderRelease: () => void;
    onPressIn: () => void;
    onPressOut: () => void;
  };
  hovered: boolean;
}

export function useHoverable(props: UseHoverableProps): UseHoverableHandlers {
  const { onHoverIn, onHoverOut } = props;
  const [state, setState] = useState({ hovered: false, showHover: true });
  const { hovered, showHover } = state;

  const handleMouseEnter = useCallback(() => {
    if (isHoverEnabled() && !hovered) {
      if (onHoverIn !== undefined) {
        onHoverIn();
      }

      setState({
        showHover,
        hovered: true,
      });
    }
  }, [showHover, hovered, onHoverIn]);

  const handleMouseLeave = useCallback(() => {
    if (hovered) {
      if (onHoverOut !== undefined) {
        onHoverOut();
      }
      setState({
        showHover,
        hovered: false,
      });
    }
  }, [hovered, showHover, onHoverOut]);

  const handleGrant = useCallback(() => {
    setState({ showHover: false, hovered });
  }, [hovered]);

  const handleRelease = useCallback(() => {
    setState({ showHover: true, hovered });
  }, [hovered]);

  return {
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      // prevent hover showing while responder
      onResponderGrant: handleGrant,
      onResponderRelease: handleRelease,
      // if child is Pressable
      onPressIn: handleGrant,
      onPressOut: handleRelease,
    },
    hovered: showHover && hovered,
  };
}

let isEnabled = false;

/**
 * Web browsers emulate mouse events (and hover states) after touch events.
 * This code infers when the currently-in-use modality supports hover
 * (including for multi-modality devices) and considers "hover" to be enabled
 * if a mouse movement occurs more than 1 second after the last touch event.
 * This threshold is long enough to account for longer delays between the
 * browser firing touch and mouse events on low-powered devices.
 */
const HOVER_THRESHOLD_MS = 1000;
let lastTouchTimestamp = 0;

function enableHover() {
  if (isEnabled || Date.now() - lastTouchTimestamp < HOVER_THRESHOLD_MS) {
    return;
  }
  isEnabled = true;
}

function disableHover() {
  lastTouchTimestamp = Date.now();
  if (isEnabled) {
    isEnabled = false;
  }
}

if (canUseDOM) {
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('touchmove', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);
}

function isHoverEnabled(): boolean {
  return isEnabled;
}
