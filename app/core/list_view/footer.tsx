import React from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../../components/theme";

interface FooterProps {
  children: React.ReactNode;
}

export function Footer(props: FooterProps): JSX.Element {
  const { children } = props;

  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.base.white,
  },
});
