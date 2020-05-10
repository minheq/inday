import Quill from 'quill';
import 'quill/dist/quill.core.css';
import './quill.css';

import type { ToWebViewMessage, FromWebViewMessage, Blot } from '../types';
import { bindings } from './keyboard';

function sendMessage(message: FromWebViewMessage) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    window.top.postMessage(message, '*');
  }
}

const container = document.querySelector<HTMLDivElement>('#editor-container');

if (!container) {
  throw new Error('Editor container element not found');
}

let quill = new Quill(container, {
  modules: {
    keyboard: {
      bindings,
    },
  },
});

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
    sendMessage({
      type: 'resize',
      width: editor.offsetWidth,
      height: editor.offsetHeight,
    });
    prevEditorWidth = editor.offsetWidth;
    prevEditorHeight = editor.offsetHeight;
  }
}

quill.on('text-change', function (delta, oldDelta, source) {
  sendMessage({ type: 'text-change', delta, oldDelta, source });
  sendResizeMessageIfNeeded();
});

quill.on('selection-change', function (range, oldRange, source) {
  sendMessage({ type: 'selection-change', range, oldRange, source });
});

function serializeBlot(blot: any): Blot {
  return {
    textContent: blot.domNode.textContent,
    tagName: blot.domNode.tagName,
    length: blot.length(),
    firstChild: blot.firstChild
      ? {
          tagName: blot.firstChild.domNode.tagName,
        }
      : null,
    parent: {
      tagName: blot.parent.domNode.tagName,
    },
  };
}

function receiveMessage(event: MessageEvent) {
  const data = event.data as ToWebViewMessage;

  if (data.type === 'format') {
    const { name, value, source } = data;
    quill.format(name, value, source);
    return;
  }

  if (data.type === 'format-text') {
    const { format, index, length, value, source, formats } = data;
    if (formats) {
      quill.formatText(index, length, formats, source);
    } else if (format) {
      quill.formatText(index, length, format, value, source);
    } else {
      quill.formatText(index, length, source);
    }
    return;
  }

  if (data.type === 'format-line') {
    const { formats, format, value, index, length, source } = data;
    if (formats) {
      quill.formatLine(index, length, formats, source);
    } else if (format) {
      quill.formatLine(index, length, format, value, source);
    } else {
      quill.formatLine(index, length, source);
    }
    return;
  }

  if (data.type === 'delete-text') {
    const { index, length } = data;
    quill.deleteText(index, length);
    return;
  }

  if (data.type === 'insert-text') {
    const { formats, format, value, index, text, source } = data;
    if (formats) {
      quill.insertText(index, text, formats, source);
    } else if (format) {
      quill.insertText(index, text, format, value, source);
    } else {
      quill.insertText(index, text, source);
    }
    return;
  }

  if (data.type === 'focus') {
    quill.focus();
    return;
  }

  if (data.type === 'undo') {
    quill.history.undo();
    return;
  }

  if (data.type === 'redo') {
    quill.history.redo();
    return;
  }

  if (data.type === 'set-contents') {
    const { delta, source } = data;
    quill.setContents(delta, source);
    return;
  }

  if (data.type === 'set-selection') {
    const { index, length, range, source } = data;
    if (range) {
      quill.setSelection(range, source);
    } else if (index && length) {
      quill.setSelection(index, length, source);
    }
    return;
  }

  if (data.type === 'get-bounds') {
    const { index, length } = data;
    const bounds = quill.getBounds(index, length);
    sendMessage({ type: 'get-bounds', bounds });
    return;
  }

  if (data.type === 'get-selection') {
    if (data.focus) {
      const selection = quill.getSelection(data.focus);
      sendMessage({ type: 'get-selection', range: selection });
    } else {
      const selection = quill.getSelection();
      sendMessage({ type: 'get-selection', range: selection });
    }
    return;
  }

  if (data.type === 'get-formats') {
    const formats = quill.getFormat();
    sendMessage({ type: 'get-formats', formats });
    return;
  }

  if (data.type === 'get-text') {
    const { range } = data;
    const text = quill.getText(range.index, range.length);
    sendMessage({ type: 'get-text', text });
    return;
  }

  if (data.type === 'get-line') {
    const { index } = data;
    const [blot, offset] = quill.getLine(index);

    if (!blot) {
      sendMessage({ type: 'get-line', line: null, offset });
    } else {
      sendMessage({ type: 'get-line', line: serializeBlot(blot), offset });
    }
    return;
  }

  if (data.type === 'get-leaf') {
    const { index } = data;
    const [blot, offset] = quill.getLeaf(index);

    if (!blot) {
      sendMessage({ type: 'get-leaf', leaf: null, offset });
    } else {
      sendMessage({ type: 'get-leaf', leaf: serializeBlot(blot), offset });
    }
    return;
  }

  // When data infers to `never`, it indicates all the cases have been satisfied

  throw new Error(`Event not handled ${event.data}`);
}

window.addEventListener('message', receiveMessage);
window.addEventListener('DOMContentLoaded', () => {
  sendMessage({ type: 'dom-content-loaded' });
  sendResizeMessageIfNeeded();
});
