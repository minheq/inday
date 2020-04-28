import React from 'react';

interface Theme {
  container: {
    shadow: string;
    radius: string;
    maxContentWidth: string;
  };
  background: {
    color: {
      primary: string;
      darkPrimary: string;
      lightPrimary: string;
      grey: string;
    };
  };
  text: {
    fontFamily: {
      body: string;
      heading: string;
    };
    color: {
      default: string;
      primary: string;
      muted: string;
      success: string;
      error: string;
    };
    xl: {
      size: number;
      lineHeight: number;
    };
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

const theme: Theme = {
  container: {
    shadow: 'string',
    radius: 'string',
    maxContentWidth: 'string',
  },
  background: {
    color: {
      primary: 'string',
      darkPrimary: 'string',
      lightPrimary: 'string',
      grey: 'string',
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
    xl: {
      size: 1,
      lineHeight: 1,
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
      default: 'string',
      focus: 'string',
    },
  },
};

const ThemeContext = React.createContext<Theme>(theme);

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
