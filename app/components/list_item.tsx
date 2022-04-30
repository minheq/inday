import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Text } from "./text";
import { tokens } from "./tokens";

interface ListItemProps {
  onPress?: () => void;
  title?: string;
  description?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ListItem(props: ListItemProps): JSX.Element {
  const { onPress, title, description, leading, actions } = props;

  return (
    <Pressable style={styles.base} onPress={onPress}>
      <View style={styles.content}>
        {leading !== null && <View style={styles.leading}>{leading}</View>}
        <View style={styles.text}>
          {title && <Text weight="bold">{title}</Text>}
          {description && <Text>{description}</Text>}
        </View>
      </View>
      {actions && <View style={styles.actions}>{actions}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.border.radius,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leading: {
    paddingRight: 8,
  },
  content: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
  },
  text: {
    justifyContent: "center",
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 8,
  },
});
