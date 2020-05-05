import React from 'react';
import { Container, Text } from '../../components';

interface HoverableCommandsProps {}

const options = ['item-1', 'item-2', 'item-3'];

export function HoverableCommands(props: HoverableCommandsProps) {
  const {} = props;

  return (
    <Container>
      {options.map((opt) => {
        return (
          <Container flex={1} key={opt}>
            <Text>{opt}</Text>
          </Container>
        );
      })}
    </Container>
  );
}
