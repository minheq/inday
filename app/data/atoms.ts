import { atom } from 'recoil';

import { RecoilKey } from './constants';
import {
  documentsByIDFixtures,
  collectionsByIDFixtures,
  fieldsByIDFixtures,
  spacesByIDFixtures,
  viewsByIDFixtures,
} from './fake_data';
import { Document } from './documents';
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
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type DocumentsByIDState = { [documentID: string]: Document | undefined };
export const documentsByIDState = atom<DocumentsByIDState>({
  key: RecoilKey.DocumentsByID,
  default: documentsByIDFixtures,
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type CollectionsByIDState = { [id: string]: Collection | undefined };
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: RecoilKey.CollectionsByID,
  default: collectionsByIDFixtures,
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type FieldsByIDState = { [fieldID: string]: Field | undefined };
export const fieldsByIDState = atom<FieldsByIDState>({
  key: RecoilKey.FieldsByID,
  default: fieldsByIDFixtures,
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type FiltersByIDState = { [filterID: string]: Filter | undefined };
export const filtersByIDState = atom<FiltersByIDState>({
  key: RecoilKey.FiltersByID,
  default: {},
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type SortsByIDState = { [sortID: string]: Sort | undefined };
export const sortsByIDState = atom<SortsByIDState>({
  key: RecoilKey.SortsByID,
  default: {},
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type GroupsByIDState = { [groupID: string]: Group | undefined };
export const groupsByIDState = atom<GroupsByIDState>({
  key: RecoilKey.GroupsByID,
  default: {},
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type SpacesByIDState = { [spaceID: string]: Space | undefined };
export const spacesByIDState = atom<SpacesByIDState>({
  key: RecoilKey.SpacesByID,
  default: spacesByIDFixtures,
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type ViewsByIDState = { [viewID: string]: View | undefined };
export const viewsByIDState = atom<ViewsByIDState>({
  key: RecoilKey.ViewsByID,
  default: viewsByIDFixtures,
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type CollaboratorsByIDState = {
  [collaboratorID: string]: Collaborator | undefined;
};
export const collaboratorsByIDState = atom<CollaboratorsByIDState>({
  key: RecoilKey.CollaboratorsByID,
  default: {},
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: RecoilKey.Events,
  default: [],
  // @ts-ignore: will be stable
  persistence_UNSTABLE: { type: true },
});
