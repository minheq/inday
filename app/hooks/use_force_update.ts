import React from 'react';

export function useForceUpdate() {
  const [, setValue] = React.useState(0);

  const forceUpdate = React.useCallback(() => setValue((value) => ++value), []);

  return forceUpdate;
}
