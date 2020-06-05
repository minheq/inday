import React from 'react';

import {
  Container,
  Text,
  Spacing,
  TextInput,
  Button,
  Dialog,
} from '../components';
import { LinkValue } from './editable/nodes/link';
import { useEditor } from './editor';

interface LinkEditContext {
  onEdit: (value: LinkValue) => void;
}

const LinkEditContext = React.createContext<LinkEditContext>({
  onEdit: () => {},
});

export function useLinkEdit() {
  return React.useContext(LinkEditContext);
}

interface LinkEditProviderProps {
  children?: React.ReactNode;
}

interface State {
  open: boolean;
  value: LinkValue | null;
}

const initialState: State = {
  open: false,
  value: null,
};

export function LinkEditProvider(props: LinkEditProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<State>(initialState);
  const { insertLink, focus } = useEditor();

  const handleEdit = React.useCallback((value: LinkValue) => {
    setState({ open: true, value });
  }, []);

  const handleInsert = React.useCallback(
    (newValue: LinkValue) => {
      setState(initialState);
      insertLink(newValue);
    },
    [insertLink],
  );

  const handleClose = React.useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <LinkEditContext.Provider value={{ onEdit: handleEdit }}>
      {children}
      <Dialog
        animationType="slide"
        isOpen={state.open}
        onRequestClose={handleClose}
        onDismiss={focus}
      >
        {state.value && (
          <LinkEdit initialValue={state.value} onSubmit={handleInsert} />
        )}
      </Dialog>
    </LinkEditContext.Provider>
  );
}

export const LinkEditConsumer = LinkEditContext.Consumer;

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
      <Button title="Submit" onPress={handleSubmit} />
    </Container>
  );
}
