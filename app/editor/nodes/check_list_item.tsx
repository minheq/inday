import React from 'react';
import { useEditor, useReadOnly, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { Element } from 'slate';
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

  return (
    <div
      {...attributes}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <span
        contentEditable={false}
        style={{
          marginRight: '0.75em',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            Transforms.setNodes(
              editor,
              { checked: event.target.checked },
              { at: path },
            );
          }}
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          flex: 1,
          opacity: checked ? 0.666 : 1,
          textDecoration: checked ? 'none' : 'line-through',
        }}
      >
        {children}
      </span>
    </div>
  );
}
