import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';
import { css } from '../../../../utils/css';

export interface WebBookmark extends Element {
  type: 'web-bookmark';
  url: string;
  title?: string;
  description?: string;
  imageURL?: string;
}

export function WebBookmark(props: ElementProps<WebBookmark>) {
  const { attributes, children, element } = props;
  const { url, title, description, imageURL } = element;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        {title && description && imageURL ? (
          <div>
            <img src={imageURL} />
            {url}
            <span style={styles('title')}>{title}</span>
            <span>{description}</span>
          </div>
        ) : (
          <div>
            <span>{url}</span>
            <span>URL metadata is being fetched.</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

const styles = css.create({
  title: {
    fontSize: 16,
  },
});
