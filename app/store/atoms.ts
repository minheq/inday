import { atom } from "recoil";

import {
  documentsByIDFixtures,
  collectionsByIDFixtures,
  fieldsByIDFixtures,
  spacesByIDFixtures,
  viewsByIDFixtures,
  groupsByIDFixtures,
  collaboratorsByIDFixtures,
} from "./fake_data";
import { Document } from "../../models/documents";
import { Collection } from "../../models/collections";
import { Field } from "../../models/fields";
import { Filter } from "../../models/filters";
import { Space } from "../../models/spaces";
import { View } from "../../models/views";
import { Workspace } from "../../models/workspace";
import { Sort } from "../../models/sorts";
import { Collaborator } from "../../models/collaborators";
import { Group } from "../../models/groups";
import { Event } from "../../models/events";

export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: "WorkspaceState",
  default: {
    id: "wrk1",
    name: "My Workspace",
    ownerID: "1",
  },
});

export type DocumentsByIDState = {
  [DocumentID: string]: Document | undefined;
};
// export type DocumentsByIDState = Record<DocumentID, Document | undefined>;
export const documentsByIDState = atom<DocumentsByIDState>({
  key: "DocumentsByIDState",
  default: documentsByIDFixtures,
});

export type CollectionsByIDState = {
  [CollectionID: string]: Collection | undefined;
};
// export type CollectionsByIDState = Record<CollectionID, Collection | undefined>;
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: "CollectionsByIDState",
  default: collectionsByIDFixtures,
});

export type FieldsByIDState = {
  [FieldID: string]: Field | undefined;
};
// export type FieldsByIDState = Record<FieldID, Field | undefined>;
export const fieldsByIDState = atom<FieldsByIDState>({
  key: "FieldsByIDState",
  default: fieldsByIDFixtures,
});

export type FiltersByIDState = {
  [FilterID: string]: Filter | undefined;
};
// export type FiltersByIDState = Record<FilterID, Filter | undefined>;
export const filtersByIDState = atom<FiltersByIDState>({
  key: "FiltersByIDState",
  default: {},
});

export type SortsByIDState = {
  [SortID: string]: Sort | undefined;
};
// export type SortsByIDState = Record<SortID, Sort | undefined>;
export const sortsByIDState = atom<SortsByIDState>({
  key: "SortsByIDState",
  default: {},
});

export type GroupsByIDState = {
  [GroupID: string]: Group | undefined;
};
// export type GroupsByIDState = Record<GroupID, Group | undefined>;
export const groupsByIDState = atom<GroupsByIDState>({
  key: "GroupsByIDState",
  default: groupsByIDFixtures,
});

export type SpacesByIDState = {
  [SpaceID: string]: Space | undefined;
};
// export type SpacesByIDState = Record<SpaceID, Space | undefined>;
export const spacesByIDState = atom<SpacesByIDState>({
  key: "SpacesByIDState",
  default: spacesByIDFixtures,
});

export type ViewsByIDState = {
  [ViewID: string]: View | undefined;
};
// export type ViewsByIDState = Record<ViewID, View | undefined>;
export const viewsByIDState = atom<ViewsByIDState>({
  key: "ViewsByIDState",
  default: viewsByIDFixtures,
});

export type CollaboratorsByIDState = {
  [CollaboratorID: string]: Collaborator | undefined;
};
// export type CollaboratorsByIDState = Record<CollaboratorID, Collaborator>;
export const collaboratorsByIDState = atom<CollaboratorsByIDState>({
  key: "CollaboratorsByIDState",
  default: collaboratorsByIDFixtures,
});

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: "EventsState",
  default: [],
});
