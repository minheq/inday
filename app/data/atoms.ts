import { atom } from 'recoil';

import {
  recordsByIDFixtures,
  collectionsByIDFixtures,
  fieldsByIDFixtures,
  spacesByIDFixtures,
  viewsByIDFixtures,
  collaboratorsByIDFixtures,
} from './fake_data';
import { Record } from './records';
import { Collection } from './collections';
import { Field } from './fields';
import { Filter } from './filters';
import { Space } from './spaces';
import { View } from './views';
import { Workspace } from './workspace';
import { Sort } from './sorts';
import { Event } from './events';
import { Collaborator } from './collaborators';
import { Group } from './groups';

export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: 'WorkspaceState',
  default: {
    id: '1',
    name: 'My Workspace',
    ownerID: '1',
  },
});

export type RecordsByIDState = { [recordID: string]: Record | undefined };
export const recordsByIDState = atom<RecordsByIDState>({
  key: 'RecordsByIDState',
  default: recordsByIDFixtures,
});

export type CollectionsByIDState = { [id: string]: Collection | undefined };
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: 'CollectionsByIDState',
  default: collectionsByIDFixtures,
});

export type FieldsByIDState = { [fieldID: string]: Field | undefined };
export const fieldsByIDState = atom<FieldsByIDState>({
  key: 'FieldsByIDState',
  default: fieldsByIDFixtures,
});

export type FiltersByIDState = { [filterID: string]: Filter | undefined };
export const filtersByIDState = atom<FiltersByIDState>({
  key: 'FiltersByIDState',
  default: {},
});

export type SortsByIDState = { [sortID: string]: Sort | undefined };
export const sortsByIDState = atom<SortsByIDState>({
  key: 'SortsByIDState',
  default: {},
});

export type GroupsByIDState = { [groupID: string]: Group | undefined };
export const groupsByIDState = atom<GroupsByIDState>({
  key: 'GroupsByIDState',
  default: {},
});

export type SpacesByIDState = { [spaceID: string]: Space | undefined };
export const spacesByIDState = atom<SpacesByIDState>({
  key: 'SpacesByIDState',
  default: spacesByIDFixtures,
});

export type ViewsByIDState = { [viewID: string]: View | undefined };
export const viewsByIDState = atom<ViewsByIDState>({
  key: 'ViewsByIDState',
  default: viewsByIDFixtures,
});

export type CollaboratorsByIDState = {
  [collaboratorID: string]: Collaborator;
};
export const collaboratorsByIDState = atom<CollaboratorsByIDState>({
  key: 'CollaboratorsByIDState',
  default: collaboratorsByIDFixtures,
});

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: 'EventsState',
  default: [],
});
