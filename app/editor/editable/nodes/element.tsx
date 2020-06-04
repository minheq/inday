import React from 'react';
import { HeadingOne } from './heading_one';
import { HeadingTwo } from './heading_two';
import { HeadingThree } from './heading_three';
import { Paragraph } from './paragraph';
import { Image } from './image';
import { Link } from './link';
import { Blockquote } from './block_quote';
import { BulletedList } from './bulleted_list';
import { NumberedList } from './numbered_list';
import { ListItem } from './list_item';
import { CheckListItem } from './check_list_item';
import { Divider } from './divider';
import { CodeBlock } from './code_block';
import { Video } from './video';

export type Block =
  | Paragraph
  | BulletedList
  | NumberedList
  | ListItem
  | Blockquote
  | CodeBlock
  | Video
  | Divider
  | CheckListItem
  | HeadingOne
  | HeadingTwo
  | HeadingThree
  | Image;

export type BlockType = Block['type'];

export type Inline = Link;
export type InlineType = Inline['type'];

export type Element = Block | Inline;
export type ElementType = Element['type'];

interface ElementProps {
  children: React.ReactNode;
  attributes: {
    'data-slate-node': 'element';
    'data-slate-inline'?: true;
    'data-slate-void'?: true;
    dir?: 'rtl';
    ref: any;
  };
  element: Element;
}

export function Element(props: ElementProps) {
  switch (props.element.type) {
    case 'heading-one':
      return <HeadingOne {...props} element={props.element} />;
    case 'heading-two':
      return <HeadingTwo {...props} element={props.element} />;
    case 'heading-three':
      return <HeadingThree {...props} element={props.element} />;
    case 'image':
      return <Image {...props} element={props.element} />;
    case 'code-block':
      return <CodeBlock {...props} element={props.element} />;
    case 'divider':
      return <Divider {...props} element={props.element} />;
    case 'link':
      return <Link {...props} element={props.element} />;
    case 'block-quote':
      return <Blockquote {...props} element={props.element} />;
    case 'video':
      return <Video {...props} element={props.element} />;
    case 'bulleted-list':
      return <BulletedList {...props} element={props.element} />;
    case 'numbered-list':
      return <NumberedList {...props} element={props.element} />;
    case 'list-item':
      return <ListItem {...props} element={props.element} />;
    case 'check-list-item':
      return <CheckListItem {...props} element={props.element} />;
    case 'paragraph':
      return <Paragraph {...props} element={props.element} />;
    default:
      throw new Error(`Unexpected element ${JSON.stringify(props.element)}`);
  }
}
