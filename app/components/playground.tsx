import React, { createContext, useCallback, useContext, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { DialogStories } from './dialog.stories';
import { GridStories } from './grid_renderer.stories';
import { DatePickerStories } from './date_picker.stories';
import { TextInputStories } from './text_input.stories';
import { Text } from './text';
import { ScreenName, ScreenProps, useNavigation } from '../routes';
import { Button } from './button';
import { tokens } from './tokens';
import { PickerStories } from './picker.stories';
import { Spacer } from './spacer';
import { Row } from './row';
import { ContextMenuStories } from './context_menu.stories';
import { FlatButton } from './flat_button';
import { Content } from './content';
import { useMediaQuery } from '../lib/media_query';
import { Modal } from './modal';
import { CloseButton } from './close_button';
import { useThemeStyles } from './theme';

const MENU_WIDTH = 280;

interface PlaygroundContext {
  component: string;
  onCloseMenu: () => void;
}

const PlaygroundContext = createContext<PlaygroundContext>({
  component: 'Intro',
  onCloseMenu: () => {
    return;
  },
});

export function Playground(
  props: ScreenProps<ScreenName.Playground>,
): JSX.Element {
  const {
    params: { component },
  } = props;
  const mq = useMediaQuery();
  const themeStyles = useThemeStyles();
  const [open, setOpen] = useState(false);

  const handleCloseMenu = useCallback(() => {
    setOpen(false);
  }, []);
  let content: React.ReactNode = null;

  switch (component) {
    case 'Intro':
      content = <Intro />;
      break;
    case 'Dialog':
      content = <DialogStories />;
      break;
    case 'Grid':
      content = <GridStories />;
      break;
    case 'Picker':
      content = <PickerStories />;
      break;
    case 'TextInput':
      content = <TextInputStories />;
      break;
    case 'DatePicker':
      content = <DatePickerStories />;
      break;
    case 'ContextMenu':
      content = <ContextMenuStories />;
      break;

    default:
      content = (
        <Text>Hmm... This components stories is not implemented yet</Text>
      );
  }

  return (
    <PlaygroundContext.Provider
      value={{ component, onCloseMenu: handleCloseMenu }}
    >
      <View style={styles.base}>
        {mq.sizeQuery.lgAndUp ? (
          <View style={[{ width: MENU_WIDTH }, themeStyles.elevation.level1]}>
            <Menu />
          </View>
        ) : (
          <Modal
            animationType="slide"
            onRequestClose={handleCloseMenu}
            visible={open}
          >
            <Row>
              <CloseButton onPress={handleCloseMenu} />
            </Row>
            <Menu />
          </Modal>
        )}
        {mq.sizeQuery.lgAndDown && (
          <View style={styles.mobileMenuButton}>
            <FlatButton
              color="primary"
              title="MENU"
              onPress={() => setOpen(!open)}
            />
          </View>
        )}
        <View style={[styles.contentWrapper, themeStyles.background.content]}>
          <Content>
            <ScrollView>
              <Text weight="bold" size="xl">
                {component}
              </Text>
              <Spacer size={24} />
              {content}
            </ScrollView>
          </Content>
        </View>
      </View>
    </PlaygroundContext.Provider>
  );
}

function Menu() {
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.menu, themeStyles.background.content]}>
      <View style={styles.menuTitleWrapper}>
        <Text weight="600" size="lg">
          Inday Playground
        </Text>
      </View>
      <ScrollView>
        <MenuSection title="GETTING STARTED" />
        <MenuItem component="Intro" />
        <MenuSection title="COMPONENTS" />
        <MenuItem component="ContextMenu" />
        <MenuItem component="Picker" />
        <MenuItem component="DatePicker" />
        <MenuItem component="TextInput" />
        <MenuItem component="Dialog" />
        <MenuItem component="Grid" />
      </ScrollView>
    </View>
  );
}

interface MenuItemProps {
  component: string;
}

function MenuItem(props: MenuItemProps) {
  const { component } = props;
  const { push } = useNavigation();
  const { component: currentComponent, onCloseMenu } = useContext(
    PlaygroundContext,
  );
  const active = currentComponent === component;

  const handlePress = useCallback(() => {
    if (active === true) {
      return;
    }
    push(ScreenName.Playground, { component });
    onCloseMenu();
  }, [active, push, component, onCloseMenu]);

  return (
    <View style={styles.menuItem}>
      <Button style={styles.menuButton} onPress={handlePress}>
        <Text
          weight={active ? 'bold' : 'normal'}
          color={active ? 'primary' : 'default'}
        >
          {component}
        </Text>
      </Button>
    </View>
  );
}

interface MenuSectionProps {
  title: string;
}

function MenuSection(props: MenuSectionProps) {
  const { title } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.menuSection, themeStyles.background.content]}>
      <Text color="muted" weight="bold">
        {title}
      </Text>
    </View>
  );
}

function Intro() {
  return (
    <View>
      <Text>Playground</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    height: '100%',
  },
  menuButton: {
    padding: 8,
    paddingLeft: 24,
    borderRadius: tokens.border.radius,
  },
  menuSection: {
    paddingLeft: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem: {
    paddingHorizontal: 8,
  },
  menu: {
    flex: 1,
  },
  menuTitleWrapper: {
    padding: 8,
    paddingTop: 16,
  },
  mobileMenuButton: {
    zIndex: 1,
    right: 16,
    bottom: 16,
    position: 'absolute',
  },
  contentWrapper: {
    flex: 1,
  },
});
