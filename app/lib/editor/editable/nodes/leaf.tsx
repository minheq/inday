import React from 'react';

export interface LeafProps {
  children: any;
  leaf: Leaf;
  attributes: {
    'data-slate-leaf': true;
  };
}

interface Leaf {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  strikethrough?: boolean;
}

export type Mark = keyof Leaf;

export function Leaf(props: LeafProps) {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code style={{ backgroundColor: 'grey' }}>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
}
