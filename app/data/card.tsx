import { Element } from '../editor/editable/nodes/element';
import { Recurrence } from '../modules/recurrence';

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
  title: string | null;
  description: string | null;
  imageURL: string | null;
}

export interface Card {
  id: string;
  content: Content;
  preview: Preview;
  labelIDs: string[];
  reminder: Reminder | null;
  task: Task | null;
  createdAt: Date;
  updatedAt: Date;
}
