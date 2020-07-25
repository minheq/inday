import React from 'react';

import { Row, Icon, Button, Container, IconName } from '../../components';
import { useEditor } from './editor';
import { useLinkEdit } from './link_edit';
import { useInsert } from './insert';
import { Mark } from './editable/nodes/leaf';
import { TextColor } from '../../components/theme';
import { BlockType } from './editable/nodes/element';

export function MainToolbar() {
  return (
    <Row>
      <InsertButton />
      <MarkButton icon="bold" format="bold" />
      <MarkButton icon="italic" format="italic" />
      <MarkButton icon="strikethrough" format="strikethrough" />
      <MarkButton icon="code" format="code" />
      <LinkButton />
      <BlockButton format="block-quote" icon="quote" />
      <BlockButton format="code-block" icon="code" />
      <BlockButton format="numbered-list" icon="list" />
      <BlockButton format="bulleted-list" icon="list" />
    </Row>
  );
}

function InsertButton() {
  const { onOpen } = useInsert();
  const { selection } = useEditor();
  const disabled = selection === null;

  return (
    <ToolbarButton
      onPress={onOpen}
      state={disabled ? 'disabled' : 'default'}
      icon="plus"
    />
  );
}

function LinkButton() {
  const { selection } = useEditor();
  const { onEditLink } = useLinkEdit();
  const disabled = selection === null;

  const handlePress = React.useCallback(() => {
    if (selection) {
      if (selection.link) {
        onEditLink(selection.link);
      } else {
        onEditLink({ url: '', display: selection.text ?? '' });
      }
    }
  }, [onEditLink, selection]);

  return (
    <ToolbarButton
      state={disabled ? 'disabled' : 'default'}
      onPress={handlePress}
      icon="link"
    />
  );
}

interface MarkButtonProps {
  icon: IconName;
  format: Mark;
}

function MarkButton(props: MarkButtonProps) {
  const { icon, format } = props;
  const { toggleMark, marks } = useEditor();
  const active = !!(marks && !!marks[format]);

  const handlePress = React.useCallback(() => {
    toggleMark(format);
  }, [toggleMark, format]);

  return (
    <ToolbarButton
      state={active ? 'active' : 'default'}
      onPress={handlePress}
      icon={icon}
    />
  );
}

interface BlockButtonProps {
  icon: IconName;
  format: BlockType;
}

function BlockButton(props: BlockButtonProps) {
  const { icon, format } = props;
  const { toggleBlock, type } = useEditor();
  const active = type === format;

  const handlePress = React.useCallback(() => {
    toggleBlock(format);
  }, [toggleBlock, format]);

  return (
    <ToolbarButton
      state={active ? 'active' : 'default'}
      onPress={handlePress}
      icon={icon}
    />
  );
}

interface ToolbarButtonProps {
  onPress: () => void;
  state: 'default' | 'active' | 'disabled';
  icon: IconName;
}

function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress, icon, state } = props;

  let color: TextColor = 'default';
  if (state === 'active') {
    color = 'primary';
  } else if (state === 'disabled') {
    color = 'muted';
  }

  return (
    <Button onPress={onPress}>
      <Container width={40} height={40} center>
        <Icon color={color} name={icon} />
      </Container>
    </Button>
  );
}
