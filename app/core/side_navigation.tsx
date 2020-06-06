import React from 'react';
import { ScrollView } from 'react-native';

import { Text, Container, Spacing, Icon, Row, Button } from '../components';
import { useTheme } from '../theme';

export function SideNavigation() {
  const theme = useTheme();
  return (
    <Container
      expanded
      width={320}
      borderRightWidth={1}
      borderColor={theme.border.color.default}
    >
      <NavigationMenu />
    </Container>
  );
}

export function NavigationMenu() {
  return (
    <ScrollView>
      <Container padding={16}>
        <HomeMenuItem />
      </Container>
    </ScrollView>
  );
}

interface MenuItemProps {}

function HomeMenuItem() {
  return (
    <Button>
      <Container height={40} paddingHorizontal={8}>
        <Row alignItems="center" expanded>
          <Icon name="home" size="lg" />
          <Spacing width={16} />
          <Text bold>Home</Text>
        </Row>
      </Container>
    </Button>
  );
}
