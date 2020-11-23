import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { NoAnimation, Slide, Fade } from './dialog.stories';
import { Flat, Grouped } from './grid.stories';
import { FlatButton } from './flat_button';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';

type Component = 'Intro' | 'Dialog' | 'Grid';

export function Playground(): JSX.Element {
  const [component, setComponent] = useState<Component>('Intro');

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

    default:
      break;
  }

  return (
    <View style={styles.base}>
      <View style={styles.menu}>
        <MenuItem onPress={setComponent} component="Intro" />
        <MenuItem onPress={setComponent} component="Dialog" />
        <MenuItem onPress={setComponent} component="Grid" />
      </View>
      <View style={styles.content}>{content}</View>
    </View>
  );
}

interface MenuItemProps {
  onPress: (component: Component) => void;
  component: Component;
}

function MenuItem(props: MenuItemProps) {
  const { onPress, component } = props;

  const handlePress = useCallback(() => {
    onPress(component);
  }, [onPress, component]);

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
