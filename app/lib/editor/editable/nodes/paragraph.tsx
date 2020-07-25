import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface Paragraph extends Element {
  type: 'paragraph';
}

export function Paragraph(props: ElementProps<Paragraph>) {
  const { attributes, children } = props;

  return <p {...attributes}>{children}</p>;
}
