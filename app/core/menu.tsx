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
  Popover,
  PopoverAnchor,
} from '../components';
import { Location, useNavigation } from '../data/navigation';

import {
  useExpandTag,
  useGetMenuTags,
  useCreateTag,
  useUpdateTagName,
} from '../data/api';
import { tokens } from '../components/theme';
import {
  useContextMenu,
  ContextMenuCoordinate,
} from '../hooks/use_context_menu';
import { Expand } from '../components/expand';
import { MenuTag } from '../data/menu';
import { isEmpty } from '../utils/arrays';

interface MenuContext {
  renameTagID: string | null;
  onSetRenameTagID: (tagID: string) => void;
  onClear: () => void;
}

const MenuContext = React.createContext<MenuContext>({
  renameTagID: null,
  onSetRenameTagID: () => {},
  onClear: () => {},
});

export function Menu() {
  const menuTags = useGetMenuTags();
  const [renameTagID, setRenameTagID] = React.useState<string | null>(null);

  const handleSetRenameTagID = React.useCallback((tagID: string) => {
    setRenameTagID(tagID);
  }, []);

  const handleClear = React.useCallback(() => {
    setRenameTagID(null);
  }, []);

  return (
    <MenuContext.Provider
      value={{
        renameTagID,
        onSetRenameTagID: handleSetRenameTagID,
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
          <Tags menuTags={menuTags} />
        </Container>
      </ScrollView>
      <MenuFooter />
    </MenuContext.Provider>
  );
}

function MenuFooter() {
  const createTag = useCreateTag();
  const menuContext = React.useContext(MenuContext);

  const handleCreateTag = React.useCallback(() => {
    const tag = createTag(null);
    menuContext.onSetRenameTagID(tag.id);
  }, [createTag, menuContext]);

  return (
    <Container padding={16}>
      <Row justifyContent="flex-end">
        <Button
          onPress={handleCreateTag}
          style={{ borderRadius: tokens.radius }}
        >
          <Container center height={40} paddingHorizontal={16}>
            <Text color="primary">New tag</Text>
          </Container>
        </Button>
      </Row>
    </Container>
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
      <Container height={40} paddingHorizontal={4}>
        <Row alignItems="center" expanded>
          <Container width={28} />
          <Icon name={icon} size="lg" />
          <Spacing width={16} />
          <Text>{title}</Text>
        </Row>
      </Container>
    </Button>
  );
}

interface TagsProps {
  menuTags: MenuTag[];
}

function Tags(props: TagsProps) {
  const { menuTags } = props;

  return (
    <>
      {menuTags.map((menuTag) => {
        const { tag, expanded } = menuTag;

        return (
          <TagMenuItem key={tag.id} menuTag={menuTag} expanded={expanded} />
        );
      })}
    </>
  );
}

interface TagMenuItemProps {
  menuTag: MenuTag;
  expanded: boolean;
}

function TagMenuItem(props: TagMenuItemProps) {
  const { menuTag, expanded } = props;
  const { tag, children } = menuTag;
  const navigation = useNavigation();
  const active =
    navigation.state.location === Location.Tag &&
    navigation.state.tagID === tag.id;
  const updateTagName = useUpdateTagName();
  const expandTag = useExpandTag();
  const [visible, setVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<PopoverAnchor>({
    y: 0,
    x: 0,
  });
  const chevron = React.useRef(new Animated.Value(0)).current;
  const menuContext = React.useContext(MenuContext);
  const ref = React.useRef<View>(null);

  const handleChange = React.useCallback(
    (name: string) => {
      updateTagName({ tagID: tag.id, name });
    },
    [updateTagName, tag],
  );

  const handlePress = React.useCallback(() => {
    navigation.navigate({
      location: Location.Tag,
      tagID: tag.id,
      noteID: '',
    });
  }, [tag, navigation]);

  const handleExpand = React.useCallback(() => {
    expandTag({ tagID: tag.id, expanded: !expanded });
  }, [tag, expanded, expandTag]);

  const handleBlur = React.useCallback(() => {
    menuContext.onClear();
  }, [menuContext]);

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
    menuContext.onSetRenameTagID(tag.id);
  }, [menuContext, tag]);

  const hasChildren = isEmpty(children) === false;

  return (
    <>
      <View ref={ref}>
        {menuContext.renameTagID === tag.id ? (
          <TagNameEditTextInput
            value={tag.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <Button
            onPress={handlePress}
            style={{ borderRadius: tokens.radius }}
            state={active ? 'active' : visible ? 'hovered' : 'default'}
          >
            <Container height={40} paddingHorizontal={4}>
              <Row alignItems="center" expanded>
                {hasChildren ? (
                  <Button style={styles.menuItemMore} onPress={handleExpand}>
                    <Container center width={24} height={24}>
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
                    </Container>
                  </Button>
                ) : (
                  <Container width={24} />
                )}
                <Spacing width={4} />
                <Icon name="tag" size="lg" />
                <Spacing width={8} />
                <Container flex={1}>
                  <Text>{tag.name}</Text>
                </Container>
              </Row>
            </Container>
          </Button>
        )}
      </View>
      <Expand open={expanded}>
        <Container paddingLeft={16}>
          <Tags menuTags={children} />
        </Container>
      </Expand>
      <Popover
        onRequestClose={handleCloseMore}
        anchor={anchor}
        visible={visible}
        placement="bottom-right"
      >
        <TagMenuItemContextMenu
          onDelete={handlePressRename}
          onPressRename={handlePressRename}
        />
      </Popover>
    </>
  );
}

interface TagMenuItemContextMenuProps {
  onPressRename: () => void;
  onDelete: () => void;
}

function TagMenuItemContextMenu(props: TagMenuItemContextMenuProps) {
  const { onPressRename, onDelete } = props;

  return (
    <Container width={160} color="content" shape="rounded">
      <Button onPress={onPressRename}>
        <Container padding={8}>
          <Text size="sm">Rename</Text>
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

interface TagNameEditTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function TagNameEditTextInput(props: TagNameEditTextInputProps) {
  const { value, onChange, onBlur } = props;

  return (
    <Container height={40} paddingHorizontal={8}>
      <Row expanded alignItems="center">
        <Icon name="tag" size="lg" />
        <Spacing width={8} />
        <TextInput
          autoFocus
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
          // @ts-ignore
          style={[styles.tagNameEditTextInput, webStyle]}
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
  tagNameEditTextInput: {
    flex: 1,
    ...tokens.text.size.md,
  },
  menuItemMore: {
    borderRadius: 999,
  },
});
