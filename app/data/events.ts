import { atom } from 'recoil';

import { RecoilKey } from './constants';
import { Workspace } from './workspace';
import { Space } from './spaces';
import { Collection } from './collections';
import { View } from './views';
import { Field } from './fields';
import { Document } from './documents';

export interface EventMetadata {
  createdAt: Date;
  workspaceID: string;
}

export interface WorkspaceCreatedEvent {
  name: 'WorkspaceCreated';
  workspace: Workspace;
}

export interface SpaceCreatedEvent {
  name: 'SpaceCreated';
  space: Space;
}

export interface SpaceDeletedEvent {
  name: 'SpaceDeleted';
  space: Space;
}

export interface SpaceNameUpdatedEvent {
  name: 'SpaceNameUpdated';
  space: Space;
}

export interface CollectionCreatedEvent {
  name: 'CollectionCreated';
  collection: Collection;
}

export interface CollectionNameUpdatedEvent {
  name: 'CollectionNameUpdated';
  collection: Collection;
}

export interface CollectionDeletedEvent {
  name: 'CollectionDeleted';
  collection: Collection;
}

export interface ViewCreatedEvent {
  name: 'ViewCreated';
  view: View;
}

export interface ViewNameUpdatedEvent {
  name: 'ViewNameUpdated';
  view: View;
}

export interface ViewDeletedEvent {
  name: 'ViewDeleted';
  view: View;
}

export interface FieldCreatedEvent {
  name: 'FieldCreated';
  field: Field;
}

export interface FieldNameUpdatedEvent {
  name: 'FieldNameUpdated';
  field: Field;
}

export interface FieldDeletedEvent {
  name: 'FieldDeleted';
  field: Field;
}

export interface DocumentCreatedEvent {
  name: 'DocumentCreated';
  document: Document;
}

export interface DocumentNameUpdatedEvent {
  name: 'DocumentNameUpdated';
  document: Document;
}

export interface DocumentDeletedEvent {
  name: 'DocumentDeleted';
  document: Document;
}

export type Event =
  | WorkspaceCreatedEvent
  | SpaceCreatedEvent
  | SpaceDeletedEvent
  | SpaceNameUpdatedEvent
  | CollectionCreatedEvent
  | CollectionNameUpdatedEvent
  | CollectionDeletedEvent
  | ViewCreatedEvent
  | ViewNameUpdatedEvent
  | ViewDeletedEvent
  | FieldCreatedEvent
  | FieldNameUpdatedEvent
  | FieldDeletedEvent
  | DocumentCreatedEvent
  | DocumentNameUpdatedEvent
  | DocumentDeletedEvent;

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
