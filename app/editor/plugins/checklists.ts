import { Editor, Transforms, Range, Point } from 'slate';
import { ReactEditor } from 'slate-react';

export function withChecklists<T extends ReactEditor>(
  editor: T,
): T & ReactEditor {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === 'check-list-item',
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          Transforms.setNodes(
            editor,
            { type: 'paragraph' },
            { match: (n) => n.type === 'check-list-item' },
          );
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  return editor;
}
