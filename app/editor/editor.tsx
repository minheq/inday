import React from 'react';
import { Node } from 'slate';
import { Editable, EditableState, EditableInstance } from './editable/editable';
import { MainToolbar } from './main_toolbar';
import { BlockType, Block } from './editable/nodes/element';
import { Mark } from './editable/nodes/leaf';
import { Hoverable } from './hoverable';
import { View } from 'react-native';
import { LinkValue } from './editable/nodes/link';
import { LinkEditProvider, LinkEditConsumer } from './link_edit';
import { FormatProvider } from './format';
import { InsertProvider } from './insert';

// TODO
// - Insert
//  - Image
//  - YouTube
//  - Twitter
// - Hotkeys
// - Type commands
// - Beautify

interface EditorProps {
  initialValue?: Node[];
}

const initialState: EditableState = {
  selection: null,
  type: 'paragraph',
  marks: {},
};

const initialInstance: EditableInstance = {
  insertBlock: () => {},
  toggleBlock: () => {},
  toggleMark: () => {},
  removeLink: () => {},
  insertLink: () => {},
  focus: () => {},
};

export function Editor(props: EditorProps) {
  const { initialValue = [] } = props;
  const editableRef = React.useRef<EditableInstance>(initialInstance);
  const [state, setState] = React.useState<EditableState>(initialState);

  const handleToggleBlock = React.useCallback(
    (format: BlockType) => {
      editableRef.current.toggleBlock(format);
    },
    [editableRef],
  );

  const handleToggleMark = React.useCallback(
    (format: Mark) => {
      editableRef.current.toggleMark(format);
    },
    [editableRef],
  );

  const handleRemoveLink = React.useCallback(() => {
    editableRef.current.removeLink();
  }, [editableRef]);

  const handleInsertLink = React.useCallback(
    (value: LinkValue) => {
      editableRef.current.insertLink(value);
    },
    [editableRef],
  );

  const handleChange = React.useCallback((value: EditableState) => {
    setState(value);
  }, []);

  const handleFocus = React.useCallback(() => {
    editableRef.current.focus();
  }, []);

  const handleInsertBlock = React.useCallback((block: Block) => {
    editableRef.current.insertBlock(block);
  }, []);

  return (
    <View>
      <EditorContext.Provider
        value={{
          selection: state.selection,
          marks: state.marks,
          type: state.type,
          toggleBlock: handleToggleBlock,
          toggleMark: handleToggleMark,
          removeLink: handleRemoveLink,
          insertLink: handleInsertLink,
          insertBlock: handleInsertBlock,
          focus: handleFocus,
        }}
      >
        <FormatProvider>
          <LinkEditProvider>
            <InsertProvider>
              <MainToolbar />
              <LinkEditConsumer>
                {({ onEdit }) => (
                  <Editable
                    ref={editableRef}
                    initialValue={initialValue}
                    onChange={handleChange}
                    onEditLink={onEdit}
                  />
                )}
              </LinkEditConsumer>
              <Hoverable />
            </InsertProvider>
          </LinkEditProvider>
        </FormatProvider>
      </EditorContext.Provider>
    </View>
  );
}

interface EditorContext extends EditableState, EditableInstance {}

const EditorContext = React.createContext<EditorContext>({
  selection: null,
  type: 'paragraph',
  marks: {},
  toggleBlock: () => {},
  toggleMark: () => {},
  removeLink: () => {},
  insertBlock: () => {},
  insertLink: () => {},
  focus: () => {},
});

export function useEditor() {
  return React.useContext(EditorContext);
}
