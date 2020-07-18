import { atom } from 'recoil';

import { RecoilKey } from './constants';
import { Note } from './notes';
import { Workspace } from './workspace';
import { List } from './list';
import { ListGroup } from './list_group';

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

export interface ListCreatedEvent {
  name: 'ListCreated';
  list: List;
}

export interface ListNameUpdatedEvent {
  name: 'ListNameUpdated';
  list: List;
}

export interface ListDeletedEvent {
  name: 'ListDeleted';
  list: List;
}

export interface ListGroupCreatedEvent {
  name: 'ListGroupCreated';
  listGroup: ListGroup;
}

export interface ListGroupNameUpdatedEvent {
  name: 'ListGroupNameUpdated';
  listGroup: ListGroup;
}

export interface ListGroupDeletedEvent {
  name: 'ListGroupDeleted';
  listGroup: ListGroup;
}

export interface ListGroupExpandedEvent {
  name: 'ListGroupExpanded';
  listGroup: ListGroup;
}

export type Event =
  | WorkspaceCreatedEvent
  | NoteCreatedEvent
  | NoteDeletedEvent
  | NoteContentUpdatedEvent
  | ListCreatedEvent
  | ListNameUpdatedEvent
  | ListDeletedEvent
  | ListGroupCreatedEvent
  | ListGroupNameUpdatedEvent
  | ListGroupDeletedEvent
  | ListGroupExpandedEvent;

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
