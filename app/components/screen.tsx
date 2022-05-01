import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { theme } from "./theme";

interface ScreenProps {
  children?: React.ReactNode;
}

export function Screen(props: ScreenProps): JSX.Element {
  const { children } = props;

  return <SafeAreaView style={styles.root}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.base.white,
  },
});
