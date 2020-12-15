import React, { useState } from 'react';

import { ContextMenu } from './context_menu';
import { Container } from './container';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <ContextMenu
      contentHeight={200}
      content={
        <Container color="primary" height={200} width={200}>
          <Text>Context menu!</Text>
        </Container>
      }
    >
      <Container>
        <Text>Right click on this</Text>
      </Container>
    </ContextMenu>
  );
}

export function ContextMenuStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
