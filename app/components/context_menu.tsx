import React, { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PressableHighlight } from "./pressable_highlight";
import { Icon, IconName } from "./icon";
import { Text, TextColor } from "./text";
import { tokens } from "./tokens";

export interface ContextMenuProps {
  menuItems: ContextMenuItem[];
  onPressMenuItem?: (menuItem: ContextMenuItem) => void;
  width?: number;
}

export const CONTEXT_MENU_ITEM_HEIGHT = 32;

export function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { menuItems, onPressMenuItem, width = 240 } = props;

  return (
    <View style={[styles.wrapper, { width }]}>
      <ScrollView>
        {menuItems.map((item) => (
          <ContextMenuItem
            onPressMenuItem={onPressMenuItem}
            key={item.label}
            item={item}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface ContextMenuItemProps {
  item: ContextMenuItem;
  onPressMenuItem?: (menuItem: ContextMenuItem) => void;
}

export interface ContextMenuItem {
  color?: TextColor;
  onPress?: () => void;
  label: string;
  icon?: IconName;
}

function ContextMenuItem(props: ContextMenuItemProps) {
  const { item, onPressMenuItem } = props;
  const { onPress, color, label, icon } = item;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    }

    if (onPressMenuItem) {
      onPressMenuItem(item);
    }
  }, [onPress, onPressMenuItem, item]);

  return (
    <PressableHighlight key={label} onPress={handlePress} style={styles.button}>
      <View style={styles.labelWrapper}>
        <Text color={color}>{label}</Text>
      </View>
      <View style={styles.iconWrapper}>{icon && <Icon name={icon} />}</View>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  labelWrapper: {
    flex: 1,
  },
  iconWrapper: {
    height: CONTEXT_MENU_ITEM_HEIGHT,
    width: 32,
    paddingLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: tokens.border.radius,
    flexDirection: "row",
    alignItems: "center",
    height: CONTEXT_MENU_ITEM_HEIGHT,
    paddingHorizontal: 8,
  },
});
