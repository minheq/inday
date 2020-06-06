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
import { toImage } from './editable/plugins/images';
import { toVideo } from './editable/plugins/videos';

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
  const { insertBlock } = useEditor();

  return (
    <Container>
      <ListItem
        onPress={async () => {
          onClose();
          await ImagePicker.openPicker({});
          // upload image and get URL
          const image = toImage('https://picsum.photos/200/300');
          insertBlock(image);
        }}
        title="Image"
      />
      <ListItem
        title="YouTube"
        onPress={() => navigate(<InsertYouTubeInput />)}
      />
      <ListItem
        title="Web Bookmark"
        onPress={() => navigate(<WebBookmarkInput />)}
      />
    </Container>
  );
}

function WebBookmarkInput() {
  const { back } = useNavigation();
  const { insertBlock } = useEditor();
  const { onClose } = useInsert();
  const [value, setValue] = React.useState('');

  const handleInsert = React.useCallback(() => {
    onClose();
    insertBlock({ type: 'web-bookmark', url: value, children: [{ text: '' }] });
  }, [insertBlock, onClose, value]);

  return (
    <Container>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <Text>Enter URL</Text>
      <TextInput value={value} onValueChange={setValue} />
      <Button onPress={handleInsert}>
        <Text>Insert</Text>
      </Button>
    </Container>
  );
}

function InsertYouTubeInput() {
  const { back } = useNavigation();
  const { insertBlock } = useEditor();
  const { onClose } = useInsert();
  const [value, setValue] = React.useState('');

  const handleInsert = React.useCallback(() => {
    onClose();
    const video = toVideo(value);
    insertBlock(video);
  }, [insertBlock, onClose, value]);

  return (
    <Container>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <Text>Enter YouTube video URL</Text>
      <TextInput value={value} onValueChange={setValue} />
      <Button onPress={handleInsert}>
        <Text>Insert</Text>
      </Button>
    </Container>
  );
}
