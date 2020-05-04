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
  HeadingSize,
  GetBoundsEvent,
  GetLineEvent,
  GetSelectionEvent,
  GetTextEvent,
  GetFormatsEvent,
  GetLinkRangeEvent,
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
      onResize = () => {},
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
        formatBold: () => {
          sendMessage({ type: 'format-bold' });
        },
        formatItalic: () => {
          sendMessage({ type: 'format-italic' });
        },
        formatStrike: () => {
          sendMessage({ type: 'format-strike' });
        },
        removeLink: (index: number) => {
          sendMessage({ type: 'remove-link', index });
        },
        formatLink: (range: Range, text: string, url: string) => {
          sendMessage({ type: 'format-link', range, text, url });
        },
        formatHeading: (size: HeadingSize) => {
          sendMessage({ type: 'format-heading', size });
        },
        formatCode: () => {
          sendMessage({ type: 'format-code' });
        },
        formatList: (index: number) => {
          sendMessage({ type: 'format-list', index });
        },
        formatBlockquote: (index: number) => {
          sendMessage({ type: 'format-blockquote', index });
        },
        formatCodeBlock: (index: number) => {
          sendMessage({ type: 'format-code-block', index });
        },
        insertImage: (index: number, url: string) => {
          sendMessage({ type: 'insert-image', index, url });
        },
        insertVideo: (index: number, url: string) => {
          sendMessage({ type: 'insert-video', index, url });
        },
        focus: () => {
          editorContentRef.current?.focus();
          sendMessage({ type: 'focus' });
        },
        setSelection: async (range: Range) => {
          sendMessage({ type: 'set-selection', range });
        },
        getLinkRange: async (index: number) => {
          const data = await sendAsyncMessage<GetLinkRangeEvent>({
            type: 'get-link-range',
            index,
          });

          return data.range;
        },
        getBounds: async (range: Range) => {
          const data = await sendAsyncMessage<GetBoundsEvent>({
            type: 'get-bounds',
            range,
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

    const handleResize = React.useCallback(
      (event: ResizeEvent) => {
        if (editorContentRef.current) {
          editorContentRef.current.style.height = event.size.height + 'px';
          onResize(event);
        }
      },
      [onResize],
    );

    const handleMessage = React.useCallback(
      (event: MessageEvent) => {
        if (event.data.type === 'text-change') {
          onTextChange(event.data as TextChangeEvent);
        } else if (event.data.type === 'selection-change') {
          onSelectionChange(event.data as SelectionChangeEvent);
        } else if (event.data.type === 'resize') {
          handleResize(event.data as ResizeEvent);
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
