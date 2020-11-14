import React from 'react';

export function useDebouncedCallback<TArgs extends any[]>(
  callback: (...args: TArgs) => void,
  deps: React.DependencyList,
  wait = 500,
) {
  // track args & timeout handle between calls
  const argsRef = React.useRef<TArgs>();
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  React.useEffect(() => cleanup, []);

  return React.useCallback((...args: TArgs) => {
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
  }, deps);
}
