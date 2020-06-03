import React from 'react';

import {
  NavigationProvider,
  useNavigation,
  Container,
  Pressable,
  Text,
  Spacing,
} from '../app/components';

export default {
  title: 'NavigationProvider',
  component: NavigationProvider,
};

export const Default = () => (
  <NavigationProvider>
    <ScreenOne />
  </NavigationProvider>
);

function ScreenOne() {
  const { navigate } = useNavigation();

  return (
    <Container expanded>
      <Text size="xl" bold>
        Screen one
      </Text>
      <Spacing height={8} />
      <Pressable onPress={() => navigate(<ScreenTwo />)}>
        <Text>Next</Text>
      </Pressable>
    </Container>
  );
}

function ScreenTwo() {
  const { navigate, back } = useNavigation();

  return (
    <Container expanded>
      <Text size="xl" bold>
        Screen two
      </Text>
      <Spacing height={8} />
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
  const { back } = useNavigation();

  return (
    <Container expanded>
      <Text size="xl" bold>
        Screen three
      </Text>
      <Spacing height={8} />
      <Pressable onPress={() => back()}>
        <Text>Previous</Text>
      </Pressable>
    </Container>
  );
}
