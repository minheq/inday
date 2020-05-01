import Delta from 'quill-delta';
import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/text';

export interface EditorContentProps {
  initialContent?: Delta;
}

export interface EditorContentInstance {
  bold: () => void;
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
  }));

  return (
    <View>
      <Text>Editor</Text>
    </View>
  );
}

export const EditorContent = React.forwardRef(EditorContentBase);
