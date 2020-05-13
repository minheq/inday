import React from 'react';
import { Element } from './types';

export interface ElementProps {
  children: any;
  element: Element;
  attributes: {
    'data-slate-node': 'element';
    'data-slate-inline'?: true;
    'data-slate-void'?: true;
    dir?: 'rtl';
    ref: any;
  };
}

export function Element(props: ElementProps) {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading':
      return <h1 {...attributes}>{children}</h1>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}
