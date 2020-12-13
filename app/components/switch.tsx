import React from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { tokens } from './tokens';

interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Switch(props: SwitchProps): JSX.Element {
  const { value, onChange } = props;
  const checked = React.useRef(new Animated.Value(0)).current;

  const handlePress = React.useCallback(() => {
    if (onChange !== undefined) {
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
              outputRange: [tokens.colors.blue[50], tokens.colors.blue[500]],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.slider,
            tokens.shadow.elevation1,
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

const styles = StyleSheet.create({
  root: {
    borderRadius: 999,
    width: 56,
    height: 32,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
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
    backgroundColor: tokens.colors.base.white,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
