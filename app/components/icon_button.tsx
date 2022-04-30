import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { tokens } from "./tokens";
import { Icon, IconName } from "./icon";
import { Spacer } from "./spacer";
import { Text } from "./text";
import { PressableHighlight } from "./pressable_highlight";

interface IconButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  icon?: IconName;
}

export function IconButton(props: IconButtonProps): JSX.Element {
  const { onPress, icon, disabled = false, title } = props;

  return (
    <PressableHighlight
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
    >
      <View style={styles.root}>
        {icon && <Icon name={icon} />}
        {title && (
          <Fragment>
            <Spacer size={4} />
            <Text size="xs">{title}</Text>
          </Fragment>
        )}
      </View>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: tokens.border.radius,
    minWidth: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: tokens.border.radius,
  },
});
