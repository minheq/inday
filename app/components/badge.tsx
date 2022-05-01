import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./text";
import { theme } from "./theme";
import { tokens } from "./tokens";

interface BadgeProps {
  title: string;
  color?: string;
  textColor?: string;
}

export function Badge(props: BadgeProps): JSX.Element {
  const { title, color, textColor } = props;

  return (
    <View
      style={[styles.base, { backgroundColor: color ?? theme.neutral[100] }]}
    >
      <Text customColor={textColor} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.border.radius,
    paddingHorizontal: 8,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
});
