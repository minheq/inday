import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, Animated, StyleSheet } from "react-native";
import { useTheme, useThemeStyles } from "./theme";

interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Switch(props: SwitchProps): JSX.Element {
  const { value, onChange } = props;
  const checked = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const themeStyles = useThemeStyles();

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
          themeStyles.border.default,
          {
            backgroundColor: checked.interpolate({
              inputRange: [0, 1],
              outputRange: [theme.background.tint, theme.background.primary],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.slider,
            themeStyles.elevation.level1,
            themeStyles.background.content,
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
  },
  slider: {
    borderRadius: 999,
    top: 2,
    width: 26,
    height: 26,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
