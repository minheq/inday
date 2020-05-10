import Delta from 'quill-delta';
import React from 'react';
// import { EditorMobile } from './editor_mobile';
import { EditorDesktop } from './editor_desktop';

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
// - Write test for request queue
// - Refactor toolbar to use common handlers
// - Markdown auto formatting
// - Proper icons
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
  const {
    initialContent = new Delta()
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n\n',
      )
      // .insert(
      //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n\n',
      // )
      // .insert(
      //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      // )
      // .insert(
      //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      // )
      .insert('\n'),
  } = props;

  return <EditorDesktop initialContent={initialContent} />;
}
