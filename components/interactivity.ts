import React from 'react';
import { GestureResponderEvent, Platform, UIManager } from 'react-native';

let isEnabled = false;

if (Platform.OS === 'web') {
  const canUseDOM = Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

  if (canUseDOM) {
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

    const enableHover = () => {
      if (isEnabled || Date.now() - lastTouchTimestamp < HOVER_THRESHOLD_MS) {
        return;
      }
      isEnabled = true;
    };

    const disableHover = () => {
      lastTouchTimestamp = Date.now();
      if (isEnabled) {
        isEnabled = false;
      }
    };

    document.addEventListener('touchstart', disableHover, true);
    document.addEventListener('touchmove', disableHover, true);
    document.addEventListener('mousemove', enableHover, true);
  }
}

function isHoverEnabled(): boolean {
  return isEnabled;
}

export type Rect = {
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
};

export type RectOrSize = Rect | number;

export function createSquare(size: number): Rect {
  return { bottom: size, left: size, right: size, top: size };
}

export function normalizeRect(rectOrSize?: RectOrSize): Rect | undefined {
  return typeof rectOrSize === 'number' ? createSquare(rectOrSize) : rectOrSize;
}

type FocusEvent = React.FocusEvent;
type BlurEvent = React.FocusEvent;

export type InteractivityConfig = {
  /**
   * Whether a press gesture can be interrupted by a parent gesture such as a
   * scroll event. Defaults to true.
   */
  cancelable?: boolean;

  /**
   * Whether to disable initialization of the press gesture.
   */
  disabled?: boolean;

  /**
   * Amount to extend the `VisualRect` by to create `HitRect`.
   */
  hitSlop?: RectOrSize;

  /**
   * Amount to extend the `HitRect` by to create `PressRect`.
   */
  pressRectOffset?: RectOrSize;

  /**
   * Duration to wait after hover in before calling `onHoverIn`.
   */
  delayHoverIn?: number;

  /**
   * Duration to wait after hover out before calling `onHoverOut`.
   */
  delayHoverOut?: number;

  /**
   * Duration (in addition to `delayPressIn`) after which a press gesture is
   * considered a long press gesture. Defaults to 500 (milliseconds).
   */
  delayLongPress?: number;

  /**
   * Duration to wait after press down before calling `onPressIn`.
   */
  delayPressIn?: number;

  /**
   * Duration to wait after letting up before calling `onPressOut`.
   */
  delayPressOut?: number;

  /**
   * Called after the element loses focus.
   */
  onBlur?: (event: BlurEvent) => void;

  /**
   * Called after the element is focused.
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Called when the hover is activated to provide visual feedback.
   */
  onHoverIn?: (event: MouseEvent) => void;

  /**
   * Called when the hover is deactivated to undo visual feedback.
   */
  onHoverOut?: (event: MouseEvent) => void;

  /**
   * Called when a long press gesture has been triggered.
   */
  onLongPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when a press gestute has been triggered.
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when the press is activated to provide visual feedback.
   */
  onPressIn?: (event: GestureResponderEvent) => void;

  /**
   * Called when the press location moves. (This should rarely be used.)
   */
  onPressMove?: (event: GestureResponderEvent) => void;

  /**
   * Called when the press is deactivated to undo visual feedback.
   */
  onPressOut?: (event: GestureResponderEvent) => void;
};

export type EventHandlers = {
  onBlur: (event: BlurEvent) => void;
  onClick: (event: GestureResponderEvent) => void;
  onFocus: (event: FocusEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onResponderGrant: (event: GestureResponderEvent) => void;
  onResponderMove: (event: GestureResponderEvent) => void;
  onResponderRelease: (event: GestureResponderEvent) => void;
  onResponderTerminate: (event: GestureResponderEvent) => void;
  onResponderTerminationRequest: () => boolean;
  onStartShouldSetResponder: () => boolean;
};

enum TouchState {
  NotResponder,
  ResponderInactivePressIn,
  ResponderInactivePressOut,
  ResponderActivePressIn,
  ResponderActivePressOut,
  ResponderActiveLongPressIn,
  ResponderActiveLongPressOut,
  Error,
}

enum TouchSignal {
  Delay,
  ResponderGrant,
  ResponderRelease,
  ResponderTerminated,
  EnterPressRect,
  LeavePressRect,
  LongPressDetected,
}

const Transitions: {
  [state in TouchState]: { [signal in TouchSignal]: TouchState };
} = {
  [TouchState.NotResponder]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.ResponderInactivePressIn,
    [TouchSignal.ResponderRelease]: TouchState.Error,
    [TouchSignal.ResponderTerminated]: TouchState.Error,
    [TouchSignal.EnterPressRect]: TouchState.Error,
    [TouchSignal.LeavePressRect]: TouchState.Error,
    [TouchSignal.LongPressDetected]: TouchState.Error,
  },
  [TouchState.ResponderInactivePressIn]: {
    [TouchSignal.Delay]: TouchState.ResponderActivePressIn,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderInactivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderInactivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
  },
  [TouchState.ResponderInactivePressOut]: {
    [TouchSignal.Delay]: TouchState.ResponderActivePressOut,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderInactivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderInactivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
  },
  [TouchState.ResponderActivePressIn]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.ResponderActiveLongPressIn,
  },
  [TouchState.ResponderActivePressOut]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
  },
  [TouchState.ResponderActiveLongPressIn]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActiveLongPressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActiveLongPressOut,
    [TouchSignal.LongPressDetected]: TouchState.ResponderActiveLongPressIn,
  },
  [TouchState.ResponderActiveLongPressOut]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActiveLongPressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActiveLongPressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
  },
  [TouchState.Error]: {
    [TouchSignal.Delay]: TouchState.NotResponder,
    [TouchSignal.ResponderGrant]: TouchState.ResponderInactivePressIn,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.NotResponder,
    [TouchSignal.LeavePressRect]: TouchState.NotResponder,
    [TouchSignal.LongPressDetected]: TouchState.NotResponder,
  },
};

const isActiveSignal = (state: TouchState) =>
  state === TouchState.ResponderActivePressIn ||
  state === TouchState.ResponderActiveLongPressIn;

const isActivationSignal = (state: TouchState) =>
  state === TouchState.ResponderActivePressOut ||
  state === TouchState.ResponderActivePressIn;

const isPressInSignal = (state: TouchState) =>
  state === TouchState.ResponderInactivePressIn ||
  state === TouchState.ResponderActivePressIn ||
  state === TouchState.ResponderActiveLongPressIn;

const isTerminalSignal = (signal: TouchSignal) =>
  signal === TouchSignal.ResponderTerminated ||
  signal === TouchSignal.ResponderRelease;

const DEFAULT_LONG_PRESS_DELAY_MS = 370; // 500 - 130
const DEFAULT_PRESS_DELAY_MS = 130;
const DEFAULT_PRESS_RECT_OFFSETS = {
  bottom: 30,
  left: 20,
  right: 20,
  top: 20,
};

type TimeoutID = number;

export class Interactivity {
  _config: InteractivityConfig;
  _eventHandlers: EventHandlers | null = null;
  _hoverInDelayTimeout: TimeoutID | null = null;
  _hoverOutDelayTimeout: TimeoutID | null = null;
  _isHovered: boolean = false;
  _longPressDelayTimeout: TimeoutID | null = null;
  _pressDelayTimeout: TimeoutID | null = null;
  _pressOutDelayTimeout: TimeoutID | null = null;
  _responderID?: number | React.ElementRef<any> = null;
  _responderRegion: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  } | null = null;
  _touchActivatePosition: {
    pageX: number;
    pageY: number;
  } | null = null;
  _touchState: TouchState = TouchState.NotResponder;

  constructor(config: InteractivityConfig) {
    this._config = config;
  }

  configure(config: InteractivityConfig) {
    this._config = config;
  }

  /**
   * Resets any pending timers. This should be called on unmount.
   */
  reset(): void {
    this._cancelHoverInDelayTimeout();
    this._cancelHoverOutDelayTimeout();
    this._cancelLongPressDelayTimeout();
    this._cancelPressDelayTimeout();
    this._cancelPressOutDelayTimeout();
  }

  /**
   * Returns a set of props to spread into the interactive element.
   */
  getEventHandlers(): EventHandlers {
    if (this._eventHandlers == null) {
      this._eventHandlers = this._createEventHandlers();
    }
    return this._eventHandlers;
  }

  _createEventHandlers(): EventHandlers {
    const focusEventHandlers = {
      onBlur: (event: BlurEvent): void => {
        const { onBlur } = this._config;
        if (onBlur != null) {
          onBlur(event);
        }
      },
      onFocus: (event: FocusEvent): void => {
        const { onFocus } = this._config;
        if (onFocus != null) {
          onFocus(event);
        }
      },
    };

    const responderEventHandlers = {
      onStartShouldSetResponder: (): boolean => {
        const { disabled } = this._config;

        return !disabled || true;
      },

      onResponderGrant: (event: GestureResponderEvent): void => {
        event.persist();

        this._cancelPressOutDelayTimeout();

        this._responderID = event.currentTarget;
        this._touchState = TouchState.NotResponder;
        this._receiveSignal(TouchSignal.ResponderGrant, event);

        const delayPressIn = normalizeDelay(
          this._config.delayPressIn,
          0,
          DEFAULT_PRESS_DELAY_MS,
        );

        if (delayPressIn > 0) {
          this._pressDelayTimeout = setTimeout(() => {
            this._receiveSignal(TouchSignal.Delay, event);
          }, delayPressIn);
        } else {
          this._receiveSignal(TouchSignal.Delay, event);
        }

        const delayLongPress = normalizeDelay(
          this._config.delayLongPress,
          10,
          DEFAULT_LONG_PRESS_DELAY_MS,
        );
        this._longPressDelayTimeout = setTimeout(() => {
          this._handleLongPress(event);
        }, delayLongPress + delayPressIn);
      },

      onResponderMove: (event: GestureResponderEvent): void => {
        if (this._config.onPressMove != null) {
          this._config.onPressMove(event);
        }

        // Region may not have finished being measured, yet.
        const responderRegion = this._responderRegion;
        if (responderRegion == null) {
          return;
        }

        const touch = getTouchFromGestureResponderEvent(event);
        if (touch == null) {
          this._cancelLongPressDelayTimeout();
          this._receiveSignal(TouchSignal.LeavePressRect, event);
          return;
        }

        if (this._touchActivatePosition != null) {
          const deltaX = this._touchActivatePosition.pageX - touch.pageX;
          const deltaY = this._touchActivatePosition.pageY - touch.pageY;
          if (Math.hypot(deltaX, deltaY) > 10) {
            this._cancelLongPressDelayTimeout();
          }
        }

        if (this._isTouchWithinResponderRegion(touch, responderRegion)) {
          this._receiveSignal(TouchSignal.EnterPressRect, event);
        } else {
          this._cancelLongPressDelayTimeout();
          this._receiveSignal(TouchSignal.LeavePressRect, event);
        }
      },

      onResponderRelease: (event: GestureResponderEvent): void => {
        this._receiveSignal(TouchSignal.ResponderRelease, event);
      },

      onResponderTerminate: (event: GestureResponderEvent): void => {
        this._receiveSignal(TouchSignal.ResponderTerminated, event);
      },

      onResponderTerminationRequest: (): boolean => {
        const { cancelable } = this._config;

        return cancelable || true;
      },

      onClick: (event: GestureResponderEvent): void => {
        const { onPress } = this._config;
        if (onPress != null) {
          onPress(event);
        }
      },
    };

    const mouseEventHandlers =
      Platform.OS === 'ios' || Platform.OS === 'android'
        ? null
        : {
            onMouseEnter: (event: MouseEvent): void => {
              if (isHoverEnabled()) {
                this._isHovered = true;
                this._cancelHoverOutDelayTimeout();
                const { onHoverIn } = this._config;
                if (onHoverIn != null) {
                  const delayHoverIn = normalizeDelay(
                    this._config.delayHoverIn,
                  );
                  if (delayHoverIn > 0) {
                    this._hoverInDelayTimeout = setTimeout(() => {
                      onHoverIn(event);
                    }, delayHoverIn);
                  } else {
                    onHoverIn(event);
                  }
                }
              }
            },

            onMouseLeave: (event: MouseEvent): void => {
              if (this._isHovered) {
                this._isHovered = false;
                this._cancelHoverInDelayTimeout();
                const { onHoverOut } = this._config;
                if (onHoverOut != null) {
                  const delayHoverOut = normalizeDelay(
                    this._config.delayHoverOut,
                  );
                  if (delayHoverOut > 0) {
                    this._hoverInDelayTimeout = setTimeout(() => {
                      onHoverOut(event);
                    }, delayHoverOut);
                  } else {
                    onHoverOut(event);
                  }
                }
              }
            },
          };

    return {
      ...focusEventHandlers,
      ...responderEventHandlers,
      ...mouseEventHandlers,
    };
  }

  /**
   * Receives a state machine signal, performs side effects of the transition
   * and stores the new state. Validates the transition as well.
   */
  _receiveSignal(signal: TouchSignal, event: GestureResponderEvent): void {
    const prevState = this._touchState as TouchState;
    const nextState = Transitions[prevState]?.[signal] as TouchState;
    if (this._responderID == null && signal === TouchSignal.ResponderRelease) {
      return;
    }

    if (nextState != null && nextState !== TouchState.Error) {
      throw new Error(
        `Interactivity: Invalid signal '${signal}' for state '${prevState}' on responder: ${
          typeof this._responderID === 'number'
            ? this._responderID
            : '<<host component>>'
        }`,
      );
    }

    if (prevState !== nextState) {
      this._performTransitionSideEffects(prevState, nextState, signal, event);
      this._touchState = nextState;
    }
  }

  /**
   * Performs a transition between touchable states and identify any activations
   * or deactivations (and callback invocations).
   */
  _performTransitionSideEffects(
    prevState: TouchState,
    nextState: TouchState,
    signal: TouchSignal,
    event: GestureResponderEvent,
  ): void {
    if (isTerminalSignal(signal)) {
      this._touchActivatePosition = null;
      this._cancelLongPressDelayTimeout();
    }

    const isInitialTransition =
      prevState === TouchState.NotResponder &&
      nextState === TouchState.ResponderInactivePressIn;

    const isActivationTransiton =
      !isActivationSignal(prevState) && isActivationSignal(nextState);

    if (isInitialTransition || isActivationTransiton) {
      this._measureResponderRegion();
    }

    if (
      isPressInSignal(prevState) &&
      signal === TouchSignal.LongPressDetected
    ) {
      const { onLongPress } = this._config;
      if (onLongPress != null) {
        onLongPress(event);
      }
    }

    const isPrevActive = isActiveSignal(prevState);
    const isNextActive = isActiveSignal(nextState);

    if (!isPrevActive && isNextActive) {
      this._activate(event);
    } else if (isPrevActive && !isNextActive) {
      this._deactivate(event);
    }

    if (isPressInSignal(prevState) && signal === TouchSignal.ResponderRelease) {
      const { onLongPress, onPress } = this._config;
      if (onPress != null) {
        const isPressCanceledByLongPress =
          onLongPress != null &&
          prevState === TouchState.ResponderActiveLongPressIn;
        if (!isPressCanceledByLongPress) {
          // If we never activated (due to delays), activate and deactivate now.
          if (!isNextActive && !isPrevActive) {
            this._activate(event);
            this._deactivate(event);
          }

          onPress(event);
        }
      }
    }

    this._cancelPressDelayTimeout();
  }

  _activate(event: GestureResponderEvent): void {
    const { onPressIn } = this._config;
    const touch = getTouchFromGestureResponderEvent(event);
    this._touchActivatePosition = {
      pageX: touch.pageX,
      pageY: touch.pageY,
    };
    if (onPressIn != null) {
      onPressIn(event);
    }
  }

  _deactivate(event: GestureResponderEvent): void {
    const { onPressOut } = this._config;
    if (onPressOut != null) {
      const delayPressOut = normalizeDelay(this._config.delayPressOut);
      if (delayPressOut > 0) {
        this._pressOutDelayTimeout = setTimeout(() => {
          onPressOut(event);
        }, delayPressOut);
      } else {
        onPressOut(event);
      }
    }
  }

  _measureResponderRegion(): void {
    if (this._responderID == null) {
      return;
    }

    if (typeof this._responderID === 'number') {
      UIManager.measure(this._responderID, this._measureCallback);
    } else {
      this._responderID.measure(this._measureCallback);
    }
  }

  _measureCallback = (
    left: number,
    top: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
  ) => {
    if (!left && !top && !width && !height && !pageX && !pageY) {
      return;
    }
    this._responderRegion = {
      bottom: pageY + height,
      left: pageX,
      right: pageX + width,
      top: pageY,
    };
  };

  _isTouchWithinResponderRegion(
    touch: GestureResponderEvent['nativeEvent'],
    responderRegion: {
      bottom: number;
      left: number;
      right: number;
      top: number;
    },
  ): boolean {
    const hitSlop = normalizeRect(this._config.hitSlop);
    const pressRectOffset = normalizeRect(this._config.pressRectOffset);

    let regionBottom = responderRegion.bottom;
    let regionLeft = responderRegion.left;
    let regionRight = responderRegion.right;
    let regionTop = responderRegion.top;

    if (hitSlop != null) {
      if (hitSlop.bottom != null) {
        regionBottom += hitSlop.bottom;
      }
      if (hitSlop.left != null) {
        regionLeft -= hitSlop.left;
      }
      if (hitSlop.right != null) {
        regionRight += hitSlop.right;
      }
      if (hitSlop.top != null) {
        regionTop -= hitSlop.top;
      }
    }

    regionBottom +=
      pressRectOffset?.bottom ?? DEFAULT_PRESS_RECT_OFFSETS.bottom;
    regionLeft -= pressRectOffset?.left ?? DEFAULT_PRESS_RECT_OFFSETS.left;
    regionRight += pressRectOffset?.right ?? DEFAULT_PRESS_RECT_OFFSETS.right;
    regionTop -= pressRectOffset?.top ?? DEFAULT_PRESS_RECT_OFFSETS.top;

    return (
      touch.pageX > regionLeft &&
      touch.pageX < regionRight &&
      touch.pageY > regionTop &&
      touch.pageY < regionBottom
    );
  }

  _handleLongPress(event: GestureResponderEvent): void {
    if (
      this._touchState === TouchState.ResponderActivePressIn ||
      this._touchState === TouchState.ResponderActiveLongPressIn
    ) {
      this._receiveSignal(TouchSignal.LongPressDetected, event);
    }
  }

  _cancelHoverInDelayTimeout(): void {
    if (this._hoverInDelayTimeout != null) {
      clearTimeout(this._hoverInDelayTimeout);
      this._hoverInDelayTimeout = null;
    }
  }

  _cancelHoverOutDelayTimeout(): void {
    if (this._hoverOutDelayTimeout != null) {
      clearTimeout(this._hoverOutDelayTimeout);
      this._hoverOutDelayTimeout = null;
    }
  }

  _cancelLongPressDelayTimeout(): void {
    if (this._longPressDelayTimeout != null) {
      clearTimeout(this._longPressDelayTimeout);
      this._longPressDelayTimeout = null;
    }
  }

  _cancelPressDelayTimeout(): void {
    if (this._pressDelayTimeout != null) {
      clearTimeout(this._pressDelayTimeout);
      this._pressDelayTimeout = null;
    }
  }

  _cancelPressOutDelayTimeout(): void {
    if (this._pressOutDelayTimeout != null) {
      clearTimeout(this._pressOutDelayTimeout);
      this._pressOutDelayTimeout = null;
    }
  }
}

function normalizeDelay(delay?: number, min = 0, fallback = 0): number {
  return Math.max(min, delay ?? fallback);
}

const getTouchFromGestureResponderEvent = (event: GestureResponderEvent) => {
  const { changedTouches, touches } = event.nativeEvent;

  if (touches != null && touches.length > 0) {
    return touches[0];
  }
  if (changedTouches != null && changedTouches.length > 0) {
    return changedTouches[0];
  }
  return event.nativeEvent;
};

export function useInteractivity(config: InteractivityConfig): EventHandlers {
  const interactivityRef = React.useRef<Interactivity | null>(null);
  if (interactivityRef.current == null) {
    interactivityRef.current = new Interactivity(config);
  }
  const interactivity = interactivityRef.current;

  // On the initial mount, this is a no-op. On updates, `interactivity` will be
  // re-configured to use the new configuration.
  React.useEffect(() => {
    interactivity.configure(config);
  }, [config, interactivity]);

  // On unmount, reset pending state and timers inside `interactivity`. This is
  // a separate effect because we do not want to reset when `config` changes.
  React.useEffect(() => {
    return () => {
      interactivity.reset();
    };
  }, [interactivity]);

  return interactivity.getEventHandlers();
}
