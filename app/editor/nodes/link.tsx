import React from 'react';

import { Element, Transforms, Node, Editor } from 'slate';
import { ElementProps } from './types';
import { useSelected, useFocused, useSlate, ReactEditor } from 'slate-react';
import { useToggle } from '../../hooks/use_toggle';
import { useLinkEdit } from '../link_edit';
import { removeLink } from '../plugins/links';
import { css } from '../../utils/css';

export interface Link extends Element {
  type: 'link';
  url: string;
  display: string;
}

export interface RenderLinkProps extends ElementProps<Link> {}

export function Link(props: RenderLinkProps) {
  const { attributes, children, element } = props;
  const { url, display } = element;
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const { onOpenLinkEdit } = useLinkEdit();
  const [isOpen, { toggle, setFalse }] = useToggle();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      toggle();
    },
    [toggle],
  );

  const handleOpenLinkEdit = React.useCallback(() => {
    onOpenLinkEdit({ url, display });
  }, [onOpenLinkEdit, url, display]);

  const handleRemoveLink = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();
      setFalse();
      removeLink(editor);
    },
    [editor, setFalse],
  );

  return (
    <span {...attributes} contentEditable={false} style={styles('root')}>
      <a
        style={styles('anchor', selected && focused && 'selected')}
        href={url}
        onClick={handleClick}
      >
        {display}
      </a>
      {isOpen && (
        <span style={styles('popover')}>
          <span>{url}</span>
          <span onMouseDown={handleOpenLinkEdit}>
            <span>Edit</span>
          </span>
          <span onMouseDown={handleRemoveLink}>
            <span>Unlink</span>
          </span>
        </span>
      )}
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
  },
  selected: {
    backgroundColor: 'grey',
  },
  popover: {
    display: 'flex',
    flexDirection: 'column',
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
});
