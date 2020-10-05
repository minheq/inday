import React from 'react';
import { useMemo, useState, useRef, useImperativeHandle } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityActionInfo,
  AccessibilityRole,
  AccessibilityState,
  AccessibilityValue,
  GestureResponderEvent,
  LayoutChangeEvent,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { normalizeRect, RectOrSize } from './pressability';
import { usePressability } from './use_pressability';

export interface StateCallbackType {
  pressed: boolean;
}

type Props = {
  /**
   * Accessibility.
   */
  accessibilityActions?: AccessibilityActionInfo[];
  accessibilityElementsHidden?: boolean;
  accessibilityHint?: string;
  accessibilityIgnoresInvertColors?: boolean;
  accessibilityLabel?: string;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityValue?: AccessibilityValue;
  accessibilityViewIsModal?: boolean;
  accessible?: boolean;
  focusable?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void | null;

  /**
   * Either children or a render prop that receives a boolean reflecting whether
   * the component is currently pressed.
   */
  children: React.ReactNode | ((state: StateCallbackType) => React.ReactNode);

  /**
   * Duration (in milliseconds) from `onPressIn` before `onLongPress` is called.
   */
  delayLongPress?: number;

  /**
   * Whether the press behavior is disabled.
   */
  disabled?: boolean;

  /**
   * Additional distance outside of this view in which a press is detected.
   */
  hitSlop?: RectOrSize;

  /**
   * Additional distance outside of this view in which a touch is considered a
   * press before `onPressOut` is triggered.
   */
  pressRetentionOffset?: RectOrSize;

  /**
   * Called when this view's layout changes.
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * Called when a long-tap gesture is detected.
   */
  onLongPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when a single tap gesture is detected.
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when a touch is engaged before `onPress`.
   */
  onPressIn?: (event: GestureResponderEvent) => void;

  /**
   * Called when a touch is released before `onPress`.
   */
  onPressOut?: (event: GestureResponderEvent) => void;

  /**
   * Either view styles or a function that receives a boolean reflecting whether
   * the component is currently pressed and returns view styles.
   */
  style?: ViewStyle | ((state: StateCallbackType) => ViewStyle);

  /**
   * Identifier used to find this view in tests.
   */
  testID?: string;

  /**
   * If true, doesn't play system sound on touch.
   */
  android_disableSound?: boolean;

  /**
   * Enables the Android ripple effect and configures its color.
   */
  // android_ripple?: RippleConfig;

  /**
   * Used only for documentation or testing (e.g. snapshot testing).
   */
  testOnly_pressed?: boolean;

  /**
   * Duration to wait after press down before calling `onPressIn`.
   */
  unstable_pressDelay?: number;
};

/**
 * Component used to build display components that should respond to whether the
 * component is currently pressed or not.
 */
function Pressable(props: Props, ref: any) {
  const {
    accessible,
    android_disableSound,
    // android_ripple,
    children,
    delayLongPress,
    disabled,
    // focusable,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    pressRetentionOffset,
    style,
    testOnly_pressed,
    unstable_pressDelay,
    ...restProps
  } = props;

  const viewRef = useRef<View | null>(null);
  useImperativeHandle(ref, () => viewRef.current);

  // TODO: Not integrated
  // const android_rippleConfig = useAndroidRippleForView(android_ripple, viewRef);

  const [pressed, setPressed] = usePressState(testOnly_pressed === true);

  const hitSlop = normalizeRect(props.hitSlop);

  const restPropsWithDefaults: Partial<ViewProps> = {
    ...restProps,
    // TODO: Not integrated
    // ...android_rippleConfig?.viewProps,
    accessible: accessible !== false,
    // TODO: Not integrated
    // focusable: focusable !== false,
    hitSlop,
  };

  const config = useMemo(
    () => ({
      disabled,
      hitSlop,
      pressRectOffset: pressRetentionOffset,
      android_disableSound,
      delayLongPress,
      delayPressIn: unstable_pressDelay,
      onLongPress,
      onPress,
      onPressIn(event: GestureResponderEvent): void {
        // TODO: Not integrated
        // if (android_rippleConfig != null) {
        //   android_rippleConfig.onPressIn(event);
        // }
        setPressed(true);
        if (onPressIn != null) {
          onPressIn(event);
        }
      },
      // TODO: Not integrated
      // onPressMove: android_rippleConfig?.onPressMove,
      onPressOut(event: GestureResponderEvent): void {
        // TODO: Not integrated
        // if (android_rippleConfig != null) {
        //   android_rippleConfig.onPressOut(event);
        // }
        setPressed(false);
        if (onPressOut != null) {
          onPressOut(event);
        }
      },
    }),
    [
      android_disableSound,
      // android_rippleConfig,
      delayLongPress,
      disabled,
      hitSlop,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      pressRetentionOffset,
      setPressed,
      unstable_pressDelay,
    ],
  );
  const eventHandlers = usePressability(config);

  return (
    <View
      {...restPropsWithDefaults}
      {...eventHandlers}
      ref={viewRef}
      style={typeof style === 'function' ? style({ pressed }) : style}
      collapsable={false}
    >
      {typeof children === 'function' ? children({ pressed }) : children}
    </View>
  );
}

function usePressState(
  forcePressed: boolean,
): [boolean, (bool: boolean) => void] {
  const [pressed, setPressed] = useState(false);
  return [pressed || forcePressed, setPressed];
}

const MemoedPressable = React.memo(React.forwardRef(Pressable));

MemoedPressable.displayName = 'Pressable';
