import React from 'react';

import { Row, Icon, Button, Container, IconName } from '../components';
import { useEditor } from './editor';
import { useLinkEdit } from './link_edit';
import { useFormat } from './format';
import { useInsert } from './insert';

export function MainToolbar() {
  return (
    <Row>
      <InsertButton />
      <FormatButton />
      <LinkButton />
    </Row>
  );
}

function InsertButton() {
  const { onOpen } = useInsert();
  const { selection } = useEditor();
  const disabled = selection === null;

  return <ToolbarButton onPress={onOpen} disabled={disabled} icon="plus" />;
}

function FormatButton() {
  const { onOpen } = useFormat();
  const { selection } = useEditor();
  const disabled = selection === null;

  return <ToolbarButton onPress={onOpen} disabled={disabled} icon="layers" />;
}

function LinkButton() {
  const { selection } = useEditor();
  const { onEdit } = useLinkEdit();
  const disabled = selection === null;

  const handlePress = React.useCallback(() => {
    if (selection) {
      if (selection.link) {
        onEdit(selection.link);
      } else {
        onEdit({ url: '', display: selection.text ?? '' });
      }
    }
  }, [onEdit, selection]);

  return (
    <ToolbarButton onPress={handlePress} disabled={disabled} icon="link" />
  );
}

interface ToolbarButtonProps {
  onPress: () => void;
  disabled: boolean;
  icon: IconName;
}

function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress, icon, disabled } = props;
  return (
    <Button onPress={onPress}>
      <Container width={40} height={40} center>
        <Icon color={disabled ? 'muted' : 'default'} name={icon} />
      </Container>
    </Button>
  );
}
