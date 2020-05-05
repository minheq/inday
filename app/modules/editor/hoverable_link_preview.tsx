import React from 'react';
import { Clipboard } from 'react-native';
import { Container, Row, Text, Button, Icon } from '../../components';

interface HoverableLinkPreviewProps {
  url: string;
  onOpenLinkEdit: () => void;
  onRemoveLink: () => void;
}

export function HoverableLinkPreview(props: HoverableLinkPreviewProps) {
  const { url, onOpenLinkEdit, onRemoveLink } = props;

  const handleCopy = React.useCallback(() => {
    Clipboard.setString(url);
  }, [url]);

  return (
    <Container>
      <Row>
        <Container flex={1} padding={8}>
          <Text decoration="underline">{url}</Text>
        </Container>
        <Button onPress={handleCopy}>
          <Icon name="copy" />
        </Button>
        <Button onPress={onOpenLinkEdit}>
          <Icon name="edit" />
        </Button>
        <Button onPress={onRemoveLink}>
          <Icon name="x-circle" />
        </Button>
      </Row>
    </Container>
  );
}
