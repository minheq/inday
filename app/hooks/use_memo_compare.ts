import { useEffect, useRef } from 'react';

/**
 * This hook is similar to `useMemo`, but instead of passing an array of dependencies we pass a custom compare function.
 * If the compare function returns `true` then the hook returns the old object reference.
 */
export function useMemoCompare<T>(
  value: () => T,
  compare: (prev: T, next: T) => boolean,
): T {
  // Ref for storing previous value
  const previousRef = useRef<T>(value());
  const previous = previousRef.current;

  // Pass previous and next value to compare function
  // to determine whether to consider them equal.
  const equal = compare(previous, value());

  // If not equal update previousRef to next value.
  // We only update if not equal so that this hook continues to return
  // the same old value if compare keeps returning true.
  useEffect(() => {
    if (!equal) {
      previousRef.current = value();
    }
  });

  // Finally, if equal then return the previous value
  return equal ? previous : value();
}
