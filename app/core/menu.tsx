import React from 'react';
import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';

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
import { initialMeasurements, measure } from '../utils/measurements';

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
          <Button onPress={handleCreateList} style={styles.newList}>
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
          <Button onPress={handleCreateListGroup} style={styles.newListGroup}>
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
  const [measurements, setMeasurements] = React.useState(initialMeasurements);
  const [visible, setVisible] = React.useState(false);
  const menuContext = React.useContext(MenuContext);
  const ref = React.useRef<View>(null);

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

  const handleLayout = React.useCallback(() => {
    measure(ref).then((m) => setMeasurements(m));
  }, []);

  const handlePressMore = React.useCallback(async () => {
    setVisible(true);
  }, []);

  const handleCloseMore = React.useCallback(async () => {
    setVisible(false);
  }, []);

  if (menuContext.renameListOrListGroupID === list.id) {
    return (
      <ListNameEditTextInput
        value={list.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }

  const anchor = {
    top: measurements.y + 28,
    left: measurements.x + measurements.width - 32,
  };

  return (
    <View ref={ref} onLayout={handleLayout}>
      <Button onPress={handlePress}>
        {({ hovered }) => (
          <Container height={56} padding={16}>
            <Row alignItems="center" expanded>
              <Icon name="list" size="lg" />
              <Spacing width={16} />
              <Container flex={1}>
                <Text>{list.name}</Text>
              </Container>
              {hovered && (
                <Button onPress={handlePressMore} style={styles.menuItemMore}>
                  <Container center width={32} height={32}>
                    <Icon name="more-horizontal" size="lg" />
                  </Container>
                </Button>
              )}
            </Row>
          </Container>
        )}
      </Button>
      <Popover
        onRequestClose={handleCloseMore}
        anchor={anchor}
        visible={visible}
        position="bottom-left"
      >
        <ListMenuItemContextMenu />
      </Popover>
    </View>
  );
}

function ListMenuItemContextMenu() {
  return (
    <Container width={200} color="content" shape="rounded">
      <Button>
        <Container padding={16}>
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
          // @ts-ignore
          style={[styles.listNameEditTextInput, { outline: 'none' }]}
        />
      </Row>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  scrollViewContainer: {
    flex: 1,
    overflow: 'visible',
  },
  listNameEditTextInput: {
    flex: 1,
    ...tokens.text.size.md,
  },
  newList: {
    borderTopLeftRadius: tokens.radius,
    borderTopRightRadius: tokens.radius,
  },
  newListGroup: {
    borderBottomLeftRadius: tokens.radius,
    borderBottomRightRadius: tokens.radius,
  },
  menuItemMore: {
    borderRadius: 999,
  },
});
