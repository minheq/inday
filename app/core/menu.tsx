import React from 'react';
import { ScrollView, TextInput, StyleSheet, View } from 'react-native';

import {
  Text,
  Container,
  Spacing,
  Icon,
  Row,
  Button,
  IconName,
  Dialog,
  Popover,
} from '../components';
import { Location, useNavigation } from '../data/navigation';
import { useToggle } from '../hooks/use_toggle';
import { List } from '../data/list';
import {
  useGetLists,
  useCreateList,
  useCreateListGroup,
  useUpdateListName,
} from '../data/api';
import { ListGroup } from '../data/list_group';
import { tokens } from '../theme';

interface MenuContext {
  renameListOrListGroupID: string | null;
  onSetRenameListOrListGroupID: (listOrListGroupID: string) => void;
  onClear: () => void;
}

const MenuContext = React.createContext<MenuContext>({
  renameListOrListGroupID: null,
  onSetRenameListOrListGroupID: () => {},
  onClear: () => {},
});

export function Menu() {
  const [renameListOrListGroupID, setRenameListOrListGroupID] = React.useState<
    string | null
  >(null);

  const handleSetRenameListOrListGroupID = React.useCallback(
    (listOrListGroupID: string) => {
      setRenameListOrListGroupID(listOrListGroupID);
    },
    [],
  );

  const handleClear = React.useCallback(() => {
    setRenameListOrListGroupID(null);
  }, []);

  return (
    <MenuContext.Provider
      value={{
        renameListOrListGroupID,
        onSetRenameListOrListGroupID: handleSetRenameListOrListGroupID,
        onClear: handleClear,
      }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <Container flex={1}>
          <FixedMenuItem icon="inbox" title="Inbox" location={Location.Inbox} />
          <FixedMenuItem
            icon="calendar"
            title="Today"
            location={Location.Today}
          />
          <FixedMenuItem
            icon="navigation"
            title="All"
            location={Location.All}
          />
          <Spacing height={64} />
          <ListsMenu />
        </Container>
        <NewListButton />
      </ScrollView>
    </MenuContext.Provider>
  );
}

function NewListButton() {
  const [visible, { toggle, setFalse }] = useToggle();
  const createList = useCreateList();
  const createListGroup = useCreateListGroup();
  const menuContext = React.useContext(MenuContext);

  const handleCreateList = React.useCallback(() => {
    const list = createList();
    menuContext.onSetRenameListOrListGroupID(list.id);
    setFalse();
  }, [createList, setFalse, menuContext]);
  const handleCreateListGroup = React.useCallback(() => {
    const listGroup = createListGroup();
    menuContext.onSetRenameListOrListGroupID(listGroup.id);
    setFalse();
  }, [createListGroup, setFalse, menuContext]);

  return (
    <>
      <Dialog animationType="slide" visible={visible} onRequestClose={setFalse}>
        <Container maxWidth={400}>
          <Button onPress={handleCreateList}>
            <Container padding={16}>
              <Row alignItems="center" expanded>
                <Icon name="list" size="lg" />
                <Spacing width={16} />
                <Container flex={1}>
                  <Text bold>New list</Text>
                  <Text>
                    Create a single list of notes that follow similar topic
                  </Text>
                </Container>
              </Row>
            </Container>
          </Button>
          <Button onPress={handleCreateListGroup}>
            <Container padding={16}>
              <Row alignItems="center" expanded>
                <Icon name="layers" size="lg" />
                <Spacing width={16} />
                <Container flex={1}>
                  <Text bold>New list group</Text>
                  <Text>
                    Group your lists based on different topic areas like
                    Engineering or Design
                  </Text>
                </Container>
              </Row>
            </Container>
          </Button>
        </Container>
      </Dialog>
      <Button onPress={toggle}>
        <Container padding={16}>
          <Text>New list</Text>
        </Container>
      </Button>
    </>
  );
}

interface FixedMenuItemProps {
  icon: IconName;
  title: string;
  location: Location.All | Location.Today | Location.Inbox;
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

  return (
    <Button onPress={handlePress}>
      <Container padding={16}>
        <Row alignItems="center" expanded>
          <Icon name={icon} size="lg" />
          <Spacing width={16} />
          <Text>{title}</Text>
        </Row>
      </Container>
    </Button>
  );
}

function ListsMenu() {
  const lists = useGetLists();

  return (
    <>
      {lists.map((list) => {
        if (list.typename === 'ListGroup') {
          return <ListGroupMenuItem key={list.id} listGroup={list} />;
        }

        return <ListMenuItem key={list.id} list={list} />;
      })}
    </>
  );
}

interface ListGroupMenuItemProps {
  listGroup: ListGroup;
}

function ListGroupMenuItem(props: ListGroupMenuItemProps) {
  const { listGroup } = props;
  const navigation = useNavigation();

  const handlePress = React.useCallback(() => {
    navigation.navigate({
      location: Location.List,
      listID: listGroup.id,
      noteID: '',
    });
  }, [navigation, listGroup]);

  return (
    <Button onPress={handlePress}>
      <Container height={56} padding={16}>
        <Row alignItems="center" expanded>
          <Icon name="layers" size="lg" />
          <Spacing width={16} />
          <Text>{listGroup.name}</Text>
        </Row>
      </Container>
    </Button>
  );
}

interface ListMenuItemProps {
  list: List;
}

function ListMenuItem(props: ListMenuItemProps) {
  const { list } = props;
  const navigation = useNavigation();
  const updateListName = useUpdateListName();
  const [visible, { setTrue, setFalse }] = useToggle();
  const menuContext = React.useContext(MenuContext);

  const handlePress = React.useCallback(() => {
    navigation.navigate({
      location: Location.List,
      listID: list.id,
      noteID: '',
    });
  }, [navigation, list]);

  const handleChange = React.useCallback(
    (name: string) => {
      updateListName({ id: list.id, name });
    },
    [updateListName, list],
  );

  const handleBlur = React.useCallback(() => {
    menuContext.onClear();
  }, [menuContext]);

  if (menuContext.renameListOrListGroupID === list.id) {
    return (
      <ListNameEditTextInput
        value={list.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <Container>
      <Popover
        visible={visible}
        onRequestClose={setFalse}
        content={<ListMenuItemContextMenu />}
      >
        {({ ref }) => (
          <Button onPress={handlePress}>
            {({ hovered }) => (
              <Container height={56} padding={16}>
                <Row alignItems="center" expanded>
                  <Icon name="list" size="lg" />
                  <Spacing width={16} />
                  <Container flex={1}>
                    <Text>{list.name}</Text>
                  </Container>
                  {(hovered || visible) && (
                    <View ref={ref}>
                      <Button onPress={setTrue} style={styles.menuItemMore}>
                        <Container center width={32} height={32}>
                          <Icon name="more-horizontal" size="lg" />
                        </Container>
                      </Button>
                    </View>
                  )}
                </Row>
              </Container>
            )}
          </Button>
        )}
      </Popover>
    </Container>
  );
}

function ListMenuItemContextMenu() {
  return (
    <Container>
      <Button>
        <Container>
          <Text>Rename</Text>
        </Container>
      </Button>
    </Container>
  );
}

interface ListNameEditTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function ListNameEditTextInput(props: ListNameEditTextInputProps) {
  const { value, onChange, onBlur } = props;

  return (
    <Container height={56} padding={16}>
      <Row alignItems="center">
        <Icon name="list" size="lg" />
        <Spacing width={16} />
        <TextInput
          autoFocus
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
          style={[styles.listNameEditTextInput, { outline: 'none' }]}
        />
      </Row>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
  },
  listNameEditTextInput: {
    flex: 1,
    ...tokens.text.size.md,
  },
  menuItemMore: {
    borderRadius: 999,
  },
});
