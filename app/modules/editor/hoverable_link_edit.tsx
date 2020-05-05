import React from 'react';
import { Container, Text, Spacing, TextInput, Button } from '../../components';
import { LinkValue } from './types';

interface HoverableLinkEditProps {
  initialValue: LinkValue;
  onSubmit: (link: LinkValue) => void;
}

export function HoverableLinkEdit(props: HoverableLinkEditProps) {
  const { onSubmit, initialValue } = props;

  const [text, setText] = React.useState(initialValue.text);
  const [url, setURL] = React.useState(initialValue.url);

  const handleSubmit = React.useCallback(() => {
    onSubmit({ text: text || url, url });
  }, [text, url, onSubmit]);

  let focus: 'text' | 'url' = 'text';

  if (!url && !text) {
    focus = 'text';
  } else if (url && text) {
    focus = 'text';
  } else if (text && !url) {
    focus = 'url';
  }

  return (
    <Container width={320}>
      <Spacing height={16} />
      <Text>Text</Text>
      <TextInput
        autoFocus={focus === 'text'}
        value={text}
        onValueChange={setText}
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
