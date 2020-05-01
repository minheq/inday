import Delta from 'quill-delta';

interface MessageShape {
  source: string;
  data: Delta;
}

export function deserializeMessage(message: string): Delta {
  let parsedMessage: MessageShape;

  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    throw new Error('Failed to parse JSON');
  }

  if (parsedMessage.source !== 'editor') {
    throw new Error('Message source not from editor');
  }

  return parsedMessage.data;
}
