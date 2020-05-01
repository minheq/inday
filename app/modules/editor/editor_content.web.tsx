import React from 'react';
import { generateHTML } from './html';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';

function EditorContentBase(
  props: EditorContentProps,
  ref:
    | React.MutableRefObject<EditorContentInstance | null>
    | ((instance: EditorContentInstance) => void)
    | null,
) {
  const { initialContent } = props;
  const editorRef = React.useRef<HTMLIFrameElement | null>(null);

  React.useImperativeHandle(ref, () => ({
    bold: () => {
      if (editorRef.current) {
        editorRef.current?.contentWindow?.postMessage(
          { source: 'app', type: 'bold' },
          '*',
        );
      }
    },
  }));

  const handleMessage = React.useCallback((event: MessageEvent) => {
    if (event.data.source !== 'editor') {
      return;
    }

    console.log(event.data);
  }, []);

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
}

export const EditorContent = React.forwardRef(EditorContentBase);

const styles = {
  iframe: {
    width: '100%',
    borderWidth: 0,
  },
};
