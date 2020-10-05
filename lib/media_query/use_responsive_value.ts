import { useMediaQuery } from './use_media_query';
import { ascendingBreakpoints, Breakpoint, breakpoints } from './breakpoints';

export function useResponsiveValue<
  TXSValue = any,
  TSMValue = any,
  TMDValue = any,
  TLGValue = any,
  TXLValue = any
>(values: {
  xs?: TXLValue;
  sm?: TXSValue;
  md?: TSMValue;
  lg?: TMDValue;
  xl?: TLGValue;
}): TXLValue | TLGValue | TMDValue | TSMValue | TXSValue | undefined {
  const { dimensions } = useMediaQuery();

  let result: TXLValue | TLGValue | TMDValue | TSMValue | TXSValue | undefined =
    values.xs;

  ascendingBreakpoints.forEach((breakpoint: Breakpoint) => {
    if (
      values[breakpoint] !== null &&
      values[breakpoint] !== undefined &&
      dimensions.width > breakpoints[breakpoint]
    ) {
      result = values[breakpoint];
    }
  });

  return result;
}
