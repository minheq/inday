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

export type KeyboardKey = NavigationKey | WhiteSpaceKey | ModifierKey;
