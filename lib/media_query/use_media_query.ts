import React, { useCallback } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { ascendingBreakpoints, Breakpoint, breakpoints } from './breakpoints';

interface MediaQuery {
  size: ScreenSize;
  dimensions: ScaledSize;
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

  let size = 'xs' as ScreenSize;

  ascendingBreakpoints.forEach((breakpoint: Breakpoint) => {
    if (dimensions.width >= breakpoints[breakpoint]) {
      size = breakpoint;
    }
  });

  return {
    dimensions,
    size,
  };
}

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
