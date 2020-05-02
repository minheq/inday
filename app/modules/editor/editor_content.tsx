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
} from './types';

export interface EditorContentProps {
  initialContent?: Delta;
  onTextChange?: (event: TextChangeEvent) => void;
  onSelectionChange?: (event: SelectionChangeEvent) => void;
}

export interface EditorContentInstance {
  bold: () => void;
  getBounds: (range: Range) => Promise<Bounds>;
  getLine: (index: number) => Promise<Line | null>;
  getSelection: () => Promise<Range>;
}

function EditorContentBase(
  props: EditorContentProps,
  ref:
    | React.MutableRefObject<EditorContentInstance | null>
    | ((instance: EditorContentInstance) => void)
    | null,
) {
  const {} = props;
  React.useImperativeHandle(ref, () => ({
    bold: () => {},
    getBounds: async () => ({
      top: 0,
      left: 0,
      height: 0,
      width: 0,
    }),
    getLine: async () => ({ isEmpty: true, offset: 0 }),
    getSelection: async () => ({ index: 0, length: 0 }),
  }));

  return (
    <View>
      <Text>Editor</Text>
    </View>
  );
}

export const EditorContent = React.forwardRef(EditorContentBase);
