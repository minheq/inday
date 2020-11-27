import React, { useCallback } from 'react';
import { View } from 'react-native';
import { NoAnimation, Slide, Fade } from './dialog.stories';
import { Flat, Grouped } from './grid.stories';
import { FlatButton } from './flat_button';
import { Basic as DayPickerBasic } from './day_picker.stories';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { ScreenName, ScreenProps, useNavigation } from '../routes';

type ComponentName = 'Intro' | 'Dialog' | 'Grid' | 'DayPicker';

export function Playground(
  props: ScreenProps<ScreenName.Playground>,
): JSX.Element {
  const {
    params: { component },
  } = props;

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
    <View style={styles.base}>
      <View style={styles.menu}>
        <MenuItem component="Intro" />
        <MenuItem component="Dialog" />
        <MenuItem component="Grid" />
        <MenuItem component="DayPicker" />
      </View>
      <View style={styles.content}>{content}</View>
    </View>
  );
}

interface MenuItemProps {
  component: ComponentName;
}

function MenuItem(props: MenuItemProps) {
  const { component } = props;
  const { push } = useNavigation();

  const handlePress = useCallback(() => {
    push(ScreenName.Playground, { component });
  }, [push, component]);

  return <FlatButton onPress={handlePress} title={component} />;
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
      <NoAnimation />
      <Slide />
      <Fade />
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
    <View>
      <DayPickerBasic />
    </View>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    flexDirection: 'row',
  },
  menu: {
    width: 300,
  },
  content: {
    flex: 1,
  },
}));
