import { TextSize } from '../theme';
import { Node } from 'slate';

export interface Text {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
}

export interface Link {
  type: 'link';
  children: Node[];
  url: string;
}

export interface Image {
  type: 'image';
  children: Node[];
  url: string;
  caption: string;
}

export interface BulletedList {
  type: 'bulleted-list';
  children: Node[];
}

export interface NumberedList {
  type: 'numbered-list';
  children: Node[];
}

export interface BlockQuote {
  type: 'block-quote';
  children: Node[];
}

export interface ListItem {
  type: 'list-item';
  children: Node[];
}

export interface Mention {
  type: 'mention';
  children: Node[];
  name: string;
}

export interface Heading {
  type: 'heading';
  children: Node[];
  size: TextSize;
}

export type Element =
  | BulletedList
  | NumberedList
  | ListItem
  | BlockQuote
  | Mention
  | Link
  | Heading;
