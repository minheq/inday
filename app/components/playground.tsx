import React, { createContext, useCallback, useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  NoAnimation as DialogNoAnimation,
  Slide as DialogSlide,
  Fade as DialogFade,
} from './dialog.stories';
import { Flat, Grouped } from './grid.stories';
import { Basic as DayPickerBasic } from './day_picker.stories';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { ScreenName, ScreenProps, useNavigation } from '../routes';
import { Button } from './button';
import { Container } from './container';
import { tokens } from './tokens';
import { Slide } from './slide';
import { Spacer } from './spacer';
import { Row } from './row';
import { FlatButton } from './flat_button';
import { Content } from './content';

const MENU_WIDTH = 280;

interface PlaygroundContext {
  component: string;
}

const PlaygroundContext = createContext<PlaygroundContext>({
  component: 'Intro',
});

export function Playground(
  props: ScreenProps<ScreenName.Playground>,
): JSX.Element {
  const {
    params: { component },
  } = props;
  const [open, setOpen] = useState(true);

  let content: React.ReactNode = null;

  switch (component) {
    case 'Intro':
      content = <Intro />;
      break;
    case 'Dialog':
      content = <Dialog />;
      break;
    case 'Grid':
      content = <Grid />;
      break;
    case 'DayPicker':
      content = <DayPicker />;
      break;

    default:
      break;
  }

  return (
    <PlaygroundContext.Provider value={{ component }}>
      <View style={styles.base}>
        <Slide width={MENU_WIDTH} open={open}>
          <Menu />
        </Slide>
        <Content>
          <Container padding={16}>
            <Row>
              <FlatButton
                color="primary"
                title="MENU"
                onPress={() => setOpen(!open)}
              />
            </Row>
            <Text weight="bold" size="xl">
              {component}
            </Text>
            <Spacer size={24} />
            {content}
          </Container>
        </Content>
      </View>
    </PlaygroundContext.Provider>
  );
}

function Menu() {
  return (
    <View style={styles.menu}>
      <Container padding={8}>
        <Text weight="600" size="lg">
          Inday Playground
        </Text>
      </Container>
      <ScrollView>
        <MenuItem component="Intro" />
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
  const context = useContext(PlaygroundContext);

  const handlePress = useCallback(() => {
    push(ScreenName.Playground, { component });
  }, [push, component]);

  const active = context.component === component;

  return (
    <Button style={styles.menuButton} onPress={handlePress}>
      <Text
        weight={active ? 'bold' : 'normal'}
        color={active ? 'primary' : 'default'}
      >
        {component}
      </Text>
    </Button>
  );
}

function Intro() {
  return (
    <View>
      <Text>Playground</Text>
    </View>
  );
}

function Dialog() {
  return (
    <View>
      <DialogNoAnimation />
      <DialogSlide />
      <DialogFade />
    </View>
  );
}

function Grid() {
  return (
    <View>
      <Flat />
      <Grouped />
    </View>
  );
}

function DayPicker() {
  return (
    <Container width={320}>
      <DayPickerBasic />
    </Container>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    flexDirection: 'row',
    height: '100%',
  },
  menu: {
    width: MENU_WIDTH,
    height: '100%',
    ...tokens.shadow.elevation1,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
}));
