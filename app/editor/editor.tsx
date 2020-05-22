import React from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { Editor, createEditor, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Leaf, Mark } from './nodes/leaf';
import { withShortcuts } from './plugins/shortcuts';
import { withChecklists } from './plugins/checklists';
import { withLinks } from './plugins/links';
import { Element, BlockType, ElementType, InlineType } from './element';

const HOTKEYS: { [key: string]: Mark | ElementType } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+shift+c': 'code',
  'mod+shift+x': 'strikethrough',
  'mod+shift+7': 'numbered-list',
  'mod+shift+8': 'bulleted-list',
  'mod+shift+9': 'block-quote',
  'mod+shift+alt+c': 'code-block',
  'mod+shift+u': 'link',
};

const MARKS: { [key: string]: true } = {
  bold: true,
  italic: true,
  code: true,
  strikethrough: true,
};

function isMark(format: string): format is Mark {
  if (MARKS[format]) {
    return true;
  }

  return false;
}

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

function isBlock(format: string): format is BlockType {
  if (BLOCKS[format]) {
    return true;
  }

  return false;
}

const INLINES: { [key: string]: true } = {
  link: true,
};

function isInline(format: string): format is InlineType {
  if (INLINES[format]) {
    return true;
  }

  return false;
}

// TODO:
// - ~~Divider~~
// - ~~Markdown shortcuts~~
//  - ~~Divider~~
//  - ~~Code block~~
//  - ~~Code~~
//  - ~~Strikethrough~~
//  - ~~Bold~~
//  - ~~Italic~~
//  - ~~[] Checklist~~
//  - ~~Link?~~
// - Keyboard shortcuts
//  - ~~Bold~~
//  - ~~Italic~~
//  - ~~Code~~
//  - ~~Strikethrough~~
//  - ~~Numbered list~~
//  - ~~Bulleted list~~
//  - ~~Block quote~~
//  - ~~Code block~~
//  - Link
// - Formatting Toolbar
// - Link Toolbar
// - Type Commands
//  - Insert Image
//  - Insert Video
//  - Insert Twitter
// - Hashtags
// - Mentions

interface MyEditorProps {
  initialValue?: Node[];
}

export function MyEditor(props: MyEditorProps) {
  const { initialValue = [] } = props;
  const [value, setValue] = React.useState<Node[]>(initialValue);
  const renderElement = React.useCallback((p) => <Element {...p} />, []);
  const renderLeaf = React.useCallback((p) => <Leaf {...p} />, []);
  const editor = React.useMemo(
    () =>
      withLinks(
        withChecklists(withShortcuts(withReact(withHistory(createEditor())))),
      ),
    [],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const format = HOTKEYS[hotkey];

          if (isMark(format)) {
            toggleMark(editor, format);
          } else if (isBlock(format)) {
            toggleBlock(editor, format);
          } else if (isInline(format)) {
            if (format === 'link') {
              // TODO
            }
          }
        }
      }
    },
    [editor],
  );

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
      />
    </Slate>
  );
}

function isMarkActive(editor: Editor, mark: Mark) {
  const marks = Editor.marks(editor);
  return marks ? marks[mark] === true : false;
}

function toggleMark(editor: Editor, mark: Mark) {
  const isActive = isMarkActive(editor, mark);

  if (isActive) {
    Editor.removeMark(editor, mark);
  } else {
    Editor.addMark(editor, mark, true);
  }
}

function isBlockActive(editor: Editor, block: string) {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === block,
  });

  return !!match;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

function toggleBlock(editor: Editor, blockType: BlockType) {
  const isActive = isBlockActive(editor, blockType);
  const isList = LIST_TYPES.includes(blockType);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
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
