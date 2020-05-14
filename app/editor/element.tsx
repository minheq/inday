import React from 'react';
import { HeadingOne } from './nodes/heading_one';
import { HeadingTwo } from './nodes/heading_two';
import { HeadingThree } from './nodes/heading_three';
import { Paragraph } from './nodes/paragraph';
import { Image } from './nodes/image';
import { Link } from './nodes/link';
import { Blockquote } from './nodes/block_quote';
import { BulletedList } from './nodes/bulleted_list';
import { NumberedList } from './nodes/numbered_list';
import { ListItem } from './nodes/list_item';
import { CheckListItem } from './nodes/check_list_item';
import { Divider } from './nodes/divider';

export type Element =
  | Paragraph
  | BulletedList
  | NumberedList
  | ListItem
  | Blockquote
  | Divider
  | Link
  | CheckListItem
  | HeadingOne
  | HeadingTwo
  | HeadingThree
  | Image;

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
    case 'divider':
      return <Divider {...props} element={props.element} />;
    case 'link':
      return <Link {...props} element={props.element} />;
    case 'block-quote':
      return <Blockquote {...props} element={props.element} />;
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
