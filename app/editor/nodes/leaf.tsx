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

  return <span {...attributes}>{children}</span>;
}

// const DECORATION_SHORTCUTS: {
//   [key: string]: { prefix: RegExp; decoration: Decoration }[];
// } = {
//   '`': [
//     {
//       prefix: /`[^`]*/,
//       decoration: 'code',
//     },
//   ],
//   '*': [
//     {
//       prefix: /(^|\s)[*][^*]+$/,
//       decoration: 'italic',
//     },
//     {
//       prefix: /(^|\s)[*]{2}[^*]+[*]$/,
//       decoration: 'bold',
//     },
//   ],
//   _: [
//     {
//       prefix: /(^|\s)[_][^_]+$/,
//       decoration: 'italic',
//     },
//     {
//       prefix: /(^|\s)[_]{2}[^_]+[_]$/,
//       decoration: 'bold',
//     },
//   ],
//   '~': [
//     {
//       prefix: /(^|\s)~{2}[^~]+~$/,
//       decoration: 'strikethrough',
//     },
//   ],
// };
