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
  bold: () => void;
  italic: () => void;
  strikethrough: () => void;
  link: (url: string) => void;
  heading: (size: HeadingSize) => void;
  code: () => void;
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
      focus: () => {},
      bold: () => {},
      italic: () => {},
      strikethrough: () => {},
      link: () => {},
      heading: () => {},
      code: () => {},
      getBounds: async () => ({
        top: 0,
        left: 0,
        height: 0,
        width: 0,
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
