import React from 'react';

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
import { Mark } from './editable/nodes/leaf';
import { BlockType } from './editable/nodes/element';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useEditor } from './editor';

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
            isOpen && (
              <Container width={160} shadow color="content">
                <BlockOption format="paragraph" label="Paragraph" />
                <BlockOption format="heading-one" label="Heading one" />
                <BlockOption format="heading-two" label="Heading two" />
                <BlockOption format="heading-three" label="Heading three" />
                <BlockOption format="block-quote" label="Quote" />
                <BlockOption format="code-block" label="Code block" />
                <BlockOption format="numbered-list" label="Numbered list" />
                <BlockOption format="bulleted-list" label="Bulleted list" />
              </Container>
            )
          }
        />
        <BlockPickerButton onPress={toggle} />
        <MarkButton format="bold" icon="bold" />
        <MarkButton format="italic" icon="italic" />
        <MarkButton format="strikethrough" icon="strikethrough" />
        <MarkButton format="code" icon="code" />
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
  const { marks, toggleMark } = useEditor();
  const active = marks && !!marks[format];

  return (
    <Pressable
      style={styles.toolbarButton}
      onPress={() => {
        toggleMark(format);
      }}
    >
      <Icon color={active ? 'primary' : 'default'} name={icon} />
    </Pressable>
  );
}

interface BlockOptionProps {
  format: BlockType;
  label: string;
}

function BlockOption(props: BlockOptionProps) {
  const { format, label } = props;
  const { type, toggleBlock } = useEditor();
  const active = type === format;

  return (
    <Pressable
      style={styles.blockOption}
      onPress={() => {
        toggleBlock(format);
      }}
    >
      <Text color={active ? 'primary' : 'default'} size="sm">
        {label}
      </Text>
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
  const theme = useTheme();

  return (
    <Pressable
      style={[styles.addButton, { borderColor: theme.border.color.default }]}
      onPress={onPress}
    >
      <Icon name="plus" size="lg" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    borderRightWidth: 1,
  },
  blockPickerButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 32,
    paddingHorizontal: 8,
  },
});
