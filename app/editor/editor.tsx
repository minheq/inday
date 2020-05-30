import React from 'react';
import { Node } from 'slate';
import { Editable, EditableState, EditableInstance } from './editable/editable';
import { Toolbar } from './toolbar';
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

  return (
    <EditorContext.Provider
      value={{
        state,
        toggleBlock: editableRef.current.toggleBlock,
        toggleMark: editableRef.current.toggleMark,
      }}
    >
      <Toolbar />
      <Editable
        ref={editableRef}
        initialValue={initialValue}
        onChange={setState}
        onSelectLink={console.log}
      />
    </EditorContext.Provider>
  );
}

interface EditorContext {
  state: EditableState;
  toggleBlock: (format: BlockType) => void;
  toggleMark: (format: Mark) => void;
}

const EditorContext = React.createContext<EditorContext>({
  state: initialState,
  toggleBlock: () => {},
  toggleMark: () => {},
});

export function useEditor() {
  return React.useContext(EditorContext);
}
