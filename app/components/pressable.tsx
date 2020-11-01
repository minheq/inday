import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  Animated,
  ViewStyle,
  StyleProp,
  AccessibilityProps,
} from 'react-native';

export interface InteractionState {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
}

interface PressableProps extends AccessibilityProps {
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode | ((props: InteractionState) => React.ReactNode);
  style?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        props: InteractionState,
      ) => Animated.WithAnimatedValue<StyleProp<ViewStyle>>);
}

export interface PressableRef {
  focus: () => void;
}

export const Pressable = forwardRef<PressableRef, PressableProps>(
  function Pressable(props, ref) {
    const {
      children,
      disabled,
      style,
      onPress,
      onLongPress,
      accessibilityActions,
      accessibilityComponentType,
      accessibilityElementsHidden,
      accessibilityHint,
      accessible,
      accessibilityIgnoresInvertColors,
      accessibilityLabel,
      accessibilityLiveRegion,
      accessibilityRole,
      accessibilityState,
      accessibilityTraits,
      accessibilityValue,
      accessibilityViewIsModal,
    } = props;
    const pressableRef = useRef<any>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          if (pressableRef.current !== null) {
            pressableRef.current.focus();
          }
        },
      }),
      [pressableRef],
    );

    return (
      <RNPressable
        ref={pressableRef}
        accessibilityActions={accessibilityActions}
        accessibilityComponentType={accessibilityComponentType}
        accessibilityElementsHidden={accessibilityElementsHidden}
        accessibilityHint={accessibilityHint}
        accessible={accessible}
        accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
        accessibilityLabel={accessibilityLabel}
        accessibilityLiveRegion={accessibilityLiveRegion}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityTraits={accessibilityTraits}
        accessibilityValue={accessibilityValue}
        accessibilityViewIsModal={accessibilityViewIsModal}
        onLongPress={onLongPress}
        onPress={onPress}
        disabled={disabled}
        // @ts-ignore
        style={style}
      >
        {children}
      </RNPressable>
    );
  },
);
