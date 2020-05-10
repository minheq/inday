import 'quill/dist/quill.core.css';
import './quill.css';
import Quill from 'quill';
import { bindings } from './keyboard';
import { ToWebViewMessage, Blot, FromWebViewMessage } from './types';

export interface Options {
  onMessage: (message: FromWebViewMessage) => void;
}

export interface QuillHandlers {
  handleMessage: (message: ToWebViewMessage) => void;
  onMessage: (message: FromWebViewMessage) => void;
}

export function createQuill(
  container: string | Element,
  onMessage: (message: FromWebViewMessage) => void,
): QuillHandlers {
  let quill = new Quill(container, {
    modules: {
      keyboard: {
        bindings,
      },
    },
  });

  quill.on('text-change', function (delta, oldDelta, source) {
    onMessage({ type: 'text-change', delta, oldDelta, source });
  });

  quill.on('selection-change', function (range, oldRange, source) {
    onMessage({ type: 'selection-change', range, oldRange, source });
  });

  function receiveMessage(message: ToWebViewMessage) {
    if (message.type === 'format') {
      const { name, value, source } = message;
      quill.format(name, value, source);
      return;
    }

    if (message.type === 'format-text') {
      const { format, index, length, value, source, formats } = message;
      if (formats) {
        quill.formatText(index, length, formats, source);
      } else if (format) {
        quill.formatText(index, length, format, value, source);
      } else {
        quill.formatText(index, length, source);
      }
      return;
    }

    if (message.type === 'format-line') {
      const { formats, format, value, index, length, source } = message;
      if (formats) {
        quill.formatLine(index, length, formats, source);
      } else if (format) {
        quill.formatLine(index, length, format, value, source);
      } else {
        quill.formatLine(index, length, source);
      }
      return;
    }

    if (message.type === 'delete-text') {
      const { index, length } = message;
      quill.deleteText(index, length);
      return;
    }

    if (message.type === 'insert-text') {
      const { formats, format, value, index, text, source } = message;
      if (formats) {
        quill.insertText(index, text, formats, source);
      } else if (format) {
        quill.insertText(index, text, format, value, source);
      } else {
        quill.insertText(index, text, source);
      }
      return;
    }

    if (message.type === 'focus') {
      quill.focus();
      return;
    }

    if (message.type === 'undo') {
      quill.history.undo();
      return;
    }

    if (message.type === 'redo') {
      quill.history.redo();
      return;
    }

    if (message.type === 'set-contents') {
      const { delta, source } = message;
      quill.setContents(delta, source);
      return;
    }

    if (message.type === 'set-selection') {
      const { index, length, range, source } = message;
      if (range) {
        quill.setSelection(range, source);
      } else if (index && length) {
        quill.setSelection(index, length, source);
      }
      return;
    }

    if (message.type === 'get-bounds') {
      const { index, length } = message;
      const bounds = quill.getBounds(index, length);
      onMessage({ type: 'get-bounds', bounds });
      return;
    }

    if (message.type === 'get-selection') {
      if (message.focus) {
        const selection = quill.getSelection(message.focus);
        onMessage({ type: 'get-selection', range: selection });
      } else {
        const selection = quill.getSelection();
        onMessage({ type: 'get-selection', range: selection });
      }
      return;
    }

    if (message.type === 'get-formats') {
      const formats = quill.getFormat();
      onMessage({ type: 'get-formats', formats });
      return;
    }

    if (message.type === 'get-text') {
      const { range } = message;
      const text = quill.getText(range.index, range.length);
      onMessage({ type: 'get-text', text });
      return;
    }

    if (message.type === 'get-line') {
      const { index } = message;
      const [blot, offset] = quill.getLine(index);

      if (!blot) {
        onMessage({ type: 'get-line', line: null, offset });
      } else {
        onMessage({ type: 'get-line', line: serializeBlot(blot), offset });
      }
      return;
    }

    if (message.type === 'get-leaf') {
      const { index } = message;
      const [blot, offset] = quill.getLeaf(index);

      if (!blot) {
        onMessage({ type: 'get-leaf', leaf: null, offset });
      } else {
        onMessage({ type: 'get-leaf', leaf: serializeBlot(blot), offset });
      }
      return;
    }

    // When message infers to `never`, it indicates all the cases have been satisfied

    throw new Error(`Event not handled ${message}`);
  }

  return {
    handleMessage: receiveMessage,
    onMessage,
  };
}

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
