import React from 'react';
import { ScrollView, Animated, StyleSheet } from 'react-native';

import {
  Text,
  Container,
  SearchInput,
  Spacing,
  IconName,
  Icon,
  Column,
  Pressable,
  Button,
} from '../components';
import { useTheme, tokens } from '../theme';

interface SideNavigationProps {}

export function SideNavigation() {
  return (
    <Container expanded width={320} color="tint">
      <NavigationMenu />
    </Container>
  );
}

export function NavigationMenu() {
  return (
    <ScrollView>
      <Container padding={16}>
        <SearchInput />
        <Spacing height={24} />
        <Menu />
      </Container>
    </ScrollView>
  );
}

interface MenuItemData {
  icon: IconName;
  title: string;
}

const menuItems: MenuItemData[] = [
  { icon: 'calendar', title: 'Timeline' },
  { icon: 'inbox', title: 'Inbox' },
];

function Menu() {
  const hoverY = React.useRef(new Animated.Value(0)).current;
  const hoverOpacity = React.useRef(new Animated.Value(0)).current;
  const selectedY = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  const handleHoverIn = React.useCallback(
    (index: number) => {
      Animated.spring(hoverY, {
        toValue: index * 40,
        useNativeDriver: true,
        bounciness: 0,
        speed: 40,
      }).start();
      Animated.spring(hoverOpacity, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
        speed: 40,
      }).start();
    },
    [hoverY, hoverOpacity],
  );

  const handleHoverOut = React.useCallback(() => {
    Animated.spring(hoverOpacity, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 40,
    }).start();
  }, [hoverOpacity]);

  const handleOnPress = React.useCallback(
    (index: number) => {
      Animated.spring(selectedY, {
        toValue: index * 40,
        useNativeDriver: true,
        bounciness: 0,
        speed: 40,
      }).start();
    },
    [selectedY],
  );

  return (
    <Column>
      <Animated.View
        style={[
          styles.selection,
          styles.hovered,
          {
            opacity: hoverOpacity,
            transform: [{ translateY: hoverY }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.selection,
          theme.container.shadow,
          {
            backgroundColor: theme.container.color.content,
            transform: [{ translateY: selectedY }],
          },
        ]}
      />
      {menuItems.map((item, index) => (
        <MenuItem
          key={item.title}
          index={index}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          icon={item.icon}
          onPress={handleOnPress}
          title={item.title}
        />
      ))}
      <Spacing height={24} />
      <AddPage />
    </Column>
  );
}

interface MenuItemProps {
  index: number;
  icon: IconName;
  onPress: (index: number) => void;
  onHoverIn: (index: number) => void;
  onHoverOut: (index: number) => void;
  title: string;
}

function MenuItem(props: MenuItemProps) {
  const { icon, onPress, title, index, onHoverIn, onHoverOut } = props;

  const handleOnPress = React.useCallback(() => {
    onPress(index);
  }, [onPress, index]);

  const handleHoverIn = React.useCallback(() => {
    onHoverIn(index);
  }, [onHoverIn, index]);

  const handleHoverOut = React.useCallback(() => {
    onHoverOut(index);
  }, [onHoverOut, index]);

  return (
    <Pressable
      onPress={handleOnPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={[styles.menuItem]}
    >
      <Icon name={icon} size="lg" />
      <Spacing width={16} />
      <Text>{title}</Text>
    </Pressable>
  );
}

interface AddPageProps {
  onPress: () => void;
}

function AddPage(props: AddPageProps) {
  const { onPress } = props;

  return (
    <Button align="left" style={styles.add} onPress={onPress}>
      <Icon name="plus" size="lg" />
      <Spacing width={8} />
      <Text>Add page</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  add: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  selection: {
    position: 'absolute',
    height: 40,
    width: '100%',
    borderRadius: tokens.radius,
  },
  hovered: {
    backgroundColor: 'rgba(240, 240, 240, 1)',
  },
  menuItem: {
    borderRadius: tokens.radius,
    cursor: 'pointer',
    height: 40,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    // touchAction: 'manipulation',
  },
});
