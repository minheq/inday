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
import { useEditorContentHandlers } from './use_editor_content_handlers';
import { Platform } from 'react-native';

const html = require('./webview/index.bundle.html');

export interface EditorContentProps {
  onBlur?: () => void;
  onFocus?: () => void;
  onLoad?: () => void;
  onDebug?: (message: any) => void;
  onResize?: (width: number, height: number) => void;
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
    const {
      onLoad,
      onTextChange,
      onDebug,
      onSelectionChange,
      onResize,
    } = props;
    const webViewRef = React.useRef<WebView>();

    const handleResize = React.useCallback(
      (width: number, contentHeight: number) => {
        if (onResize) {
          onResize(width, contentHeight);
        }
      },
      [onResize],
    );

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
      onResize: handleResize,
      onDebug,
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
        originWhitelist={['*']}
        // @ts-ignore
        ref={webViewRef}
        source={Platform.select({
          ios: html,
          android: { uri: 'file:///android_asset/index.bundle.html' },
        })}
        // style={height ? { flex: 0, height } : { flex: 1 }}
        // style={{ paddingBottom: 80 }}
        // containerStyle={{ flex: 1 }}
        // scrollEnabled={false}
        bounces={false}
        hideKeyboardAccessoryView
        // overScrollMode="content"
        onLayout={(e) => {
          console.log(e.nativeEvent.layout, 'webview layout');
          // setLayoutHeight(e.nativeEvent.layout.height);
        }}
        onMessage={handleReceive}
      />
    );
  },
);
