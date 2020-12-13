import { useMemo } from 'react';
import { ScaledSize, useWindowDimensions } from 'react-native';

export interface SizeQuery {
  xsAndUp: boolean;
  smAndUp: boolean;
  mdAndUp: boolean;
  lgAndUp: boolean;
  xlAndUp: boolean;
  xsAndDown: boolean;
  smAndDown: boolean;
  mdAndDown: boolean;
  lgAndDown: boolean;
  xlAndDown: boolean;
}

interface MediaQuery {
  size: ScreenSize;
  dimensions: ScaledSize;
  sizeQuery: SizeQuery;
}

export function useMediaQuery(): MediaQuery {
  const dimensions = useWindowDimensions();

  let size: ScreenSize = 'xs';

  ascendingBreakpoints.forEach((breakpoint: Breakpoint) => {
    if (dimensions.width >= breakpoints[breakpoint]) {
      size = breakpoint;
    }
  });

  const sizeQuery = useMemo(() => {
    const xsAndUp =
      size === 'xs' || screenSizeHierarchy[size] > screenSizeHierarchy.xs;
    const smAndUp =
      size === 'sm' || screenSizeHierarchy[size] > screenSizeHierarchy.sm;
    const mdAndUp =
      size === 'md' || screenSizeHierarchy[size] > screenSizeHierarchy.md;
    const lgAndUp =
      size === 'lg' || screenSizeHierarchy[size] > screenSizeHierarchy.lg;
    const xlAndUp =
      size === 'xl' || screenSizeHierarchy[size] > screenSizeHierarchy.xl;
    const xsAndDown =
      size === 'xs' || screenSizeHierarchy[size] < screenSizeHierarchy.xs;
    const smAndDown =
      size === 'sm' || screenSizeHierarchy[size] < screenSizeHierarchy.sm;
    const mdAndDown =
      size === 'md' || screenSizeHierarchy[size] < screenSizeHierarchy.md;
    const lgAndDown =
      size === 'lg' || screenSizeHierarchy[size] < screenSizeHierarchy.lg;
    const xlAndDown =
      size === 'xl' || screenSizeHierarchy[size] < screenSizeHierarchy.xl;

    return {
      xsAndUp,
      smAndUp,
      mdAndUp,
      lgAndUp,
      xlAndUp,
      xsAndDown,
      smAndDown,
      mdAndDown,
      lgAndDown,
      xlAndDown,
    };
  }, [size]);

  return {
    dimensions,
    size,
    sizeQuery,
  };
}

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export type Breakpoint = keyof Breakpoints;

export const breakpoints: Breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const ascendingBreakpoints: Breakpoint[] = ['sm', 'md', 'lg', 'xl'];
export const ascendingScreenSizes: ScreenSize[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
];

export const screenSizeHierarchy: {
  [key in ScreenSize]: number;
} = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
};

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
