import React from 'react';
import { Text } from './types';

export interface LeafProps {
  children: any;
  leaf: Text;
  attributes: {
    'data-slate-leaf': true;
  };
}

export function Leaf(props: LeafProps) {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  return <span {...attributes}>{children}</span>;
}
