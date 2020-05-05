import Quill from 'quill';
import Delta from 'quill-delta';
import 'quill/dist/quill.core.css';
import './editor.css';

import type { ToWebViewMessage, FromWebViewMessage, Range } from '../types';

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect: () => void;
  observe: (target: Element, options?: ResizeObserverObserveOptions) => void;
  unobserve: (target: Element) => void;
}

interface ResizeObserverObserveOptions {
  box?: 'content-box' | 'border-box';
}

type ResizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver,
) => void;

interface ResizeObserverEntry {
  readonly borderBoxSize: ResizeObserverEntryBoxSize;
  readonly contentBoxSize: ResizeObserverEntryBoxSize;
  readonly contentRect: DOMRectReadOnly;
  readonly target: Element;
}

interface ResizeObserverEntryBoxSize {
  blockSize: number;
  inlineSize: number;
}

declare global {
  interface Window {
    initialContent: Delta;
    ReactNativeWebView: {
      postMessage: (message: FromWebViewMessage) => void;
    };
  }
}

declare module 'quill' {
  interface Quill {
    history: {
      undo: () => void;
      redo: () => void;
    };
  }
}

function sendMessage(message: FromWebViewMessage) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(message);
  } else {
    window.top.postMessage(message, '*');
  }
}

const observer = new ResizeObserver((entries) => {
  const body = entries[0];

  sendMessage({
    type: 'resize',
    size: {
      height: body.contentRect.height,
      width: body.contentRect.width,
    },
  });
});

const bodyElement = document.querySelector('body');

if (!bodyElement) {
  throw new Error('Body element not found');
}

observer.observe(bodyElement);

let quill = new Quill('#editor-container');

// Forward slash
quill.keyboard.addBinding(
  { key: 191 },
  {
    empty: true,
    collapsed: true,
  },
  function (range: Range) {
    sendMessage({ type: 'prompt-commands', index: range.index });
    quill.insertText(range.index, '/');
  },
);

// Arrow up
quill.keyboard.addBinding(
  { key: 38 },
  {
    prefix: /^\/$/,
  },
  function () {
    console.log('up');
  },
);

// Arrow down
quill.keyboard.addBinding(
  { key: 40 },
  {
    prefix: /^\/$/,
  },
  function () {
    console.log('down');
  },
);

quill.on('text-change', function (delta, oldDelta, source) {
  sendMessage({ type: 'text-change', delta, oldDelta, source });
});

quill.on('selection-change', function (range, oldRange, source) {
  sendMessage({ type: 'selection-change', range, oldRange, source });
});

function receiveMessage(event: MessageEvent) {
  const data = event.data as ToWebViewMessage;

  if (data.type === 'format') {
    const { name, value, source } = data;
    quill.format(name, value, source);
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
    const { range } = data;
    quill.setSelection(range.index, range.length);
    return;
  }

  if (data.type === 'get-bounds') {
    const { index, length } = data;
    const bounds = quill.getBounds(index, length);
    sendMessage({ type: 'get-bounds', bounds });
    return;
  }

  if (data.type === 'get-selection') {
    const selection = quill.getSelection();
    sendMessage({ type: 'get-selection', range: selection });
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

  if (data.type === 'get-link-range') {
    const { index } = data;
    const [link, offset] = quill.getLeaf(index);

    if (link && link.parent.domNode instanceof window.HTMLAnchorElement) {
      const range = { index: index - offset, length: link.length() };

      sendMessage({ type: 'get-link-range', range });
    } else {
      sendMessage({ type: 'get-link-range', range: null });
    }
    return;
  }

  if (data.type === 'get-line') {
    const { index } = data;
    const [blot, offset] = quill.getLine(index);

    if (!blot) {
      sendMessage({ type: 'get-line', line: null });
    } else {
      const line = {
        isEmpty:
          blot.domNode instanceof window.HTMLParagraphElement &&
          blot.domNode.firstChild instanceof window.HTMLBRElement,
        offset,
      };

      sendMessage({ type: 'get-line', line });
    }
    return;
  }

  if (data.type === 'remove-link') {
    const { index } = data;
    const [link, offset] = quill.getLeaf(index);

    if (link && link.parent.domNode instanceof window.HTMLAnchorElement) {
      const linkRange = { index: index - offset, length: link.length() };
      quill.formatText(linkRange, 'link', false);
    }
    return;
  }

  if (data.type === 'format-link') {
    const {
      range,
      link: { text, url },
    } = data;
    quill.deleteText(range.index, range.length);
    quill.insertText(range.index, text, 'link', url);
  }
}

window.addEventListener('message', receiveMessage);
window.addEventListener('DOMContentLoaded', () => {
  sendMessage({ type: 'dom-content-loaded' });
});
