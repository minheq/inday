import React from 'react';
import { Formats, HeadingSize, ListType } from './types';

interface UseTextFormattingHandlersProps {
  formats: Formats;
  onFormatBold: (value: boolean) => void;
  onFormatItalic: (value: boolean) => void;
  onFormatStrike: (value: boolean) => void;
  onFormatHeading: (value: HeadingSize | false) => void;
  onFormatCode: (value: boolean) => void;
  onFormatList: (value: ListType | false) => void;
  onFormatBlockquote: (value: boolean) => void;
  onFormatCodeBlock: (value: boolean) => void;
}

export function useTextFormattingHandlers(
  props: UseTextFormattingHandlersProps,
) {
  const {
    formats,
    onFormatBold,
    onFormatItalic,
    onFormatStrike,
    onFormatHeading,
    onFormatCode,
    onFormatList,
    onFormatBlockquote,
    onFormatCodeBlock,
  } = props;

  const handleFormatText = React.useCallback(() => {
    if (formats.header === 1) {
      onFormatHeading(false);
    } else if (formats.header === 2) {
      onFormatHeading(false);
    } else if (formats.header === 3) {
      onFormatHeading(false);
    } else if (formats.list === 'bullet') {
      onFormatList(false);
    } else if (formats.list === 'ordered') {
      onFormatList(false);
    } else if (formats.code) {
      onFormatCodeBlock(false);
    } else if (formats.blockquote) {
      onFormatBlockquote(false);
    }
  }, [
    formats,
    onFormatHeading,
    onFormatList,
    onFormatCodeBlock,
    onFormatBlockquote,
  ]);

  const handleFormatBold = React.useCallback(() => {
    onFormatBold(!formats.bold);
  }, [onFormatBold, formats.bold]);

  const handleFormatItalic = React.useCallback(() => {
    onFormatItalic(!formats.italic);
  }, [onFormatItalic, formats.italic]);

  const handleFormatStrike = React.useCallback(() => {
    onFormatStrike(!formats.strike);
  }, [onFormatStrike, formats.strike]);

  const handleFormatCode = React.useCallback(() => {
    onFormatCode(!formats.code);
  }, [onFormatCode, formats.code]);

  const handleFormatHeading1 = React.useCallback(() => {
    onFormatHeading(1);
  }, [onFormatHeading]);

  const handleFormatHeading2 = React.useCallback(() => {
    onFormatHeading(2);
  }, [onFormatHeading]);

  const handleFormatHeading3 = React.useCallback(() => {
    onFormatHeading(3);
  }, [onFormatHeading]);

  const handleFormatBulletList = React.useCallback(() => {
    onFormatList('bullet');
  }, [onFormatList]);

  const handleFormatNumberedList = React.useCallback(() => {
    onFormatList('ordered');
  }, [onFormatList]);

  const handleFormatCodeBlock = React.useCallback(() => {
    onFormatCodeBlock(true);
  }, [onFormatCodeBlock]);

  const handleFormatBlockquote = React.useCallback(() => {
    onFormatBlockquote(true);
  }, [onFormatBlockquote]);

  const labels = {
    text: 'Text',
    title: 'Title',
    heading: 'Heading',
    subheading: 'Subheading',
    bulletedList: 'Bulleted list',
    numberedList: 'Numbered list',
    code: 'Code',
    quote: 'Quote',
  };

  let activeLabel = labels.text;

  if (formats.header === 1) {
    activeLabel = labels.title;
  } else if (formats.header === 2) {
    activeLabel = labels.heading;
  } else if (formats.header === 3) {
    activeLabel = labels.subheading;
  } else if (formats.list === 'bullet') {
    activeLabel = labels.bulletedList;
  } else if (formats.list === 'ordered') {
    activeLabel = labels.numberedList;
  } else if (formats.code) {
    activeLabel = labels.code;
  } else if (formats.blockquote) {
    activeLabel = labels.quote;
  }

  return {
    labels,
    activeLabel,
    handleFormatBold,
    handleFormatItalic,
    handleFormatStrike,
    handleFormatCode,
    handleFormatText,
    handleFormatHeading1,
    handleFormatHeading2,
    handleFormatHeading3,
    handleFormatBulletList,
    handleFormatNumberedList,
    handleFormatCodeBlock,
    handleFormatBlockquote,
  };
}
