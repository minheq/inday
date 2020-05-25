import React from 'react';
import { BlockType } from './element';
import { Editor, Transforms } from 'slate';

interface UseBlockHandlersProps {
  onSetBlock: (value: BlockType) => void;
}

export function getBlockType(editor: Editor): BlockType | null {
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });

  if (!block) {
    return null;
  }

  return block[0].type as BlockType;
}

export function isBlockActive(editor: Editor, blockType: BlockType) {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === blockType,
  });

  return !!match;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const BLOCKS: { [key: string]: true } = {
  paragraph: true,
  'bulleted-list': true,
  'numbered-list': true,
  'list-item': true,
  'block-quote': true,
  'code-block': true,
  divider: true,
  'check-list-item': true,
  'heading-one': true,
  'heading-two': true,
  'heading-three': true,
  image: true,
};

export function isBlock(format: string): format is BlockType {
  if (BLOCKS[format]) {
    return true;
  }

  return false;
}

export function toggleBlock(editor: Editor, blockType: BlockType) {
  const isActive = isBlockActive(editor, blockType);
  const isList = LIST_TYPES.includes(blockType);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : blockType,
  });

  if (!isActive && isList) {
    const block = { type: blockType, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export function useBlockHandlers(props: UseBlockHandlersProps) {
  const { onSetBlock } = props;

  const handleFormatText = React.useCallback(() => {
    onSetBlock('paragraph');
  }, [onSetBlock]);

  const handleFormatHeading1 = React.useCallback(() => {
    onSetBlock('heading-one');
  }, [onSetBlock]);

  const handleFormatHeading2 = React.useCallback(() => {
    onSetBlock('heading-two');
  }, [onSetBlock]);

  const handleFormatHeading3 = React.useCallback(() => {
    onSetBlock('heading-three');
  }, [onSetBlock]);

  const handleFormatBulletedList = React.useCallback(() => {
    onSetBlock('bulleted-list');
  }, [onSetBlock]);

  const handleFormatNumberedList = React.useCallback(() => {
    onSetBlock('numbered-list');
  }, [onSetBlock]);

  const handleFormatBlockquote = React.useCallback(() => {
    onSetBlock('block-quote');
  }, [onSetBlock]);

  const handleFormatCodeBlock = React.useCallback(() => {
    onSetBlock('code-block');
  }, [onSetBlock]);

  return {
    handleFormatText,
    handleFormatHeading1,
    handleFormatHeading2,
    handleFormatHeading3,
    handleFormatBulletedList,
    handleFormatNumberedList,
    handleFormatBlockquote,
    handleFormatCodeBlock,
  };
}

// const labels = {
//   text: 'Text',
//   title: 'Title',
//   heading: 'Heading',
//   subheading: 'Subheading',
//   bulletedList: 'Bulleted list',
//   numberedList: 'Numbered list',
//   code: 'Code',
//   quote: 'Quote',
// };

// let activeLabel = labels.text;

// if (activeBlock === 'heading-one') {
//   activeLabel = labels.title;
// } else if (activeBlock === 'heading-two') {
//   activeLabel = labels.heading;
// } else if (activeBlock === 'heading-three') {
//   activeLabel = labels.subheading;
// } else if (activeBlock === 'bulleted-list') {
//   activeLabel = labels.bulletedList;
// } else if (activeBlock === 'numbered-list') {
//   activeLabel = labels.numberedList;
// } else if (activeBlock === 'code-block') {
//   activeLabel = labels.code;
// } else if (activeBlock === 'block-quote') {
//   activeLabel = labels.quote;
// }
