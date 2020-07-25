import { isURL } from '../../../../utils/is_url';
import { ReactEditor } from 'slate-react';
import { wrapLink } from './handlers';

export function withLinks<T extends ReactEditor>(editor: T): T & ReactEditor {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'link' ? true : isVoid(element);
  };

  editor.insertText = (text) => {
    if (text && isURL(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isURL(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}
