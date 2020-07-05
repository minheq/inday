import React from 'react';
import { Editable, EditableState, EditableInstance } from './editable/editable';
import { MainToolbar } from './main_toolbar';
import { BlockType, Block, Element } from './editable/nodes/element';
import { Mark } from './editable/nodes/leaf';
import { View } from 'react-native';
import { LinkValue } from './editable/nodes/link';
import { LinkEditProvider } from './link_edit';
import { InsertProvider } from './insert';
import {
  measure,
  Measurements,
  initialMeasurements,
} from '../utils/measurements';

// TODO
// - Insert
//  - Image
//  - YouTube
//  - Twitter
// - Hotkeys
// - Type commands
// - Beautify

interface EditorProps {
  initialValue?: Element[];
  onChange?: (value: Element[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const initialState: EditableState = {
  value: [],
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

export interface EditorInstance {
  focus: () => void;
}

export const Editor = React.forwardRef<EditorInstance, EditorProps>(
  (props, ref) => {
    const { initialValue = [], onChange = () => {}, onBlur, onFocus } = props;
    const editorRef = React.useRef<View>(null);
    const editableRef = React.useRef<EditableInstance>(initialInstance);
    const [state, setState] = React.useState<EditableState>({
      ...initialState,
      value: initialValue,
    });
    const [measurements, setMeasurements] = React.useState<Measurements>(
      initialMeasurements,
    );

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        editableRef.current.focus();
      },
    }));

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
      (link: LinkValue) => {
        editableRef.current.insertLink(link);
      },
      [editableRef],
    );

    const handleChange = React.useCallback(
      (newState: EditableState) => {
        setState(newState);
        onChange(newState.value);
      },
      [onChange],
    );

    const handleFocus = React.useCallback(() => {
      editableRef.current.focus();
    }, []);

    const handleInsertBlock = React.useCallback((block: Block) => {
      editableRef.current.insertBlock(block);
    }, []);

    const handleLayout = React.useCallback(async () => {
      const m = await measure(editorRef);
      setMeasurements(m);
    }, []);

    return (
      <View ref={editorRef} onLayout={handleLayout}>
        <EditorContext.Provider
          value={{
            value: state.value,
            selection: state.selection,
            marks: state.marks,
            type: state.type,
            measurements,
            toggleBlock: handleToggleBlock,
            toggleMark: handleToggleMark,
            removeLink: handleRemoveLink,
            insertLink: handleInsertLink,
            insertBlock: handleInsertBlock,
            focus: handleFocus,
          }}
        >
          <LinkEditProvider>
            <InsertProvider>
              <MainToolbar />
              <Editable
                ref={editableRef}
                value={state.value}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={onFocus}
              />
            </InsertProvider>
          </LinkEditProvider>
        </EditorContext.Provider>
      </View>
    );
  },
);

interface EditorContext extends EditableState, EditableInstance {
  measurements: Measurements;
}

const EditorContext = React.createContext<EditorContext>({
  value: [],
  selection: null,
  type: 'paragraph',
  marks: {},
  measurements: initialMeasurements,
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
