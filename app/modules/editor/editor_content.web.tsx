import Delta from 'quill-delta';
import React from 'react';
import { generateHTML } from './html';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';
import type {
  TextChangeEvent,
  SelectionChangeEvent,
  Range,
  MessagePayload,
  ResizeEvent,
  GetBoundsEvent,
  GetLineEvent,
  GetSelectionEvent,
  GetTextEvent,
  GetFormatsEvent,
  GetLinkRangeEvent,
  EditorContentSize,
} from './types';

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const {
      initialContent,
      onBlur = () => {},
      onFocus = () => {},
      onTextChange = () => {},
      onSelectionChange = () => {},
    } = props;
    const editorContentRef = React.useRef<HTMLIFrameElement | null>(null);

    const sendMessage = React.useCallback((message: MessagePayload) => {
      if (editorContentRef.current) {
        editorContentRef.current?.contentWindow?.postMessage(message, '*');
      }
    }, []);

    const sendAsyncMessage = React.useCallback(
      <T extends any>(message: MessagePayload): Promise<T> => {
        return new Promise((resolve) => {
          sendMessage(message);

          window.addEventListener('message', handleTemporaryMessage);

          function handleTemporaryMessage(event: MessageEvent) {
            if (event.data.type === message.type) {
              resolve(event.data);
              window.removeEventListener('message', handleTemporaryMessage);
            }
          }
        });
      },
      [sendMessage],
    );

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
        formatLink: () => {},
        removeLink: () => {},
        focus: () => {
          editorContentRef.current?.focus();
          sendMessage({ type: 'focus' });
        },
        setSelection: async (range: Range) => {
          sendMessage({ type: 'set-selection', range });
        },
        insertText: () => {
          return new Delta();
        },
        insertEmbed: () => {
          return new Delta();
        },
        getLinkRange: async (index: number) => {
          const data = await sendAsyncMessage<GetLinkRangeEvent>({
            type: 'get-link-range',
            index,
          });

          return data.range;
        },
        getBounds: async (index: number, length?: number) => {
          const data = await sendAsyncMessage<GetBoundsEvent>({
            type: 'get-bounds',
            index,
            length,
          });

          return data.bounds;
        },
        getLine: async (index: number) => {
          const data = await sendAsyncMessage<GetLineEvent>({
            type: 'get-line',
            index,
          });

          return data.line;
        },
        getSelection: async () => {
          const data = await sendAsyncMessage<GetSelectionEvent>({
            type: 'get-selection',
          });

          return data.range;
        },
        getText: async (range: Range) => {
          const data = await sendAsyncMessage<GetTextEvent>({
            type: 'get-text',
            range,
          });

          return data.text;
        },
        getFormats: async () => {
          const data = await sendAsyncMessage<GetFormatsEvent>({
            type: 'get-formats',
          });

          return data.formats;
        },
      }),
      [sendMessage, sendAsyncMessage],
    );

    const handleResize = React.useCallback((size: EditorContentSize) => {
      if (editorContentRef.current) {
        editorContentRef.current.style.height = size.height + 'px';
      }
    }, []);

    const handleMessage = React.useCallback(
      (event: MessageEvent) => {
        if (event.data.type === 'text-change') {
          const data = event.data as TextChangeEvent;
          onTextChange(data.delta, data.oldDelta, data.source);
        } else if (event.data.type === 'selection-change') {
          const data = event.data as SelectionChangeEvent;
          onSelectionChange(data.range, data.oldRange, data.source);
        } else if (event.data.type === 'resize') {
          const data = event.data as ResizeEvent;
          handleResize(data.size);
        }
      },
      [onTextChange, onSelectionChange, handleResize],
    );

    React.useEffect(() => {
      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, [handleMessage]);

    return (
      <iframe
        ref={editorContentRef}
        srcDoc={generateHTML({ initialContent })}
        style={styles.iframe}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  },
);

const styles = {
  iframe: {
    width: '100%',
    borderWidth: 0,
  },
};
