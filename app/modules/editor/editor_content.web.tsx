import React from 'react';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';
import type { ToWebViewMessage, FromWebViewMessage } from './types';
import html from './webview/index.bundle.html';
import { useWebViewHandler } from './use_webview_handler';
import { RequestQueue } from './request_queue';

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
    const requestQueue = React.useRef(new RequestQueue()).current;

    const sendMessage = React.useCallback((message: ToWebViewMessage) => {
      if (editorContentRef.current) {
        editorContentRef.current?.contentWindow?.postMessage(message, '*');
      }
    }, []);

    const sendRequest = React.useCallback(
      (message: ToWebViewMessage): Promise<FromWebViewMessage> => {
        return new Promise((resolve) => {
          requestQueue.request(message, (fromWebViewMessage) => {
            resolve(fromWebViewMessage);
          });

          sendMessage(message);
        });
      },
      [sendMessage, requestQueue],
    );

    const receiveMessage = React.useCallback(
      (event: MessageEvent) => {
        const data = event.data as FromWebViewMessage;

        if (data.type === 'text-change') {
          onTextChange(data.delta, data.oldDelta, data.source);
        } else if (data.type === 'selection-change') {
          onSelectionChange(data.range, data.oldRange, data.source);
        } else if (data.type === 'dom-content-loaded') {
          onLoad();
        } else if ((data.type as any) === 'webpackOk') {
        } else {
          requestQueue.receive(data);
        }
      },
      [onTextChange, onSelectionChange, onLoad, requestQueue],
    );

    useWebViewHandler({
      ref,
      sendMessage,
      sendRequest,
    });

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
    flex: 1,
  },
};
