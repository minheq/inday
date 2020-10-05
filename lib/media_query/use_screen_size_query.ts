import { useMediaQuery } from './use_media_query';

export function useLargeScreenSizeQuery() {
  const { size } = useMediaQuery();

  return {
    isLarge: size === 'lg',
    isLargeOrBelow:
      size === 'lg' || size === 'md' || size === 'sm' || size === 'xs',
    isLargeOrAbove: size === 'lg' || size === 'xl',
  };
}
