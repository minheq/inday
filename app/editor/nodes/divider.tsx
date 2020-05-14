import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface Divider extends Element {
  type: 'divider';
  void: true;
}

export function Divider(props: ElementProps<Divider>) {
  const { attributes } = props;

  return <hr {...attributes} />;
}
