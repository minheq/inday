import React from 'react';

import { Element, Transforms, Range, Path } from 'slate';
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

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();
      toggle();
      ReactEditor.focus(editor);
    },
    [toggle, editor],
  );

  // Prevents closing the popover
  const handleMouseDownPopover = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();
    },
    [],
  );

  const handleMouseUp = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();
    },
    [],
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

  React.useEffect(() => {
    if (!selected) {
      setFalse();
    }
  }, [selected, setFalse]);

  return (
    <span {...attributes} contentEditable={false} style={styles('root')}>
      <span
        style={styles('anchor', selected && focused && 'selected')}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {display}
      </span>
      {isOpen && (
        <span onMouseDown={handleMouseDownPopover} style={styles('popover')}>
          <span>{url}</span>
          <a href={url} target="_blank">
            Open link
          </a>
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
    color: 'blue',
    cursor: 'pointer',
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
