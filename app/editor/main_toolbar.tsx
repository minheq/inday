import React from 'react';

import { Container, Row, Pressable, IconName, Icon } from '../components';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export function MainToolbar() {
  return (
    <Container borderBottomWidth={1}>
      <Row>
        <Button icon="plus" label="Insert" />
        <Button icon="layers" label="Format" />
        <Button icon="link" label="Link" />
        <Button icon="flag" label="Tag" />
        <Button icon="user" label="Mention" />
      </Row>
    </Container>
  );
}

interface ButtonProps {
  icon: IconName;
  label: string;
}

function Button(props: ButtonProps) {
  const { icon } = props;
  const theme = useTheme();

  return (
    <Pressable
      style={[styles.button, { borderColor: theme.border.color.default }]}
    >
      <Icon name={icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
});
