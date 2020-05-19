import { Editor, Transforms, Range, Point } from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementType } from '../element';
import { Mark } from '../nodes/leaf';

// Anywhere
// bold immediate
// italic immediate
// strike immediate
// code immediate

const BLOCK_SHORTCUTS: {
  [text: string]: {
    [beforeText: string]: ElementType;
  };
} = {
  ' ': {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
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
  // '`': {
  //   '``': 'code-block',
  // },
};

const MARK_SHORTCUTS: {
  [key: string]: { prefix: RegExp; mark: Mark }[];
} = {
  '`': [
    {
      prefix: /`[^`]*/,
      mark: 'code',
    },
  ],
  '*': [
    {
      prefix: /\*[^*]*/,
      mark: 'italic',
    },
    // {
    //   prefix: /(^|\s)[*]{2}[^*]+[*]$/,
    //   mark: 'bold',
    // },
  ],
  // _: [
  //   {
  //     prefix: /(^|\s)[_][^_]+$/,
  //     mark: 'italic',
  //   },
  //   {
  //     prefix: /(^|\s)[_]{2}[^_]+[_]$/,
  //     mark: 'bold',
  //   },
  // ],
  '~': [
    {
      prefix: /~{2}[^~]+~/,
      mark: 'strikethrough',
    },
  ],
};

//   autolink: {
//     key: [' ', '\n'],
//     prefix: /https?:\/\/[^\s]+$/,
//   },
//   arrow: makeCompletionHotkey('->', '→'),
//   mdash: makeCompletionHotkey('--', '—'),

export function withShortcuts<T extends ReactEditor>(
  editor: T,
): T & ReactEditor {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;
    // console.log(editor.children, 'ed');

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

      for (let i = 0; i < MARK_SHORTCUTS[text].length; i++) {
        const shortcut = MARK_SHORTCUTS[text][i];

        console.log(leafText, 'match', shortcut.prefix);

        const match = leafText.match(shortcut.prefix);
        console.log(match);

        if (match?.index !== undefined) {
          console.log(match);

          const offset = match.index;

          const range = {
            anchor: { path, offset },
            focus,
          };

          // Don't format if it is empty
          // Don't format if it is already in that format
          // Don't format if it is `code`
          // Don't format if it is within code block
          Transforms.select(editor, range);

          const beforeText = Editor.string(editor, range);
          console.log(beforeText);
          const insertedText = beforeText.substring(2);
          console.log(insertedText);

          // Transforms.delete(editor);

          // editor.addMark(shortcut.mark, true);
          // editor.insertText(insertedText);
          // editor.removeMark(shortcut.mark);

          return;
        }
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
