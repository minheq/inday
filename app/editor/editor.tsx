import React from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { Editor as SlateEditor, createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { Leaf } from './nodes/leaf';
import { withShortcuts } from './plugins/shortcuts';
import { withChecklists } from './plugins/checklists';
import { withLinks } from './plugins/links';
import { Element } from './element';

const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

// TODO:
// - Code block and syntax highlighting
// - Markdown shortcuts
//  - Code
//  - Code block
//  - Divider
//  - Strike through
//  - Bold
//  - Italic
//  - Link
// - Formatting Toolbar
// - Link Toolbar
// - Type Commands
//  - Insert Image
//  - Insert Video
//  - Insert Twitter
// - Hashtags
// - Mentions
// - Enforce layout?
export function Editor() {
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

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            // @ts-ignore
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
}

const isMarkActive = (editor: SlateEditor, format: string) => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: SlateEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
  }
};

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'image',
    void: true,
    url: 'https://source.unsplash.com/kFrdX5IeQzI',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
  {
    type: 'divider',
    void: true,
    children: [{ text: '' }],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Slide to the left.' }],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Slide to the right.' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Criss-cross.' }],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Criss-cross!' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Cha cha real smooth…' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: "Let's go to work!" }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes, like ',
      },
      {
        type: 'link',
        url: 'https://en.wikipedia.org/wiki/Hypertext',
        children: [{ text: 'hyperlinks' }],
      },
      {
        text: '!',
      },
    ],
  },
];
