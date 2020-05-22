import React from 'react';
import {
  GestureResponderEvent,
  Platform,
  UIManager,
  PanResponderGestureState,
  PanResponder,
  GestureResponderHandlers,
} from 'react-native';

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

export type GestureDetectorConfig = {
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
   * Called when a press gesture has been triggered.
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when a drag gesture has started
   */
  onDragStart?: (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;

  /**
   * Called when a drag gesture has moved
   */
  onDragMove?: (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;

  /**
   * Called when a drag gesture has ended
   */
  onDragEnd?: (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;

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

export interface EventHandlers extends GestureResponderHandlers {
  onBlur: (event: BlurEvent) => void;
  onFocus: (event: FocusEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
}

enum TouchState {
  NotResponder = 'NOT_RESPONDER',
  ResponderInactivePressIn = 'RESPONDER_INACTIVE_PRESS_IN',
  ResponderInactivePressOut = 'RESPONDER_INACTIVE_PRESS_OUT',
  ResponderActivePressIn = 'RESPONDER_ACTIVE_PRESS_IN',
  ResponderActivePressOut = 'RESPONDER_ACTIVE_PRESS_OUT',
  ResponderActiveLongPressIn = 'RESPONDER_ACTIVE_LONG_PRESS_IN',
  ResponderActiveLongPressOut = 'RESPONDER_ACTIVE_LONG_PRESS_OUT',
  ResponderActiveDrag = 'RESPONDER_ACTIVE_DRAG',
  Error = 'ERROR',
}

enum TouchSignal {
  Delay = 'DELAY',
  ResponderGrant = 'RESPONDER_GRANT',
  ResponderRelease = 'RESPONDER_RELEASE',
  ResponderTerminated = 'RESPONDER_TERMINATED',
  EnterPressRect = 'ENTER_PRESS_RECT',
  LeavePressRect = 'LEAVE_PRESS_RECT',
  LongPressDetected = 'LONG_PRESS_DETECTED',
  DragDetected = 'DRAG_DETECTED',
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
    [TouchSignal.DragDetected]: TouchState.Error,
  },
  [TouchState.ResponderInactivePressIn]: {
    [TouchSignal.Delay]: TouchState.ResponderActivePressIn,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderInactivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderInactivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
    [TouchSignal.DragDetected]: TouchState.Error,
  },
  [TouchState.ResponderInactivePressOut]: {
    [TouchSignal.Delay]: TouchState.ResponderActivePressOut,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderInactivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderInactivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
    [TouchSignal.DragDetected]: TouchState.Error,
  },
  [TouchState.ResponderActivePressIn]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.ResponderActiveLongPressIn,
    [TouchSignal.DragDetected]: TouchState.ResponderActiveDrag,
  },
  [TouchState.ResponderActivePressOut]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActivePressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActivePressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
    [TouchSignal.DragDetected]: TouchState.Error,
  },
  [TouchState.ResponderActiveLongPressIn]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActiveLongPressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActiveLongPressOut,
    [TouchSignal.LongPressDetected]: TouchState.ResponderActiveLongPressIn,
    [TouchSignal.DragDetected]: TouchState.ResponderActiveDrag,
  },
  [TouchState.ResponderActiveLongPressOut]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.ResponderActiveLongPressIn,
    [TouchSignal.LeavePressRect]: TouchState.ResponderActiveLongPressOut,
    [TouchSignal.LongPressDetected]: TouchState.Error,
    [TouchSignal.DragDetected]: TouchState.Error,
  },
  [TouchState.ResponderActiveDrag]: {
    [TouchSignal.Delay]: TouchState.Error,
    [TouchSignal.ResponderGrant]: TouchState.Error,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.Error,
    [TouchSignal.LeavePressRect]: TouchState.Error,
    [TouchSignal.LongPressDetected]: TouchState.Error,
    [TouchSignal.DragDetected]: TouchState.ResponderActiveDrag,
  },
  [TouchState.Error]: {
    [TouchSignal.Delay]: TouchState.NotResponder,
    [TouchSignal.ResponderGrant]: TouchState.ResponderInactivePressIn,
    [TouchSignal.ResponderRelease]: TouchState.NotResponder,
    [TouchSignal.ResponderTerminated]: TouchState.NotResponder,
    [TouchSignal.EnterPressRect]: TouchState.NotResponder,
    [TouchSignal.LeavePressRect]: TouchState.NotResponder,
    [TouchSignal.LongPressDetected]: TouchState.NotResponder,
    [TouchSignal.DragDetected]: TouchState.NotResponder,
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

export class GestureDetector {
  _config: GestureDetectorConfig;
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

  constructor(config: GestureDetectorConfig) {
    this._config = config;
  }

  configure(config: GestureDetectorConfig) {
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

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (): boolean => {
        const { disabled } = this._config;

        return !disabled || true;
      },

      onPanResponderGrant: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ): void => {
        event.persist();

        this._cancelPressOutDelayTimeout();

        this._responderID = event.currentTarget;
        this._touchState = TouchState.NotResponder;
        this._receiveSignal(TouchSignal.ResponderGrant, event, state);

        const delayPressIn = normalizeDelay(
          this._config.delayPressIn,
          0,
          DEFAULT_PRESS_DELAY_MS,
        );

        if (delayPressIn > 0) {
          this._pressDelayTimeout = setTimeout(() => {
            this._receiveSignal(TouchSignal.Delay, event, state);
          }, delayPressIn);
        } else {
          this._receiveSignal(TouchSignal.Delay, event, state);
        }

        const delayLongPress = normalizeDelay(
          this._config.delayLongPress,
          10,
          DEFAULT_LONG_PRESS_DELAY_MS,
        );
        this._longPressDelayTimeout = setTimeout(() => {
          this._handleLongPress(event, state);
        }, delayLongPress + delayPressIn);
      },

      onPanResponderMove: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ): void => {
        if (this._config.onPressMove != null) {
          this._config.onPressMove(event);
        }

        // Region may not have finished being measured, yet.
        const responderRegion = this._responderRegion;
        if (responderRegion == null) {
          return;
        }

        const touch = getTouchFromGestureDetectorResponderEvent(event);
        if (touch == null) {
          this._cancelLongPressDelayTimeout();
          this._receiveSignal(TouchSignal.LeavePressRect, event, state);
          return;
        }

        if (this._touchActivatePosition != null) {
          const deltaX = this._touchActivatePosition.pageX - touch.pageX;
          const deltaY = this._touchActivatePosition.pageY - touch.pageY;

          // Distance from touch activate position
          if (Math.hypot(deltaX, deltaY) > 10) {
            this._cancelLongPressDelayTimeout();

            if (
              this._touchState === TouchState.ResponderActivePressIn ||
              this._touchState === TouchState.ResponderActiveLongPressIn
            ) {
              this._receiveSignal(TouchSignal.DragDetected, event, state);
            }
          }
        }

        // Stop evaluating Enter/Press Rect when drag is active
        if (this._touchState === TouchState.ResponderActiveDrag) {
          const { onDragMove } = this._config;
          if (onDragMove != null) {
            onDragMove(event, state);
          }
          return;
        }

        if (this._isTouchWithinResponderRegion(touch, responderRegion)) {
          this._receiveSignal(TouchSignal.EnterPressRect, event, state);
        } else {
          this._cancelLongPressDelayTimeout();
          this._receiveSignal(TouchSignal.LeavePressRect, event, state);
        }
      },

      onPanResponderRelease: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ): void => {
        this._receiveSignal(TouchSignal.ResponderRelease, event, state);
      },

      onPanResponderTerminate: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ): void => {
        this._receiveSignal(TouchSignal.ResponderTerminated, event, state);
      },

      onPanResponderTerminationRequest: (): boolean => {
        const { cancelable } = this._config;

        // Keep this as responder while drag is active
        if (this._touchState === TouchState.ResponderActiveDrag) {
          return false;
        }

        return cancelable || true;
      },
    });

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
      ...panResponder.panHandlers,
      ...mouseEventHandlers,
    };
  }

  /**
   * Receives a state machine signal, performs side effects of the transition
   * and stores the new state. Validates the transition as well.
   */
  _receiveSignal(
    signal: TouchSignal,
    event: GestureResponderEvent,
    state: PanResponderGestureState,
  ): void {
    const prevState = this._touchState;
    const nextState = Transitions[prevState][signal];

    if (this._responderID == null && signal === TouchSignal.ResponderRelease) {
      return;
    }

    if (nextState === null || nextState === TouchState.Error) {
      throw new Error(
        `GestureDetector: Invalid signal '${signal}' for state '${prevState}' on responder: ${
          typeof this._responderID === 'number'
            ? this._responderID
            : '<<host component>>'
        }`,
      );
    }

    if (prevState !== nextState) {
      this._performTransitionSideEffects(
        prevState,
        nextState,
        signal,
        event,
        state,
      );
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
    state: PanResponderGestureState,
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

    if (nextState === TouchState.ResponderActiveDrag) {
      const { onDragStart } = this._config;
      if (onDragStart != null) {
        onDragStart(event, state);
      }
    }

    const isPrevActive = isActiveSignal(prevState);
    const isNextActive = isActiveSignal(nextState);

    if (!isPrevActive && isNextActive) {
      this._activate(event);
    } else if (isPrevActive && !isNextActive) {
      this._deactivate(event);
    }

    if (
      prevState === TouchState.ResponderActiveDrag &&
      signal === TouchSignal.ResponderRelease
    ) {
      const { onDragEnd } = this._config;
      if (onDragEnd != null) {
        onDragEnd(event, state);
      }
    } else if (
      isPressInSignal(prevState) &&
      signal === TouchSignal.ResponderRelease
    ) {
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
    const touch = getTouchFromGestureDetectorResponderEvent(event);
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

    UIManager.measure(this._responderID, this._measureCallback);
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

  _handleLongPress(
    event: GestureResponderEvent,
    state: PanResponderGestureState,
  ): void {
    if (
      this._touchState === TouchState.ResponderActivePressIn ||
      this._touchState === TouchState.ResponderActiveLongPressIn
    ) {
      this._receiveSignal(TouchSignal.LongPressDetected, event, state);
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

const getTouchFromGestureDetectorResponderEvent = (
  event: GestureResponderEvent,
) => {
  const { changedTouches, touches } = event.nativeEvent;

  if (touches != null && touches.length > 0) {
    return touches[0];
  }
  if (changedTouches != null && changedTouches.length > 0) {
    return changedTouches[0];
  }
  return event.nativeEvent;
};

export function useGestureDetector(
  config: GestureDetectorConfig,
): EventHandlers {
  const gestureDetectorRef = React.useRef<GestureDetector | null>(null);
  if (gestureDetectorRef.current == null) {
    gestureDetectorRef.current = new GestureDetector(config);
  }
  const gestureDetector = gestureDetectorRef.current;

  // On the initial mount, this is a no-op. On updates, `gestureDetector` will be
  // re-configured to use the new configuration.
  React.useEffect(() => {
    gestureDetector.configure(config);
  }, [config, gestureDetector]);

  // On unmount, reset pending state and timers inside `gestureDetector`. This is
  // a separate effect because we do not want to reset when `config` changes.
  React.useEffect(() => {
    return () => {
      gestureDetector.reset();
    };
  }, [gestureDetector]);

  return gestureDetector.getEventHandlers();
}
