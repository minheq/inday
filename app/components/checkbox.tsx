import React from 'react';
import { Icon } from './icon';
import { StyleSheet, View, Animated } from 'react-native';
import { Pressable } from './pressable';
import { useTheme } from './theme';

interface CheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {
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
      {value && (
        <View style={styles.checkmark}>
          <Icon name="check" color="white" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 999,
    width: 24,
    height: 24,
    padding: 4,
    borderWidth: 1,
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
