import React from 'react';
import { Icon } from './icon';
import { View, Pressable, Animated } from 'react-native';
import { isNonNullish } from '../../lib/js_utils';
import { DynamicStyleSheet } from './stylesheet';
import { palette } from './palette';

interface CheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const { value, onChange } = props;
  const checked = React.useRef(new Animated.Value(0)).current;

  const handlePress = React.useCallback(() => {
    if (isNonNullish(onChange)) {
      onChange(!value);
    }
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
      style={[styles.root, value && styles.checked]}
    >
      {value && (
        <View style={styles.checkmark}>
          <Icon name="Check" color="contrast" />
        </View>
      )}
    </Pressable>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  root: {
    borderRadius: 999,
    width: 24,
    height: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  checked: {
    backgroundColor: palette.blue[400],
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
}));
