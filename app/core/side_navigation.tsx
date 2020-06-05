import React from 'react';
import { ScrollView, Animated, StyleSheet } from 'react-native';

import { Text, Container, Spacing, Icon, Pressable, Row } from '../components';
import { useTheme, tokens } from '../theme';

export function SideNavigation() {
  const theme = useTheme();
  return (
    <Container
      expanded
      width={320}
      borderRightWidth={1}
      borderColor={theme.border.color.default}
    >
      <NavigationMenu />
    </Container>
  );
}

export function NavigationMenu() {
  return (
    <ScrollView>
      <Container padding={16}>
        <HomeMenuItem />
      </Container>
    </ScrollView>
  );
}

interface MenuItemProps {}

function HomeMenuItem() {
  const theme = useTheme();
  const background = React.useRef(new Animated.Value(0)).current;
  return (
    <Pressable
      style={({ pressed, hovered }) => {
        Animated.spring(background, {
          toValue: pressed ? 1 : hovered ? 0.5 : 0,
          useNativeDriver: false,
          bounciness: 0,
          speed: 100,
        }).start();

        return [
          styles.base,
          {
            backgroundColor: background.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                theme.button.flat.backgroundDefault,
                theme.button.flat.backgroundHovered,
                theme.button.flat.backgroundPressed,
              ],
            }),
          },
        ];
      }}
    >
      <Row alignItems="center">
        <Icon name="home" size="lg" />
        <Spacing width={16} />
        <Text bold>Home</Text>
      </Row>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    paddingHorizontal: 8,
    flexDirection: 'row',
    borderRadius: tokens.radius,
    alignItems: 'center',
  },
});
