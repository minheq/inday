import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface BulletedList extends Element {
  type: 'bulleted-list';
}

export function BulletedList(props: ElementProps<BulletedList>) {
  const { attributes, children } = props;

  return <ul {...attributes}>{children}</ul>;
}
