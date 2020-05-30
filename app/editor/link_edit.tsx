import React from 'react';

import { Container, Text, Spacing, TextInput, Button } from '../components';
import { LinkValue } from './editable/nodes/link';

interface LinkEditProps {
  initialValue: LinkValue;
  onSubmit: (link: LinkValue) => void;
}

export function LinkEdit(props: LinkEditProps) {
  const { onSubmit, initialValue } = props;

  const [display, setDisplay] = React.useState(initialValue.display);
  const [url, setURL] = React.useState(initialValue.url);

  const handleSubmit = React.useCallback(() => {
    onSubmit({ display: display || url, url });
  }, [display, url, onSubmit]);

  let focus: 'display' | 'url' = 'display';

  if (!url && !display) {
    focus = 'display';
  } else if (url && display) {
    focus = 'display';
  } else if (display && !url) {
    focus = 'url';
  }

  return (
    <Container>
      <Text>Display</Text>
      <TextInput
        autoFocus={focus === 'display'}
        value={display}
        onValueChange={setDisplay}
      />
      <Spacing height={16} />
      <Text>URL</Text>
      <TextInput
        autoFocus={focus === 'url'}
        value={url}
        onValueChange={setURL}
      />
      <Spacing height={24} />
      <Button onPress={handleSubmit}>
        <Text>Submit</Text>
      </Button>
    </Container>
  );
}
