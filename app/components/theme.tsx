import { ColorSchemeName } from "react-native";
import { palette } from "./palette";

/* eslint-disable react-native/no-color-literals */

export interface Theme {
  colorScheme: ColorSchemeName;
  base: {
    default: string;
  };
  primary: {
    darkest: string;
    dark: string;
    default: string;
    light: string;
    lightest: string;
  };
  success: {
    darkest: string;
    dark: string;
    default: string;
    light: string;
    lightest: string;
  };
  error: {
    darkest: string;
    dark: string;
    default: string;
    light: string;
    lightest: string;
  };
  neutral: {
    darkest: string;
    dark: string;
    default: string;
    light: string;
    lightest: string;
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
    default: palette.base.white,
  },
  primary: {
    darkest: palette.blue[900],
    dark: palette.blue[800],
    default: palette.blue[600],
    light: palette.blue[300],
    lightest: palette.blue[50],
  },
  success: {
    darkest: palette.green[900],
    dark: palette.green[800],
    default: palette.green[600],
    light: palette.green[300],
    lightest: palette.green[50],
  },
  error: {
    darkest: palette.red[900],
    dark: palette.red[800],
    default: palette.red[600],
    light: palette.red[300],
    lightest: palette.red[50],
  },
  neutral: {
    darkest: palette.red[900],
    dark: palette.gray[800],
    default: palette.gray[600],
    light: palette.gray[300],
    lightest: palette.gray[50],
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
