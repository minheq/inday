import React from 'react';
import { Node } from 'slate';
import { Editable, EditableState, EditableInstance } from './editable/editable';
import { MainToolbar } from './main_toolbar';
import { BlockType } from './editable/nodes/element';
import { Mark } from './editable/nodes/leaf';

interface EditorProps {
  initialValue?: Node[];
}

const initialState: EditableState = {
  selection: null,
  type: 'paragraph',
  marks: {},
};

const initialInstance: EditableInstance = {
  toggleBlock: () => {},
  toggleMark: () => {},
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

  const handleChange = React.useCallback((value: EditableState) => {
    console.log(value);

    setState(value);
  }, []);

  console.log(state);

  return (
    <EditorContext.Provider
      value={{
        selection: state.selection,
        marks: state.marks,
        type: state.type,
        toggleBlock: handleToggleBlock,
        toggleMark: handleToggleMark,
      }}
    >
      <MainToolbar />
      <Editable
        ref={editableRef}
        initialValue={initialValue}
        onChange={handleChange}
      />
    </EditorContext.Provider>
  );
}

interface EditorContext extends EditableState, EditableInstance {}

const EditorContext = React.createContext<EditorContext>({
  selection: null,
  type: 'paragraph',
  marks: {},
  toggleBlock: () => {},
  toggleMark: () => {},
});

export function useEditor() {
  return React.useContext(EditorContext);
}
