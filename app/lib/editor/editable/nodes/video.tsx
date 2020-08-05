import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';
import { css } from '../../../css/css';
import { useSelected } from 'slate-react';

export interface Video extends Element {
  type: 'video';
  url: string;
}

export function Video(props: ElementProps<Video>) {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const { url } = element;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div style={styles('wrapper')}>
          <iframe
            src={url}
            frameBorder="0"
            style={styles('frame', selected && 'selected')}
          />
        </div>
      </div>
      {children}
    </div>
  );
}

const styles = css.create({
  wrapper: {
    padding: '75% 0 0 0',
    position: 'relative',
  },
  frame: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },
  selected: {
    boxShadow: '0 0 0 3px #B4D5FF',
  },
});
