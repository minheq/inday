import { useCallback, useEffect, useMemo, useRef } from 'react';
import { groupBy } from '../../lib/array_utils';
import { isEmpty } from '../../lib/lang_utils';

export interface KeyBinding {
  key: KeyBindingKey;
  alt?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: (key: string) => void;
}

interface ActiveKeys {
  [key: string]: boolean | undefined;
}

export function useKeyboard(keyBindings: KeyBinding[], active = true): void {
  const activeKeysRef = useRef<ActiveKeys>({});

  const groupedKeyBindingsByKey = useMemo(() => {
    return groupBy(keyBindings, (keyBinding) => keyBinding.key);
  }, [keyBindings]);

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = normalize(event.key);
      const code = event.code;
      const activeKeys = activeKeysRef.current;
      const nextActiveKeys = { ...activeKeys, [key]: true };
      const printableKeyBindings = groupedKeyBindingsByKey['PrintableKey'];
      const printableKey = !!printableKeyBindings && isPrintableKey(code);

      activeKeysRef.current = nextActiveKeys;

      let matchedKeyBindings = groupedKeyBindingsByKey[key];

      if (matchedKeyBindings === undefined || isEmpty(matchedKeyBindings)) {
        if (printableKey === false) {
          return;
        }

        matchedKeyBindings = printableKeyBindings;
      }

      // We sort so that we prioritize keybindings that contain
      // most simultaneous modifier keys and handle them first
      matchedKeyBindings = matchedKeyBindings.slice(0).sort((a, b) => {
        const aCount = countModifierKeys(a);
        const bCount = countModifierKeys(b);

        if (bCount < aCount) {
          return -1;
        } else if (bCount > aCount) {
          return 1;
        }

        return 0;
      });

      for (let i = 0; i < matchedKeyBindings.length; i++) {
        const keyBinding = matchedKeyBindings[i];

        const { shift = false, alt = false, meta = false } = keyBinding;

        const activeShift = !!activeKeys[ModifierKey.Shift];
        const activeMeta = !!activeKeys[ModifierKey.Meta];
        const activeAlt = !!activeKeys[ModifierKey.Alt];

        if (
          (shift === activeShift && meta === activeMeta && alt === activeAlt) ||
          // Accept the standalone PrintableKey or Shift + PrintableKey
          (printableKey === true && activeMeta === false && activeAlt === false)
        ) {
          event.preventDefault();
          keyBinding.handler(key);
          return;
        }
      }
    },
    [groupedKeyBindingsByKey],
  );

  const handleOnKeyUp = useCallback((event: KeyboardEvent) => {
    const activeKeys = activeKeysRef.current;
    const key = normalize(event.key);
    const nextActiveKeys = { ...activeKeys, [key]: false };

    activeKeysRef.current = nextActiveKeys;
  }, []);

  const listen = useCallback(() => {
    window.addEventListener('keydown', handleOnKeyDown);
    window.addEventListener('keyup', handleOnKeyUp);
  }, [handleOnKeyDown, handleOnKeyUp]);

  const unsubscribe = useCallback(() => {
    window.removeEventListener('keydown', handleOnKeyDown);
    window.removeEventListener('keyup', handleOnKeyUp);
  }, [handleOnKeyDown, handleOnKeyUp]);

  useEffect(() => {
    if (active === true) {
      listen();
    }

    return () => {
      if (active === true) {
        unsubscribe();
      }
    };
  }, [active, listen, unsubscribe]);
}

function normalize(key: string): KeyboardKey {
  switch (key) {
    case 'Up':
      return NavigationKey.ArrowUp;
    case 'Down':
      return NavigationKey.ArrowDown;
    case 'Left':
      return NavigationKey.ArrowLeft;
    case 'Right':
      return NavigationKey.ArrowRight;
    case ' ':
      return WhiteSpaceKey.Space;
  }

  return key as KeyboardKey;
}

function countModifierKeys(keyBinding: KeyBinding): number {
  return (
    (keyBinding.meta ? 1 : 0) +
    (keyBinding.shift ? 1 : 0) +
    (keyBinding.alt ? 1 : 0)
  );
}

/**
 * All keys derived from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */

// eslint-disable-next-line
export enum NavigationKey {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
}

// eslint-disable-next-line
export enum WhiteSpaceKey {
  Enter = 'Enter',
  Space = 'Space',
  Tab = 'Tab',
}

// eslint-disable-next-line
export enum ModifierKey {
  Alt = 'Alt',
  Control = 'Control',
  /** On MacOS `Command`, on Windows `Control` */
  Meta = 'Meta',
  Shift = 'Shift',
}

// eslint-disable-next-line
export enum UIKey {
  Escape = 'Escape',
}

// eslint-disable-next-line
export enum EditingKey {
  Backspace = 'Backspace',
  Delete = 'Delete',
}

function isPrintableKey(code: string): boolean {
  return code in WritingSystemKeyCode;
}

// https://w3c.github.io/uievents-code/#alphanumeric-section
// eslint-disable-next-line
enum WritingSystemKeyCode {
  'Backquote' = 'Backquote',
  'Backslash' = 'Backslash',
  'BracketLeft' = 'BracketLeft',
  'BracketRight' = 'BracketRight',
  'Comma' = 'Comma',
  'Digit0' = 'Digit0',
  'Digit1' = 'Digit1',
  'Digit2' = 'Digit2',
  'Digit3' = 'Digit3',
  'Digit4' = 'Digit4',
  'Digit5' = 'Digit5',
  'Digit6' = 'Digit6',
  'Digit7' = 'Digit7',
  'Digit8' = 'Digit8',
  'Digit9' = 'Digit9',
  'Equal' = 'Equal',
  'IntlBackslash' = 'IntlBackslash',
  'IntlRo' = 'IntlRo',
  'IntlYen' = 'IntlYen',
  'KeyA' = 'KeyA',
  'KeyB' = 'KeyB',
  'KeyC' = 'KeyC',
  'KeyD' = 'KeyD',
  'KeyE' = 'KeyE',
  'KeyF' = 'KeyF',
  'KeyG' = 'KeyG',
  'KeyH' = 'KeyH',
  'KeyI' = 'KeyI',
  'KeyJ' = 'KeyJ',
  'KeyK' = 'KeyK',
  'KeyL' = 'KeyL',
  'KeyM' = 'KeyM',
  'KeyN' = 'KeyN',
  'KeyO' = 'KeyO',
  'KeyP' = 'KeyP',
  'KeyQ' = 'KeyQ',
  'KeyR' = 'KeyR',
  'KeyS' = 'KeyS',
  'KeyT' = 'KeyT',
  'KeyU' = 'KeyU',
  'KeyV' = 'KeyV',
  'KeyW' = 'KeyW',
  'KeyX' = 'KeyX',
  'KeyY' = 'KeyY',
  'KeyZ' = 'KeyZ',
  'Minus' = 'Minus',
  'Period' = 'Period',
  'Quote' = 'Quote',
  'Semicolon' = 'Semicolon',
  'Slash' = 'Slash',
}

type KeyBindingKey =
  | NavigationKey
  | WhiteSpaceKey
  | UIKey
  | EditingKey
  | PrintableKey;

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
// > If the pressed key has a printed representation, the returned value is a non-empty Unicode character string containing the printable representation of the key.
// i.e. alphanumeric keys
type PrintableKey = 'PrintableKey';

export type KeyboardKey =
  | NavigationKey
  | WhiteSpaceKey
  | ModifierKey
  | UIKey
  | EditingKey;
