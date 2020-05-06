import Quill from 'quill';
import Delta from 'quill-delta';
import 'quill/dist/quill.core.css';
import './editor.css';

import type {
  ToWebViewMessage,
  FromWebViewMessage,
  Range,
  Blot,
} from '../types';

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
      postMessage: (message: string) => void;
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

let BlockEmbed = Quill.import('blots/block/embed');

class HorizontalRule extends BlockEmbed {}
HorizontalRule.blotName = 'hr';
HorizontalRule.tagName = 'hr';

function sendMessage(message: FromWebViewMessage) {
  if (window.ReactNativeWebView) {
    console.log(message);

    window.ReactNativeWebView.postMessage(JSON.stringify(message));
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
  console.log(event);
  const data = JSON.parse(event.data) as ToWebViewMessage;

  console.log(data);

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
});
