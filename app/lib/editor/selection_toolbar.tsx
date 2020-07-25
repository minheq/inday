import React from 'react';

import { Icon, IconName, Row, Button, Container } from '../../components';
import { Mark } from './editable/nodes/leaf';
import { useEditor } from './editor';
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
  const active = !!(marks && !!marks[format]);

  const handlePress = React.useCallback(() => {
    toggleMark(format);
  }, [toggleMark, format]);

  return <ToolbarButton active={active} onPress={handlePress} icon={icon} />;
}

function LinkButton() {
  const { selection } = useEditor();
  const { onEditLink } = useLinkEdit();

  const handlePress = React.useCallback(() => {
    if (selection) {
      onEditLink({ url: '', display: selection.text ?? '' });
    }
  }, [onEditLink, selection]);

  return <ToolbarButton active={false} onPress={handlePress} icon="link" />;
}

interface ToolbarButtonProps {
  onPress: () => void;
  active: boolean;
  icon: IconName;
}

function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress, icon, active } = props;
  return (
    <Button onPress={onPress}>
      <Container width={32} height={32} center>
        <Icon color={active ? 'primary' : 'default'} name={icon} />
      </Container>
    </Button>
  );
}
