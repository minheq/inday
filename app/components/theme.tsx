import { ColorSchemeName } from "react-native";
import { palette } from "./palette";

/* eslint-disable react-native/no-color-literals */

export interface Theme {
  colorScheme: ColorSchemeName;
  base: {
    default: string;
  };
  primary: {
    dark: string;
    default: string;
    light: string;
  };
  success: {
    dark: string;
    default: string;
    light: string;
  };
  danger: {
    dark: string;
    default: string;
    light: string;
  };
  neutral: {
    dark: string;
    default: string;
    light: string;
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
    dark: palette.blue[800],
    default: palette.blue[600],
    light: palette.blue[50],
  },
  success: {
    dark: palette.green[800],
    default: palette.green[600],
    light: palette.green[50],
  },
  danger: {
    dark: palette.red[800],
    default: palette.red[600],
    light: palette.red[50],
  },
  neutral: {
    dark: palette.gray[900],
    default: palette.gray[600],
    light: palette.gray[300],
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
