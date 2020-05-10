import type { FromWebViewMessage, ToWebViewMessage } from './types';
import { createQuill } from './quill';

function sendMessage(message: FromWebViewMessage) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    window.top.postMessage(message, '*');
  }
}

const container = document.querySelector<HTMLDivElement>('.ql-container');

if (!container) {
  throw new Error('Editor container element not found');
}

const { handleMessage, onMessage } = createQuill(container, sendMessage);

const editor = document.querySelector<HTMLDivElement>('.ql-editor');

let prevEditorHeight = 0;
let prevEditorWidth = 0;

function sendResizeMessageIfNeeded() {
  if (!editor) {
    return;
  }

  if (
    editor.offsetWidth !== prevEditorWidth ||
    editor.offsetHeight !== prevEditorHeight
  ) {
    onMessage({
      type: 'resize',
      width: editor.offsetWidth,
      height: editor.offsetHeight,
    });
    prevEditorWidth = editor.offsetWidth;
    prevEditorHeight = editor.offsetHeight;
  }
}

function receiveMessage(message: MessageEvent) {
  const data = message.data as ToWebViewMessage;

  handleMessage(data);
}

window.addEventListener('message', receiveMessage);
window.addEventListener('DOMContentLoaded', () => {
  sendMessage({ type: 'editor-content-loaded' });
  sendResizeMessageIfNeeded();
});
