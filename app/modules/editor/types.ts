import type Delta from 'quill-delta';

export type ChangeSource = 'user' | 'api' | 'silent';

export type HeadingSize = 1 | 2 | 3 | 4 | 5;

export interface Formats {
  italic?: boolean;
  bold?: boolean;
  strike?: boolean;
  link?: string;
  list?: 'bullet' | false;
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

export interface Line {
  isEmpty: boolean;
  offset: number;
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
  size: EditorContentSize;
}

export interface FromWebViewDOMContentLoaded {
  type: 'dom-content-loaded';
}

export interface FromWebViewGetSelection {
  type: 'get-selection';
  range: Range | null;
}

export interface FromWebViewGetLinkRange {
  type: 'get-link-range';
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
  line: Line | null;
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
  | FromWebViewGetLinkRange
  | FromWebViewGetFormats
  | FromWebViewDOMContentLoaded
  | FromWebViewResize;

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
}

export interface ToWebViewGetText {
  type: 'get-text';
  range: Range;
}

export interface ToWebViewGetLinkRange {
  type: 'get-link-range';
  index: number;
}

export interface ToWebViewGetFormats {
  type: 'get-formats';
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

export interface ToWebViewRemoveLink {
  type: 'remove-link';
  index: number;
}

export interface ToWebViewUndo {
  type: 'undo';
}

export interface ToWebViewRedo {
  type: 'redo';
}

export interface ToWebViewSetSelection {
  type: 'set-selection';
  range: Range;
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
  | ToWebViewGetLinkRange
  | ToWebViewRemoveLink
  | ToWebViewSetSelection
  | ToWebViewSetContents
  | ToWebViewFocus;
