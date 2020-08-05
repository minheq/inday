import React from 'react';

import {
  Container,
  Text,
  Spacer,
  TextInput,
  Button,
  Dialog,
} from '../../components';
import { LinkValue } from './editable/nodes/link';
import { useEditor } from './editor';

interface LinkEditContext {
  onEditLink: (value: LinkValue) => void;
}

const LinkEditContext = React.createContext<LinkEditContext>({
  onEditLink: () => {},
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

  const handleEditLink = React.useCallback((value: LinkValue) => {
    setState({ open: true, value });
  }, []);

  const handleInsertLink = React.useCallback(
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
    <LinkEditContext.Provider value={{ onEditLink: handleEditLink }}>
      {children}
      <Dialog
        animationType="slide"
        visible={state.open}
        onRequestClose={handleClose}
        onDismiss={focus}
      >
        {state.value && (
          <LinkEdit initialValue={state.value} onSubmit={handleInsertLink} />
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
        onChange={setDisplay}
      />
      <Spacer size={16} />
      <Text>URL</Text>
      <TextInput autoFocus={focus === 'url'} value={url} onChange={setURL} />
      <Spacer size={24} />
      <Button onPress={handleSubmit}>
        <Text>Submit</Text>
      </Button>
    </Container>
  );
}
