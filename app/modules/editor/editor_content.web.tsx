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

    const handleLoad = React.useCallback(() => {
      if (editorRef.current && editorRef.current.contentWindow) {
        editorRef.current.style.height =
          editorRef.current.contentWindow?.document.documentElement
            .scrollHeight + 'px';
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
      }),
      [sendMessage],
    );

    const handleMessage = React.useCallback(
      (event: MessageEvent) => {
        if (event.data.type === 'text-change') {
          onTextChange(event.data as TextChangeEvent);
        } else if (event.data.type === 'selection-change') {
          onSelectionChange(event.data as SelectionChangeEvent);
        }
      },
      [onTextChange, onSelectionChange],
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
        frameBorder="0"
        scrolling="no"
        onLoad={handleLoad}
      />
    );
  },
);

const styles = {
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
};
