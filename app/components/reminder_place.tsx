import React from 'react';
import { Container } from './container';
import { Pressable } from './pressable';
import { Text } from './text';

export interface ReminderPlace {
  lat: number;
  lng: number;
  radius: number;
  when: 'leaving' | 'arriving';
}

interface ReminderPlaceProps {}

export function ReminderPlace(props: ReminderPlaceProps) {
  return (
    <Container>
      <Pressable>
        <Text>Pick place</Text>
      </Pressable>
    </Container>
  );
}
