import { Recurrence } from '../modules/recurrence';
import { Element } from '../editor/editable/nodes/element';

export interface Reminder {
  time: ReminderTime | null;
  place: ReminderPlace | null;
}

interface ReminderTime {
  date: Date;
  time: Date | null;
  recurrence: Recurrence | null;
}

interface ReminderPlace {
  lat: number;
  lng: number;
  radius: number;
  when: 'leaving' | 'arriving';
}

export type Content = Element[];

export interface Task {
  completed: boolean;
}

export interface Preview {
  title: string;
  description: string;
  imageURL: string;
}

export interface Card {
  id: string;
  content: Content;
  preview: Preview;
  reminder: Reminder | null;
  task: Task | null;
  createdAt: Date;
  updatedAt: Date;
  inbox: boolean;
  listID: string | null;
  scheduledAt: Date | null;
  typename: 'Card';
}

export interface Workspace {
  id: string;
  name: string;
  all: string[];
  inbox: string[];
  typename: 'Workspace';
}
