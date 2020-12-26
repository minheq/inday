import React, { useCallback } from 'react';
import { Row } from '../../components/row';
import { TextLink } from '../../components/text_link';
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
      <TextLink onPress={handlePress}>Open link</TextLink>
    </Row>
  );
}
