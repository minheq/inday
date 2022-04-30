import React from "react";
import { Pressable } from "react-native";
import { Text } from "./text";

interface TextLinkProps {
  text: string;
  onPress?: () => void;
}

export function TextLink(props: TextLinkProps): JSX.Element {
  const { onPress, text } = props;

  return (
    <Pressable onPress={onPress}>
      <Text decoration="underline" color="primary">
        {text}
      </Text>
    </Pressable>
  );
}
