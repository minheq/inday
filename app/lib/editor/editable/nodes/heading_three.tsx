import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface HeadingThree extends Element {
  type: 'heading-three';
}

export function HeadingThree(props: ElementProps<HeadingThree>) {
  const { attributes, children } = props;

  return <h3 {...attributes}>{children}</h3>;
}
