import React from 'react';

import { Dialog, Container, ListItem, CloseButton, Row } from '../components';
import { useToggle } from '../hooks/use_toggle';
import { useEditor } from './editor';
import { ImagePicker } from '../modules/image_picker';

interface InsertContext {
  onOpen: () => void;
  onClose: () => void;
}

const InsertContext = React.createContext<InsertContext>({
  onOpen: () => {},
  onClose: () => {},
});

export function useInsert() {
  return React.useContext(InsertContext);
}

interface InsertProviderProps {
  children?: React.ReactNode;
}

export function InsertProvider(props: InsertProviderProps) {
  const { children } = props;
  const { focus } = useEditor();
  const [open, { setTrue, setFalse }] = useToggle();

  return (
    <InsertContext.Provider value={{ onOpen: setTrue, onClose: setFalse }}>
      {children}
      <Dialog
        animationType="slide"
        isOpen={open}
        onRequestClose={setFalse}
        onDismiss={focus}
      >
        <Container minWidth={320}>
          <Row>
            <CloseButton onPress={setFalse} />
          </Row>
          <ListItem
            onPress={async () => {
              const image = await ImagePicker.openPicker({});

              console.log(image);
            }}
            title="Image"
          />
          <ListItem title="YouTube" />
          <ListItem title="Twitter" />
        </Container>
      </Dialog>
    </InsertContext.Provider>
  );
}
