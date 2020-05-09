import Delta from 'quill-delta';
import React from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import type {
  Bounds,
  Range,
  Blot,
  Format,
  Formats,
  ChangeSource,
  ToWebViewMessage,
  FromWebViewMessage,
} from './types';
import { StyleSheet } from 'react-native';
import { useEditorContentHandlers } from './use_editor_content_handlers';

const html = require('./webview/index.bundle.html');

export interface EditorContentProps {
  onBlur?: () => void;
  onFocus?: () => void;
  onLoad?: () => void;
  onTextChange?: (
    delta: Delta,
    oldContents: Delta,
    source: ChangeSource,
  ) => void;
  onSelectionChange?: (
    range: Range | null,
    oldRange: Range | null,
    source: ChangeSource,
  ) => void;
}

export interface EditorContentInstance {
  // Content
  insertText(index: number, text: string, source?: ChangeSource): void;
  insertText(
    index: number,
    text: string,
    formats: Formats,
    source?: ChangeSource,
  ): void;
  insertText<TFormat extends Format>(
    index: number,
    text: string,
    format: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ): void;
  insertEmbed(
    index: number,
    type: string,
    value: any,
    source?: ChangeSource,
  ): void;
  formatLine(index: number, length: number, source?: ChangeSource): void;
  formatLine(
    index: number,
    length: number,
    formats: Formats,
    source?: ChangeSource,
  ): void;
  formatLine<TFormat extends Format>(
    index: number,
    length: number,
    format: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ): void;
  deleteText(index: number, length: number, source?: ChangeSource): void;
  // History
  undo: () => void;
  redo: () => void;
  // Formatting
  getFormat(): Promise<Formats>;
  getFormat(range: Range): Promise<Formats>;
  getFormat(index: number, length: number): Promise<Formats>;
  format: <TFormat extends Format>(
    name: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ) => void;
  formatText(index: number, length: number, source?: ChangeSource): void;
  formatText(
    index: number,
    length: number,
    formats: Formats,
    source?: ChangeSource,
  ): void;
  formatText<TFormat extends Format>(
    index: number,
    length: number,
    format: TFormat,
    value: Formats[TFormat],
    source?: ChangeSource,
  ): void;
  setContents: (delta: Delta, source?: ChangeSource) => void;
  // Editor
  focus: () => void;
  // Model
  getText: (range: Range) => Promise<string>;
  getLine: (index: number) => Promise<[Blot | null, number]>;
  getLeaf: (index: number) => Promise<[Blot | null, number]>;
  // Selection
  getBounds: (index: number, length?: number) => Promise<Bounds>;
  getSelection(): Promise<Range | null>;
  getSelection(focus: boolean): Promise<Range | null>;
  setSelection(index: number, length: number): Promise<void>;
  setSelection(range: Range): Promise<void>;
}

export const EditorContent = React.forwardRef(
  (
    props: EditorContentProps,
    ref:
      | React.MutableRefObject<EditorContentInstance | null>
      | ((instance: EditorContentInstance) => void)
      | null,
  ) => {
    const { onLoad, onTextChange, onSelectionChange } = props;
    const webViewRef = React.useRef<WebView>();

    const send = React.useCallback((message: ToWebViewMessage) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `window.postMessage(${JSON.stringify(message)}, '*');
           true;
          `,
        );
      }
    }, []);

    const receive = useEditorContentHandlers({
      ref,
      send,
      onLoad,
      onTextChange,
      onSelectionChange,
    });

    const handleReceive = React.useCallback(
      (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data) as FromWebViewMessage;

        receive(data);
      },
      [receive],
    );

    return (
      <WebView
        // @ts-ignore
        ref={webViewRef}
        source={html}
        style={styles.base}
        onMessage={handleReceive}
      />
    );
  },
);
const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
