import React from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';
import { createEditor, Node, Transforms, Range } from 'slate';
import { withHistory } from 'slate-history';
import { Leaf, Mark } from './nodes/leaf';
import { withShortcuts } from './plugins/shortcuts';
import { withChecklists } from './plugins/checklists';
import { withLinks, insertLink } from './plugins/links';
import { Element, ElementType } from './element';
import { isMark, toggleMark } from './use_mark_handlers';
import { isBlock, toggleBlock } from './use_block_handlers';
import { isInline } from './use_inline_handlers';
import { Toolbar } from './toolbar';
import { Dialog } from '../components';
import { LinkEdit, LinkValue, LinkEditProvider } from './link_edit';

const HOTKEYS: { [key: string]: Mark | ElementType } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+shift+c': 'code',
  'mod+shift+x': 'strikethrough',
  'mod+shift+7': 'numbered-list',
  'mod+shift+8': 'bulleted-list',
  'mod+shift+9': 'block-quote',
  'mod+shift+alt+c': 'code-block',
  'mod+k': 'link',
};

// TODO:
// - Toolbar
// - Link
// - Type Commands
//  - Insert Image
//  - Insert Video Embed
//  - Insert Twitter Embed
//  - Insert Audio Recording
//  - More
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
        // @ts-ignore
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
      <LinkEditProvider>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
        />
      </LinkEditProvider>
    </Slate>
  );
}
