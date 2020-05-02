import type Delta from 'quill-delta';

export type ChangeSource = 'user' | 'api' | 'silent';

export interface SelectionChangeEvent {
  type: 'selection-change';
  range: Range;
  oldRange: Range;
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

export interface ResizeEvent {
  type: 'resize';
  height: number;
}

export interface GetSelectionEvent {
  type: 'get-selection';
  range: Range;
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
};

export interface FormatBoldMessage {
  type: 'bold';
}

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

/** Messages sent to iframe */
export type MessagePayload =
  | FormatBoldMessage
  | GetBoundsMessage
  | GetLineMessage
  | GetSelectionMessage;
