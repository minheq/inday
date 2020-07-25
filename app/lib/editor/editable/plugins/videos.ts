import { Transforms, Editor } from 'slate';
import { isURL } from '../../../../utils/is_url';
import { ReactEditor } from 'slate-react';
import { Video } from '../nodes/video';

export function withVideos<T extends ReactEditor>(editor: T): T & Editor {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'video' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (isVideoURL(text)) {
      insertVideo(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}

export function toVideo(url: string): Video {
  const text = { text: '' };

  let embedURL = url;

  if (isYouTubeURL(url)) {
    embedURL = transformYouTubeURL(url);
  }

  const video = { type: 'video' as const, url: embedURL, children: [text] };

  return video;
}

function insertVideo(editor: ReactEditor, url: string) {
  const video = toVideo(url);

  Transforms.insertNodes(editor, video);
}

const isVideoURL = (url: string) => {
  return isYouTubeURL(url);
};

function isYouTubeURL(url: string) {
  if (!isURL(url)) {
    return false;
  }

  return url.includes('youtube');
}

function transformYouTubeURL(youtubeURL: string) {
  const [, paramsString] = youtubeURL.split('?');
  const params = new URLSearchParams(paramsString);
  const id = params.get('v');
  const url = `https://www.youtube.com/embed/${id}`;

  return url;
}
