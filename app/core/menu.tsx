import React from 'react';
import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  Animated,
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
  PopoverAnchor,
} from '../components';
import { Location, useNavigation } from '../data/navigation';
import { useToggle } from '../hooks/use_toggle';
import { List } from '../data/list';
import {
  useCreateList,
  useCreateListGroup,
  useUpdateListName,
  useUpdateListGroupName,
  useGetListGroupLists,
  useExpandListGroup,
  useGetMenu,
  useGetListAndListGroups,
} from '../data/api';
import { ListGroup } from '../data/list_group';
import { tokens } from '../theme';
import { measure } from '../utils/measurements';
import {
  useContextMenu,
  ContextMenuCoordinate,
} from '../hooks/use_context_menu';
import { Expand } from '../components/expand';

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
        <Container flex={1} padding={16}>
          <FixedMenuItem icon="inbox" title="Inbox" location={Location.Inbox} />
          <FixedMenuItem icon="book" title="All" location={Location.All} />
          <FixedMenuItem icon="trash" title="Trash" location={Location.Trash} />
          <Spacing height={32} />
          <ListsMenu />
        </Container>
      </ScrollView>
      <NewListButton />
    </MenuContext.Provider>
  );
}

function NewListButton() {
  const [visible, { toggle, setFalse }] = useToggle();
  const createList = useCreateList();
  const createListGroup = useCreateListGroup();
  const menuContext = React.useContext(MenuContext);

  const handleCreateList = React.useCallback(() => {
    const list = createList(null);
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
      <Container padding={16}>
        <Row justifyContent="flex-end">
          <Button onPress={toggle} style={{ borderRadius: tokens.radius }}>
            <Container center height={40} paddingHorizontal={16}>
              <Text color="primary">New list</Text>
            </Container>
          </Button>
        </Row>
      </Container>
    </>
  );
}

interface FixedMenuItemProps {
  icon: IconName;
  title: string;
  location: Location.All | Location.Inbox | Location.Trash;
}

function FixedMenuItem(props: FixedMenuItemProps) {
  const { icon, title, location } = props;
  const navigation = useNavigation();
  const active = navigation.state.location === location;

  const handlePress = React.useCallback(() => {
    navigation.navigate({
      location,
      noteID: '',
    });
  }, [navigation, location]);

  return (
    <Button
      state={active ? 'active' : 'default'}
      onPress={handlePress}
      style={{ borderRadius: tokens.radius }}
    >
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

function ListsMenu() {
  const lists = useGetListAndListGroups();
  const menu = useGetMenu();

  return (
    <>
      {lists.map((list) => {
        if (list.typename === 'ListGroup') {
          const listGroupMenuItem = menu.listGroupIDs[list.id];

          const expanded = !!(
            listGroupMenuItem && listGroupMenuItem.expanded === true
          );

          return (
            <ListGroupMenuItem
              key={list.id}
              listGroup={list}
              expanded={expanded}
            />
          );
        }

        return <ListMenuItem key={list.id} list={list} />;
      })}
    </>
  );
}

interface ListGroupMenuItemProps {
  listGroup: ListGroup;
  expanded: boolean;
}

function ListGroupMenuItem(props: ListGroupMenuItemProps) {
  const { listGroup, expanded } = props;
  const updateListName = useUpdateListGroupName();
  const expandListGroup = useExpandListGroup();
  const [visible, setVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<PopoverAnchor>({
    y: 0,
    x: 0,
  });
  const createList = useCreateList();
  const chevron = React.useRef(new Animated.Value(0)).current;
  const menuContext = React.useContext(MenuContext);
  const ref = React.useRef<View>(null);
  const lists = useGetListGroupLists(listGroup.id);

  const handleChange = React.useCallback(
    (name: string) => {
      updateListName({ listGroupID: listGroup.id, name });
    },
    [updateListName, listGroup],
  );

  const handleExpand = React.useCallback(() => {
    expandListGroup({ listGroupID: listGroup.id, expanded: !expanded });
  }, [listGroup, expanded, expandListGroup]);

  const handleBlur = React.useCallback(() => {
    menuContext.onClear();
  }, [menuContext]);

  const handlePressMore = React.useCallback(async () => {
    measure(ref).then((measurements) => {
      setVisible(true);
      setAnchor({
        y: measurements.pageY + 28,
        x: measurements.pageX + measurements.width - 24,
      });
    });
  }, []);

  const handleOpenContextMenu = React.useCallback(
    (coordinate: ContextMenuCoordinate) => {
      setVisible(true);
      setAnchor({
        y: coordinate.y,
        x: coordinate.x,
      });
    },
    [],
  );

  useContextMenu({ ref, onOpen: handleOpenContextMenu });

  React.useEffect(() => {
    Animated.spring(chevron, {
      toValue: expanded ? 1 : 0,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }, [expanded, chevron]);

  const handleCloseMore = React.useCallback(async () => {
    setVisible(false);
  }, []);

  const handlePressRename = React.useCallback(() => {
    setVisible(false);
    menuContext.onSetRenameListOrListGroupID(listGroup.id);
  }, [menuContext, listGroup]);

  const handleAddList = React.useCallback(() => {
    setVisible(false);
    expandListGroup({ listGroupID: listGroup.id, expanded: true });
    const list = createList(listGroup.id);
    menuContext.onSetRenameListOrListGroupID(list.id);
  }, [menuContext, listGroup, expandListGroup, createList]);

  return (
    <>
      <View ref={ref}>
        {menuContext.renameListOrListGroupID === listGroup.id ? (
          <ListNameEditTextInput
            typename="ListGroup"
            value={listGroup.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <Button
            onPress={handleExpand}
            style={{ borderRadius: tokens.radius }}
            state={visible ? 'hovered' : 'default'}
          >
            {({ hovered }) => (
              <Container height={40} paddingHorizontal={8}>
                <Row alignItems="center" expanded>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: chevron.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '90deg'],
                          }),
                        },
                      ],
                    }}
                  >
                    <Icon name="chevron-right" size="lg" />
                  </Animated.View>
                  <Spacing width={8} />
                  <Container flex={1}>
                    <Text>{listGroup.name}</Text>
                  </Container>
                  {hovered && (
                    <Button
                      onPress={handlePressMore}
                      style={styles.menuItemMore}
                    >
                      <Container center width={32} height={32}>
                        <Icon name="more-horizontal" size="lg" />
                      </Container>
                    </Button>
                  )}
                </Row>
              </Container>
            )}
          </Button>
        )}
      </View>
      <Expand open={expanded}>
        <Container paddingLeft={16}>
          {lists.map((list) => (
            <ListMenuItem key={list.id} list={list} />
          ))}
        </Container>
      </Expand>
      <Popover
        onRequestClose={handleCloseMore}
        anchor={anchor}
        visible={visible}
        placement="bottom-right"
      >
        <ListGroupMenuItemContextMenu
          onAddList={handleAddList}
          onDelete={handlePressRename}
          onPressRename={handlePressRename}
        />
      </Popover>
    </>
  );
}

interface ListMenuItemProps {
  list: List;
}

function ListMenuItem(props: ListMenuItemProps) {
  const { list } = props;
  const navigation = useNavigation();
  const updateListName = useUpdateListName();
  const [visible, setVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<PopoverAnchor>({
    y: 0,
    x: 0,
  });
  const menuContext = React.useContext(MenuContext);
  const ref = React.useRef<View>(null);
  const active =
    navigation.state.location === Location.List &&
    navigation.state.listID === list.id;

  const handlePress = React.useCallback(() => {
    navigation.navigate({
      location: Location.List,
      listID: list.id,
      noteID: '',
    });
  }, [navigation, list]);

  const handleChange = React.useCallback(
    (name: string) => {
      updateListName({ listID: list.id, name });
    },
    [updateListName, list],
  );

  const handleBlur = React.useCallback(() => {
    menuContext.onClear();
  }, [menuContext]);

  const handlePressMore = React.useCallback(async () => {
    measure(ref).then((measurements) => {
      setVisible(true);
      setAnchor({
        y: measurements.pageY + 28,
        x: measurements.pageX + measurements.width - 24,
      });
    });
  }, []);

  const handleOpenContextMenu = React.useCallback(
    (coordinate: ContextMenuCoordinate) => {
      setVisible(true);
      setAnchor({
        y: coordinate.y,
        x: coordinate.x,
      });
    },
    [],
  );

  useContextMenu({ ref, onOpen: handleOpenContextMenu });

  const handleCloseMore = React.useCallback(async () => {
    setVisible(false);
  }, []);

  const handlePressRename = React.useCallback(() => {
    setVisible(false);
    menuContext.onSetRenameListOrListGroupID(list.id);
  }, [menuContext, list]);

  return (
    <>
      <View ref={ref}>
        {menuContext.renameListOrListGroupID === list.id ? (
          <ListNameEditTextInput
            typename="List"
            value={list.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <Button
            state={active ? 'active' : visible ? 'hovered' : 'default'}
            onPress={handlePress}
            style={{ borderRadius: tokens.radius }}
          >
            {({ hovered }) => (
              <Container height={40} paddingHorizontal={8}>
                <Row alignItems="center" expanded>
                  <Icon name="list" size="lg" />
                  <Spacing width={8} />
                  <Container flex={1}>
                    <Text>{list.name}</Text>
                  </Container>
                  {hovered && (
                    <Button
                      onPress={handlePressMore}
                      style={styles.menuItemMore}
                    >
                      <Container center width={32} height={32}>
                        <Icon name="more-horizontal" size="lg" />
                      </Container>
                    </Button>
                  )}
                </Row>
              </Container>
            )}
          </Button>
        )}
      </View>
      <Popover
        onRequestClose={handleCloseMore}
        anchor={anchor}
        visible={visible}
        placement="bottom-right"
      >
        <ListMenuItemContextMenu
          onDelete={handlePressRename}
          onPressRename={handlePressRename}
          onAddNote={() => {}}
        />
      </Popover>
    </>
  );
}

interface ListMenuItemContextMenuProps {
  onPressRename: () => void;
  onDelete: () => void;
  onAddNote: () => void;
}

function ListMenuItemContextMenu(props: ListMenuItemContextMenuProps) {
  const { onPressRename, onDelete, onAddNote } = props;

  return (
    <Container width={160} color="content" shape="rounded">
      <Button onPress={onPressRename}>
        <Container padding={8}>
          <Text size="sm">Rename</Text>
        </Container>
      </Button>
      <Button onPress={onAddNote}>
        <Container padding={8}>
          <Text size="sm">Add note</Text>
        </Container>
      </Button>
      <Button onPress={onDelete}>
        <Container padding={8}>
          <Text color="error" size="sm">
            Delete
          </Text>
        </Container>
      </Button>
    </Container>
  );
}

interface ListGroupMenuItemContextMenuProps {
  onPressRename: () => void;
  onAddList: () => void;
  onDelete: () => void;
}

function ListGroupMenuItemContextMenu(
  props: ListGroupMenuItemContextMenuProps,
) {
  const { onPressRename, onAddList } = props;

  return (
    <Container width={160} color="content" shape="rounded">
      <Button onPress={onPressRename}>
        <Container padding={8}>
          <Text size="sm">Rename</Text>
        </Container>
      </Button>
      <Button onPress={onAddList}>
        <Container padding={8}>
          <Text size="sm">Add list</Text>
        </Container>
      </Button>
      <Button onPress={onAddList}>
        <Container padding={8}>
          <Text color="error" size="sm">
            Delete
          </Text>
        </Container>
      </Button>
    </Container>
  );
}

interface ListNameEditTextInputProps {
  typename: 'List' | 'ListGroup';
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function ListNameEditTextInput(props: ListNameEditTextInputProps) {
  const { typename, value, onChange, onBlur } = props;

  return (
    <Container height={40} paddingHorizontal={8}>
      <Row expanded alignItems="center">
        <Icon name={typename === 'List' ? 'list' : 'layers'} size="lg" />
        <Spacing width={8} />
        <TextInput
          autoFocus
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
          // @ts-ignore
          style={[styles.listNameEditTextInput, webStyle]}
        />
      </Row>
    </Container>
  );
}

const webStyle = {
  outline: 'none',
};

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
