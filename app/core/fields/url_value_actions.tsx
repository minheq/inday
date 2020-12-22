import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { Row } from '../../components/row';
import { Text } from '../../components/text';
import { URLFieldValue } from '../../data/fields';

interface URLValueActionsProps {
  value: URLFieldValue;
}
export function URLValueActions(props: URLValueActionsProps): JSX.Element {
  const { value } = props;

  const handlePress = useCallback(() => {
    console.log('send email', value);
  }, [value]);

  return (
    <Row>
      <Pressable onPress={handlePress}>
        <Text decoration="underline" size="sm" color="primary">
          Open link
        </Text>
      </Pressable>
    </Row>
  );
}
