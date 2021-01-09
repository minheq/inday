import { useRef } from 'react';

/**
 * This hook is similar to useMemo, but instead of passing an array of dependencies we pass a custom compare function that receives the previous and new value.
 * If the compare function returns false then the hook returns the old object reference.
 */
export function useMemoCompare<T>(
  getValue: () => T,
  compare: () => boolean,
): T {
  // Ref for storing previous value
  const previousRef = useRef(getValue());
  const previous = previousRef.current;

  // Pass previous and next value to compare function
  // to determine whether to consider them equal.
  const changed = compare();

  if (!changed) {
    return previous;
  }

  const nextValue = getValue();
  previousRef.current = nextValue;
  return nextValue;
}
