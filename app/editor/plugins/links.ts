import { Transforms, Editor, Range } from 'slate';
import { isUrl } from '../../utils/is_url';
import { ReactEditor } from 'slate-react';
import { Link } from '../nodes/link';
import { LinkValue } from '../link_edit';

export function withLinks<T extends ReactEditor>(editor: T): T & ReactEditor {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'link' ? true : isVoid(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}

export function insertLink(editor: ReactEditor, value: LinkValue) {
  if (editor.selection) {
    wrapLink(editor, value);
  }
}

const isLinkActive = (editor: ReactEditor) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
  return !!link;
};

export function unwrapLink(editor: ReactEditor) {
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === 'link',
  });
}

export function removeLink(editor: ReactEditor) {
  const [node] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
  const [element] = node;
  const link = element as Link;

  Transforms.delete(editor);
  Transforms.insertText(editor, link.display);

  // const selection = editor.selection;
  setTimeout(() => {
    // ReactEditor.focus(editor);
    console.log(editor);
  }, 10);
}

const wrapLink = (editor: ReactEditor, value: LinkValue | string) => {
  const { selection } = editor;

  if (!selection) {
    return;
  }
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const isCollapsed = Range.isCollapsed(selection);

  const link: Link = {
    type: 'link',
    url: typeof value === 'string' ? value : value.url,
    display: typeof value === 'string' ? value : value.display,
    children: [{ text: '' }],
  };

  if (isCollapsed) {
    const above = Editor.above(editor);

    // Happens during "Edit"
    if (above && above[0].type === 'link') {
      Transforms.delete(editor);
    }

    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
  }

  if (editor.selection) {
    const after = Editor.after(editor, editor.selection);

    if (after) {
      Transforms.select(editor, after);
    }
  }
};
