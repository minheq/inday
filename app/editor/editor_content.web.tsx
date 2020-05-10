import React from 'react';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';
import type { ToWebViewMessage, FromWebViewMessage } from './types';
import html from './webview/quill.html';
import { useEditorContentHandlers } from './use_editor_content_handlers';

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const {
      onBlur,
      onLoad,
      onFocus,
      onResize,
      onTextChange,
      onSelectionChange,
    } = props;
    const editorContentRef = React.useRef<HTMLIFrameElement | null>(null);

    const send = React.useCallback((message: ToWebViewMessage) => {
      if (editorContentRef.current) {
        editorContentRef.current?.contentWindow?.postMessage(message, '*');
      }
    }, []);

    const receive = useEditorContentHandlers({
      ref,
      send,
      onLoad,
      onResize,
      onTextChange,
      onSelectionChange,
    });

    const handleReceive = React.useCallback(
      (event: MessageEvent) => {
        const data = event.data as FromWebViewMessage;
        receive(data);
      },
      [receive],
    );

    React.useEffect(() => {
      window.addEventListener('message', handleReceive);

      return () => {
        window.removeEventListener('message', handleReceive);
      };
    }, [handleReceive]);

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
