import React from 'react';
import { ScrollView } from 'react-native';

import {
  Text,
  Container,
  Spacing,
  Icon,
  Row,
  Button,
  IconName,
  Dialog,
} from '../components';
import { Location, useNavigation } from '../data/navigation';
import { useToggle } from '../hooks/use_toggle';

export function Menu() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
      <Container flex={1} padding={16}>
        <FixedMenuItem icon="inbox" title="Inbox" location={Location.Inbox} />
        <FixedMenuItem
          icon="calendar"
          title="Daily"
          location={Location.Daily}
        />
        <FixedMenuItem icon="navigation" title="All" location={Location.All} />
      </Container>
      <NewListButton />
    </ScrollView>
  );
}

function NewListButton() {
  const [visible, { toggle, setFalse }] = useToggle();

  return (
    <>
      <Dialog animationType="slide" visible={visible} onRequestClose={setFalse}>
        <Container>
          <Button>
            <Text>New list</Text>
          </Button>
          <Button>
            <Text>New list group</Text>
          </Button>
        </Container>
      </Dialog>
      <Button onPress={toggle} style={{ padding: 16 }}>
        <Text>New list</Text>
      </Button>
    </>
  );
}

interface FixedMenuItemProps {
  icon: IconName;
  title: string;
  location: Location.All | Location.Daily | Location.Inbox;
}

function FixedMenuItem(props: FixedMenuItemProps) {
  const { icon, title, location } = props;
  const navigation = useNavigation();

  const handlePress = React.useCallback(() => {
    navigation.navigate({
      location,
      noteID: '',
    });
  }, [navigation, location]);

  return <MenuItem onPress={handlePress} icon={icon} title={title} />;
}

interface MenuItemProps {
  icon: IconName;
  title: string;
  onPress: () => void;
}

function MenuItem(props: MenuItemProps) {
  const { icon, title, onPress } = props;

  return (
    <Button onPress={onPress}>
      <Container height={40} paddingHorizontal={8}>
        <Row alignItems="center" expanded>
          <Icon name={icon} size="lg" />
          <Spacing width={16} />
          <Text>{title}</Text>
        </Row>
      </Container>
    </Button>
  );
}
