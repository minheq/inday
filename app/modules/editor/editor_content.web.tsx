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
  Bounds,
  MessagePayload,
  Line,
  ResizeEvent,
  HeadingSize,
  Formats,
  Word,
  SelectWordEvent,
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
      onTextChange = () => {},
      onSelectionChange = () => {},
      onResize = () => {},
    } = props;
    const editorRef = React.useRef<HTMLIFrameElement | null>(null);

    const sendMessage = React.useCallback((message: MessagePayload) => {
      if (editorRef.current) {
        editorRef.current?.contentWindow?.postMessage(message, '*');
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
          sendMessage({ type: 'focus' });
        },
        selectWord: async (index?: number) => {
          const data = await sendAsyncMessage<SelectWordEvent>({
            type: 'select-word',
            index,
          });

          return data.word;
        },
        getBounds: async (range: Range) => {
          return new Promise((resolve) => {
            sendMessage({ type: 'get-bounds', range });

            window.addEventListener('message', handleTemporaryMessage);

            function handleTemporaryMessage(event: MessageEvent) {
              if (event.data.type === 'get-bounds') {
                resolve(event.data.bounds as Bounds);
                window.removeEventListener('message', handleTemporaryMessage);
              }
            }
          });
        },
        getLine: async (index: number) => {
          return new Promise((resolve) => {
            sendMessage({ type: 'get-line', index });

            window.addEventListener('message', handleTemporaryMessage);

            function handleTemporaryMessage(event: MessageEvent) {
              if (event.data.type === 'get-line') {
                resolve(event.data.line as Line | null);
                window.removeEventListener('message', handleTemporaryMessage);
              }
            }

            return;
          });
        },
        getSelection: async () => {
          return new Promise((resolve) => {
            sendMessage({ type: 'get-selection' });

            window.addEventListener('message', handleTemporaryMessage);

            function handleTemporaryMessage(event: MessageEvent) {
              if (event.data.type === 'get-selection') {
                resolve(event.data.range as Range);
                window.removeEventListener('message', handleTemporaryMessage);
              }
            }

            return;
          });
        },
        getText: async (range: Range) => {
          return new Promise((resolve) => {
            sendMessage({ type: 'get-text', range });

            window.addEventListener('message', handleTemporaryMessage);

            function handleTemporaryMessage(event: MessageEvent) {
              if (event.data.type === 'get-text') {
                resolve(event.data.text as string);
                window.removeEventListener('message', handleTemporaryMessage);
              }
            }

            return;
          });
        },
        getFormats: async () => {
          return new Promise((resolve) => {
            sendMessage({ type: 'get-formats' });

            window.addEventListener('message', handleTemporaryMessage);

            function handleTemporaryMessage(event: MessageEvent) {
              if (event.data.type === 'get-formats') {
                resolve(event.data.formats as Formats);
                window.removeEventListener('message', handleTemporaryMessage);
              }
            }

            return;
          });
        },
      }),
      [sendMessage],
    );

    const handleResize = React.useCallback(
      (event: ResizeEvent) => {
        if (editorRef.current) {
          editorRef.current.style.height = event.size.height + 'px';
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
        ref={editorRef}
        srcDoc={generateHTML({ initialContent })}
        style={styles.iframe}
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
