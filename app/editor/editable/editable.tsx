import React from 'react';
import isHotkey from 'is-hotkey';
import {
  Editable as SlateEditable,
  withReact,
  Slate,
  ReactEditor,
} from 'slate-react';
import { createEditor, Node, Range, Editor } from 'slate';
import { withHistory } from 'slate-history';

import { Leaf, Mark } from './nodes/leaf';
import { withShortcuts } from './plugins/shortcuts';
import { withChecklists } from './plugins/checklists';
import { withLinks } from './plugins/links';
import { Element, ElementType, BlockType } from './nodes/element';
import {
  isInline,
  isBlock,
  toggleBlock,
  isMark,
  toggleMark,
  getBlockType,
} from './plugins/handlers';
import { EditableProvider } from './provider';
import { LinkValue } from './nodes/link';

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

export interface EditableState {
  marks: { [key in Mark]?: true } | null;
  type: BlockType | null;
  selection: Range | null;
}

export interface EditableInstance {
  toggleBlock: (format: BlockType) => void;
  toggleMark: (format: Mark) => void;
}

interface EditableProps {
  initialValue?: Node[];
  onChange?: (state: EditableState) => void;
  onSelectLink?: (value: LinkValue) => void;
}

export const Editable = React.forwardRef<EditableInstance, EditableProps>(
  (props, ref) => {
    const {
      initialValue = [],
      onChange = () => {},
      onSelectLink = () => {},
    } = props;
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

    React.useImperativeHandle(
      ref,
      () => ({
        toggleBlock: (format) => {
          ReactEditor.focus(editor);
          toggleBlock(editor, format);
        },
        toggleMark: (format) => {
          ReactEditor.focus(editor);
          toggleMark(editor, format);
        },
      }),
      [editor],
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

    const handleChange = React.useCallback(
      (newValue: Node[]) => {
        setValue(newValue);

        onChange({
          marks: Editor.marks(editor),
          selection: editor.selection,
          type: getBlockType(editor),
        });
      },
      [editor, onChange],
    );

    return (
      <Slate editor={editor} value={value} onChange={handleChange}>
        <EditableProvider onSelectLink={onSelectLink}>
          <SlateEditable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={handleKeyDown}
          />
        </EditableProvider>
      </Slate>
    );
  },
);
