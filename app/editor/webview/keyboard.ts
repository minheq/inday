import Delta from 'quill-delta';
// import { BlockEmbed } from 'quill/blots/block';
import Quill from 'quill';
// import selectNode from '../utils/editor/selectNode';
// import Block from './formats/Block';
// import ImageBlot from './formats/Image';
// import { identifyLanguage } from './Syntax';
import { Range, Format } from '../types';

interface QuillContainer {
  quill: Quill;
}

export const bindings = {
  autolink: {
    key: [' ', '\n'],
    prefix: /https?:\/\/[^\s]+$/,
    collapsed: true,
    format: { link: false, code: false, 'code-block': false },
    handler(this: QuillContainer, range: Range, context: any) {
      const [match] = context.prefix.match(bindings.autolink.prefix);
      const index = range.index + range.length;
      const text = context.event.key === ' ' ? ' ' : '\n';
      this.quill.insertText(index, text, 'user');
      this.quill.history.cutoff();
      const delta = new Delta()
        .retain(index - match.length)
        .retain(match.length, { link: match });
      this.quill.updateContents(delta, 'user');
      this.quill.setSelection(index + 1, 0, 'silent');
      this.quill.history.cutoff();
    },
  },
  arrow: makeCompletionHotkey('->', '→'),
  mdash: makeCompletionHotkey('--', '—'),
  'title-tab': {
    key: 'Tab',
    handler(this: QuillContainer, range: Range) {
      const [line] = this.quill.getLine(range.index);
      if (line && line.offset(this.quill.scroll) === 0 && line.next) {
        // If we are on the title row, insert a newline or advance to content
        this.quill.setSelection(line.next.offset(this.quill.scroll), 'user');
        return false;
      }
      return true;
    },
  },
  'header-1': makeHeaderHotkey(1),
  'header-2': makeHeaderHotkey(2),
  'header-3': makeHeaderHotkey(3),
  'header-4': makeHeaderHotkey(4),
  'header-5': makeHeaderHotkey(5),
  'header-6': makeHeaderHotkey(6),
  'remove-formatting': {
    key: 48,
    shortKey: true,
    altKey: true,
    handler(this: QuillContainer, range: Range) {
      if (range.length === 0) {
        const formats = this.quill.getFormat();
        Object.keys(formats).forEach((name) => {
          this.quill.format(name, false, 'user');
        });
      } else {
        this.quill.removeFormat(range.index, range.length, 'user');
      }
    },
  },
  'ordered-list': {
    key: 55,
    shortKey: true,
    shiftKey: true,
    handler(this: QuillContainer, range: Range, context: any) {
      const {
        format: { list },
      } = context;
      this.quill.format('list', list === 'ordered' ? false : 'ordered', 'user');
    },
  },
  'bullet-list': {
    key: 56,
    shortKey: true,
    shiftKey: true,
    handler(this: QuillContainer, range: Range, context: any) {
      const {
        format: { list },
      } = context;
      this.quill.format('list', list === 'bullet' ? false : 'bullet', 'user');
    },
  },
  'check-list': {
    key: 57,
    shortKey: true,
    shiftKey: true,
    handler(this: QuillContainer, range: Range, context: any) {
      const {
        format: { list },
      } = context;
      this.quill.format(
        'list',
        list === 'checked' || list === 'unchecked' ? false : 'unchecked',
        'user',
      );
    },
  },
  'list-space-tab': {
    key: ' ',
    collapsed: true,
    offset: 1,
    prefix: /^ $/,
    format: { list: true },
    handler(this: QuillContainer, range: Range) {
      this.quill.insertText(range.index, ' ', 'user');
      this.quill.history.cutoff();
      this.quill.deleteText(range.index - 1, 2, 'user');
      this.quill.formatLine(range.index - 1, 0, 'indent', '+1', 'user');
      this.quill.history.cutoff();
    },
  },
  strike: {
    key: 88,
    altKey: true,
    shortKey: true,
    handler(this: QuillContainer, range: Range, context: any) {
      this.quill.format('strike', !context.format.strike, 'user');
    },
  },
  'select-all-code': {
    key: 'a',
    shortKey: true,
    format: ['code-block'],
    handler(this: QuillContainer, range: Range) {
      const [line] = this.quill.getLine(range.index);
      if (line && line.parent) {
        const index = line.parent.offset();
        const length = line.parent.length();
        this.quill.setSelection(index, length - 1, 'user');
        return false;
      }
      return true;
    },
  },
  'markdown-code-block': {
    key: 'Enter',
    prefix: /^```([a-z]*)$/,
    collapsed: true,
    handler(this: QuillContainer, range: Range, context: any, binding: any) {
      let format = null;
      let length = 3;
      if (!context.format['code-block']) {
        [, format] = context.prefix.match(binding.prefix);
        length += format.length;
        format = identifyLanguage(format);
      }
      this.quill.history.cutoff();
      const delta = new Delta()
        .retain(range.index - length)
        .delete(length)
        .retain(1, { 'code-block': format });
      this.quill.updateContents(delta, 'user');
      this.quill.history.cutoff();
    },
  },
  'markdown-header': {
    key: ' ',
    shiftKey: null,
    prefix: /^#{1,6}$/,
    format: { code: false, 'code-block': false },
    handler(this: QuillContainer, range: Range, context: any) {
      this.quill.insertText(range.index, ' ', 'user');
      this.quill.history.cutoff();
      const [line, offset] = this.quill.getLine(range.index + 1);
      const delta = new Delta()
        .retain(range.index + 1 - offset)
        .delete(context.prefix.length + 1)
        .retain(line.length() - 1 - offset)
        .retain(1, { header: Math.min(context.offset, 3) });
      this.quill.updateContents(delta, 'user');
      this.quill.history.cutoff();
      this.quill.setSelection(range.index - context.prefix.length, 0, 'silent');
    },
  },
  'markdown-blockquote': {
    key: ' ',
    prefix: /^>$/,
    format: { blockquote: false, code: false, 'code-block': false },
    handler(this: QuillContainer, range: Range, context: any) {
      this.quill.insertText(range.index, ' ', 'user');
      this.quill.history.cutoff();
      const [line, offset] = this.quill.getLine(range.index + 1);
      const delta = new Delta()
        .retain(range.index + 1 - offset)
        .delete(context.prefix.length + 1)
        .retain(line.length() - 1 - offset)
        .retain(1, { blockquote: true });
      this.quill.updateContents(delta, 'user');
      this.quill.history.cutoff();
      this.quill.setSelection(range.index - context.prefix.length, 0, 'silent');
    },
  },
  'markdown-hr': {
    key: 'Enter',
    prefix: /^[-*_]{3}$/,
    collapsed: true,
    handler(this: QuillContainer, range: Range) {
      this.quill.insertText(range.index, '\n', 'user');
      this.quill.history.cutoff();
      const delta = new Delta()
        .retain(range.index - 3)
        .insert({ hr: true })
        .delete(4);
      this.quill.updateContents(delta, 'user');
      this.quill.history.cutoff();
      this.quill.setSelection(range.index - 2, 0, 'user');
    },
  },
  'markdown-bold': {
    key: ['*', '_'],
    shiftKey: null,
    prefix: /(^|\s)[_*]{2}[^_*]+[_*]$/,
    collapsed: true,
    format: { bold: false, code: false, 'code-block': false },
    handler(this: QuillContainer, range: Range, context: any) {
      handleInlineMarkdown(this.quill, 'bold', range, context);
    },
  },
  'markdown-italic': {
    key: ['*', '_'],
    shiftKey: null,
    prefix: /(^|\s)[_*][^_*]+$/,
    collapsed: true,
    format: { italic: false, code: false, 'code-block': false },
    handler(this: QuillContainer, range: Range, context: any) {
      handleInlineMarkdown(this.quill, 'italic', range, context);
    },
  },
  'markdown-code': {
    key: '`',
    prefix: /`[^`]*/,
    collapsed: true,
    format: { 'code-block': false },
    handler(this: QuillContainer, range: Range, context: any) {
      console.log('huh should go');

      if (context.event.isComposing) {
        handleInlineMarkdown(this.quill, 'code', range, context);
      } else if (context.prefix.match(/^`+$/g) && context.format.list == null) {
        return true;
      } else if (context.prefix.endsWith('`')) {
        this.quill.deleteText(range.index - 1, 1, 'user');
        this.quill.format('code', !context.format.code, 'user');
      } else if (!context.format.code) {
        handleInlineMarkdown(this.quill, 'code', range, context);
      }
      return false;
    },
  },
  'markdown-strike': {
    key: '~',
    shiftKey: null,
    prefix: /(^|\s)~{2}[^~]+~$/,
    collapsed: true,
    format: { strike: false },
    handler(this: QuillContainer, range: Range, context: any) {
      handleInlineMarkdown(this.quill, 'strike', range, context);
    },
  },
  'embed enter': {
    key: ['Enter'],
    collapsed: false,
    offset: 0,
    handler(this: QuillContainer, range: Range, { line }) {
      if (!(line instanceof BlockEmbed)) {
        return true;
      }

      const isNextLineEmpty =
        line.next &&
        line.next.statics.blotName === Block.blotName &&
        line.next.length() <= 1;

      if (!isNextLineEmpty) {
        this.quill.insertText(range.index + 1, '\n', 'user');
      }
      this.quill.setSelection(range.index + 1, 0, 'user');
      selectNode(null, this.quill.root);
      return false;
    },
  },
  'image backspace': {
    key: ['Backspace'],
    collapsed: true,
    offset: 0,
    handler(this: QuillContainer, range: Range, context: any) {
      const { empty, line } = context;
      if (!line.prev || line.prev.statics.blotName !== ImageBlot.blotName) {
        return true;
      }

      this.quill.setSelection(range.index - 1, 1, 'user');
      selectNode(line.prev.domNode, this.quill.root);

      // Image can't be the last element of the post
      if (line.next && empty) {
        this.quill.deleteText(range.index, 1, 'user');
      }
      return false;
    },
  },
  'hint enter': {
    key: 'Enter',
    collapsed: true,
    format: ['hint'],
    handler(this: QuillContainer, range: Range, context: any) {
      const { line, offset } = context;
      if (offset < line.length() - 1) {
        return true;
      }
      this.quill.insertText(range.index + 1, '\n', { hint: null }, 'user');
      this.quill.setSelection(range.index + 1, 0, 'silent');
      return false;
    },
  },
};

function handleInlineMarkdown(
  quill: Quill,
  format: Format,
  { index },
  { event, prefix },
) {
  const trimLength = format === 'bold' || format === 'strike' ? 2 : 1;
  let code = event.key;
  if (trimLength === 2) {
    code += event.key;
  }
  const text = prefix.slice(prefix.indexOf(code));
  // Some international keyboards (ex German) will have already inserted
  if (text.endsWith(code)) {
    // Need to defer to allow compositionend to take place
    _.defer(() => {
      applyInlineMarkdown(quill, index, format, text, code);
    });
  } else {
    quill.insertText(index, event.key, 'user');
    applyInlineMarkdown(quill, index + 1, format, text + event.key, code);
  }
}

function applyInlineMarkdown(
  quill: Quill,
  index: number,
  format: Format,
  text: string,
  code: string,
) {
  quill.history.cutoff();
  const delta = new Delta()
    .retain(index - text.length)
    .delete(code.length)
    .retain(text.length - 2 * code.length, { [format]: true })
    .delete(code.length);
  quill.updateContents(delta, 'user');
  quill.setSelection(index - 2 * code.length, 0, 'silent');
  quill.history.cutoff();
  quill.format(format, false);
}

function makeCompletionHotkey(from: string, to: string) {
  const [prev, next] = from.split('');
  return {
    key: next,
    shiftKey: null,
    prefix: new RegExp(`[^${prev}]+${prev}$`),
    format: { code: false, 'code-block': false },
    handler(this: QuillContainer, range: Range) {
      this.quill.insertText(range.index, next, 'user');
      this.quill.history.cutoff();
      this.quill.updateContents(
        new Delta()
          .retain(range.index - 1)
          .delete(2)
          .insert(to),
        'user',
      );
      this.quill.history.cutoff();
      this.quill.setSelection(range.index, 0, 'silent');
    },
  };
}

function makeHeaderHotkey(level: number) {
  return {
    key: level + 48, // 49 is 1
    shortKey: true,
    altKey: true,
    handler(this: QuillContainer) {
      this.quill.format('header', Math.min(level, 3), 'user');
      this.quill.format('indent', null, 'user');
    },
  };
}
