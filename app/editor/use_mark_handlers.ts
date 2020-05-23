import React from 'react';
import { Mark } from './nodes/leaf';
import { Editor } from 'slate';

const MARKS: { [key: string]: true } = {
  bold: true,
  italic: true,
  code: true,
  strikethrough: true,
};

export function isMark(format: string): format is Mark {
  if (MARKS[format]) {
    return true;
  }

  return false;
}

export function isMarkActive(editor: Editor, mark: Mark) {
  const marks = Editor.marks(editor);
  return marks ? marks[mark] === true : false;
}

export function toggleMark(editor: Editor, mark: Mark) {
  const isActive = isMarkActive(editor, mark);

  if (isActive) {
    Editor.removeMark(editor, mark);
  } else {
    Editor.addMark(editor, mark, true);
  }
}

interface UseMarkHandlersProps {
  onToggleMark: (mark: Mark) => void;
}

export function useMarkHandlers(props: UseMarkHandlersProps) {
  const { onToggleMark } = props;

  const handleFormatBold = React.useCallback(() => {
    onToggleMark('bold');
  }, [onToggleMark]);

  const handleFormatItalic = React.useCallback(() => {
    onToggleMark('italic');
  }, [onToggleMark]);

  const handleFormatStrikethrough = React.useCallback(() => {
    onToggleMark('strikethrough');
  }, [onToggleMark]);

  const handleFormatCode = React.useCallback(() => {
    onToggleMark('code');
  }, [onToggleMark]);

  return {
    handleFormatBold,
    handleFormatItalic,
    handleFormatStrikethrough,
    handleFormatCode,
  };
}
