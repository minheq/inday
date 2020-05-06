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
  EditorContentSize,
} from './types';
import { StyleSheet } from 'react-native';
import { useWebViewHandler } from './use_webview_handler';

// const html = require('./try.html');
const html = require('./webview/index.bundle.html');
// const html = require('./webview/index.html');
// const { html } = require('./webview/asjs');

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

class MessageHolder {
  constructor(listener: (message: FromWebViewMessage) => void) {
    this.listener = listener;
  }

  listener: (message: FromWebViewMessage) => void;

  on = (message: FromWebViewMessage) => {
    if (this.listener) {
      this.listener(message);
    } else {
      console.error('No listener');
    }
  };
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
      onLoad = () => {},
      onTextChange = () => {},
      onSelectionChange = () => {},
    } = props;
    const webViewRef = React.useRef<WebView>();
    const messageHolderRef = React.useRef<MessageHolder | null>(null);

    const sendMessage = React.useCallback((message: ToWebViewMessage) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `(function() {window.dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(
            message,
          )}}));})()`,
        );
      }
    }, []);

    const sendRequest = React.useCallback(
      (message: ToWebViewMessage): Promise<FromWebViewMessage> => {
        return new Promise((resolve) => {
          sendMessage(message);

          if (messageHolderRef.current) {
            messageHolderRef.current = new MessageHolder(
              (data: FromWebViewMessage) => {
                if (data.type === message.type) {
                  resolve(data);
                }

                messageHolderRef.current = null;
              },
            );
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

    const handleResize = React.useCallback((_size: EditorContentSize) => {
      if (webViewRef.current) {
        // webViewRef.current.style.height = size.height + 'px';
      }
    }, []);

    const receiveMessage = React.useCallback(
      (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data) as FromWebViewMessage;

        console.log(data);

        if (data.type === 'text-change') {
          onTextChange(data.delta, data.oldDelta, data.source);
        } else if (data.type === 'selection-change') {
          onSelectionChange(data.range, data.oldRange, data.source);
        } else if (data.type === 'resize') {
          handleResize(data.size);
        } else if (data.type === 'dom-content-loaded') {
          onLoad();
        }

        if (messageHolderRef.current) {
          messageHolderRef.current.on(data);
        }
      },
      [onTextChange, onSelectionChange, handleResize, onLoad],
    );

    return (
      <WebView
        // @ts-ignore
        ref={webViewRef}
        injectedJavaScript={debugging}
        source={html}
        style={styles.base}
        onMessage={receiveMessage}
      />
    );
  },
);
const debugging = `
  // Debug
  console = new Object();
  console.log = function(log) {
    window.webViewBridge.send("console", log);
  };
  console.debug = console.log;
  console.info = console.log;
  console.warn = console.log;
  console.error = console.log;
`;
const styles = StyleSheet.create({
  base: {
    height: '100%',
    width: '100%',
  },
});
