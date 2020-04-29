import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

import {
  Text,
  Container,
  SearchInput,
  Spacing,
  Row,
  IconName,
  Interactive,
  Icon,
} from '../components';

export function NavigationMenu() {
  return (
    <ScrollView>
      <Container padding={16}>
        <SearchInput />
        <Spacing height={24} />

        <MenuItem icon="list" onPress={() => {}} title="Timeline" />
      </Container>
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: IconName;
  onPress: () => void;
  title: string;
}

function MenuItem(props: MenuItemProps) {
  const { icon, onPress, title } = props;

  return (
    <Interactive>
      {({ onFocus, onBlur }) => (
        <TouchableOpacity onFocus={onFocus} onBlur={onBlur} onPress={onPress}>
          <Container height={40} padding={8}>
            <Row expanded alignItems="center">
              <Icon name={icon} />
              <Spacing width={8} />
              <Text>{title}</Text>
            </Row>
          </Container>
        </TouchableOpacity>
      )}
    </Interactive>
  );
}
