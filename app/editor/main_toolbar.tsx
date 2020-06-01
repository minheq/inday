import React from 'react';

import { Row, Icon } from '../components';
import { useEditor } from './editor';
import { useLinkEdit } from './link_edit';
import { ToolbarButton } from './toolbar';
import { useFormat } from './format';

export function MainToolbar() {
  return (
    <Row>
      <FormatButton />
      <LinkButton />
    </Row>
  );
}

function FormatButton() {
  const { onOpen } = useFormat();
  const { selection } = useEditor();
  const disabled = selection === null;

  return (
    <ToolbarButton disabled={disabled} onPress={onOpen}>
      <Icon color={disabled ? 'muted' : 'default'} name="layers" />
    </ToolbarButton>
  );
}

function LinkButton() {
  const { selection } = useEditor();
  const { onEdit } = useLinkEdit();
  const disabled = selection === null;

  const handlePress = React.useCallback(() => {
    if (selection) {
      onEdit({ url: '', display: selection.text ?? '' });
    }
  }, [onEdit, selection]);

  return (
    <ToolbarButton onPress={handlePress}>
      <Icon color={disabled ? 'muted' : 'default'} name="link" />
    </ToolbarButton>
  );
}
