import React, { memo, useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";

import { Icon, IconName } from "./icon";
import { TextColor } from "./text";
import { theme } from "./theme";
import { tokens } from "./tokens";

interface CheckboxAltProps extends CheckboxAltViewProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function CheckboxAlt(props: CheckboxAltProps): JSX.Element {
  const { value, onChange, icon, color } = props;

  const handlePress = useCallback(() => {
    if (onChange !== undefined) {
      onChange(!value);
    }
  }, [value, onChange]);

  return (
    <Pressable onPress={handlePress}>
      <CheckboxAltView icon={icon} color={color} value={value} />
    </Pressable>
  );
}

interface CheckboxAltViewProps {
  value?: boolean;
  icon?: IconName;
  color?: TextColor;
}

export const CheckboxAltView = memo(function CheckboxAltView(
  props: CheckboxAltViewProps
) {
  const { value, icon = "CheckThick", color = "success" } = props;

  return (
    <View style={styles.selectCheckboxAlt}>
      {value && <Icon name={icon} color={color} />}
    </View>
  );
});

const styles = StyleSheet.create({
  selectCheckboxAlt: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral.light,
    justifyContent: "center",
    alignItems: "center",
  },
});
