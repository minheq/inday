import React, { useCallback, useMemo } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import {
  ascendingBreakpoints,
  Breakpoint,
  breakpoints,
  ScreenSize,
  screenSizeHierarchy,
} from './breakpoints';

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
  const [dimensions, setDimensions] = React.useState<ScaledSize>(
    Dimensions.get('window'),
  );

  const handleDimensionsChange = useCallback(
    ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
      setDimensions(window);
    },
    [],
  );

  React.useEffect(() => {
    Dimensions.addEventListener('change', handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, [handleDimensionsChange]);

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
