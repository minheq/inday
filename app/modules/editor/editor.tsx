import Delta from 'quill-delta';
import React from 'react';
import { EditorMobile } from './editor_mobile';

// Type of commands
// Inline format
//  - Emphasis (Bold, Italic, Code, Strike)
//  - Link
// Block format
//  - Headers
//  - Lists
//  - Blockquotes
//  - Code Block
// Blocks
//  - Images
//  - Divider
//  - Videos
//  - Tables

// Desktop
// HoverableToolbar -> Inline format + Block format
// Commands -> Block format + Blocks

// Mobile
// Selection -> Inline Format
// Collapsed selection -> Block format + Blocks
// Collapsed on link -> Link edit/preview

// TODO:
// - Markdown auto formatting
// - Code and Code block syntax highlighting
// - Disable pasted formats
// - Paste image

// - Smooth loading of editor
// - Drag and drop image/video into editor
// - Embed Videos
// - Embed Tweets
// - Embed Drawings

export interface EditorProps {
  initialContent?: Delta;
}

export function Editor(props: EditorProps) {
  const { initialContent } = props;

  return <EditorMobile initialContent={initialContent} />;
}
