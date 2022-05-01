import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "./theme";

/**
 * Visual separator between components.
 */
export function Divider(): JSX.Element {
  return <View style={[styles.base, { borderColor: theme.neutral[200] }]} />;
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: 1,
  },
});
