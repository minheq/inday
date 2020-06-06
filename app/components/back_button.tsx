import React from 'react';
import { Icon } from './icon';
import { Button } from './button';
import { Container } from './container';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton(props: BackButtonProps) {
  const { onPress } = props;

  return (
    <Button onPress={onPress}>
      <Container center width={40} height={40}>
        <Icon name="arrow-left" size="xl" />
      </Container>
    </Button>
  );
}
