import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface CodeBlock extends Element {
  type: 'code-block';
}

export function CodeBlock(props: ElementProps<CodeBlock>) {
  const { attributes, children } = props;

  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
}
