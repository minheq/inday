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
  success: string;
  error: string;
}

export type TextColor = keyof TextColors;

interface ContainerColors {
  default: string;
  content: string;
  primary: string;
  tint: string;
}

export type ContainerColor = keyof ContainerColors;

export const tokens = {
  radius: 8,
};

interface Theme {
  container: {
    color: ContainerColors;
    shadow: ViewStyle;
  };
  text: {
    fontFamily: {
      body: string;
      heading: string;
    };
    color: TextColors;
    size: TextSizes;
  };
  button: {
    primary: {
      textColor: string;
      disabled: string;
    };
  };
  border: {
    color: {
      default: string;
      focus: string;
    };
  };
}

const lightTheme: Theme = {
  container: {
    color: {
      default: 'transparent',
      content: '#ffffff',
      primary: 'string',
      tint: '#f9f9fb',
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 0.07,
      shadowRadius: 16,
    },
  },
  text: {
    fontFamily: {
      body: 'string',
      heading: 'string',
    },
    color: {
      default: 'string',
      primary: 'string',
      muted: 'string',
      success: 'string',
      error: 'string',
    },
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
  button: {
    primary: {
      textColor: 'string',
      disabled: 'string',
    },
  },
  border: {
    color: {
      default: 'rgba(0, 0, 0, 0.15)',
      focus: 'rgba(0, 0, 0, 1)',
    },
  },
};

const ThemeContext = React.createContext<Theme>(lightTheme);

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
