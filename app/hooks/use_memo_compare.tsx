import { useRef } from "react";

/**
 * This hook is similar to useMemo, but instead of passing an array of dependencies we pass a custom compare function that receives the previous and new value.
 * If the compare function returns false then the hook returns the old object reference.
 */
export function useMemoCompare<T>(
  getValue: () => T,
  compare: ((previous: T, next: T) => boolean) | boolean
): T {
  // Ref for storing previous value
  const previousRef = useRef(getValue());
  const previous = previousRef.current;

  let next: T | null = null;
  let changed = false;

  if (typeof compare === "function") {
    next = getValue();
    changed = compare(previous, next);
  } else {
    changed = compare;
  }

  if (!changed) {
    return previous;
  }

  if (!next) {
    next = getValue();
  }

  previousRef.current = next;
  return next;
}
