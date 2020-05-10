import React from 'react';
import type {
  EditorContentProps,
  EditorContentInstance,
} from './editor_content';
import { useEditorContentHandlers } from './use_editor_content_handlers';
import { QuillHandlers, createQuill } from './quill';
import type { ToWebViewMessage } from './types';

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const { onLoad, onResize, onTextChange, onSelectionChange } = props;
    const editorContentRef = React.useRef<HTMLDivElement | null>(null);
    const quillRef = React.useRef<QuillHandlers | null>(null);

    const send = React.useCallback((message: ToWebViewMessage) => {
      if (quillRef.current) {
        quillRef.current.handleMessage(message);
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

    React.useEffect(() => {
      if (editorContentRef.current) {
        quillRef.current = createQuill(editorContentRef.current, receive);
        if (onLoad) {
          onLoad();
        }
      }
    }, [editorContentRef, receive, onLoad]);

    return <div spellCheck="false" ref={editorContentRef} />;
  },
);
