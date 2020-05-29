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
  focus: () => {},
};

export function Editor(props: EditorProps) {
  const { initialValue = [] } = props;
  const editable = React.useRef<EditableInstance>(initialInstance);
  const [state, setState] = React.useState<EditableState>(initialState);
  console.log(state);

  return (
    <EditorContext.Provider
      value={{
        state,
        toggleBlock: editable.current.toggleBlock,
        toggleMark: editable.current.toggleMark,
        focus: editable.current.focus,
      }}
    >
      <Toolbar />
      <Editable
        ref={editable}
        initialValue={initialValue}
        onChange={setState}
      />
    </EditorContext.Provider>
  );
}

interface EditorContext {
  state: EditableState;
  toggleBlock: (format: BlockType) => void;
  toggleMark: (format: Mark) => void;
  focus: () => void;
}

const EditorContext = React.createContext<EditorContext>({
  state: initialState,
  toggleBlock: () => {},
  toggleMark: () => {},
  focus: () => {},
});

export function useEditor() {
  return React.useContext(EditorContext);
}
