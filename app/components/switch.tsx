import React from 'react';
import { Pressable, Animated } from 'react-native';
import { isNonNullish } from '../../lib/js_utils';
import { palette } from './palette';
import { DynamicStyleSheet } from './stylesheet';
import { useTheme } from './theme';

interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Switch(props: SwitchProps): JSX.Element {
  const { value, onChange } = props;
  const theme = useTheme();
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
    <Pressable onPress={handlePress} style={styles.root}>
      <Animated.View
        style={[
          styles.wrapper,
          {
            backgroundColor: checked.interpolate({
              inputRange: [0, 1],
              outputRange: [theme.background.tint, palette.blue[500]],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.slider,
            theme.shadow,
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
      </Animated.View>
    </Pressable>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  root: {
    borderRadius: 999,
    width: 56,
    height: 32,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  wrapper: {
    borderRadius: 999,
    position: 'absolute',
    width: '100%',
    height: '100%',
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
}));
