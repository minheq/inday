import React from "react";
import { StyleSheet } from "react-native";
import { tokens } from "./tokens";
import { Icon, IconName } from "./icon";
import { Spacer } from "./spacer";
import { Text, TextColor } from "./text";
import { PressableStateCallback } from "./pressable_highlight";
import { theme } from "./theme";
import { Pressable } from "./pressable";

export type ButtonAppearance = "flat" | "outline" | "filled";
export type ButtonAlign = "left" | "center" | "right";
export type ButtonColor = "default" | "primary" | "error";

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  icon?: IconName;
  iconColor?: string;
  align?: ButtonAlign;
  appearance?: ButtonAppearance;
  color?: ButtonColor;
  weight?: "bold" | "normal";
}

export function Button(props: ButtonProps): JSX.Element {
  const {
    onPress,
    icon,
    disabled = false,
    weight = "normal",
    align = "center",
    iconColor,
    title,
    appearance = "flat",
    color = "default",
  } = props;

  const textColor = getTextColor(appearance, color);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={(state) => {
        const style = getButtonStyle(appearance, color, state);

        return [styles.button, styles[align], style];
      }}
    >
      {icon && <Icon customColor={iconColor} color={textColor} name={icon} />}
      {icon && title && <Spacer direction="row" size={4} />}
      {title && (
        <Text weight={weight} color={textColor}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

function getButtonStyle(
  appearance: ButtonAppearance,
  color: ButtonColor,
  state: PressableStateCallback
) {
  const style = styleMapping[appearance][color];
  if (state.pressed) {
    return style.pressed;
  } else if (state.hovered) {
    return style.hovered;
  }

  return style.default;
}

function getTextColor(
  appearance: ButtonAppearance,
  color: ButtonColor
): TextColor {
  switch (appearance) {
    case "flat":
      return color === "primary" ? "primary" : "default";
    case "outline":
      return color === "primary" ? "primary" : "default";
    case "filled":
      return "default";
    default:
      return "default";
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: tokens.border.radius,
    flexDirection: "row",
    minWidth: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  left: {
    justifyContent: "flex-start",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  center: {
    justifyContent: "center",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  right: {
    justifyContent: "flex-end",
  },
  flatDefaultDefault: {},
  flatDefaultHovered: {
    backgroundColor: theme.neutral[100],
  },
  flatDefaultPressed: {
    backgroundColor: theme.neutral[200],
  },
  flatErrorDefault: {},
  flatErrorHovered: {
    backgroundColor: theme.error[50],
  },
  flatErrorPressed: {
    backgroundColor: theme.error[100],
  },
  flatPrimaryDefault: {},
  flatPrimaryHovered: {
    backgroundColor: theme.primary[50],
  },
  flatPrimaryPressed: {
    backgroundColor: theme.primary[100],
  },
  outlineDefaultDefault: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral[200],
  },
  outlineDefaultHovered: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral[200],
    backgroundColor: theme.neutral[50],
  },
  outlineDefaultPressed: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral[200],
    backgroundColor: theme.neutral[100],
  },
  outlineErrorDefault: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.error[100],
  },
  outlineErrorHovered: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.error[100],
    backgroundColor: theme.error[50],
  },
  outlineErrorPressed: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.error[100],
    backgroundColor: theme.error[100],
  },
  outlinePrimaryDefault: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary[600],
  },
  outlinePrimaryHovered: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary[600],
    backgroundColor: theme.primary[50],
  },
  outlinePrimaryPressed: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary[600],
    backgroundColor: theme.primary[100],
  },
  filledDefaultDefault: {
    backgroundColor: theme.primary[700],
  },
  filledDefaultHovered: {
    backgroundColor: theme.primary[600],
  },
  filledDefaultPressed: {
    backgroundColor: theme.primary[800],
  },
  filledErrorDefault: {
    backgroundColor: theme.error[700],
  },
  filledErrorHovered: {
    backgroundColor: theme.error[600],
  },
  filledErrorPressed: {
    backgroundColor: theme.error[800],
  },
  filledPrimaryDefault: {
    backgroundColor: theme.primary[700],
  },
  filledPrimaryHovered: {
    backgroundColor: theme.primary[600],
  },
  filledPrimaryPressed: {
    backgroundColor: theme.primary[800],
  },
});

const styleMapping: {
  [appearance in ButtonAppearance]: {
    [color in ButtonColor]: {
      default: object;
      hovered: object;
      pressed: object;
    };
  };
} = {
  flat: {
    default: {
      default: styles.flatDefaultDefault,
      hovered: styles.flatDefaultHovered,
      pressed: styles.flatDefaultPressed,
    },
    error: {
      default: styles.flatErrorDefault,
      hovered: styles.flatErrorHovered,
      pressed: styles.flatErrorPressed,
    },
    primary: {
      default: styles.flatPrimaryDefault,
      hovered: styles.flatPrimaryHovered,
      pressed: styles.flatPrimaryPressed,
    },
  },
  outline: {
    default: {
      default: styles.outlineDefaultDefault,
      hovered: styles.outlineDefaultHovered,
      pressed: styles.outlineDefaultPressed,
    },
    error: {
      default: styles.outlineErrorDefault,
      hovered: styles.outlineErrorHovered,
      pressed: styles.outlineErrorPressed,
    },
    primary: {
      default: styles.outlinePrimaryDefault,
      hovered: styles.outlinePrimaryHovered,
      pressed: styles.outlinePrimaryPressed,
    },
  },
  filled: {
    default: {
      default: styles.filledDefaultDefault,
      hovered: styles.filledDefaultHovered,
      pressed: styles.filledDefaultPressed,
    },
    error: {
      default: styles.filledErrorDefault,
      hovered: styles.filledErrorHovered,
      pressed: styles.filledErrorPressed,
    },
    primary: {
      default: styles.filledPrimaryDefault,
      hovered: styles.filledPrimaryHovered,
      pressed: styles.filledPrimaryPressed,
    },
  },
} as const;
