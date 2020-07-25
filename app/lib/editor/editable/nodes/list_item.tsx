import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface ListItem extends Element {
  type: 'list-item';
}

export function ListItem(props: ElementProps<ListItem>) {
  const { attributes, children } = props;

  return <li {...attributes}>{children}</li>;
}
