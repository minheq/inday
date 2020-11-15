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
