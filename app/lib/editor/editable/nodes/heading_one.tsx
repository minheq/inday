import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface HeadingOne extends Element {
  type: 'heading-one';
}

export function HeadingOne(props: ElementProps<HeadingOne>) {
  const { attributes, children } = props;

  return <h1 {...attributes}>{children}</h1>;
}
