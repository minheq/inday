import React from 'react';

import { Container, Row, Pressable, Icon, IconName } from '../components';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export function SelectionToolbar() {
  return (
    <Container height={24} borderWidth={1}>
      <Row>
        <Button icon="bold" />
        <Button icon="italic" />
        <Button icon="strikethrough" />
        <Button icon="code" />
      </Row>
    </Container>
  );
}

interface ButtonProps {
  icon: IconName;
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
