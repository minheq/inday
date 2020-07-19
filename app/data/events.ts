import { atom } from 'recoil';

import { RecoilKey } from './constants';
import { Note } from './notes';
import { Workspace } from './workspace';
import { Tag } from './tag';

export interface EventMetadata {
  createdAt: Date;
  typename: 'Event';
  workspaceID: string;
}

export interface WorkspaceCreatedEvent {
  name: 'WorkspaceCreated';
  workspace: Workspace;
}

export interface NoteCreatedEvent {
  name: 'NoteCreated';
  note: Note;
}

export interface NoteDeletedEvent {
  name: 'NoteDeleted';
  note: Note;
}

export interface NoteContentUpdatedEvent {
  name: 'NoteContentUpdatedEvent';
  note: Note;
}

export interface TagCreatedEvent {
  name: 'TagCreated';
  tag: Tag;
}

export interface TagNameUpdatedEvent {
  name: 'TagNameUpdated';
  tag: Tag;
}

export interface TagDeletedEvent {
  name: 'TagDeleted';
  tag: Tag;
}

export interface TagExpandedEvent {
  name: 'TagExpanded';
  tag: Tag;
}

export type Event =
  | WorkspaceCreatedEvent
  | NoteCreatedEvent
  | NoteDeletedEvent
  | NoteContentUpdatedEvent
  | TagCreatedEvent
  | TagNameUpdatedEvent
  | TagDeletedEvent
  | TagExpandedEvent;

export type EventWithMetadata = Event & EventMetadata;

type SubscriptionCallback = (event: EventWithMetadata) => void;

class EventEmitter {
  private subscribers: SubscriptionCallback[] = [];

  subscribe(callback: SubscriptionCallback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: SubscriptionCallback) {
    this.subscribers = this.subscribers.filter((c) => c !== callback);
  }

  emit(event: EventWithMetadata) {
    setTimeout(() => {
      this.subscribers.forEach((callback) => {
        callback(event);
      });
    }, 0);
  }
}

export const eventEmitter = new EventEmitter();

export function useEventEmitter() {
  return eventEmitter;
}

export type EventsState = EventWithMetadata[];
export const eventsState = atom<EventsState>({
  key: RecoilKey.Events,
  default: [],
});
