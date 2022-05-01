import { ColorSchemeName } from "react-native";
import { palette } from "./palette";

/* eslint-disable react-native/no-color-literals */

export interface Theme {
  colorScheme: ColorSchemeName;
  base: {
    white: string;
  };
  primary: {
    900: string;
    800: string;
    700: string;
    600: string;
    500: string;
    400: string;
    300: string;
    200: string;
    100: string;
    50: string;
  };
  success: {
    900: string;
    800: string;
    700: string;
    600: string;
    500: string;
    400: string;
    300: string;
    200: string;
    100: string;
    50: string;
  };
  error: {
    900: string;
    800: string;
    700: string;
    600: string;
    500: string;
    400: string;
    300: string;
    200: string;
    100: string;
    50: string;
  };
  neutral: {
    900: string;
    800: string;
    700: string;
    600: string;
    500: string;
    400: string;
    300: string;
    200: string;
    100: string;
    50: string;
  };
  elevation: {
    level1: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowRadius: number;
    };
  };
}

export const theme: Theme = {
  colorScheme: "light",
  base: {
    white: "white",
  },
  primary: {
    900: palette.blue[900],
    800: palette.blue[800],
    700: palette.blue[700],
    600: palette.blue[600],
    500: palette.blue[500],
    400: palette.blue[400],
    300: palette.blue[300],
    200: palette.blue[200],
    100: palette.blue[100],
    50: palette.blue[50],
  },
  success: {
    900: palette.green[900],
    800: palette.green[800],
    700: palette.green[700],
    600: palette.green[600],
    500: palette.green[500],
    400: palette.green[400],
    300: palette.green[300],
    200: palette.green[200],
    100: palette.green[100],
    50: palette.green[50],
  },
  error: {
    900: palette.red[900],
    800: palette.red[800],
    700: palette.red[700],
    600: palette.red[600],
    500: palette.red[500],
    400: palette.red[400],
    300: palette.red[300],
    200: palette.red[200],
    100: palette.red[100],
    50: palette.red[50],
  },
  neutral: {
    900: palette.neutral[900],
    800: palette.neutral[800],
    700: palette.neutral[700],
    600: palette.neutral[600],
    500: palette.neutral[500],
    400: palette.neutral[400],
    300: palette.neutral[300],
    200: palette.neutral[200],
    100: palette.neutral[100],
    50: palette.neutral[50],
  },
  elevation: {
    level1: {
      shadowColor: palette.gray[100],
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowRadius: 16,
    },
  },
};
