import React, { useState } from 'react';

import { ContextMenu } from './context_menu';
import { Container } from './container';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <ContextMenu options={[{ label: 'Item 1' }, { label: 'Item 2' }]}>
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
