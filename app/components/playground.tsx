import React, { createContext, useCallback, useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { DialogStories } from './dialog.stories';
import { GridStories } from './grid.stories';
import { DayPickerStories } from './day_picker.stories';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { ScreenName, ScreenProps, useNavigation } from '../routes';
import { Button } from './button';
import { Container } from './container';
import { tokens } from './tokens';
import { PickerStories } from './picker.stories';
import { Spacer } from './spacer';
import { Row } from './row';
import { FlatButton } from './flat_button';
import { Content } from './content';
import { useMediaQuery } from '../lib/media_query';
import { Modal } from './modal';
import { CloseButton } from './close_button';

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
    case 'DayPicker':
      content = <DayPickerStories />;
      break;

    default:
      break;
  }

  return (
    <PlaygroundContext.Provider
      value={{ component, onCloseMenu: handleCloseMenu }}
    >
      <View style={styles.base}>
        {mq.sizeQuery.lgAndUp ? (
          <Container width={MENU_WIDTH} shadow>
            <Menu />
          </Container>
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
          <Container zIndex={1} right={16} bottom={16} position="absolute">
            <Row>
              <FlatButton
                color="primary"
                title="MENU"
                onPress={() => setOpen(!open)}
              />
            </Row>
          </Container>
        )}
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
    </PlaygroundContext.Provider>
  );
}

function Menu() {
  return (
    <View style={styles.menu}>
      <Container padding={8} paddingTop={16}>
        <Text weight="600" size="lg">
          Inday Playground
        </Text>
      </Container>
      <ScrollView>
        <MenuSection title="GETTING STARTED" />
        <MenuItem component="Intro" />
        <MenuSection title="COMPONENTS" />
        <MenuItem component="Picker" />
        <MenuItem component="DayPicker" />
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
    <Container paddingHorizontal={8}>
      <Button style={styles.menuButton} onPress={handlePress}>
        <Text
          weight={active ? 'bold' : 'normal'}
          color={active ? 'primary' : 'default'}
        >
          {component}
        </Text>
      </Button>
    </Container>
  );
}

interface MenuSectionProps {
  title: string;
}

function MenuSection(props: MenuSectionProps) {
  const { title } = props;

  return (
    <Container paddingLeft={8} paddingTop={16} paddingBottom={8}>
      <Text color="muted" weight="bold">
        {title}
      </Text>
    </Container>
  );
}

function Intro() {
  return (
    <View>
      <Text>Playground</Text>
    </View>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    flexDirection: 'row',
    height: '100%',
  },
  menu: {
    flex: 1,
  },
  menuButton: {
    padding: 8,
    paddingLeft: 24,
    borderRadius: tokens.border.radius.default,
  },
  content: {
    flex: 1,
  },
}));
