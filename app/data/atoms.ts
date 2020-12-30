import { atom } from 'recoil';

import {
  documentsByIDFixtures,
  collectionsByIDFixtures,
  fieldsByIDFixtures,
  spacesByIDFixtures,
  viewsByIDFixtures,
  groupsByIDFixtures,
  collaboratorsByIDFixtures,
} from './fake_data';
import { Document, DocumentID } from './documents';
import { Collection, CollectionID } from './collections';
import { Field, FieldID } from './fields';
import { Filter, FilterID } from './filters';
import { Space, SpaceID } from './spaces';
import { View, ViewID } from './views';
import { Workspace } from './workspace';
import { Sort, SortID } from './sorts';
import { Event } from './events';
import { Collaborator, CollaboratorID } from './collaborators';
import { Group, GroupID } from './groups';

export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: 'WorkspaceState',
  default: {
    id: 'wrk1',
    name: 'My Workspace',
    ownerID: '1',
  },
});

export type DocumentsByIDState = Record<DocumentID, Document | undefined>;
export const documentsByIDState = atom<DocumentsByIDState>({
  key: 'DocumentsByIDState',
  default: documentsByIDFixtures,
});

export type CollectionsByIDState = Record<CollectionID, Collection | undefined>;
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: 'CollectionsByIDState',
  default: collectionsByIDFixtures,
});

export type FieldsByIDState = Record<FieldID, Field | undefined>;
export const fieldsByIDState = atom<FieldsByIDState>({
  key: 'FieldsByIDState',
  default: fieldsByIDFixtures,
});

export type FiltersByIDState = Record<FilterID, Filter | undefined>;
export const filtersByIDState = atom<FiltersByIDState>({
  key: 'FiltersByIDState',
  default: {},
});

export type SortsByIDState = Record<SortID, Sort | undefined>;
export const sortsByIDState = atom<SortsByIDState>({
  key: 'SortsByIDState',
  default: {},
});

export type GroupsByIDState = Record<GroupID, Group | undefined>;
export const groupsByIDState = atom<GroupsByIDState>({
  key: 'GroupsByIDState',
  default: groupsByIDFixtures,
});

export type SpacesByIDState = Record<SpaceID, Space | undefined>;
export const spacesByIDState = atom<SpacesByIDState>({
  key: 'SpacesByIDState',
  default: spacesByIDFixtures,
});

export type ViewsByIDState = Record<ViewID, View | undefined>;
export const viewsByIDState = atom<ViewsByIDState>({
  key: 'ViewsByIDState',
  default: viewsByIDFixtures,
});

export type CollaboratorsByIDState = Record<CollaboratorID, Collaborator>;

export const collaboratorsByIDState = atom<CollaboratorsByIDState>({
  key: 'CollaboratorsByIDState',
  default: collaboratorsByIDFixtures,
});

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: 'EventsState',
  default: [],
});
