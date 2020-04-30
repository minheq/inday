import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import {
  Text,
  Container,
  SearchInput,
  Spacing,
  IconName,
  Icon,
  Column,
} from '../components';
import { Hoverable } from '../components/hoverable';
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

function Menu() {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const hoverY = React.useRef(new Animated.Value(0)).current;
  const hoverOpacity = React.useRef(new Animated.Value(0)).current;
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
      setSelectedIndex(index);
    },
    [setSelectedIndex],
  );

  const menuItems: MenuItemData[] = [
    { icon: 'list', title: 'Timeline' },
    { icon: 'list', title: 'Inbox' },
    { icon: 'list', title: 'List' },
  ];

  return (
    <Column>
      <Animated.View
        style={[
          styles.hover,
          {
            opacity: hoverOpacity,
            backgroundColor: theme.container.color.hover,
            transform: [{ translateY: hoverY }],
          },
        ]}
      />
      {menuItems.map((item, index) => (
        <MenuItem
          isSelected={index === selectedIndex}
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
  isSelected: boolean;
  icon: IconName;
  onPress: (index: number) => void;
  onHoverIn: (index: number) => void;
  onHoverOut: (index: number) => void;
  title: string;
}

function MenuItem(props: MenuItemProps) {
  const {
    icon,
    onPress,
    title,
    index,
    onHoverIn,
    onHoverOut,
    isSelected,
  } = props;
  const theme = useTheme();

  const handleHoverIn = React.useCallback(() => {
    if (isSelected === false) {
      onHoverIn(index);
    }
  }, [onHoverIn, index, isSelected]);

  const handleHoverOut = React.useCallback(() => {
    onHoverOut(index);
  }, [onHoverOut, index]);

  const handleOnPress = React.useCallback(() => {
    onPress(index);
  }, [onPress, index]);

  return (
    <Hoverable onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
      <TouchableOpacity onPress={handleOnPress} disabled={isSelected}>
        <View
          style={[
            styles.menuItem,
            isSelected && theme.container.shadow,
            {
              backgroundColor: isSelected
                ? theme.container.color.content
                : theme.container.color.default,
            },
          ]}
        >
          <Icon name={icon} />
          <Spacing width={8} />
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    </Hoverable>
  );
}

const styles = StyleSheet.create({
  menu: {},
  hover: {
    position: 'absolute',
    height: 40,
    width: '100%',
    borderRadius: tokens.radius,
  },
  menuItem: {
    height: 40,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
});
