import type Delta from 'quill-delta';

export type ChangeSource = 'user' | 'api' | 'silent';

export interface SelectionChangeEvent {
  type: 'selection-change';
  range: Range | null;
  oldRange: Range | null;
  source: ChangeSource;
}

export interface TextChangeEvent {
  type: 'text-change';
  delta: Delta;
  oldDelta: Delta;
  source: ChangeSource;
}

export interface GetBoundsEvent {
  type: 'get-bounds';
  bounds: Bounds;
}

export interface EditorContentSize {
  height: number;
  width: number;
}

export interface ResizeEvent {
  type: 'resize';
  size: EditorContentSize;
}

export interface GetSelectionEvent {
  type: 'get-selection';
  range: Range;
}

export interface GetLinkRangeEvent {
  type: 'get-link-range';
  range: Range | null;
}

export interface GetTextEvent {
  type: 'get-text';
  text: string;
}

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

export interface GetFormatsEvent {
  type: 'get-format';
  formats: Formats;
}

export interface GetLineEvent {
  type: 'get-line';
  line: Line | null;
}

/** Events received from iframe */
export type EventPayload =
  | TextChangeEvent
  | SelectionChangeEvent
  | GetBoundsEvent
  | GetLineEvent
  | GetTextEvent
  | ResizeEvent;

export type Range = { index: number; length: number };

export type Line = {
  isEmpty: boolean;
  offset: number;
};

export type Bounds = {
  left: number;
  top: number;
  height: number;
  width: number;
  bottom: number;
  right: number;
};

export interface GetBoundsMessage {
  type: 'get-bounds';
  index: number;
  length?: number;
}

export interface GetLineMessage {
  type: 'get-line';
  index: number;
}

export interface GetSelectionMessage {
  type: 'get-selection';
}

export interface GetTextMessage {
  type: 'get-text';
  range: Range;
}

export interface GetLinkRangeMessage {
  type: 'get-link-range';
  index: number;
}

export interface GetFormatsMessage {
  type: 'get-formats';
}

export interface FocusMessage {
  type: 'focus';
}

// Formats

export type HeadingSize = 1 | 2 | 3 | 4 | 5;

export interface FormatMessage<
  T extends Formats = any,
  K extends keyof T = any
> {
  type: 'format';
  name: K;
  value: T[K];
  source?: ChangeSource;
}

export interface RemoveLinkMessage {
  type: 'remove-link';
  index: number;
}

export interface UndoMessage {
  type: 'undo';
}

export interface RedoMessage {
  type: 'redo';
}

export interface SetSelectionMessage {
  type: 'set-selection';
  range: Range;
}

/** Messages sent to iframe */
export type MessagePayload =
  | GetFormatsMessage
  | GetBoundsMessage
  | FormatMessage
  | GetLineMessage
  | GetSelectionMessage
  | UndoMessage
  | RedoMessage
  | GetTextMessage
  | GetLinkRangeMessage
  | RemoveLinkMessage
  | SetSelectionMessage
  | FocusMessage;
