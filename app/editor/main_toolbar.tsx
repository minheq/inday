import React from 'react';

import { Row, IconName, Icon } from '../components';
import { useEditor } from './editor';
import { useLinkEdit } from './link_edit';
import { ToolbarButton } from './toolbar';

export function MainToolbar() {
  return (
    <Row>
      <Button icon="plus" label="Insert" />
      <Button icon="layers" label="Format" />
      <LinkButton />
      <Button icon="flag" label="Tag" />
      <Button icon="user" label="Mention" />
    </Row>
  );
}

interface ButtonProps {
  icon: IconName;
  label: string;
}

function Button(props: ButtonProps) {
  const { icon } = props;
  const { selection } = useEditor();
  const disabled = selection === null;

  return (
    <ToolbarButton disabled={disabled}>
      <Icon color={disabled ? 'muted' : 'default'} name={icon} />
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
