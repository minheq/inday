import React, { useCallback } from 'react';

import { TextLink } from '../../components/text_link';
import { EmailFieldValue } from '../../data/fields';

interface EmailValueActionsProps {
  value: EmailFieldValue;
}
export function EmailValueActions(props: EmailValueActionsProps): JSX.Element {
  const { value } = props;

  const handlePress = useCallback(() => {
    console.log('send email', value);
  }, [value]);

  return <TextLink onPress={handlePress}>Send email</TextLink>;
}
