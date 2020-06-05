import React from 'react';
import isHotkey from 'is-hotkey';
import {
  Editable as SlateEditable,
  withReact,
  Slate,
  ReactEditor,
} from 'slate-react';
import { createEditor, Node, Range, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';

import { Leaf, Mark } from './nodes/leaf';
import { withShortcuts } from './plugins/shortcuts';
import { withChecklists } from './plugins/checklists';
import { withLinks } from './plugins/links';
import { Element, ElementType, BlockType, Block } from './nodes/element';
import {
  isInline,
  isBlock,
  toggleBlock,
  isMark,
  toggleMark,
  getBlockType,
  removeLink,
  insertLink,
} from './plugins/handlers';
import { LinkValue, Link } from './nodes/link';
import { css } from '../../utils/css';
import { usePrevious } from '../../hooks/use_previous';
import { withImages } from './plugins/images';
import { withVideos } from './plugins/videos';

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
  text: string | null;
  dragging: boolean;
}

export interface EditableState {
  marks: { [key in Mark]?: true } | null;
  type: BlockType | null;
  selection: Selection | null;
}

export interface EditableInstance {
  insertBlock: (block: Block) => void;
  toggleBlock: (format: BlockType) => void;
  toggleMark: (format: Mark) => void;
  removeLink: () => void;
  insertLink: (value: LinkValue) => void;
  focus: () => void;
}

interface EditableProps {
  initialValue?: Node[];
  onChange?: (state: EditableState) => void;
}

export const Editable = React.forwardRef<EditableInstance, EditableProps>(
  (props, ref) => {
    const { initialValue = [], onChange = () => {} } = props;
    const [value, setValue] = React.useState<Node[]>(initialValue);
    const editor = React.useMemo(
      () =>
        withImages(
          withVideos(
            withLinks(
              withChecklists(
                withShortcuts(withReact(withHistory(createEditor()))),
              ),
            ),
          ),
        ),
      [],
    );
    const prevSelection = usePrevious(editor.selection);
    const draggingRef = React.useRef(false);
    const previousStateRef = React.useRef<EditableState>({
      selection: null,
      type: 'paragraph',
      marks: {},
    });

    const renderElement = React.useCallback((p) => <Element {...p} />, []);
    const renderLeaf = React.useCallback((p) => <Leaf {...p} />, []);

    const restoreSelection = React.useCallback(() => {
      // When other items are pressed, we lose focus and selection.
      // We keep track of previous selection so that we can reuse it here and select
      if (!prevSelection) {
        return;
      }

      ReactEditor.focus(editor);
      Transforms.select(editor, prevSelection);
    }, [editor, prevSelection]);

    React.useImperativeHandle(
      ref,
      () => ({
        toggleBlock: (format) => {
          ReactEditor.focus(editor);
          toggleBlock(editor, format);
        },
        insertBlock: (block) => {
          restoreSelection();
          Transforms.insertNodes(editor, block);
        },
        toggleMark: (format) => {
          ReactEditor.focus(editor);
          toggleMark(editor, format);
        },
        removeLink: () => {
          ReactEditor.focus(editor);
          removeLink(editor);
        },
        insertLink: (val: LinkValue) => {
          restoreSelection();
          insertLink(editor, val);
        },
        focus: () => {
          ReactEditor.focus(editor);
        },
      }),
      [editor, restoreSelection],
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

    const handleMouseDown = React.useCallback(() => {
      draggingRef.current = true;
    }, [draggingRef]);

    const handleMouseUp = React.useCallback(() => {
      draggingRef.current = false;
      const prevState = previousStateRef.current;

      if (prevState.selection?.dragging) {
        onChange({
          marks: prevState.marks,
          selection: {
            ...prevState.selection,
            dragging: false,
          },
          type: prevState.type,
        });
      }
    }, [draggingRef, previousStateRef, onChange]);

    const handleChange = React.useCallback(
      (newValue: Node[]) => {
        setValue(newValue);
        const marks = Editor.marks(editor);
        const type = getBlockType(editor);
        let selection: Selection | null = null;
        let text: string | null = null;
        const dragging = draggingRef.current;

        if (editor.selection) {
          let rect = {
            width: 0,
            left: 0,
            top: 0,
            height: 0,
          };
          let link: LinkValue | null = null;

          // Non-collapsed range is selected
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

            text = Editor.string(editor, editor.selection);

            // Link is selected
          } else if (Range.isCollapsed(editor.selection)) {
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

              text = linkNode.display;
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
            text,
            dragging,
          };
        }

        const state: EditableState = { marks, selection, type };

        previousStateRef.current = state;

        onChange(state);
      },
      [editor, onChange, draggingRef, previousStateRef],
    );

    return (
      <Slate editor={editor} value={value} onChange={handleChange}>
        <SlateEditable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          style={styles('editable')}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
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
