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
} from '../components';
import { useTheme, tokens } from '../theme';

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
  { icon: 'list', title: 'Timeline' },
  { icon: 'list', title: 'Inbox' },
  { icon: 'list', title: 'List' },
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
          {
            opacity: hoverOpacity,
            backgroundColor: theme.container.color.hover,
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
      <Icon name={icon} />
      <Spacing width={8} />
      <Text>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selection: {
    position: 'absolute',
    height: 40,
    width: '100%',
    borderRadius: tokens.radius,
  },
  menuItem: {
    borderRadius: tokens.radius,
    cursor: 'pointer',
    height: 40,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    touchAction: 'manipulation',
  },
});
