import React from 'react';
import { ScrollView } from 'react-native';

import { Text, Container, Spacing, Icon, Row, Button } from '../components';

export function NavigationMenu() {
  return (
    <ScrollView>
      <Container padding={16}>
        <InboxMenuItem />
      </Container>
    </ScrollView>
  );
}

function InboxMenuItem() {
  return (
    <Button>
      <Container height={40} paddingHorizontal={8}>
        <Row alignItems="center" expanded>
          <Icon name="inbox" size="lg" />
          <Spacing width={16} />
          <Text bold>Inbox</Text>
        </Row>
      </Container>
    </Button>
  );
}
