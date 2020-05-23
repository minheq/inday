import React from 'react';
import { useSlate } from 'slate-react';

import {
  Container,
  Row,
  Popover,
  Pressable,
  Text,
  Spacing,
  Icon,
  IconName,
} from '../components';
import { useToggle } from '../hooks/use_toggle';
import { Mark } from './nodes/leaf';
import { isMarkActive, toggleMark } from './use_mark_handlers';
import { toggleBlock, getActiveBlock } from './use_block_handlers';
import { BlockType } from './element';

export function Toolbar() {
  const editor = useSlate();
  const [isOpen, { toggle }] = useToggle();
  const activeBlock = getActiveBlock(editor);

  return (
    <Container>
      <Row>
        <Popover
          isOpen={isOpen}
          position="left"
          content={
            <Container width={160} shadow color="content">
              <BlockButton format="heading-one" icon="activity" />
              <BlockButton format="heading-two" icon="activity" />
              <BlockButton format="heading-three" icon="activity" />
              <BlockButton format="block-quote" icon="quote" />
              <BlockButton format="code-block" icon="code" />
              <BlockButton format="numbered-list" icon="list" />
              <BlockButton format="bulleted-list" icon="list" />
            </Container>
          }
        >
          <Pressable onPress={toggle}>
            <Text>{activeBlock}</Text>
            <Spacing width={8} />
            <Icon name="chevron-down" />
          </Pressable>
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
  icon: IconName;
}

function BlockButton(props: BlockButtonProps) {
  const { format, icon } = props;
  const editor = useSlate();

  return (
    <Pressable
      onPress={() => {
        toggleBlock(editor, format);
      }}
    >
      <Icon name={icon} />
    </Pressable>
  );
}
