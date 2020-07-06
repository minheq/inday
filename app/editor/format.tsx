import React from 'react';

import { Pressable, Text, Dialog, Container } from '../components';
import { useToggle } from '../hooks/use_toggle';
import { BlockType } from './editable/nodes/element';
import { useEditor } from './editor';
import { StyleSheet } from 'react-native';

interface FormatContext {
  onOpen: () => void;
  onClose: () => void;
}

const FormatContext = React.createContext<FormatContext>({
  onOpen: () => {},
  onClose: () => {},
});

export function useFormat() {
  return React.useContext(FormatContext);
}

interface FormatProviderProps {
  children?: React.ReactNode;
}

export function FormatProvider(props: FormatProviderProps) {
  const { children } = props;
  const { focus } = useEditor();
  const [visible, { setTrue, setFalse }] = useToggle();

  return (
    <FormatContext.Provider value={{ onOpen: setTrue, onClose: setFalse }}>
      {children}
      <Dialog
        animationType="slide"
        visible={visible}
        onRequestClose={setFalse}
        onDismiss={focus}
      >
        <Container padding={16}>
          <BlockOption format="paragraph" label="Paragraph" />
          <BlockOption format="heading-one" label="Heading one" />
          <BlockOption format="heading-two" label="Heading two" />
          <BlockOption format="heading-three" label="Heading three" />
          <BlockOption format="block-quote" label="Quote" />
          <BlockOption format="code-block" label="Code block" />
          <BlockOption format="numbered-list" label="Numbered list" />
          <BlockOption format="bulleted-list" label="Bulleted list" />
        </Container>
      </Dialog>
    </FormatContext.Provider>
  );
}

interface BlockOptionProps {
  format: BlockType;
  label: string;
}

function BlockOption(props: BlockOptionProps) {
  const { format, label } = props;
  const { type, toggleBlock } = useEditor();
  const { onClose } = useFormat();
  const active = type === format;

  return (
    <Pressable
      style={styles.option}
      onPress={() => {
        toggleBlock(format);
        onClose();
      }}
    >
      <Text color={active ? 'primary' : 'default'}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    height: 40,
    borderBottomWidth: 1,
  },
});
