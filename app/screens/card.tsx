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
  Dialog,
} from '../components';
import { ScrollView } from 'react-native';
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
  const [open, toggle] = useToggle();
  const active = card.task !== null;

  const handleAddTask = React.useCallback(() => {
    updateTask(card.id, { completed: false });
    toggle.setTrue();
  }, [updateTask, card, toggle]);

  const handleToggleTask = React.useCallback(() => {
    if (!card.task) {
      return;
    }

    updateTask(card.id, { completed: !card.task.completed });
  }, [updateTask, card]);

  const handleRemoveTask = React.useCallback(() => {
    if (!card.task) {
      return;
    }

    updateTask(card.id, null);
  }, [updateTask, card]);

  return (
    <>
      <EditButton active={active} icon="check-circle" onPress={handleAddTask} />
      <Dialog
        animationType="slide"
        isOpen={open}
        onRequestClose={toggle.setFalse}
      >
        {card.task && (
          <Row>
            <Button onPress={handleToggleTask}>
              <Text>
                {card.task.completed ? 'Completed' : 'Mark as completed'}
              </Text>
            </Button>
            <Button onPress={handleRemoveTask}>
              <Text>Remove</Text>
            </Button>
          </Row>
        )}
      </Dialog>
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
