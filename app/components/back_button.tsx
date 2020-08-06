import React from 'react';
import { StyleSheet } from 'react-native';

import { Icon } from './icon';
import { Container } from './container';
import { Pressable } from './pressable';
import { tokens } from './theme';
import { Row } from './row';
import { Spacer } from './spacer';
import { Text } from './text';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton(props: BackButtonProps) {
  const { onPress } = props;

  return (
    <Pressable style={styles.base} onPress={onPress}>
      <Container center height={32} paddingRight={4}>
        <Row expanded alignItems="center">
          <Icon name="chevron-left" size="lg" />
          <Spacer size={2} />
          <Text>Back</Text>
        </Row>
      </Container>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius,
  },
});
