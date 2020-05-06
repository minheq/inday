import Delta from 'quill-delta';
import React from 'react';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';
import type {
  Range,
  ToWebViewMessage,
  EditorContentSize,
  FromWebViewGetLeaf,
  FromWebViewGetBounds,
  FromWebViewMessage,
  FromWebViewGetLine,
  FromWebViewGetSelection,
  FromWebViewGetText,
  FromWebViewGetFormats,
  ChangeSource,
} from './types';
import html from './webview/index.bundle.html';

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const {
      onPromptCommands = () => {},
      onBlur = () => {},
      onLoad = () => {},
      onFocus = () => {},
      onTextChange = () => {},
      onSelectionChange = () => {},
    } = props;
    const editorContentRef = React.useRef<HTMLIFrameElement | null>(null);

    const sendMessage = React.useCallback((message: ToWebViewMessage) => {
      if (editorContentRef.current) {
        editorContentRef.current?.contentWindow?.postMessage(message, '*');
      }
    }, []);

    const sendAsyncMessage = React.useCallback(
      <T extends FromWebViewMessage>(message: ToWebViewMessage): Promise<T> => {
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
          editorContentRef.current?.focus();
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
          const data = await sendAsyncMessage<FromWebViewGetBounds>({
            type: 'get-bounds',
            index,
            length,
          });

          return data.bounds;
        },
        getLine: async (index: number) => {
          const data = await sendAsyncMessage<FromWebViewGetLine>({
            type: 'get-line',
            index,
          });

          return [data.line, data.offset];
        },
        getLeaf: async (index: number) => {
          const data = await sendAsyncMessage<FromWebViewGetLeaf>({
            type: 'get-leaf',
            index,
          });

          return [data.leaf, data.offset];
        },
        getSelection: async (focus?: boolean) => {
          const data = await sendAsyncMessage<FromWebViewGetSelection>({
            type: 'get-selection',
            focus,
          });

          return data.range;
        },
        getText: async (range: Range) => {
          const data = await sendAsyncMessage<FromWebViewGetText>({
            type: 'get-text',
            range,
          });

          return data.text;
        },
        getFormat: async () => {
          const data = await sendAsyncMessage<FromWebViewGetFormats>({
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

    const receiveMessage = React.useCallback(
      (event: MessageEvent) => {
        const data = event.data as FromWebViewMessage;

        if (data.type === 'text-change') {
          onTextChange(data.delta, data.oldDelta, data.source);
        } else if (data.type === 'selection-change') {
          onSelectionChange(data.range, data.oldRange, data.source);
        } else if (data.type === 'resize') {
          handleResize(data.size);
        } else if (data.type === 'prompt-commands') {
          onPromptCommands(data.index);
        } else if (data.type === 'dom-content-loaded') {
          onLoad();
        }
      },
      [onTextChange, onSelectionChange, handleResize, onPromptCommands, onLoad],
    );

    React.useEffect(() => {
      window.addEventListener('message', receiveMessage);

      return () => {
        window.removeEventListener('message', receiveMessage);
      };
    }, [receiveMessage]);

    return (
      <iframe
        ref={editorContentRef}
        srcDoc={html}
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
