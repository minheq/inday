import React from 'react';
import { Element } from 'slate';
import { useSelected, useFocused, useSlate, ReactEditor } from 'slate-react';

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
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();
      ReactEditor.focus(editor);
    },
    [editor],
  );

  const handleMouseUp = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();
    },
    [],
  );

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={styles('anchor', selected && focused && 'selected')}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {display}
      {children}
    </span>
  );
}

const styles = css.create({
  root: {
    position: 'relative',
  },
  anchor: {
    textDecoration: 'none',
    color: 'blue',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: 'grey',
  },
});
