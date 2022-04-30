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
import { Document, DocumentID } from "../../models/documents";
import { Collection, CollectionID } from "../../models/collections";
import { Field, FieldID } from "../../models/fields";
import { Filter, FilterID } from "../../models/filters";
import { Space, SpaceID } from "../../models/spaces";
import { View, ViewID } from "../../models/views";
import { Workspace } from "../../models/workspace";
import { Sort, SortID } from "../../models/sorts";
import { Collaborator, CollaboratorID } from "../../models/collaborators";
import { Group, GroupID } from "../../models/groups";
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

export type DocumentsByIDState = Record<DocumentID, Document>;
export const documentsByIDState = atom<DocumentsByIDState>({
  key: "DocumentsByIDState",
  default: documentsByIDFixtures,
});

export type CollectionsByIDState = Record<CollectionID, Collection>;
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: "CollectionsByIDState",
  default: collectionsByIDFixtures,
});

export type FieldsByIDState = Record<FieldID, Field>;
export const fieldsByIDState = atom<FieldsByIDState>({
  key: "FieldsByIDState",
  default: fieldsByIDFixtures,
});

export type FiltersByIDState = Record<FilterID, Filter>;
export const filtersByIDState = atom<FiltersByIDState>({
  key: "FiltersByIDState",
  default: {},
});

export type SortsByIDState = Record<SortID, Sort>;
export const sortsByIDState = atom<SortsByIDState>({
  key: "SortsByIDState",
  default: {},
});

export type GroupsByIDState = Record<GroupID, Group>;
export const groupsByIDState = atom<GroupsByIDState>({
  key: "GroupsByIDState",
  default: groupsByIDFixtures,
});

export type SpacesByIDState = Record<SpaceID, Space>;
export const spacesByIDState = atom<SpacesByIDState>({
  key: "SpacesByIDState",
  default: spacesByIDFixtures,
});

export type ViewsByIDState = Record<ViewID, View>;
export const viewsByIDState = atom<ViewsByIDState>({
  key: "ViewsByIDState",
  default: viewsByIDFixtures,
});

export type CollaboratorsByIDState = Record<CollaboratorID, Collaborator>;
export const collaboratorsByIDState = atom<CollaboratorsByIDState>({
  key: "CollaboratorsByIDState",
  default: collaboratorsByIDFixtures,
});

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: "EventsState",
  default: [],
});
