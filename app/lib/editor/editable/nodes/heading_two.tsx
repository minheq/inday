import React from 'react';
import { Element } from 'slate';

import { ElementProps } from './types';

export interface HeadingTwo extends Element {
  type: 'heading-two';
}

export function HeadingTwo(props: ElementProps<HeadingTwo>) {
  const { attributes, children } = props;

  return <h2 {...attributes}>{children}</h2>;
}
