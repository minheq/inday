import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface NumberedList extends Element {
  type: 'numbered-list';
}

export function NumberedList(props: ElementProps<NumberedList>) {
  const { attributes, children } = props;

  return <ol {...attributes}>{children}</ol>;
}
