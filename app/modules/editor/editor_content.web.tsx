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
    } = props;
    const editorRef = React.useRef<HTMLIFrameElement | null>(null);

    const sendMessage = React.useCallback((message: MessagePayload) => {
      if (editorRef.current) {
        editorRef.current?.contentWindow?.postMessage(message, '*');
      }
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        bold: () => {
          sendMessage({ type: 'bold' });
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
      }),
      [sendMessage],
    );

    const handleResize = React.useCallback((resize: ResizeEvent) => {
      if (editorRef.current) {
        editorRef.current.style.height = resize.height + 'px';
      }
    }, []);

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
