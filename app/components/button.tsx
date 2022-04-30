import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { tokens } from "./tokens";
import { Icon, IconName } from "./icon";
import { Spacer } from "./spacer";
import { Text, TextColor } from "./text";
import { PressableStateCallback } from "./pressable_highlight";
import { theme } from "./theme";

type ButtonAppearance = "flat" | "outline" | "filled";
type ButtonColor = "default" | "primary" | "error";

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  icon?: IconName;
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
        const style = getButtonStyle(
          appearance,
          color,
          state as PressableStateCallback
        );

        return [styles.button, style];
      }}
    >
      {icon && <Icon color={textColor} name={icon} />}
      {icon && title && <Spacer size={4} />}
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
  flatDefaultDefault: {},
  flatDefaultHovered: {
    backgroundColor: theme.neutral.lightest,
  },
  flatDefaultPressed: {
    backgroundColor: theme.neutral.lightest,
  },
  flatErrorDefault: {},
  flatErrorHovered: {
    backgroundColor: theme.error.lightest,
  },
  flatErrorPressed: {
    backgroundColor: theme.error.light,
  },
  flatPrimaryDefault: {},
  flatPrimaryHovered: {
    backgroundColor: theme.primary.lightest,
  },
  flatPrimaryPressed: {
    backgroundColor: theme.primary.light,
  },
  outlineDefaultDefault: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral.light,
  },
  outlineDefaultHovered: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral.light,
    backgroundColor: theme.neutral.lightest,
  },
  outlineDefaultPressed: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral.light,
    backgroundColor: theme.neutral.light,
  },
  outlineErrorDefault: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.error.light,
  },
  outlineErrorHovered: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.error.light,
    backgroundColor: theme.error.lightest,
  },
  outlineErrorPressed: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.error.light,
    backgroundColor: theme.error.light,
  },
  outlinePrimaryDefault: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary.dark,
  },
  outlinePrimaryHovered: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary.dark,
    backgroundColor: theme.primary.lightest,
  },
  outlinePrimaryPressed: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary.dark,
    backgroundColor: theme.primary.light,
  },
  filledDefaultDefault: {
    backgroundColor: theme.primary.default,
  },
  filledDefaultHovered: {
    backgroundColor: theme.primary.dark,
  },
  filledDefaultPressed: {
    backgroundColor: theme.primary.darkest,
  },
  filledErrorDefault: {
    backgroundColor: theme.error.default,
  },
  filledErrorHovered: {
    backgroundColor: theme.error.dark,
  },
  filledErrorPressed: {
    backgroundColor: theme.error.darkest,
  },
  filledPrimaryDefault: {
    backgroundColor: theme.primary.default,
  },
  filledPrimaryHovered: {
    backgroundColor: theme.primary.dark,
  },
  filledPrimaryPressed: {
    backgroundColor: theme.primary.darkest,
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
