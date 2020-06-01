import React from 'react';

import { Icon, IconName, Row } from '../components';
import { Mark } from './editable/nodes/leaf';
import { useEditor } from './editor';
import { ToolbarButton } from './toolbar';
import { useLinkEdit } from './link_edit';

export function SelectionToolbar() {
  return (
    <Row>
      <MarkButton icon="bold" format="bold" />
      <MarkButton icon="italic" format="italic" />
      <MarkButton icon="strikethrough" format="strikethrough" />
      <MarkButton icon="code" format="code" />
      <LinkButton />
    </Row>
  );
}

interface MarkButtonProps {
  icon: IconName;
  format: Mark;
}

function MarkButton(props: MarkButtonProps) {
  const { icon, format } = props;
  const { toggleMark, marks } = useEditor();
  const active = marks && !!marks[format];

  const handlePress = React.useCallback(() => {
    toggleMark(format);
  }, [toggleMark, format]);

  return (
    <ToolbarButton onPress={handlePress}>
      <Icon color={active ? 'primary' : 'default'} name={icon} />
    </ToolbarButton>
  );
}

function LinkButton() {
  const { selection } = useEditor();
  const { onEdit } = useLinkEdit();

  const handlePress = React.useCallback(() => {
    if (selection) {
      onEdit({ url: '', display: selection.text ?? '' });
    }
  }, [onEdit, selection]);

  return (
    <ToolbarButton onPress={handlePress}>
      <Icon name="link" />
    </ToolbarButton>
  );
}
