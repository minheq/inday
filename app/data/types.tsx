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

export interface Note {
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
  typename: 'Note';
}

export interface Workspace {
  id: string;
  name: string;
  all: string[];
  inbox: string[];
  typename: 'Workspace';
}

interface EventBase {
  createdAt: Date;
}

export interface NoteCreatedEvent extends EventBase {
  name: 'NoteCreated';
  note: Note;
  workspace: Workspace;
}

export interface NoteDeletedEvent extends EventBase {
  name: 'NoteDeleted';
  note: Note;
  workspace: Workspace;
}

export interface NoteUpdatedEvent extends EventBase {
  name: 'NoteUpdated';
  prevNote: Note;
  nextNote: Note;
}

export type Event = NoteCreatedEvent | NoteDeletedEvent | NoteUpdatedEvent;

export type ListID = 'all' | 'inbox' | string;
export interface List {
  id: ListID;
  name: string;
}
