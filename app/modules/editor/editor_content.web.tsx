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
  FromWebViewGetLinkRange,
  FromWebViewGetBounds,
  FromWebViewMessage,
  FromWebViewGetLine,
  FromWebViewGetSelection,
  FromWebViewGetText,
  FromWebViewGetFormats,
  ChangeSource,
  LinkValue,
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
        formatLink: (range: Range, link: LinkValue) => {
          sendMessage({ type: 'format-link', range, link });
        },
        removeLink: () => {},
        focus: () => {
          editorContentRef.current?.focus();
          sendMessage({ type: 'focus' });
        },
        setSelection: async (range: Range) => {
          sendMessage({ type: 'set-selection', range });
        },
        setContents: (delta: Delta, source?: ChangeSource) => {
          sendMessage({ type: 'set-contents', delta, source });
        },
        insertText: () => {
          return new Delta();
        },
        insertEmbed: () => {
          return new Delta();
        },
        getLinkRange: async (index: number) => {
          const data = await sendAsyncMessage<FromWebViewGetLinkRange>({
            type: 'get-link-range',
            index,
          });

          return data.range;
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

          return data.line;
        },
        getSelection: async () => {
          const data = await sendAsyncMessage<FromWebViewGetSelection>({
            type: 'get-selection',
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
        getFormats: async () => {
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
