import { atom } from 'recoil';

import { RecoilKey } from './constants';
import { Note } from './notes';
import { Workspace } from './workspace';
import { List } from './list';
import { ListGroup } from './list_group';

interface EventBase {
  createdAt: Date;
  typename: 'Event';
}

export interface WorkspaceCreatedEvent extends EventBase {
  name: 'WorkspaceCreated';
  workspace: Workspace;
}

export interface WorkspaceUpdatedEvent extends EventBase {
  name: 'WorkspaceUpdated';
  prevWorkspace: Workspace;
  nextWorkspace: Workspace;
}

export interface NoteCreatedEvent extends EventBase {
  name: 'NoteCreated';
  note: Note;
  workspaceID: string;
}

export interface NoteDeletedEvent extends EventBase {
  name: 'NoteDeleted';
  note: Note;
  workspaceID: string;
}

export interface NoteUpdatedEvent extends EventBase {
  name: 'NoteUpdated';
  prevNote: Note;
  workspaceID: string;
  nextNote: Note;
}

export interface ListCreatedEvent extends EventBase {
  name: 'ListCreated';
  list: List;
  workspaceID: string;
}

export interface ListDeletedEvent extends EventBase {
  name: 'ListDeleted';
  list: List;
  workspaceID: string;
}

export interface ListNameUpdatedEvent extends EventBase {
  name: 'ListNameUpdated';
  prevList: List;
  workspaceID: string;
  nextList: List;
}

export interface ListGroupCreatedEvent extends EventBase {
  name: 'ListGroupCreated';
  listGroup: ListGroup;
  workspaceID: string;
}

export interface ListGroupDeletedEvent extends EventBase {
  name: 'ListGroupDeleted';
  listGroup: ListGroup;
  workspaceID: string;
}

export interface ListGroupNameUpdatedEvent extends EventBase {
  name: 'ListGroupNameUpdated';
  prevListGroup: ListGroup;
  workspaceID: string;
  nextListGroup: ListGroup;
}

export type Event =
  | WorkspaceCreatedEvent
  | WorkspaceUpdatedEvent
  | NoteCreatedEvent
  | NoteDeletedEvent
  | NoteUpdatedEvent
  | ListCreatedEvent
  | ListDeletedEvent
  | ListNameUpdatedEvent
  | ListGroupCreatedEvent
  | ListGroupDeletedEvent
  | ListGroupNameUpdatedEvent;

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
