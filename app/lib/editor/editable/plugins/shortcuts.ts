import { Editor, Transforms, Range, Point } from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementType } from '../nodes/element';
import { Mark } from '../nodes/leaf';

const BLOCK_SHORTCUTS: {
  [text: string]: {
    [beforeText: string]: ElementType;
  };
} = {
  ' ': {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    // '#': 'heading-one',
    // '##': 'heading-two',
    // '###': 'heading-three',
  },
  ']': {
    '[': 'check-list-item',
  },
  '>': {
    '': 'block-quote',
  },
  '-': {
    '--': 'divider',
  },
  '*': {
    '**': 'divider',
  },
  '`': {
    '``': 'code-block',
  },
};

const MARK_SHORTCUTS: {
  [key: string]: { prefix: RegExp; mark: Mark }[];
} = {
  '`': [
    {
      prefix: /`([^`]*)/,
      mark: 'code',
    },
  ],
  '*': [
    {
      prefix: /\*{2}([^*]*)\*/,
      mark: 'bold',
    },
    {
      prefix: /\*([^*]*)/,
      mark: 'italic',
    },
  ],
  _: [
    {
      prefix: /_{2}([^_]*)_/,
      mark: 'bold',
    },
    {
      prefix: /_([^_]*)/,
      mark: 'italic',
    },
  ],
  '~': [
    {
      prefix: /~{2}([^~]*)~/,
      mark: 'strikethrough',
    },
  ],
};

const SUBSTITUTE_SHORTCUTS: {
  [text: string]: {
    [beforeCharacter: string]: string;
  };
} = {
  '>': {
    '-': '→',
  },
  '-': {
    '-': '—',
  },
};

// TODO:
// Don't format if it is already in that format
// Don't format if it is `code`
// > It is already not possible because of how inline nodes work
export function withShortcuts<T extends ReactEditor>(
  editor: T,
): T & ReactEditor {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (BLOCK_SHORTCUTS[text] && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      const type = BLOCK_SHORTCUTS[text][beforeText];

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(
          editor,
          { type },
          { match: (n) => Editor.isBlock(editor, n) },
        );

        if (type === 'list-item') {
          const list = { type: 'bulleted-list', children: [] };
          Transforms.wrapNodes(editor, list, {
            match: (n) => n.type === 'list-item',
          });
        }

        return;
      }
    }

    if (MARK_SHORTCUTS[text] && selection && Range.isCollapsed(selection)) {
      const { focus } = selection;
      const leaf = Editor.leaf(editor, selection);
      const [{ text: leafText }, path] = leaf;
      const beforeText = leafText.substring(0, selection.focus.offset);

      for (let i = 0; i < MARK_SHORTCUTS[text].length; i++) {
        const shortcut = MARK_SHORTCUTS[text][i];
        const match = beforeText.match(shortcut.prefix);

        if (match?.index !== undefined) {
          const matchedText = match[1];

          // Don't format if it is empty
          if (!matchedText) {
            break;
          }

          const node = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n),
          });

          // Don't format if it is within code block
          if (node && node[0].type === 'code-block') {
            break;
          }

          const range = { anchor: { path, offset: match.index }, focus };

          Transforms.select(editor, range);
          Transforms.delete(editor);

          editor.addMark(shortcut.mark, true);
          editor.insertText(matchedText);
          editor.removeMark(shortcut.mark);

          return;
        }
      }
    }

    if (
      SUBSTITUTE_SHORTCUTS[text] &&
      selection &&
      Range.isCollapsed(selection)
    ) {
      const { focus } = selection;
      const leaf = Editor.leaf(editor, selection);
      const [{ text: leafText }, path] = leaf;
      const beforeText = leafText.substring(0, selection.focus.offset);
      const beforeCharacter = beforeText.charAt(beforeText.length - 1);
      const substitutedText = SUBSTITUTE_SHORTCUTS[text][beforeCharacter];

      if (substitutedText) {
        const range = {
          anchor: { path, offset: beforeText.length - 1 },
          focus,
        };

        Transforms.select(editor, range);
        Transforms.delete(editor);
        editor.insertText(substitutedText);
        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: 'paragraph' });

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: (n) => n.type === 'bulleted-list',
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(unit);
    }
  };

  return editor;
}
