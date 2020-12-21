import React, { useCallback, useEffect, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';

import { Icon } from './icon';
import { usePrevious } from '../hooks/use_previous';
import { useTheme } from './theme';

interface CheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const { value, onChange } = props;
  const theme = useTheme();
  const checked = useRef(new Animated.Value(value ? 1 : 0)).current;
  const prevValue = usePrevious(value);
  const handlePress = useCallback(() => {
    if (onChange !== undefined) {
      onChange(!value);
    }
  }, [value, onChange]);

  useEffect(() => {
    if (prevValue !== value) {
      Animated.spring(checked, {
        toValue: value ? 1 : 0,
        useNativeDriver: false,
        bounciness: 0,
        speed: 40,
      }).start();
    }
  }, [checked, value, prevValue]);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.root,
        { borderColor: value ? theme.border.primary : theme.border.default },
      ]}
    >
      <Animated.View
        style={[
          styles.wrapper,
          {
            backgroundColor: checked.interpolate({
              inputRange: [0, 1],
              outputRange: [theme.background.tint, theme.background.primary],
            }),
          },
        ]}
      >
        {value && (
          <View style={styles.checkmark}>
            <Icon name="Check" color="contrast" />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 999,
    width: 24,
    height: 24,
    borderWidth: 1,
  },
  wrapper: {
    borderRadius: 999,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  checkmark: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
