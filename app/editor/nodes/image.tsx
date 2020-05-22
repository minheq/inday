import React from 'react';

import { Element } from 'slate';
import { ElementProps } from './types';
import { useSelected, useFocused } from 'slate-react';

export interface Image extends Element {
  type: 'image';
  url: string;
  caption?: string;
}

export function Image(props: ElementProps<Image>) {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20em',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
      </div>
      {children}
    </div>
  );
}
