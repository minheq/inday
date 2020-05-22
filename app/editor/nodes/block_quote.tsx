import React from 'react';
import { Element } from 'slate';

import { ElementProps } from './types';

export interface Blockquote extends Element {
  type: 'block-quote';
}

export function Blockquote(props: ElementProps<Blockquote>) {
  const { attributes, children } = props;

  return (
    <blockquote style={{ color: 'grey' }} {...attributes}>
      {children}
    </blockquote>
  );
}
