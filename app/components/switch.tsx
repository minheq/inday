import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Pressable } from './pressable';
import { useTheme } from '../theme';

interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Switch(props: SwitchProps) {
  const { value, onChange = () => {} } = props;
  const theme = useTheme();
  const checked = React.useRef(new Animated.Value(0)).current;

  const handlePress = React.useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  React.useEffect(() => {
    Animated.spring(checked, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      bounciness: 0,
      speed: 40,
    }).start();
  }, [checked, value]);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.root,
        {
          borderColor: theme.border.color.default,
        },
        {
          backgroundColor: checked.interpolate({
            inputRange: [0, 1],
            outputRange: [
              theme.container.color.tint,
              theme.container.color.primary,
            ],
          }),
        },
      ]}
    >
      <Animated.View
        style={[
          styles.slider,
          theme.container.shadow,
          {
            transform: [
              {
                translateX: checked.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 26],
                }),
              },
            ],
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 999,
    width: 56,
    height: 32,
    borderWidth: 1,
  },
  slider: {
    borderRadius: 999,
    top: 2,
    width: 26,
    height: 26,
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
