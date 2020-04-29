import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useTheme, tokens } from '../theme';
import { isHoverEnabled } from '../utils/execution_environment';

interface InteractiveChildrenProps {
  onFocus: () => void;
  onBlur: () => void;
}

interface InteractiveProps {
  children: (props: InteractiveChildrenProps) => React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Interactive(props: InteractiveProps) {
  const { children, onBlur = () => {}, onFocus = () => {} } = props;
  const interactionLevel = React.useRef(new Animated.Value(0)).current;
  const interactionLevelValueRef = React.useRef(0);
  const theme = useTheme();

  React.useEffect(() => {
    interactionLevel.addListener(({ value }) => {
      interactionLevelValueRef.current = value;
    });
  }, [interactionLevel]);

  const handleOnFocus = React.useCallback(() => {
    onFocus();
    Animated.timing(interactionLevel, {
      toValue: 1,
      useNativeDriver: true,
      duration: 200,
    }).start();
  }, [interactionLevel, onFocus]);

  const handleOnBlur = React.useCallback(() => {
    onBlur();
    Animated.timing(interactionLevel, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
    }).start();
  }, [interactionLevel, onBlur]);

  const handleMouseEnter = React.useCallback(() => {
    if (isHoverEnabled() && interactionLevelValueRef.current === 0) {
      Animated.timing(interactionLevel, {
        toValue: 0.5,
        useNativeDriver: true,
        duration: 200,
      }).start();
    }
  }, [interactionLevel]);

  const handleMouseLeave = React.useCallback(() => {
    if (interactionLevelValueRef.current === 0.5) {
      Animated.timing(interactionLevel, {
        toValue: 0,
        useNativeDriver: true,
        duration: 200,
      }).start();
    }
  }, [interactionLevel]);

  return (
    <Animated.View
      // @ts-ignore
      onMouseEnter={handleMouseEnter}
      // @ts-ignore
      onMouseLeave={handleMouseLeave}
      style={[
        styles.root,
        {
          borderColor: interactionLevel.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              'rgba(0, 0, 0, 0)',
              theme.border.color.default,
              theme.border.color.focus,
            ],
          }),
        },
      ]}
    >
      {children({ onFocus: handleOnFocus, onBlur: handleOnBlur })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 2,
    borderRadius: tokens.radius,
  },
});
