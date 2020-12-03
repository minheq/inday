import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<TArgs extends (number | string)[]>(
  callback: (...args: TArgs) => void,
  wait = 500,
): (...args: TArgs) => void {
  // track args & timeout handle between calls
  const argsRef = useRef<TArgs>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => cleanup, []);

  return useCallback(
    (...args: TArgs) => {
      // capture latest args
      argsRef.current = args;

      // clear debounce timer
      cleanup();

      // start waiting again
      timeout.current = setTimeout(() => {
        if (argsRef.current) {
          callback(...argsRef.current);
        }
      }, wait);
    },
    [callback, wait],
  );
}
