import React from 'react';

import {
  Dialog,
  Container,
  ListItem,
  Row,
  useNavigation,
  TextInput,
  NavigationProvider,
  Text,
  BackButton,
  Button,
} from '../components';
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
        {open && (
          <Container width={320} height={400}>
            <NavigationProvider>
              <InsertContent />
            </NavigationProvider>
          </Container>
        )}
      </Dialog>
    </InsertContext.Provider>
  );
}

function InsertContent() {
  const { onClose } = useInsert();
  const { navigate } = useNavigation();
  const { insertImage } = useEditor();

  return (
    <Container>
      <ListItem
        onPress={async () => {
          onClose();
          insertImage('https://picsum.photos/200/300');
          // const image = await ImagePicker.openPicker({});
        }}
        title="Image"
      />
      <ListItem
        title="YouTube"
        onPress={() => navigate(<InsertYouTubeInput />)}
      />
      <ListItem title="Twitter" />
    </Container>
  );
}

function InsertYouTubeInput() {
  const { back } = useNavigation();
  const { insertVideo } = useEditor();
  const { onClose } = useInsert();
  const [value, setValue] = React.useState('');

  const handleInsert = React.useCallback(() => {
    onClose();
    insertVideo(value);
  }, [insertVideo, onClose, value]);

  return (
    <Container>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <Text>Enter YouTube video URL</Text>
      <TextInput value={value} onValueChange={setValue} />
      <Button title="Insert" onPress={handleInsert} />
    </Container>
  );
}
