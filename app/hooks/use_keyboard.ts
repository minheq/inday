import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

export type KeyValue =
  | 'Backspace'
  | 'ArrowUp'
  | 'ArrowLeft'
  | 'ArrowDown'
  | 'ArrowRight'
  | 'Space'
  | 'Enter'
  | 'Shift'
  | ' ';

export type KeyPressHandler = (keyValue: KeyValue) => void;

export function useKeyboard(handler: KeyPressHandler) {
  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      handler(event.key as KeyValue);
    },
    [handler],
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleOnKeyDown);

      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', handleOnKeyDown);
      };
    }
  }, [handleOnKeyDown]);
}
