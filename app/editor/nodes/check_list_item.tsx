import React from 'react';
import { useEditor, useReadOnly, ReactEditor } from 'slate-react';
import { Transforms, Element } from 'slate';

import { ElementProps } from './types';

export interface CheckListItem extends Element {
  type: 'check-list-item';
  checked: boolean;
}

export function CheckListItem(props: ElementProps<CheckListItem>) {
  const { attributes, children, element } = props;
  const editor = useEditor();
  const readOnly = useReadOnly();
  const { checked } = element;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { checked: event.target.checked },
        { at: path },
      );
    },
    [editor, element],
  );

  return (
    <div {...attributes} style={styles.base}>
      <span
        contentEditable={false}
        style={{
          marginRight: '0.75em',
        }}
      >
        <input type="checkbox" checked={checked} onChange={handleChange} />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          flex: 1,
          opacity: checked ? 0.666 : 1,
          textDecoration: !checked ? 'none' : 'line-through',
        }}
      >
        {children}
      </span>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};
