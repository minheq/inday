import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { Text } from '../../components/text';
import { EmailFieldValue } from '../../data/fields';

interface EmailValueActionsProps {
  value: EmailFieldValue;
}
export function EmailValueActions(props: EmailValueActionsProps): JSX.Element {
  const { value } = props;

  const handlePress = useCallback(() => {
    console.log('send email', value);
  }, [value]);

  return (
    <Pressable onPress={handlePress}>
      <Text decoration="underline" size="sm" color="primary">
        Send email
      </Text>
    </Pressable>
  );
}
