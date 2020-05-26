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
  display: string;
  url: string;
}

interface LinkEditContext {
  onOpenLinkEdit: (value?: LinkValue) => void;
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

  const handleOpenLinkEdit = React.useCallback(
    (value?: LinkValue) => {
      if (editor.selection) {
        setState({
          selection: editor.selection,
          isOpen: true,
          link: value ?? { display: '', url: '' },
        });
      }
    },
    [editor],
  );

  const handleCloseLinkEdit = React.useCallback(() => {
    setState(initialState);
  }, []);

  const handleSubmitLinkEdit = React.useCallback(
    (value: LinkValue) => {
      if (selection) {
        ReactEditor.focus(editor);
        Transforms.select(editor, selection);
        insertLink(editor, value);
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
        animationType="slide"
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

  const [display, setDisplay] = React.useState(initialValue.display);
  const [url, setURL] = React.useState(initialValue.url);

  const handleSubmit = React.useCallback(() => {
    onSubmit({ display: display || url, url });
  }, [display, url, onSubmit]);

  let focus: 'display' | 'url' = 'display';

  if (!url && !display) {
    focus = 'display';
  } else if (url && display) {
    focus = 'display';
  } else if (display && !url) {
    focus = 'url';
  }

  return (
    <Container>
      <Text>Display</Text>
      <TextInput
        autoFocus={focus === 'display'}
        value={display}
        onValueChange={setDisplay}
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
