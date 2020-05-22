import React from 'react';

interface ToggleHandlers {
  toggle: () => void;
  set: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
}

export function useToggle(
  initialValue: boolean = false,
): [boolean, ToggleHandlers] {
  const [value, setValue] = React.useState(initialValue);

  const set = React.useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  const toggle = React.useCallback(() => {
    setValue(!value);
  }, [value]);

  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);

  const handlers = { set, toggle, setTrue, setFalse };

  return [value, handlers];
}
