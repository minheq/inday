import React from 'react';
import {
  Screen,
  Content,
  Row,
  IconName,
  Button,
  Container,
  Icon,
  Text,
  Popover,
} from '../components';
import { ScrollView, View } from 'react-native';
import { Card, useCardStore } from '../data/card';
import { Editor } from '../editor';
import { AppBar } from '../core/app_bar';
import { useToggle } from '../hooks/use_toggle';

interface CardScreenProps {
  card: Card;
}

export function CardScreen(props: CardScreenProps) {
  const { card } = props;

  return (
    <Screen>
      <AppBar actions={<EditActions card={card} />} />
      <ScrollView>
        <Content>
          <Editor initialValue={card.content} />
        </Content>
      </ScrollView>
    </Screen>
  );
}

interface EditActionsProps {
  card: Card;
}

function EditActions(props: EditActionsProps) {
  const { card } = props;
  return (
    <Row expanded>
      <TaskButton card={card} />
      <EditButton icon="clock" onPress={() => {}} />
      <EditButton icon="tag" onPress={() => {}} />
      <EditButton icon="more-horizontal" onPress={() => {}} />
    </Row>
  );
}

interface TaskButtonProps {
  card: Card;
}

function TaskButton(props: TaskButtonProps) {
  const { card } = props;
  const { updateTask } = useCardStore();
  const [open, popover] = useToggle();
  const active = card.task !== null;

  const handleToggleTask = React.useCallback(() => {
    if (!card.task) {
      updateTask(card.id, { completed: false });
      return;
    }

    updateTask(card.id, { completed: !card.task.completed });
  }, [updateTask, card]);

  const handleRemoveTask = React.useCallback(() => {
    if (!card.task) {
      return;
    }

    updateTask(card.id, null);
    popover.setFalse();
  }, [updateTask, card, popover]);

  return (
    <>
      <Popover
        position="bottom-right"
        open={open}
        content={
          <PopoverContainer>
            <Row>
              {card.task ? (
                <Button onPress={handleToggleTask}>
                  <Text>
                    {card.task.completed ? 'Completed' : 'Mark as completed'}
                  </Text>
                </Button>
              ) : (
                <Button onPress={handleToggleTask}>
                  <Text>Turn card into task</Text>
                </Button>
              )}
              <Button onPress={handleRemoveTask}>
                <Text>Remove</Text>
              </Button>
            </Row>
          </PopoverContainer>
        }
      >
        {({ ref }) => (
          <View ref={ref}>
            <EditButton
              active={active}
              icon="check-circle"
              onPress={popover.toggle}
            />
          </View>
        )}
      </Popover>
    </>
  );
}

interface EditButtonProps {
  onPress: () => void;
  icon: IconName;
  active: boolean;
}

function EditButton(props: EditButtonProps) {
  const { onPress, icon, active } = props;
  return (
    <Button onPress={onPress}>
      <Container width={40} height={40} center>
        <Icon size="lg" color={active ? 'primary' : 'default'} name={icon} />
      </Container>
    </Button>
  );
}

interface PopoverContainerProps {
  children?: React.ReactNode;
}

function PopoverContainer(props: PopoverContainerProps) {
  const { children } = props;

  return (
    <Container shape="rounded" borderWidth={1} shadow padding={16}>
      {children}
    </Container>
  );
}
