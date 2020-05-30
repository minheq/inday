import React from 'react';
import { Element } from 'slate';
import { useSelected, useFocused, useSlate, ReactEditor } from 'slate-react';

import { ElementProps } from './types';
import { css } from '../../../utils/css';
import { useEditable } from '../provider';

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
  const { onSelectLink } = useEditable();
  const selected = useSelected();
  const focused = useFocused();

  const handleMouseDown = React.useCallback(() => {
    onSelectLink({ url: element.url, display: element.display });
  }, [onSelectLink, element]);

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={styles('anchor', selected && focused && 'selected')}
      onMouseDown={handleMouseDown}
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
