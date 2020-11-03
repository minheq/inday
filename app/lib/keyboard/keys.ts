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
