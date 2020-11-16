import { Workspace } from './workspace';
import { Space } from './spaces';
import { Collection } from './collections';
import { View, ListView } from './views';
import { Field } from './fields';
import { Record } from './records';
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
  prevSpace: Space;
  nextSpace: Space;
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
  prevCollection: Collection;
  nextCollection: Collection;
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
  prevView: View;
  nextView: View;
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
  prevField: Field;
  nextField: Field;
}
export interface FieldNameUpdatedEvent
  extends BaseEvent,
    FieldNameUpdatedEventConfig {}

export interface FieldDeletedEventConfig {
  name: 'FieldDeleted';
  field: Field;
}
export interface FieldDeletedEvent extends BaseEvent, FieldDeletedEventConfig {}

export interface RecordCreatedEventConfig {
  name: 'RecordCreated';
  record: Record;
}
export interface RecordCreatedEvent
  extends BaseEvent,
    RecordCreatedEventConfig {}

export interface RecordNameUpdatedEventConfig {
  name: 'RecordNameUpdated';
  prevRecord: Record;
  nextRecord: Record;
}
export interface RecordNameUpdatedEvent
  extends BaseEvent,
    RecordNameUpdatedEventConfig {}

export interface RecordDeletedEventConfig {
  name: 'RecordDeleted';
  record: Record;
}
export interface RecordDeletedEvent
  extends BaseEvent,
    RecordDeletedEventConfig {}

export interface FilterCreatedEventConfig {
  name: 'FilterCreated';
  filter: Filter;
}
export interface FilterCreatedEvent
  extends BaseEvent,
    FilterCreatedEventConfig {}

export interface FilterConfigUpdatedEventConfig {
  name: 'FilterConfigUpdated';
  prevFilter: Filter;
  nextFilter: Filter;
}
export interface FilterConfigUpdatedEvent
  extends BaseEvent,
    FilterConfigUpdatedEventConfig {}

export interface FilterGroupUpdatedEventConfig {
  name: 'FilterGroupUpdated';
  prevFilters: Filter[];
  nextFilters: Filter[];
}
export interface FilterGroupUpdatedEvent
  extends BaseEvent,
    FilterGroupUpdatedEventConfig {}

export interface FilterDeletedEventConfig {
  name: 'FilterDeleted';
  prevFilters: Filter[];
  nextFilters: Filter[];
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
  prevSort: Sort;
  nextSort: Sort;
}
export interface SortConfigUpdatedEvent
  extends BaseEvent,
    SortConfigUpdatedEventConfig {}

export interface SortDeletedEventConfig {
  name: 'SortDeleted';
  prevSorts: Sort[];
  nextSorts: Sort[];
}
export interface SortDeletedEvent extends BaseEvent, SortDeletedEventConfig {}

export interface GroupCreatedEventConfig {
  name: 'GroupCreated';
  group: Group;
}
export interface GroupCreatedEvent extends BaseEvent, GroupCreatedEventConfig {}

export interface GroupConfigUpdatedEventConfig {
  name: 'GroupConfigUpdated';
  prevGroup: Group;
  nextGroup: Group;
}
export interface GroupConfigUpdatedEvent
  extends BaseEvent,
    GroupConfigUpdatedEventConfig {}

export interface GroupDeletedEventConfig {
  name: 'GroupDeleted';
  prevGroups: Group[];
  nextGroups: Group[];
}
export interface GroupDeletedEvent extends BaseEvent, GroupDeletedEventConfig {}

export interface ListViewFieldConfigUpdatedEventConfig {
  name: 'ListViewFieldConfigUpdated';
  prevView: ListView;
  nextView: ListView;
}
export interface ListViewFieldConfigUpdatedEvent
  extends BaseEvent,
    ListViewFieldConfigUpdatedEventConfig {}

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
  | RecordCreatedEventConfig
  | RecordNameUpdatedEventConfig
  | RecordDeletedEventConfig
  | FilterCreatedEventConfig
  | FilterConfigUpdatedEventConfig
  | FilterGroupUpdatedEventConfig
  | FilterDeletedEventConfig
  | SortCreatedEventConfig
  | SortConfigUpdatedEventConfig
  | SortDeletedEventConfig
  | GroupCreatedEventConfig
  | GroupConfigUpdatedEventConfig
  | GroupDeletedEventConfig
  | ListViewFieldConfigUpdatedEventConfig;

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
  | RecordCreatedEvent
  | RecordNameUpdatedEvent
  | RecordDeletedEvent
  | FilterCreatedEvent
  | FilterConfigUpdatedEvent
  | FilterGroupUpdatedEvent
  | FilterDeletedEvent
  | SortCreatedEvent
  | SortConfigUpdatedEvent
  | SortDeletedEvent
  | GroupCreatedEvent
  | GroupConfigUpdatedEvent
  | GroupDeletedEvent
  | ListViewFieldConfigUpdatedEvent;

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

export function useEventEmitter(): EventEmitter {
  return eventEmitter;
}
