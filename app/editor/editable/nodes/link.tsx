import React from 'react';
import { Element } from 'slate';
import { useSelected } from 'slate-react';

import { ElementProps } from './types';
import { css } from '../../../utils/css';

export interface LinkValue {
  display: string;
  url: string;
}

export interface Link extends Element, LinkValue {
  type: 'link';
}

export interface RenderLinkProps extends ElementProps<Link> {}

export function Link(props: RenderLinkProps) {
  const { attributes, children, element } = props;
  const { display } = element;
  const selected = useSelected();

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={styles('anchor', selected && 'selected')}
    >
      {display}
      {children}
    </span>
  );
}

const styles = css.create({
  anchor: {
    color: 'blue',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: 'grey',
  },
});
