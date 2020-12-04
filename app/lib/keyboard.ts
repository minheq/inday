import { useCallback, useEffect, useMemo, useRef } from 'react';
import { groupBy } from '../../lib/array_utils';
import { isEmpty } from '../../lib/lang_utils';

export interface KeyBinding {
  key: NavigationKey | WhiteSpaceKey | UIKey;
  alt?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: () => void;
}

interface ActiveKeys {
  [key: string]: boolean | undefined;
}

export function useKeyboard(keyBindings: KeyBinding[]): void {
  const activeKeysRef = useRef<ActiveKeys>({});

  const groupedKeyBindingsByKey = useMemo(() => {
    return groupBy(keyBindings, (keyBinding) => keyBinding.key);
  }, [keyBindings]);

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = normalize(event.key);
      const activeKeys = activeKeysRef.current;
      const nextActiveKeys = { ...activeKeys, [key]: true };

      activeKeysRef.current = nextActiveKeys;

      let matchedKeyBindings = groupedKeyBindingsByKey[key];

      if (matchedKeyBindings === undefined || isEmpty(matchedKeyBindings)) {
        return;
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

        if (shift === activeShift && meta === activeMeta && alt === activeAlt) {
          event.preventDefault();
          keyBinding.handler();
          return;
        }
      }
    },
    [activeKeysRef, groupedKeyBindingsByKey],
  );

  const handleOnKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const activeKeys = activeKeysRef.current;
      const key = normalize(event.key);
      const nextActiveKeys = { ...activeKeys, [key]: false };

      activeKeysRef.current = nextActiveKeys;
    },
    [activeKeysRef],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDown, { passive: true });
    window.addEventListener('keyup', handleOnKeyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleOnKeyDown);
      window.removeEventListener('keyup', handleOnKeyUp);
    };
  }, [handleOnKeyDown, handleOnKeyUp]);
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
    default:
      break;
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

export enum NavigationKey {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
}

export enum WhiteSpaceKey {
  Enter = 'Enter',
  Space = 'Space',
  Tab = 'Tab',
}

export enum ModifierKey {
  Alt = 'Alt',
  /** On MacOS `Command`, on Windows `Control` */
  Meta = 'Meta',
  Shift = 'Shift',
}

export enum UIKey {
  Escape = 'Escape',
}

export type KeyboardKey = NavigationKey | WhiteSpaceKey | ModifierKey | UIKey;
