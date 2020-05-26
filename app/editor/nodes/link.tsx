import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';
import { useSelected, useFocused } from 'slate-react';
import { useToggle } from '../../hooks/use_toggle';

export interface Link extends Element {
  type: 'link';
  url: string;
  display: string;
}

export interface RenderLinkProps extends ElementProps<Link> {}

export function Link(props: RenderLinkProps) {
  const { attributes, children, element } = props;
  const { url, display } = element;
  const selected = useSelected();
  const focused = useFocused();
  const [isOpen, { toggle }] = useToggle();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      toggle();
    },
    [toggle],
  );

  return (
    <a
      {...attributes}
      style={styles.anchor}
      contentEditable={false}
      href={url}
      onClick={handleClick}
    >
      {display}
      {isOpen && (
        <span style={styles.popover}>
          <span>{url}</span>
        </span>
      )}
      {children}
    </a>
  );
}

const styles = {
  anchor: {
    position: 'relative',
  },
  popover: {
    padding: 16,
    backgroundColor: 'white',
    position: 'absolute',
    left: '50%',
    top: '100%',
    transform: 'translateX(-50%)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
};
