import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type KeyValue =
  | 'Alt'
  | 'Control'
  | 'Meta'
  | 'Shift'
  | 'Enter'
  | ' '
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp';

export type KeyMap = {
  [keyValue in KeyValue]: boolean;
};
export type KeyEventHandler = (keyMap: KeyMap) => void;

export function useKeyboard(handler: KeyEventHandler) {
  const [keyMap, setKeyMap] = useState<KeyMap>({
    Alt: false,
    Control: false,
    Meta: false,
    Shift: false,
    Enter: false,
    ' ': false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
  });

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      const nextKeyMap: KeyMap = {
        ...keyMap,
        [event.key]: true,
      };

      handler(nextKeyMap);

      setKeyMap(nextKeyMap);
    },
    [handler, keyMap],
  );

  const handleOnKeyUp = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      const nextKeyMap: KeyMap = {
        ...keyMap,
        [event.key]: false,
      };

      setKeyMap(nextKeyMap);
    },
    [keyMap],
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleOnKeyDown);
      window.addEventListener('keyup', handleOnKeyUp);

      return () => {
        window.removeEventListener('keydown', handleOnKeyDown);
        window.removeEventListener('keyup', handleOnKeyUp);
      };
    }
  }, [handleOnKeyDown, handleOnKeyUp]);
}
