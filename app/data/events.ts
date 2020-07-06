import { atom } from 'recoil';

import { RecoilKey } from './constants';
import { Note } from './notes';
import { Workspace } from './workspace';

interface EventBase {
  createdAt: Date;
  typename: 'Event';
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

type SubscriptionCallback = (event: Event) => void;

class EventEmitter {
  private subscribers: SubscriptionCallback[] = [];

  subscribe(callback: SubscriptionCallback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: SubscriptionCallback) {
    this.subscribers = this.subscribers.filter((c) => c !== callback);
  }

  emit(event: Event) {
    this.subscribers.forEach((callback) => {
      callback(event);
    });
  }
}

export const eventEmitter = new EventEmitter();

export function useEventEmitter() {
  return eventEmitter;
}

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: RecoilKey.Events,
  default: [],
});
