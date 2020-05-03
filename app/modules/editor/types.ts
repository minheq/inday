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

export type Formats = {
  italic?: true;
  bold?: true;
  strike?: true;
  link?: string;
  header?: HeadingSize;
  code?: true;
};

export interface GetFormatEvent {
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
  range: Range;
}

export interface GetLineMessage {
  type: 'get-line';
  index: number;
}

export interface GetSelectionMessage {
  type: 'get-selection';
}

export interface GetFormatsMessage {
  type: 'get-formats';
}

export interface FocusMessage {
  type: 'focus';
}

// Formats

export interface FormatBoldMessage {
  type: 'bold';
}

export interface FormatItalicMessage {
  type: 'italic';
}

export interface FormatStrikethroughMessage {
  type: 'strikethrough';
}

export type HeadingSize = 1 | 2 | 3 | 4 | 5;

export interface FormatHeadingMessage {
  type: 'heading';
  size: HeadingSize;
}

export interface FormatCodeMessage {
  type: 'inline-code';
}

export interface FormatLinkMessage {
  type: 'link';
  url: string;
}

/** Messages sent to iframe */
export type MessagePayload =
  | GetFormatsMessage
  | FormatBoldMessage
  | FormatItalicMessage
  | FormatStrikethroughMessage
  | FormatHeadingMessage
  | FormatLinkMessage
  | FormatCodeMessage
  | GetBoundsMessage
  | GetLineMessage
  | GetSelectionMessage
  | FocusMessage;
