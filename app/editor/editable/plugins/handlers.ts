import { Editor, Transforms, Range } from 'slate';

import { Mark } from '../nodes/leaf';
import { BlockType, InlineType } from '../nodes/element';
import { ReactEditor } from 'slate-react';
import { Link, LinkValue } from '../nodes/link';

export function getBlockType(editor: Editor): BlockType | null {
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });

  if (!block) {
    return null;
  }

  return block[0].type as BlockType;
}

export function isBlockActive(editor: Editor, blockType: BlockType) {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === blockType,
  });

  return !!match;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const BLOCKS: { [key: string]: true } = {
  paragraph: true,
  'bulleted-list': true,
  'numbered-list': true,
  'list-item': true,
  'block-quote': true,
  'code-block': true,
  divider: true,
  'check-list-item': true,
  'heading-one': true,
  'heading-two': true,
  'heading-three': true,
  image: true,
};

export function isBlock(format: string): format is BlockType {
  if (BLOCKS[format]) {
    return true;
  }

  return false;
}

export function toggleBlock(editor: Editor, blockType: BlockType) {
  const isActive = isBlockActive(editor, blockType);
  const isList = LIST_TYPES.includes(blockType);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : blockType,
  });

  if (!isActive && isList) {
    const block = { type: blockType, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

const MARKS: { [key: string]: true } = {
  bold: true,
  italic: true,
  code: true,
  strikethrough: true,
};

export function isMark(format: string): format is Mark {
  if (MARKS[format]) {
    return true;
  }

  return false;
}

export function isMarkActive(editor: Editor, mark: Mark) {
  const marks = Editor.marks(editor);
  return marks ? marks[mark] === true : false;
}

export function toggleMark(editor: Editor, mark: Mark) {
  const isActive = isMarkActive(editor, mark);

  if (isActive) {
    Editor.removeMark(editor, mark);
  } else {
    Editor.addMark(editor, mark, true);
  }
}

const INLINES: { [key: string]: true } = {
  link: true,
};

export function isInline(format: string): format is InlineType {
  if (INLINES[format]) {
    return true;
  }

  return false;
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

function unwrapLink(editor: ReactEditor) {
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
}

export const wrapLink = (editor: ReactEditor, value: LinkValue | string) => {
  const { selection } = editor;

  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const isCollapsed = selection && Range.isCollapsed(selection);

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

    // We get the call ReactEditor.toDOMNode at every change
    // However, when we insert new nodes and want to select it
    // the DOMNode is not ready. Thus we defer selection so that the DOMNode
    // gets registered in time
    if (editor.selection) {
      const prevSelection = editor.selection;
      Transforms.deselect(editor);

      setTimeout(() => {
        Transforms.select(editor, prevSelection);
      }, 0);
    }
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
  }
};
