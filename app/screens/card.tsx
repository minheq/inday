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
} from '../components';
import { ScrollView } from 'react-native';
import { Card, useCardStore } from '../data/card';
import { Editor } from '../editor';
import { AppBar } from '../core/app_bar';

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
  const { updateTask } = useCardStore();
  const { task } = card;

  const handleToggle = React.useCallback(() => {
    if (!task) {
      return;
    }

    updateTask(card.id, { completed: !task.completed });
  }, [updateTask, card, task]);

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
  const active = card.task !== null;

  const handleToggleTask = React.useCallback(() => {
    if (!card.task) {
      updateTask(card.id, { completed: false });
      return;
    }

    updateTask(card.id, null);
  }, [updateTask, card]);

  return (
    <EditButton
      active={active}
      icon="check-circle"
      onPress={handleToggleTask}
    />
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
