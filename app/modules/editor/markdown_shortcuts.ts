import { Range, HeadingSize } from './types';
import { EditorContentInstance } from './editor_content';

interface ShortcutMatch {
  name: string;
  pattern: RegExp;
  action: (
    text: string,
    selection: Range,
    pattern: RegExp,
    lineStart: number,
  ) => void;
}

export class MarkdownShortcuts {
  editor: EditorContentInstance;
  matches: ShortcutMatch[];
  ignoreTags: string[];

  constructor(editor: EditorContentInstance) {
    this.editor = editor;
    this.ignoreTags = ['PRE'];
    this.matches = [
      {
        name: 'header',
        pattern: /^(#){1,6}\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text);
          if (!match) {
            return;
          }
          const size = match[0].length;
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.editor.formatLine(
              selection.index,
              0,
              'header',
              (size - 1) as HeadingSize,
            );
            this.editor.deleteText(selection.index - size, size);
          }, 0);
        },
      },
      {
        name: 'blockquote',
        pattern: /^(>)\s/g,
        action: (text, selection) => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.editor.formatLine(selection.index, 1, 'blockquote', true);
            this.editor.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'code-block',
        pattern: /^`{3}(?:\s|\n)/g,
        action: (text, selection) => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.editor.formatLine(selection.index, 1, 'code-block', true);
            this.editor.deleteText(selection.index - 4, 4);
          }, 0);
        },
      },
      {
        name: 'bolditalic',
        pattern: /(?:\*){3}(.+?)(?:\*){3}|\b(?:_){3}(.+?)(?:_){3}\b/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);
          if (!match) {
            return;
          }

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout(() => {
            this.editor.deleteText(startIndex, annotatedText.length);
            this.editor.insertText(startIndex, matchedText, {
              bold: true,
              italic: true,
            });
            this.editor.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'bold',
        pattern: /(?:\*){2}(.+?)(?:\*){2}|\b(?:_){2}(.+?)(?:_){2}\b/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);
          if (!match) {
            return;
          }

          const annotatedText = match[0];
          const matchedText = match[1] || match[2];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout(() => {
            this.editor.deleteText(startIndex, annotatedText.length);
            this.editor.insertText(startIndex, matchedText, { bold: true });
            this.editor.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'italic',
        pattern: /(?:\*){1}(.+?)(?:\*){1}|\b(?:_){1}(.+?)(?:_){1}\b/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);
          if (!match) {
            return;
          }

          const annotatedText = match[0];
          const matchedText = match[1] || match[2];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout(() => {
            this.editor.deleteText(startIndex, annotatedText.length);
            this.editor.insertText(startIndex, matchedText, { italic: true });
            this.editor.format('italic', false);
          }, 0);
        },
      },
      {
        name: 'strike',
        pattern: /(?:~~)(.+?)(?:~~)/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);
          if (!match) {
            return;
          }

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout(() => {
            this.editor.deleteText(startIndex, annotatedText.length);
            this.editor.insertText(startIndex, matchedText, { strike: true });
            this.editor.format('strike', false);
          }, 0);
        },
      },
      {
        name: 'code',
        pattern: /(?:`)(.+?)(?:`)/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);
          if (!match) {
            return;
          }

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          this.editor.deleteText(startIndex, annotatedText.length);
          this.editor.insertText(startIndex, matchedText, { code: true });
          this.editor.format('code', false);
          this.editor.insertText(selection.index, ' ');
        },
      },
      {
        name: 'hr',
        pattern: /^([-*]\s?){3}/g,
        action: (text, selection) => {
          const startIndex = selection.index - text.length;
          this.editor.deleteText(startIndex, text.length);

          this.editor.insertEmbed(startIndex + 1, 'hr', 'user');
          this.editor.insertText(startIndex + 2, '\n');
          this.editor.setSelection(startIndex + 2, 0);
        },
      },
      {
        name: 'plus-ul',
        // Quill 1.3.5 already treat * as another trigger for bullet lists
        pattern: /^\+\s$/g,
        action: (text, selection) => {
          this.editor.formatLine(selection.index, 1, 'list', 'bullet');
          this.editor.deleteText(selection.index - 2, 2);
        },
      },
      {
        name: 'image',
        pattern: /(?:!\[(.+?)\])(?:\((.+?)\))/g,
        action: (text, selection, pattern) => {
          const startIndex = text.search(pattern);
          const matchedText = text.match(pattern)?.[0];
          const hrefLink = text.match(/(?:\((.*?)\))/g)?.[0];

          if (!hrefLink || !matchedText) {
            return;
          }
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.editor.deleteText(start, matchedText.length);
              this.editor.insertEmbed(
                start,
                'image',
                hrefLink.slice(1, hrefLink.length - 1),
              );
            }, 0);
          }
        },
      },
      {
        name: 'link',
        pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
        action: (text, selection, pattern) => {
          const startIndex = text.search(pattern);
          const matchedText = text.match(pattern)?.[0];
          const hrefText = text.match(/(?:\[(.*?)\])/g)?.[0];
          const hrefLink = text.match(/(?:\((.*?)\))/g)?.[0];

          if (!matchedText || !hrefText || !hrefLink) {
            return;
          }
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.editor.deleteText(start, matchedText.length);
              this.editor.insertText(
                start,
                hrefText.slice(1, hrefText.length - 1),
                'link',
                hrefLink.slice(1, hrefLink.length - 1),
              );
            }, 0);
          }
        },
      },
    ];

    // Handler that looks for insert deltas that match specific characters
    this.editor.on('text-change', (delta) => {
      console.log('delta go');

      for (let i = 0; i < delta.ops.length; i++) {
        if (delta.ops[i].hasOwnProperty('insert')) {
          if (delta.ops[i].insert === ' ') {
            this.onSpace();
          } else if (delta.ops[i].insert === '\n') {
            this.onEnter();
          }
        }
      }
    });
  }

  isValid(text: string, tagName: string) {
    return (
      typeof text !== 'undefined' &&
      text &&
      this.ignoreTags.indexOf(tagName) === -1
    );
  }

  onSpace = async () => {
    const selection = await this.editor.getSelection();
    if (!selection) {
      return;
    }
    const [line, offset] = await this.editor.getLine(selection.index);
    if (!line) {
      return;
    }
    const text = line.textContent;
    const lineStart = selection.index - offset;
    if (this.isValid(text, line.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern);
        if (matchedText) {
          // We need to replace only matched text not the whole line
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  };

  onEnter = async () => {
    let selection = await this.editor.getSelection();
    if (!selection) {
      return;
    }
    const [line, offset] = await this.editor.getLine(selection.index);
    if (!line) {
      return;
    }
    const text = line.textContent + ' ';
    const lineStart = selection.index - offset;
    selection.length = selection.index++;
    if (this.isValid(text, line.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern);
        if (matchedText) {
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  };
}
