import Delta from 'quill-delta';
import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/text';
import type {
  Bounds,
  Range,
  Line,
  Format,
  Formats,
  ChangeSource,
  LinkValue,
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
  insertText(index: number, text: string, source?: ChangeSource): Delta;
  insertText(
    index: number,
    text: string,
    format: Format,
    value: any,
    source?: ChangeSource,
  ): Delta;
  insertText(
    index: number,
    text: string,
    formats: Formats,
    source?: ChangeSource,
  ): Delta;
  insertEmbed(
    index: number,
    type: string,
    value: any,
    source: ChangeSource,
  ): Delta;
  // History
  undo: () => void;
  redo: () => void;
  // Formatting
  getFormats: () => Promise<Formats>;
  format: <TFormat extends Format>(
    name: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ) => void;
  setContents: (delta: Delta, source?: ChangeSource) => void;
  removeLink: (index: number) => void;
  formatLink: (range: Range, link: LinkValue) => void;
  // Editor
  focus: () => void;
  // Model
  getText: (range: Range) => Promise<string>;
  getLinkRange: (index: number) => Promise<Range | null>;
  getLine: (index: number) => Promise<Line | null>;
  // Selection
  getBounds: (index: number, length?: number) => Promise<Bounds>;
  getSelection: () => Promise<Range | null>;
  setSelection: (range: Range) => Promise<void>;
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
      formatLink: () => {},
      removeLink: () => {},
      focus: () => {},
      getLinkRange: async () => null,
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
      getLine: async () => ({ isEmpty: true, offset: 0 }),
      getSelection: async () => ({ index: 0, length: 0 }),
      getFormats: async () => ({}),
    }));

    return (
      <View>
        <Text>Editor</Text>
      </View>
    );
  },
);
