import { Editor, Transforms, Range, Point } from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementType } from '../element';
import { Mark } from '../nodes/leaf';

// Anywhere
// bold immediate
// italic immediate
// strike immediate
// code immediate

const KEY_SHORTCUTS: {
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
  // '*': [
  //   {
  //     prefix: /(^|\s)[*][^*]+$/,
  //     mark: 'italic',
  //   },
  //   {
  //     prefix: /(^|\s)[*]{2}[^*]+[*]$/,
  //     mark: 'bold',
  //   },
  // ],
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
  // '~': [
  //   {
  //     prefix: /(^|\s)~{2}[^~]+~$/,
  //     mark: 'strikethrough',
  //   },
  // ],
};

// Don't format if it is already in that format
// Don't format if it is `code`
// Don't format if it is within code block

export function withShortcuts<T extends ReactEditor>(
  editor: T,
): T & ReactEditor {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (KEY_SHORTCUTS[text] && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      const type = KEY_SHORTCUTS[text][beforeText];

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
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      for (let i = 0; i < MARK_SHORTCUTS[text].length; i++) {
        const shortcut = MARK_SHORTCUTS[text][i];
        const match = beforeText.match(shortcut.prefix);
        if (match) {
          if (match.index && editor.selection) {
            const prevSelection = editor.selection;
            console.log(beforeText.substring(match.index));
            const markRange: Range = {
              anchor: {
                path: editor.selection.anchor.path,
                offset: match.index,
              },
              focus: editor.selection.focus,
            };
            console.log(markRange, 'markRange');

            Transforms.select(editor, markRange);
            console.log('selected');

            Editor.addMark(editor, shortcut.mark, true);
            console.log('mark added');

            Transforms.select(editor, prevSelection);
            console.log('seletion restored');
          }
        }
      }
    }

    // console.log(beforeText);

    // if (matchedShortcut) {
    //   Transforms.select(editor, range);
    //   Transforms.delete(editor);
    //   Transforms.setNodes(
    //     editor,
    //     { type: matchedShortcut.type },
    //     { match: (n) => Editor.isBlock(editor, n) },
    //   );

    //   return;
    // }

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
