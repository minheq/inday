import React, { useCallback } from 'react';

import { TextLink } from './text_link';

interface EmailLinkProps {
  email: string;
  text: string;
}

export function EmailLink(props: EmailLinkProps): JSX.Element {
  const { text, email } = props;

  const handlePress = useCallback(() => {
    console.log('send email', email);
  }, [email]);

  return <TextLink text={text} onPress={handlePress} />;
}
