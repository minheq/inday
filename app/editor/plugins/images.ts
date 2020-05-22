import { Transforms, Editor } from 'slate';
import { isUrl } from '../../utils/is_url';
import { imageExtensions } from '../../utils/image_extensions';
import { ReactEditor } from 'slate-react';

export function withImages<T extends ReactEditor>(editor: T): T & Editor {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const reader = new window.FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            if (url) {
              insertImage(
                editor,
                typeof url === 'string' ? url : arrayBufferToString(url),
              );
            }
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}

function arrayBufferToString(buf: ArrayBuffer) {
  return String.fromCharCode(convertArrayBufferToNumber(buf));
}

function convertArrayBufferToNumber(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const dv = new DataView(bytes.buffer);
  return dv.getUint16(0, true);
}

const insertImage = (editor: ReactEditor, url: string) => {
  const text = { text: '' };
  const image = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const isImageUrl = (url: string) => {
  if (!url) {
    return false;
  }
  if (!isUrl(url)) {
    return false;
  }
  const ext = new URL(url).pathname.split('.').pop();
  if (!ext) {
    return false;
  }
  return imageExtensions.includes(ext);
};
