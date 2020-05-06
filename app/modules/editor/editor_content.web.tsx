import React from 'react';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';
import type {
  ToWebViewMessage,
  EditorContentSize,
  FromWebViewMessage,
} from './types';
import html from './webview/index.bundle.html';
import { useWebViewHandler } from './use_webview_handler';

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const {
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

    const sendRequest = React.useCallback(
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

    useWebViewHandler({
      ref,
      sendMessage,
      sendRequest,
    });

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
        } else if (data.type === 'dom-content-loaded') {
          onLoad();
        }
      },
      [onTextChange, onSelectionChange, handleResize, onLoad],
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
