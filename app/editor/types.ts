import type Delta from 'quill-delta';

export type ChangeSource = 'user' | 'api' | 'silent';

export type HeadingSize = 1 | 2 | 3 | 4 | 5;

export type ListType = 'bullet' | 'ordered' | 'checked' | 'unchecked';

export interface LinkValue {
  text: string;
  url: string;
}

export interface Formats {
  italic?: boolean;
  bold?: boolean;
  strike?: boolean;
  link?: string | false;
  list?: ListType | false;
  blockquote?: boolean;
  'code-block'?: boolean;
  header?: HeadingSize | false;
  code?: boolean;
}

export type Format = keyof Formats;

export interface Range {
  index: number;
  length: number;
}

export interface Blot {
  textContent: string;
  tagName: string;
  length: number;
  firstChild: {
    tagName: string;
  } | null;
  parent: {
    tagName: string;
  };
}

export interface Bounds {
  left: number;
  top: number;
  height: number;
  width: number;
  bottom: number;
  right: number;
}

export interface EditorContentSize {
  height: number;
  width: number;
}

export interface FromWebViewSelectionChange {
  type: 'selection-change';
  range: Range | null;
  oldRange: Range | null;
  source: ChangeSource;
}

export interface FromWebViewPromptCommands {
  type: 'prompt-commands';
  index: number;
}

export interface FromWebViewTextChange {
  type: 'text-change';
  delta: Delta;
  oldDelta: Delta;
  source: ChangeSource;
}

export interface FromWebViewGetBounds {
  type: 'get-bounds';
  bounds: Bounds;
}
export interface FromWebViewResize {
  type: 'resize';
  height: number;
  width: number;
}

export interface FromWebViewDebug {
  type: 'debug';
  message: any;
}

export interface FromWebViewDOMContentLoaded {
  type: 'dom-content-loaded';
}

export interface FromWebViewGetSelection {
  type: 'get-selection';
  range: Range | null;
}

export interface FromWebViewGetText {
  type: 'get-text';
  text: string;
}

export interface FromWebViewGetFormats {
  type: 'get-formats';
  formats: Formats;
}

export interface FromWebViewGetLine {
  type: 'get-line';
  line: Blot | null;
  offset: number;
}

export interface FromWebViewGetLeaf {
  type: 'get-leaf';
  leaf: Blot | null;
  offset: number;
}

/** Events received from iframe */
export type FromWebViewMessage =
  | FromWebViewTextChange
  | FromWebViewSelectionChange
  | FromWebViewGetSelection
  | FromWebViewPromptCommands
  | FromWebViewGetBounds
  | FromWebViewGetLine
  | FromWebViewGetText
  | FromWebViewGetFormats
  | FromWebViewGetLeaf
  | FromWebViewDOMContentLoaded
  | FromWebViewResize
  | FromWebViewDebug;

export interface ToWebViewGetBounds {
  type: 'get-bounds';
  index: number;
  length?: number;
}

export interface ToWebViewGetLine {
  type: 'get-line';
  index: number;
}

export interface ToWebViewGetSelection {
  type: 'get-selection';
  focus?: boolean;
}

export interface ToWebViewGetText {
  type: 'get-text';
  range: Range;
}

export interface ToWebViewGetFormats {
  type: 'get-formats';
}

export interface ToWebViewGetLeaf {
  type: 'get-leaf';
  index: number;
}

export interface ToWebViewFocus {
  type: 'focus';
}

export interface ToWebViewFormat<
  T extends Formats = any,
  K extends keyof T = any
> {
  type: 'format';
  name: K;
  value: T[K];
  source?: ChangeSource;
}

export interface ToWebViewFormatText<
  T extends Formats = any,
  K extends keyof T = any
> {
  type: 'format-text';
  index: number;
  length: number;
  format?: K;
  formats?: K;
  value?: T[K];
  source?: ChangeSource;
}

export interface ToWebViewUndo {
  type: 'undo';
}

export interface ToWebViewRedo {
  type: 'redo';
}

export interface ToWebViewGetLeaf {
  type: 'get-leaf';
}

export interface ToWebViewFormatLine<
  T extends Formats = any,
  K extends keyof T = any
> {
  type: 'format-line';
  index: number;
  length: number;
  formats?: Format;
  format?: K;
  value?: T[K];
  source?: ChangeSource;
}

export interface ToWebViewDeleteText {
  type: 'delete-text';
  index: number;
  length: number;
}

export interface ToWebViewInsertText<
  T extends Formats = any,
  K extends keyof T = any
> {
  type: 'insert-text';
  index: number;
  text: string;
  format?: K;
  formats?: K;
  value?: T[K];
  source?: ChangeSource;
}
export interface ToWebViewSetSelection {
  type: 'set-selection';
  range?: Range;
  index?: number;
  length?: number;
  source?: ChangeSource;
}

export interface ToWebViewSetContents {
  type: 'set-contents';
  delta: Delta;
  source?: ChangeSource;
}

/** Messages sent to iframe */
export type ToWebViewMessage =
  | ToWebViewGetFormats
  | ToWebViewGetBounds
  | ToWebViewFormat
  | ToWebViewGetLine
  | ToWebViewGetSelection
  | ToWebViewUndo
  | ToWebViewRedo
  | ToWebViewGetText
  | ToWebViewDeleteText
  | ToWebViewFormatText
  | ToWebViewGetLeaf
  | ToWebViewFormatLine
  | ToWebViewSetSelection
  | ToWebViewInsertText
  | ToWebViewSetContents
  | ToWebViewFocus;
