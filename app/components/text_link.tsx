import React from 'react';
import { Pressable } from 'react-native';
import { Text } from './text';

interface TextLinkProps {
  children: React.ReactText;
  onPress?: () => void;
}

export function TextLink(props: TextLinkProps): JSX.Element {
  const { onPress, children } = props;

  return (
    <Pressable onPress={onPress}>
      <Text decoration="underline" color="primary">
        {children}
      </Text>
    </Pressable>
  );
}
