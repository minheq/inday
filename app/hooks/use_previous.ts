import React from 'react';

export function usePrevious<T = any>(value: T): T {
  const ref = React.useRef(value);

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
