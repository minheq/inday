import React from 'react';
import {
  Container,
  Text,
  Spacing,
  TextInput,
  Button,
  Dialog,
} from '../components';
import { Range, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { insertLink } from './plugins/links';

export interface LinkValue {
  text: string;
  url: string;
}

interface LinkEditContext {
  onOpenLinkEdit: () => void;
  onCloseLinkEdit: () => void;
  onSubmitLinkEdit: (value: LinkValue) => void;
}

const LinkEditContext = React.createContext<LinkEditContext>({
  onOpenLinkEdit: () => {},
  onCloseLinkEdit: () => {},
  onSubmitLinkEdit: () => {},
});

export function useLinkEdit() {
  return React.useContext(LinkEditContext);
}

interface LinkEditProviderProps {
  children?: React.ReactNode;
}

interface State {
  link: LinkValue | null;
  selection: Range | null;
  isOpen: boolean;
}
const initialState: State = {
  link: null,
  selection: null,
  isOpen: false,
};

export function LinkEditProvider(props: LinkEditProviderProps) {
  const { children } = props;
  const editor = useSlate();
  const [state, setState] = React.useState<State>(initialState);
  const { isOpen, selection, link } = state;

  const handleOpenLinkEdit = React.useCallback(() => {
    console.log(editor.selection);

    if (editor.selection) {
      setState({
        selection: editor.selection,
        isOpen: true,
        link: { text: '', url: '' },
      });
    }
  }, [editor]);

  const handleCloseLinkEdit = React.useCallback(() => {
    setState(initialState);
  }, []);

  const handleSubmitLinkEdit = React.useCallback(
    (value: LinkValue) => {
      if (selection) {
        ReactEditor.focus(editor);
        Transforms.select(editor, selection);
        insertLink(editor, value.url);
      }

      setState(initialState);
    },
    [editor, selection],
  );

  // We need to focus after everything finished re-rendering
  // so that the focus can be correctly preserved
  const handleDismiss = React.useCallback(() => {
    ReactEditor.focus(editor);
  }, [editor]);

  return (
    <LinkEditContext.Provider
      value={{
        onOpenLinkEdit: handleOpenLinkEdit,
        onCloseLinkEdit: handleCloseLinkEdit,
        onSubmitLinkEdit: handleSubmitLinkEdit,
      }}
    >
      {children}
      <Dialog
        // animationType="slide"
        isOpen={isOpen}
        onRequestClose={handleCloseLinkEdit}
        onDismiss={handleDismiss}
      >
        {link && (
          <LinkEdit initialValue={link} onSubmit={handleSubmitLinkEdit} />
        )}
      </Dialog>
    </LinkEditContext.Provider>
  );
}

interface LinkEditProps {
  initialValue: LinkValue;
  onSubmit: (link: LinkValue) => void;
}

export function LinkEdit(props: LinkEditProps) {
  const { onSubmit, initialValue } = props;

  const [text, setText] = React.useState(initialValue.text);
  const [url, setURL] = React.useState(initialValue.url);

  const handleSubmit = React.useCallback(() => {
    onSubmit({ text: text || url, url });
  }, [text, url, onSubmit]);

  let focus: 'text' | 'url' = 'text';

  if (!url && !text) {
    focus = 'text';
  } else if (url && text) {
    focus = 'text';
  } else if (text && !url) {
    focus = 'url';
  }

  return (
    <Container>
      <Text>Text</Text>
      <TextInput
        autoFocus={focus === 'text'}
        value={text}
        onValueChange={setText}
      />
      <Spacing height={16} />
      <Text>URL</Text>
      <TextInput
        autoFocus={focus === 'url'}
        value={url}
        onValueChange={setURL}
      />
      <Spacing height={24} />
      <Button onPress={handleSubmit}>
        <Text>Submit</Text>
      </Button>
    </Container>
  );
}
