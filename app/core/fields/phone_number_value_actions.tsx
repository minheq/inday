import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { Row } from '../../components/row';
import { Text } from '../../components/text';
import { PhoneNumberFieldValue } from '../../data/fields';

interface PhoneNumberValueActionsProps {
  value: PhoneNumberFieldValue;
}
export function PhoneNumberValueActions(
  props: PhoneNumberValueActionsProps,
): JSX.Element {
  const { value } = props;

  const handlePress = useCallback(() => {
    console.log('send email', value);
  }, [value]);

  return (
    <Row>
      <Pressable onPress={handlePress}>
        <Text decoration="underline" size="sm" color="primary">
          Call
        </Text>
      </Pressable>
    </Row>
  );
}
