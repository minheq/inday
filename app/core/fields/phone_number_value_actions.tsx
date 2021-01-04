import React, { useCallback } from 'react';
import { Row } from '../../components/row';
import { TextLink } from '../../components/text_link';
import { PhoneNumberFieldValue } from '../../../models/fields';

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
      <TextLink onPress={handlePress}>Call</TextLink>
    </Row>
  );
}
