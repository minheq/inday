import type Delta from 'quill-delta';
import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/text';
import type {
  TextChangeEvent,
  SelectionChangeEvent,
  Bounds,
  Range,
  Line,
  ResizeEvent,
  HeadingSize,
  Formats,
} from './types';

export interface EditorContentProps {
  initialContent?: Delta;
  onResize?: (event: ResizeEvent) => void;
  onTextChange?: (event: TextChangeEvent) => void;
  onSelectionChange?: (event: SelectionChangeEvent) => void;
}

export interface EditorContentInstance {
  selection: Range | null;
  formatBold: () => void;
  formatItalic: () => void;
  formatStrike: () => void;
  formatLink: (url: string) => void;
  formatHeading: (size: HeadingSize) => void;
  formatCode: () => void;
  formatList: (index: number) => void;
  formatBlockquote: (index: number) => void;
  formatCodeBlock: (index: number) => void;
  insertImage: (index: number, url: string) => void;
  insertVideo: (index: number, url: string) => void;
  focus: () => void;
  getBounds: (range: Range) => Promise<Bounds>;
  getLine: (index: number) => Promise<Line | null>;
  getSelection: () => Promise<Range>;
  getFormats: () => Promise<Formats>;
}

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const {} = props;
    React.useImperativeHandle(ref, () => ({
      selection: null,
      formatBold: () => {},
      formatItalic: () => {},
      formatStrike: () => {},
      formatLink: () => {},
      formatHeading: () => {},
      formatCode: () => {},
      formatList: () => {},
      formatBlockquote: () => {},
      formatCodeBlock: () => {},
      insertImage: () => {},
      insertVideo: () => {},
      focus: () => {},
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
