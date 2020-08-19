import { Workspace } from './workspace';
import { Space } from './spaces';
import { Collection } from './collections';
import { View } from './views';
import { Field } from './fields';
import { Document } from './documents';
import { Filter } from './filters';
import { Sort } from './sorts';
import { Group } from './groups';

export interface BaseEvent {
  createdAt: Date;
  workspaceID: string;
}

export interface WorkspaceCreatedEventConfig {
  name: 'WorkspaceCreated';
  workspace: Workspace;
}
export interface WorkspaceCreatedEvent
  extends BaseEvent,
    WorkspaceCreatedEventConfig {}

export interface SpaceCreatedEventConfig {
  name: 'SpaceCreated';
  space: Space;
}
export interface SpaceCreatedEvent extends BaseEvent, SpaceCreatedEventConfig {}

export interface SpaceDeletedEventConfig {
  name: 'SpaceDeleted';
  space: Space;
}
export interface SpaceDeletedEvent extends BaseEvent, SpaceDeletedEventConfig {}

export interface SpaceNameUpdatedEventConfig {
  name: 'SpaceNameUpdated';
  space: Space;
}
export interface SpaceNameUpdatedEvent
  extends BaseEvent,
    SpaceNameUpdatedEventConfig {}

export interface CollectionCreatedEventConfig {
  name: 'CollectionCreated';
  collection: Collection;
}
export interface CollectionCreatedEvent
  extends BaseEvent,
    CollectionCreatedEventConfig {}

export interface CollectionNameUpdatedEventConfig {
  name: 'CollectionNameUpdated';
  collection: Collection;
}
export interface CollectionNameUpdatedEvent
  extends BaseEvent,
    CollectionNameUpdatedEventConfig {}

export interface CollectionDeletedEventConfig {
  name: 'CollectionDeleted';
  collection: Collection;
}
export interface CollectionDeletedEvent
  extends BaseEvent,
    CollectionDeletedEventConfig {}

export interface ViewCreatedEventConfig {
  name: 'ViewCreated';
  view: View;
}
export interface ViewCreatedEvent extends BaseEvent, ViewCreatedEventConfig {}

export interface ViewNameUpdatedEventConfig {
  name: 'ViewNameUpdated';
  view: View;
}
export interface ViewNameUpdatedEvent
  extends BaseEvent,
    ViewNameUpdatedEventConfig {}

export interface ViewDeletedEventConfig {
  name: 'ViewDeleted';
  view: View;
}
export interface ViewDeletedEvent extends BaseEvent, ViewDeletedEventConfig {}

export interface FieldCreatedEventConfig {
  name: 'FieldCreated';
  field: Field;
}
export interface FieldCreatedEvent extends BaseEvent, FieldCreatedEventConfig {}

export interface FieldNameUpdatedEventConfig {
  name: 'FieldNameUpdated';
  field: Field;
}
export interface FieldNameUpdatedEvent
  extends BaseEvent,
    FieldNameUpdatedEventConfig {}

export interface FieldDeletedEventConfig {
  name: 'FieldDeleted';
  field: Field;
}
export interface FieldDeletedEvent extends BaseEvent, FieldDeletedEventConfig {}

export interface DocumentCreatedEventConfig {
  name: 'DocumentCreated';
  document: Document;
}
export interface DocumentCreatedEvent
  extends BaseEvent,
    DocumentCreatedEventConfig {}

export interface DocumentNameUpdatedEventConfig {
  name: 'DocumentNameUpdated';
  document: Document;
}
export interface DocumentNameUpdatedEvent
  extends BaseEvent,
    DocumentNameUpdatedEventConfig {}

export interface DocumentDeletedEventConfig {
  name: 'DocumentDeleted';
  document: Document;
}
export interface DocumentDeletedEvent
  extends BaseEvent,
    DocumentDeletedEventConfig {}

export interface FilterCreatedEventConfig {
  name: 'FilterCreated';
  filter: Filter;
}
export interface FilterCreatedEvent
  extends BaseEvent,
    FilterCreatedEventConfig {}

export interface FilterConfigUpdatedEventConfig {
  name: 'FilterConfigUpdated';
  filter: Filter;
}
export interface FilterConfigUpdatedEvent
  extends BaseEvent,
    FilterConfigUpdatedEventConfig {}

export interface FilterGroupUpdatedEventConfig {
  name: 'FilterGroupUpdated';
  filters: Filter[];
}
export interface FilterGroupUpdatedEvent
  extends BaseEvent,
    FilterGroupUpdatedEventConfig {}

export interface FilterDeletedEventConfig {
  name: 'FilterDeleted';
  filters: Filter[];
}
export interface FilterDeletedEvent
  extends BaseEvent,
    FilterDeletedEventConfig {}

export interface SortCreatedEventConfig {
  name: 'SortCreated';
  sort: Sort;
}
export interface SortCreatedEvent extends BaseEvent, SortCreatedEventConfig {}

export interface SortConfigUpdatedEventConfig {
  name: 'SortConfigUpdated';
  sort: Sort;
}
export interface SortConfigUpdatedEvent
  extends BaseEvent,
    SortConfigUpdatedEventConfig {}

export interface SortDeletedEventConfig {
  name: 'SortDeleted';
  sorts: Sort[];
}
export interface SortDeletedEvent extends BaseEvent, SortDeletedEventConfig {}

export interface GroupCreatedEventConfig {
  name: 'GroupCreated';
  group: Group;
}
export interface GroupCreatedEvent extends BaseEvent, GroupCreatedEventConfig {}

export interface GroupConfigUpdatedEventConfig {
  name: 'GroupConfigUpdated';
  group: Group;
}
export interface GroupConfigUpdatedEvent
  extends BaseEvent,
    GroupConfigUpdatedEventConfig {}

export interface GroupDeletedEventConfig {
  name: 'GroupDeleted';
  groups: Group[];
}
export interface GroupDeletedEvent extends BaseEvent, GroupDeletedEventConfig {}

export type EventConfig =
  | WorkspaceCreatedEventConfig
  | SpaceCreatedEventConfig
  | SpaceDeletedEventConfig
  | SpaceNameUpdatedEventConfig
  | CollectionCreatedEventConfig
  | CollectionNameUpdatedEventConfig
  | CollectionDeletedEventConfig
  | ViewCreatedEventConfig
  | ViewNameUpdatedEventConfig
  | ViewDeletedEventConfig
  | FieldCreatedEventConfig
  | FieldNameUpdatedEventConfig
  | FieldDeletedEventConfig
  | DocumentCreatedEventConfig
  | DocumentNameUpdatedEventConfig
  | DocumentDeletedEventConfig
  | FilterCreatedEventConfig
  | FilterConfigUpdatedEventConfig
  | FilterGroupUpdatedEventConfig
  | FilterDeletedEventConfig
  | SortCreatedEventConfig
  | SortConfigUpdatedEventConfig
  | SortDeletedEventConfig
  | GroupCreatedEventConfig
  | GroupConfigUpdatedEventConfig
  | GroupDeletedEventConfig;

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
  | DocumentDeletedEvent
  | FilterCreatedEvent
  | FilterConfigUpdatedEvent
  | FilterGroupUpdatedEvent
  | FilterDeletedEvent
  | SortCreatedEvent
  | SortConfigUpdatedEvent
  | SortDeletedEvent
  | GroupCreatedEvent
  | GroupConfigUpdatedEvent
  | GroupDeletedEvent;

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
