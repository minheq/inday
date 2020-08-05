import React from 'react';

import {
  TransitionProvider,
  useTransition,
  Container,
  Pressable,
  Text,
  Spacer,
} from '../app/components';

export default {
  title: 'TransitionProvider',
  component: TransitionProvider,
};

export const Default = () => (
  <TransitionProvider>
    <ScreenOne />
  </TransitionProvider>
);

function ScreenOne() {
  const { navigate } = useTransition();

  return (
    <Container expanded>
      <Text size="xl" bold>
        Screen one
      </Text>
      <Spacer size={8} />
      <Pressable onPress={() => navigate(<ScreenTwo />)}>
        <Text>Next</Text>
      </Pressable>
    </Container>
  );
}

function ScreenTwo() {
  const { navigate, back } = useTransition();

  return (
    <Container expanded>
      <Text size="xl" bold>
        Screen two
      </Text>
      <Spacer size={8} />
      <Pressable onPress={() => back()}>
        <Text>Previous</Text>
      </Pressable>
      <Pressable onPress={() => navigate(<ScreenThree />)}>
        <Text>Next</Text>
      </Pressable>
    </Container>
  );
}

function ScreenThree() {
  const { back } = useTransition();

  return (
    <Container expanded>
      <Text size="xl" bold>
        Screen three
      </Text>
      <Spacer size={8} />
      <Pressable onPress={() => back()}>
        <Text>Previous</Text>
      </Pressable>
    </Container>
  );
}
