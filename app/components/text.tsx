import React from "react";
import { Text as RNText, TextStyle, StyleSheet } from "react-native";
import { theme } from "./theme";
import { tokens } from "./tokens";

export interface TextProps {
  children?: string;
  size?: TextSize;
  color?: TextColor;
  customColor?: string;
  align?: "left" | "right" | "center";
  weight?: TextWeight;
  selectable?: boolean;
  testID?: string;
  numberOfLines?: number;
  decoration?: TextDecorationLine;
}

type TextDecorationLine =
  | "none"
  | "underline"
  | "line-through"
  | "underline line-through";

export type TextWeight =
  | "normal"
  | "bold"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

interface TextSizes {
  xl: TextStyle;
  lg: TextStyle;
  md: TextStyle;
  sm: TextStyle;
  xs: TextStyle;
}

export type TextSize = keyof TextSizes;

interface TextColors {
  default: string;
  success: string;
  primary: string;
  muted: string;
  error: string;
}

export type TextColor = keyof TextColors;

/**
 * Run of text with a single style.
 */
export function Text(props: TextProps): JSX.Element {
  const {
    align = "left",
    children,
    color = "default",
    customColor,
    size = "md",
    selectable = false,
    testID,
    numberOfLines,
    decoration = "none",
    weight = "normal",
  } = props;

  return (
    <RNText
      testID={testID}
      style={[
        styles[align],
        styles[size],
        styles[color],
        styles[weight],
        styles[decoration],
        {
          ...(customColor !== undefined && {
            color: customColor,
          }),
        },
      ]}
      selectable={selectable}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  xl: tokens.text.size.xl,
  // eslint-disable-next-line react-native/no-unused-styles
  lg: tokens.text.size.lg,
  // eslint-disable-next-line react-native/no-unused-styles
  md: tokens.text.size.md,
  // eslint-disable-next-line react-native/no-unused-styles
  sm: tokens.text.size.sm,
  // eslint-disable-next-line react-native/no-unused-styles
  xs: tokens.text.size.xs,
  // eslint-disable-next-line react-native/no-unused-styles
  left: {
    textAlign: "left",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  right: {
    textAlign: "right",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  center: {
    textAlign: "center",
  },

  // eslint-disable-next-line react-native/no-unused-styles
  default: {
    color: theme.neutral.dark,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  success: {
    color: theme.success.default,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  primary: {
    color: theme.primary.dark,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  muted: {
    color: theme.neutral.default,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  error: {
    color: theme.error.default,
  },

  // eslint-disable-next-line react-native/no-unused-styles
  normal: {
    fontWeight: "normal",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  bold: {
    fontWeight: "bold",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "300": {
    fontWeight: "300",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "400": {
    fontWeight: "400",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "500": {
    fontWeight: "500",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "600": {
    fontWeight: "600",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "700": {
    fontWeight: "700",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "800": {
    fontWeight: "800",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "900": {
    fontWeight: "900",
  },

  // eslint-disable-next-line react-native/no-unused-styles
  none: {
    textDecorationLine: "none",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  underline: {
    textDecorationLine: "underline",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "line-through": {
    textDecorationLine: "line-through",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  "underline line-through": {
    textDecorationLine: "underline line-through",
  },
});
