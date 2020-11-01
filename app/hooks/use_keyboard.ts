import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export type KeyValue =
  | 'Alt'
  | 'Control'
  | 'Meta'
  | 'Shift'
  | 'Enter'
  | 'Space'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp';

export type KeyMap = {
  [keyValue in KeyValue]: boolean;
};
export type KeyEventHandler = (keyMap: KeyMap) => void;

function normalize(key: string): KeyValue {
  switch (key) {
    case 'Up':
      return 'ArrowUp';
    case 'Down':
      return 'ArrowDown';
    case 'Left':
      return 'ArrowLeft';
    case 'Right':
      return 'ArrowRight';
    case ' ':
      return 'Space';
    default:
      break;
  }

  return key as KeyValue;
}

export function useKeyboard(handler: KeyEventHandler) {
  // Use ref to not trigger re-renders
  const keyMapRef = useRef({
    Alt: false,
    Control: false,
    Meta: false,
    Shift: false,
    Enter: false,
    Space: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
  });

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      const nextKeyMap: KeyMap = {
        ...keyMapRef.current,
        [normalize(event.key)]: true,
      };

      handler(nextKeyMap);

      keyMapRef.current = nextKeyMap;
    },
    [handler, keyMapRef],
  );

  const handleOnKeyUp = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      const nextKeyMap: KeyMap = {
        ...keyMapRef.current,
        [normalize(event.key)]: false,
      };

      keyMapRef.current = nextKeyMap;
    },
    [keyMapRef],
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
