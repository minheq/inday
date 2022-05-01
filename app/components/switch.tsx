import React, { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Pressable } from "./pressable";
import { theme } from "./theme";
interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Switch(props: SwitchProps): JSX.Element {
  const { value, onChange } = props;
  const checked = useRef(new Animated.Value(0)).current;

  const handlePress = useCallback(() => {
    if (onChange !== undefined) {
      onChange(!value);
    }
  }, [value, onChange]);

  useEffect(() => {
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
              outputRange: [theme.neutral[100], theme.primary[100]],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.slider,
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
  },
  wrapper: {
    borderRadius: 999,
    position: "absolute",
    width: "100%",
    height: "100%",
    borderColor: theme.neutral[200],
  },
  slider: {
    borderRadius: 999,
    top: 2,
    width: 26,
    height: 26,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.base.white,
    ...theme.elevation.level1,
  },
});
