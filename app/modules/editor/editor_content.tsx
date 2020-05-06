import Delta from 'quill-delta';
import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/text';
import type {
  Bounds,
  Range,
  Blot,
  Format,
  Formats,
  ChangeSource,
} from './types';

export interface EditorContentProps {
  onBlur?: () => void;
  onFocus?: () => void;
  onLoad?: () => void;
  onPromptCommands?: (index: number) => void;
  onTextChange?: (
    delta: Delta,
    oldContents: Delta,
    source: ChangeSource,
  ) => void;
  onSelectionChange?: (
    range: Range | null,
    oldRange: Range | null,
    source: ChangeSource,
  ) => void;
}

export interface EditorContentInstance {
  // Content
  insertText(index: number, text: string, source?: ChangeSource): void;
  insertText(
    index: number,
    text: string,
    formats: Formats,
    source?: ChangeSource,
  ): void;
  insertText<TFormat extends Format>(
    index: number,
    text: string,
    format: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ): void;
  insertEmbed(
    index: number,
    type: string,
    value: any,
    source?: ChangeSource,
  ): void;
  formatLine(index: number, length: number, source?: ChangeSource): void;
  formatLine(
    index: number,
    length: number,
    formats: Formats,
    source?: ChangeSource,
  ): void;
  formatLine<TFormat extends Format>(
    index: number,
    length: number,
    format: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ): void;
  deleteText(index: number, length: number, source?: ChangeSource): void;
  // History
  undo: () => void;
  redo: () => void;
  // Formatting
  getFormat(): Promise<Formats>;
  getFormat(range: Range): Promise<Formats>;
  getFormat(index: number, length: number): Promise<Formats>;
  format: <TFormat extends Format>(
    name: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ) => void;
  formatText(index: number, length: number, source?: ChangeSource): void;
  formatText(
    index: number,
    length: number,
    formats: Formats,
    source?: ChangeSource,
  ): void;
  formatText<TFormat extends Format>(
    index: number,
    length: number,
    format: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ): void;
  setContents: (delta: Delta, source?: ChangeSource) => void;
  // Editor
  focus: () => void;
  // Model
  getText: (range: Range) => Promise<string>;
  getLine: (index: number) => Promise<[Blot | null, number]>;
  getLeaf: (index: number) => Promise<[Blot | null, number]>;
  // Selection
  getBounds: (index: number, length?: number) => Promise<Bounds>;
  getSelection(): Promise<Range | null>;
  getSelection(focus: boolean): Promise<Range | null>;
  setSelection(index: number, length: number): Promise<void>;
  setSelection(range: Range): Promise<void>;
}

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    React.useImperativeHandle(ref, () => ({
      selection: null,
      undo: () => {},
      setContents: () => {},
      redo: () => {},
      getText: async () => '',
      format: () => {},
      formatText: () => {},
      formatLine: () => new Delta(),
      deleteText: () => new Delta(),
      focus: () => {},
      setSelection: async () => {},
      insertText: () => new Delta(),
      insertEmbed: () => new Delta(),
      getBounds: async () => ({
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        bottom: 0,
        right: 0,
      }),
      getLine: async () => [
        {
          isEmpty: true,
          textContent: '',
          tagName: '',
          length: 0,
          firstChild: {
            tagName: '',
          },
          parent: {
            tagName: '',
          },
        },
        0,
      ],
      getLeaf: async () => [
        {
          isEmpty: true,
          textContent: '',
          tagName: '',
          length: 0,
          firstChild: {
            tagName: '',
          },
          parent: {
            tagName: '',
          },
        },
        0,
      ],
      getSelection: async () => ({ index: 0, length: 0 }),
      getFormat: async () => ({}),
    }));

    return (
      <View>
        <Text>Editor</Text>
      </View>
    );
  },
);
