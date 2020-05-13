import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';

export interface Link extends Element {
  type: 'link';
  url: string;
}

export interface RenderLinkProps extends ElementProps<Link> {}

export function Link(props: RenderLinkProps) {
  const { attributes, children, element } = props;
  const { url } = element;

  return (
    <a {...attributes} href={url}>
      {children}
    </a>
  );
}
