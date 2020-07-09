import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

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
  primary: string;
  muted: string;
  white: string;
  success: string;
  error: string;
}

export type TextColor = keyof TextColors;

interface ContainerColors {
  default: string;
  content: string;
  primary: string;
  tint: string;
  darkTint: string;
}

export type ContainerColor = keyof ContainerColors;

export interface Tokens {
  radius: number;
  fontFamily: string;
  text: {
    size: TextSizes;
  };
  animation: {
    spring: {
      bounciness: number;
    };
  };
}
export const tokens: Tokens = {
  radius: 8,
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
  "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
  "Helvetica Neue", sans-serif`,
  text: {
    size: {
      xl: {
        fontSize: 31.25,
        lineHeight: 41,
      },
      lg: {
        fontSize: 24,
        lineHeight: 32,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
      },
      sm: {
        fontSize: 14,
        lineHeight: 18,
      },
      xs: {
        fontSize: 12,
        lineHeight: 16,
      },
    },
  },
  animation: {
    spring: {
      bounciness: 0,
    },
  },
};

interface ButtonAppearance {
  backgroundDefault: string;
  backgroundPressed: string;
  backgroundHovered: string;
}

interface Theme {
  container: {
    color: ContainerColors;
    shadow: ViewStyle;
  };
  text: {
    color: TextColors;
  };
  button: {
    primary: ButtonAppearance;
    flat: ButtonAppearance;
  };
  border: {
    color: {
      transparent: string;
      default: string;
      dark: string;
      focus: string;
    };
  };
}

const lightTheme: Theme = {
  container: {
    color: {
      default: 'rgba(255, 255, 255, 0)',
      content: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(0, 102, 204, 1)',
      tint: 'rgba(246, 246, 246, 1)',
      darkTint: 'rgba(230, 230, 230, 1)',
    },
    shadow: {
      shadowColor: 'rgba(0, 0, 0, 1)',
      shadowOffset: {
        width: 6,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 24,
    },
  },
  text: {
    color: {
      default: 'rgba(34, 34, 34, 1)',
      primary: 'rgba(0, 102, 204, 1)',
      muted: 'rgba(134, 134, 139, 1)',
      success: 'string',
      error: 'rgba(234, 0, 68, 1)',
      white: 'white',
    },
  },
  button: {
    flat: {
      backgroundDefault: 'rgba(255, 255, 255, 0)',
      backgroundHovered: 'rgba(245, 245, 245, 1)',
      backgroundPressed: 'rgba(230, 230, 230, 1)',
    },
    primary: {
      backgroundDefault: 'rgba(255, 255, 255, 0)',
      backgroundHovered: 'rgba(245, 245, 245, 1)',
      backgroundPressed: 'rgba(230, 230, 230, 1)',
    },
  },
  border: {
    color: {
      transparent: 'rgba(255, 255, 255, 0)',
      default: 'rgba(34, 34, 34, 0.15)',
      dark: 'rgba(34, 34, 34, 0.4)',
      focus: 'rgba(34, 34, 34, 1)',
    },
  },
};

export const ThemeContext = React.createContext<Theme>(lightTheme);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;

  return (
    <ThemeContext.Provider value={lightTheme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
