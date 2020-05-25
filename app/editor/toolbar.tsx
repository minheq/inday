import React from 'react';
import { useSlate } from 'slate-react';

import {
  Container,
  Row,
  Popover,
  Pressable,
  Text,
  Icon,
  IconName,
  Spacing,
} from '../components';
import { useToggle } from '../hooks/use_toggle';
import { Mark } from './nodes/leaf';
import { isMarkActive, toggleMark } from './use_mark_handlers';
import { toggleBlock } from './use_block_handlers';
import { BlockType } from './element';
import { StyleSheet } from 'react-native';

export function Toolbar() {
  const [isOpen, { toggle }] = useToggle();

  return (
    <Container borderBottomWidth={1}>
      <Row>
        <AddButton onPress={() => {}} />
        <Popover
          isOpen={isOpen}
          position="left"
          content={
            <Container width={160} shadow color="content">
              <BlockButton format="paragraph" label="Paragraph" />
              <BlockButton format="heading-one" label="Heading one" />
              <BlockButton format="heading-two" label="Heading two" />
              <BlockButton format="heading-three" label="Heading three" />
              <BlockButton format="block-quote" label="Quote" />
              <BlockButton format="code-block" label="Code block" />
              <BlockButton format="numbered-list" label="Numbered list" />
              <BlockButton format="bulleted-list" label="Bulleted list" />
            </Container>
          }
        >
          <BlockPickerButton onPress={toggle} />
        </Popover>
        <MarkButton format="bold" icon="bold" />
        <MarkButton format="italic" icon="italic" />
        <MarkButton format="strikethrough" icon="strikethrough" />
        <MarkButton format="code" icon="code" />
        {/* <MarkButton format="link" icon="link" /> */}
      </Row>
    </Container>
  );
}

interface MarkButtonProps {
  format: Mark;
  icon: IconName;
}

function MarkButton(props: MarkButtonProps) {
  const { format, icon } = props;
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <Pressable
      style={styles.toolbarButton}
      onPress={() => {
        toggleMark(editor, format);
      }}
    >
      <Icon color={active ? 'default' : 'muted'} name={icon} />
    </Pressable>
  );
}

interface BlockButtonProps {
  format: BlockType;
  label: string;
}

function BlockButton(props: BlockButtonProps) {
  const { format, label } = props;
  const editor = useSlate();

  return (
    <Pressable
      style={styles.blockOption}
      onPress={() => {
        toggleBlock(editor, format);
      }}
    >
      <Text size="sm">{label}</Text>
    </Pressable>
  );
}

interface BlockPickerButtonProps {
  onPress: () => void;
}

function BlockPickerButton(props: BlockPickerButtonProps) {
  const { onPress } = props;

  return (
    <Pressable style={styles.blockPickerButton} onPress={onPress}>
      <Text size="sm">Type</Text>
      <Spacing width={4} />
      <Icon name="chevron-down" />
    </Pressable>
  );
}

interface AddButtonProps {
  onPress: () => void;
}

function AddButton(props: AddButtonProps) {
  const { onPress } = props;

  return (
    <Pressable style={styles.addButton} onPress={onPress}>
      <Icon name="plus" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbarButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockOption: {
    padding: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockPickerButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 32,
    paddingHorizontal: 8,
  },
});
