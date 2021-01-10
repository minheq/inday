import React, { useCallback } from 'react';

import { TextLink } from './text_link';

interface PhoneNumberLinkProps {
  phoneNumber: string;
  text: string;
}

export function PhoneNumberLink(props: PhoneNumberLinkProps): JSX.Element {
  const { text, phoneNumber } = props;

  const handlePress = useCallback(() => {
    console.log('send phoneNumber', phoneNumber);
  }, [phoneNumber]);

  return <TextLink text={text} onPress={handlePress} />;
}
