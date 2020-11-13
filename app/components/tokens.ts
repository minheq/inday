export interface Tokens {
  radius: number;
  text: {
    fontFamily: string;
    size: TextSizes;
  };
  animation: {
    spring: {
      bounciness: number;
    };
  };
  contentWidth: number;
}

interface TextSizeStyle {
  fontSize: number;
  lineHeight: number;
}

interface TextSizes {
  xl: TextSizeStyle;
  lg: TextSizeStyle;
  md: TextSizeStyle;
  sm: TextSizeStyle;
  xs: TextSizeStyle;
}

export type TextSize = keyof TextSizes;

export const tokens: Tokens = {
  radius: 8,
  text: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif`,
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
  contentWidth: 1366,
};
