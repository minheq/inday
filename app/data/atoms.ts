import { atom } from 'recoil';

import { RecoilKey } from './constants';
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
  key: RecoilKey.Workspace,
  default: {
    id: '1',
    name: 'My Workspace',
    ownerID: '1',
  },
});

export type RecordsByIDState = { [recordID: string]: Record | undefined };
export const recordsByIDState = atom<RecordsByIDState>({
  key: RecoilKey.RecordsByID,
  default: recordsByIDFixtures,
});

export type CollectionsByIDState = { [id: string]: Collection | undefined };
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: RecoilKey.CollectionsByID,
  default: collectionsByIDFixtures,
});

export type FieldsByIDState = { [fieldID: string]: Field | undefined };
export const fieldsByIDState = atom<FieldsByIDState>({
  key: RecoilKey.FieldsByID,
  default: fieldsByIDFixtures,
});

export type FiltersByIDState = { [filterID: string]: Filter | undefined };
export const filtersByIDState = atom<FiltersByIDState>({
  key: RecoilKey.FiltersByID,
  default: {},
});

export type SortsByIDState = { [sortID: string]: Sort | undefined };
export const sortsByIDState = atom<SortsByIDState>({
  key: RecoilKey.SortsByID,
  default: {},
});

export type GroupsByIDState = { [groupID: string]: Group | undefined };
export const groupsByIDState = atom<GroupsByIDState>({
  key: RecoilKey.GroupsByID,
  default: {},
});

export type SpacesByIDState = { [spaceID: string]: Space | undefined };
export const spacesByIDState = atom<SpacesByIDState>({
  key: RecoilKey.SpacesByID,
  default: spacesByIDFixtures,
});

export type ViewsByIDState = { [viewID: string]: View | undefined };
export const viewsByIDState = atom<ViewsByIDState>({
  key: RecoilKey.ViewsByID,
  default: viewsByIDFixtures,
});

export type CollaboratorsByIDState = {
  [collaboratorID: string]: Collaborator | undefined;
};
export const collaboratorsByIDState = atom<CollaboratorsByIDState>({
  key: RecoilKey.CollaboratorsByID,
  default: collaboratorsByIDFixtures,
});

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: RecoilKey.Events,
  default: [],
});
