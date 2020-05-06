import React from 'react';
import {
  ToWebViewMessage,
  ChangeSource,
  FromWebViewGetBounds,
  FromWebViewGetLine,
  FromWebViewGetLeaf,
  FromWebViewGetSelection,
  FromWebViewGetText,
  FromWebViewGetFormats,
  Range,
  FromWebViewMessage,
} from './types';
import { EditorContentInstance } from './editor_content';
import Delta from 'quill-delta';

interface UseWebViewHandlerProps {
  ref:
    | React.MutableRefObject<EditorContentInstance | null>
    | ((instance: EditorContentInstance) => void)
    | null;
  sendMessage: (message: ToWebViewMessage) => void;
  sendRequest: (message: ToWebViewMessage) => Promise<FromWebViewMessage>;
}

export function useWebViewHandler(props: UseWebViewHandlerProps) {
  const { sendMessage, sendRequest, ref } = props;

  React.useImperativeHandle(
    ref,
    () => ({
      selection: null,
      undo: () => {
        sendMessage({ type: 'undo' });
      },
      redo: () => {
        sendMessage({ type: 'redo' });
      },
      format: (name, value, source) => {
        sendMessage({ type: 'format', name, value, source });
      },
      formatText: (...args: any[]) => {
        const [index, length, arg3, arg4, arg5] = args;

        // Formats
        if (typeof arg4 === 'object') {
          sendMessage({
            type: 'format-text',
            index,
            length,
            formats: arg3,
            source: arg4,
          });
        } else if (arg4 !== undefined || arg4 !== null) {
          sendMessage({
            type: 'format-text',
            index,
            length,
            format: arg3,
            value: arg4,
            source: arg5,
          });
        } else {
          sendMessage({
            type: 'format-text',
            index,
            length,
            source: arg3,
          });
        }
      },
      formatLine: (...args: any[]) => {
        const [index, length, arg3, arg4, arg5] = args;

        // Formats
        if (typeof arg4 === 'object') {
          sendMessage({
            type: 'format-line',
            index,
            length,
            formats: arg3,
            source: arg4,
          });
        } else if (arg4 !== undefined || arg4 !== null) {
          sendMessage({
            type: 'format-line',
            index,
            length,
            format: arg3,
            value: arg4,
            source: arg5,
          });
        } else {
          sendMessage({
            type: 'format-line',
            index,
            length,
            source: arg3,
          });
        }
      },
      deleteText: (index: number, length: number) => {
        sendMessage({ type: 'delete-text', index, length });
      },
      focus: () => {
        sendMessage({ type: 'focus' });
      },
      setSelection: async (...args: any[]) => {
        const [arg1, arg2, arg3] = args;
        if (typeof arg1 === 'object') {
          sendMessage({ type: 'set-selection', range: arg1, source: arg2 });
        } else {
          sendMessage({
            type: 'set-selection',
            index: arg1,
            length: arg2,
            source: arg3,
          });
        }
      },
      setContents: (delta: Delta, source?: ChangeSource) => {
        sendMessage({ type: 'set-contents', delta, source });
      },
      insertText: (...args: any[]) => {
        const [index, text, arg3, arg4, arg5] = args;

        // Formats
        if (typeof arg3 === 'object') {
          sendMessage({
            type: 'insert-text',
            index,
            text,
            formats: arg3,
            source: arg4,
          });
        } else if (arg4 !== undefined || arg4 !== null) {
          sendMessage({
            type: 'insert-text',
            index,
            text,
            format: arg3,
            value: arg4,
            source: arg5,
          });
        } else {
          sendMessage({
            type: 'insert-text',
            index,
            text,
            source: arg3,
          });
        }
      },
      insertEmbed: () => {
        return new Delta();
      },
      getBounds: async (index: number, length?: number) => {
        const data = (await sendRequest({
          type: 'get-bounds',
          index,
          length,
        })) as FromWebViewGetBounds;

        return data.bounds;
      },
      getLine: async (index: number) => {
        const data = (await sendRequest({
          type: 'get-line',
          index,
        })) as FromWebViewGetLine;

        return [data.line, data.offset];
      },
      getLeaf: async (index: number) => {
        const data = (await sendRequest({
          type: 'get-leaf',
          index,
        })) as FromWebViewGetLeaf;

        return [data.leaf, data.offset];
      },
      getSelection: async (focus?: boolean) => {
        const data = (await sendRequest({
          type: 'get-selection',
          focus,
        })) as FromWebViewGetSelection;

        return data.range;
      },
      getText: async (range: Range) => {
        const data = (await sendRequest({
          type: 'get-text',
          range,
        })) as FromWebViewGetText;

        return data.text;
      },
      getFormat: async () => {
        const data = (await sendRequest({
          type: 'get-formats',
        })) as FromWebViewGetFormats;

        return data.formats;
      },
    }),
    [sendMessage, sendRequest],
  );
}
