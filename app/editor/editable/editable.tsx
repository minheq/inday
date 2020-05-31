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
import { LinkValue, Link } from './nodes/link';
import { css } from '../../utils/css';

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

interface Rect {
  width: number;
  height: number;
  left: number;
  top: number;
}

interface Selection extends Range, Rect {
  link: LinkValue | null;
}

export interface EditableState {
  marks: { [key in Mark]?: true } | null;
  type: BlockType | null;
  selection: Selection | null;
}

export interface EditableInstance {
  toggleBlock: (format: BlockType) => void;
  toggleMark: (format: Mark) => void;
}

interface EditableProps {
  initialValue?: Node[];
  onChange?: (state: EditableState) => void;
}

export const Editable = React.forwardRef<EditableInstance, EditableProps>(
  (props, ref) => {
    const { initialValue = [], onChange = () => {} } = props;
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
        const marks = Editor.marks(editor);
        const type = getBlockType(editor);
        let selection: Selection | null = null;

        if (editor.selection) {
          let rect = {
            width: 0,
            left: 0,
            top: 0,
            height: 0,
          };
          let link: LinkValue | null = null;

          if (
            !Range.isCollapsed(editor.selection) &&
            Editor.string(editor, editor.selection) !== ''
          ) {
            const domSelection = window.getSelection();
            const domRange = domSelection!.getRangeAt(0);
            const domRect = domRange.getBoundingClientRect();

            rect = {
              width: domRect.width,
              left: domRect.left,
              top: domRect.top,
              height: domRect.height,
            };
          }

          if (Range.isCollapsed(editor.selection)) {
            const [linkEntry] = Editor.nodes(editor, {
              match: (n) => n.type === 'link',
            });

            if (linkEntry) {
              const linkNode = linkEntry[0] as Link;
              const domNode = ReactEditor.toDOMNode(editor, linkNode);
              const domRect = domNode.getBoundingClientRect();

              link = {
                url: linkNode.url,
                display: linkNode.display,
              };

              rect = {
                width: domRect.width,
                left: domRect.left,
                top: domRect.top,
                height: domRect.height,
              };
            }
          }

          selection = {
            anchor: editor.selection.anchor,
            focus: editor.selection.focus,
            width: rect.width,
            left: rect.left,
            top: rect.top,
            height: rect.height,
            link,
          };
        }

        onChange({ marks, selection, type });
      },
      [editor, onChange],
    );

    return (
      <Slate editor={editor} value={value} onChange={handleChange}>
        <SlateEditable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          style={styles('editable')}
        />
      </Slate>
    );
  },
);

const styles = css.create({
  editable: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
  "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
  "Helvetica Neue", sans-serif`,
  },
});
