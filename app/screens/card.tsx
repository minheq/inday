import React from 'react';
import {
  Screen,
  Content,
  Row,
  IconName,
  Button,
  Container,
  Icon,
  Pressable,
  Text,
  Spacing,
  Dialog,
} from '../components';
import { ScrollView } from 'react-native';
import { Card } from '../data/card';
import { Editor } from '../editor';
import { AppBar } from '../core/app_bar';
import { useToggle } from '../hooks/use_toggle';
import { Reminder } from '../core/reminder';

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
          <AddOn card={card} />
          <Spacing height={16} />
          <Editor initialValue={card.content} />
        </Content>
      </ScrollView>
    </Screen>
  );
}

interface AddOnProps {
  card: Card;
}

function AddOn(props: AddOnProps) {
  const { card } = props;

  return (
    <Row>
      <TaskCheckbox card={card} />
    </Row>
  );
}

interface TaskCheckboxProps {
  card: Card;
}

function TaskCheckbox(props: TaskCheckboxProps) {
  const { card } = props;
  const { updateCardTask } = useCardStore();
  const { task } = card;

  const handleToggle = React.useCallback(() => {
    if (!task) {
      return;
    }

    updateCardTask(card.id, { completed: !task.completed });
  }, [updateCardTask, card, task]);

  if (task === null) {
    return null;
  }

  const { completed } = task;

  return (
    <Pressable onPress={handleToggle}>
      {completed ? (
        <Container
          padding={4}
          paddingRight={8}
          borderWidth={1}
          shape="pill"
          color="primary"
        >
          <Row alignItems="center">
            <Icon name="check" color="white" />
            <Spacing width={4} />
            <Text color="white" size="xs">
              Completed
            </Text>
          </Row>
        </Container>
      ) : (
        <Container padding={4} paddingRight={8} borderWidth={1} shape="pill">
          <Row alignItems="center">
            <Icon name="check" color="primary" />
            <Spacing width={4} />
            <Text size="xs">Mark as Completed</Text>
          </Row>
        </Container>
      )}
    </Pressable>
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
      <ReminderButton card={card} />
      {/* <EditButton icon="tag" onPress={() => {}} />
      <EditButton icon="more-horizontal" onPress={() => {}} /> */}
    </Row>
  );
}

interface TaskButtonProps {
  card: Card;
}

function TaskButton(props: TaskButtonProps) {
  const { card } = props;
  const { updateCardTask } = useCardStore();
  const active = card.task !== null;

  const handleToggleTask = React.useCallback(() => {
    if (!card.task) {
      updateCardTask(card.id, { completed: false });
      return;
    }

    updateCardTask(card.id, null);
  }, [updateCardTask, card]);

  return (
    <EditButton
      active={active}
      icon="check-circle"
      onPress={handleToggleTask}
    />
  );
}

interface ReminderButtonProps {
  card: Card;
}

function ReminderButton(props: ReminderButtonProps) {
  const { card } = props;
  const [open, dialog] = useToggle();
  const active = card.reminder !== null;

  return (
    <>
      <EditButton active={active} icon="clock" onPress={dialog.setTrue} />
      <Dialog
        animationType="slide"
        isOpen={open}
        onRequestClose={dialog.setFalse}
      >
        <Container width={320} height={480}>
          <Reminder />
        </Container>
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
