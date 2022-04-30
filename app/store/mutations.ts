import { useRecoilCallback } from "recoil";

import { EventConfig, Event } from "../../models/events";
import {
  Collection,
  CollectionID,
  generateCollectionID,
} from "../../models/collections";

import { generateSpaceID, Space, SpaceID } from "../../models/spaces";
import {
  View,
  ViewID,
  assertListView,
  ListViewFieldConfig,
  generateViewID,
} from "../../models/views";
import {
  Field,
  FieldConfig,
  FieldID,
  FieldValue,
  generateFieldID,
  getDefaultDocumentFieldValues,
} from "../../models/fields";
import {
  Document,
  DocumentFieldValues,
  DocumentID,
  generateDocumentID,
} from "../../models/documents";
import {
  Filter,
  FilterConfig,
  updateFilterGroup,
  FilterID,
  deleteFilter,
  generateFilterID,
} from "../../models/filters";
import { useLogger } from "../../lib/logger";
import {
  spacesByIDState,
  collectionsByIDState,
  viewsByIDState,
  filtersByIDState,
  FiltersByIDState,
  fieldsByIDState,
  documentsByIDState,
  sortsByIDState,
  eventsState,
  SortsByIDState,
  groupsByIDState,
  GroupsByIDState,
} from "./atoms";
import {
  SortConfig,
  Sort,
  SortID,
  deleteSort,
  generateSortID,
} from "../../models/sorts";
import {
  Group,
  GroupID,
  deleteGroup,
  generateGroupID,
} from "../../models/groups";
import { EventEmitter } from "../../lib/event_emitter";
import { useWorkspaceQuery } from "./queries";
import {
  collectionFieldsQuery,
  collectionQuery,
  documentQuery,
  filterQuery,
  groupQuery,
  sortQuery,
  spaceQuery,
  viewFiltersQuery,
  viewGroupsQuery,
  viewQuery,
  viewSortsQuery,
  workspaceQuery,
} from "./selectors";

export const eventEmitter = new EventEmitter<Event>();

export function useEmitEvent(): (eventConfig: EventConfig) => void {
  const logger = useLogger();
  const workspace = useWorkspaceQuery();

  return useRecoilCallback(
    ({ set }) =>
      (eventConfig: EventConfig) => {
        const event: Event = {
          ...eventConfig,
          createdAt: new Date(),
          workspaceID: workspace.id,
        };

        set(eventsState, (prevEvents) => [...prevEvents, event]);

        logger.debug("Emit event", event);

        eventEmitter.emit(event);
      },
    [workspace, logger]
  );
}

export function useCreateSpaceMutation(): () => Promise<Space> {
  const emitEvent = useEmitEvent();
  const createCollection = useCreateCollectionMutation();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const workspace = await snapshot.getPromise(workspaceQuery);

        if (workspace === null) {
          throw new Error("");
        }

        const newSpace: Space = {
          id: generateSpaceID(),
          name: "",
          workspaceID: workspace.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(spacesByIDState, (previousSpacesByID) => ({
          ...previousSpacesByID,
          [newSpace.id]: newSpace,
        }));

        emitEvent({
          name: "SpaceCreated",
          space: newSpace,
        });

        createCollection(newSpace.id);

        return newSpace;
      },
    [emitEvent]
  );
}

export function useDeleteSpaceMutation(): (spaceID: SpaceID) => void {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (spaceID: SpaceID) => {
        set(spacesByIDState, (previousSpaces) => {
          const updatedSpaces = { ...previousSpaces };

          delete updatedSpaces[spaceID];

          return updatedSpaces;
        });

        emitEvent({
          name: "SpaceDeleted",
          spaceID,
        });
      },
    [emitEvent]
  );
}

export interface UpdateSpaceNameInput {
  name: string;
}

export function useUpdateSpaceNameMutation(): (
  spaceID: SpaceID,
  input: UpdateSpaceNameInput
) => Promise<void> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (spaceID, input) => {
        const prevSpace = await snapshot.getPromise(spaceQuery(spaceID));

        const { name } = input;

        const nextSpace: Space = {
          ...prevSpace,
          name,
        };

        set(spacesByIDState, (previousSpaces) => ({
          ...previousSpaces,
          [nextSpace.id]: nextSpace,
        }));

        emitEvent({
          name: "SpaceNameUpdated",
          spaceID,
          prevName: prevSpace.name,
          nextName: nextSpace.name,
        });
      },
    [emitEvent]
  );
}

export function useCreateCollectionMutation(): (
  spaceID: SpaceID
) => Collection {
  const emitEvent = useEmitEvent();
  const createView = useCreateViewMutation();

  return useRecoilCallback(
    ({ set }) =>
      (spaceID) => {
        const newCollection: Collection = {
          id: generateCollectionID(),
          name: "",
          primaryFieldID: generateFieldID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          spaceID,
        };

        set(collectionsByIDState, (previousCollectionsByID) => ({
          ...previousCollectionsByID,
          [newCollection.id]: newCollection,
        }));

        emitEvent({
          name: "CollectionCreated",
          collection: newCollection,
        });

        createView(newCollection.id);

        return newCollection;
      },
    [emitEvent, createView]
  );
}

export function useUpdateDocumentFieldValueMutation<T extends FieldValue>(): (
  documentID: DocumentID,
  fieldID: FieldID,
  nextValue: T
) => Promise<void> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (documentID, fieldID, nextValue) => {
        const prevDocument = await snapshot.getPromise(
          documentQuery(documentID)
        );
        const prevValue = prevDocument.fields[fieldID];

        const nextDocument: Document = {
          ...prevDocument,
          fields: {
            ...prevDocument.fields,
            [fieldID]: nextValue,
          },
        };

        set(documentsByIDState, (previousDocumentsByID) => ({
          ...previousDocumentsByID,
          [nextDocument.id]: nextDocument,
        }));

        emitEvent({
          name: "DocumentFieldValueUpdated",
          fieldID,
          prevValue,
          nextValue,
        });
      },
    [emitEvent]
  );
}

export function useDeleteCollectionMutation(): (
  collectionID: CollectionID
) => void {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (collectionID) => {
        set(collectionsByIDState, (previousCollections) => {
          const updatedCollections = { ...previousCollections };

          delete updatedCollections[collectionID];

          return updatedCollections;
        });

        emitEvent({
          name: "CollectionDeleted",
          collectionID,
        });
      },
    [emitEvent]
  );
}

export interface UpdateCollectionNameInput {
  name: string;
}

export function useUpdateCollectionNameMutation(): (
  collectionID: CollectionID,
  input: UpdateCollectionNameInput
) => Promise<Collection> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (collectionID, input) => {
        const prevCollection = await snapshot.getPromise(
          collectionQuery(collectionID)
        );
        const { name } = input;

        const nextCollection: Collection = {
          ...prevCollection,
          name,
        };

        set(collectionsByIDState, (previousCollections) => ({
          ...previousCollections,
          [nextCollection.id]: nextCollection,
        }));

        emitEvent({
          name: "CollectionNameUpdated",
          collectionID,
          prevName: prevCollection.name,
          nextName: nextCollection.name,
        });

        return nextCollection;
      },
    [emitEvent]
  );
}

export function useCreateFilterMutation(): (
  viewID: ViewID,
  group: number,
  filterConfig: FilterConfig
) => Filter {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (viewID, group, filterConfig) => {
        const newFilter: Filter = {
          id: generateFilterID(),
          viewID,
          group,
          ...filterConfig,
        };

        set(filtersByIDState, (prevFilters) => ({
          ...prevFilters,
          [newFilter.id]: newFilter,
        }));

        emitEvent({
          name: "FilterCreated",
          filter: newFilter,
        });

        return newFilter;
      },
    [emitEvent]
  );
}

export function useUpdateFilterConfigMutation(): (
  filterID: FilterID,
  group: number,
  filterConfig: FilterConfig
) => Promise<Filter> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (filterID, group, filterConfig) => {
        const prevFilter = await snapshot.getPromise(filterQuery(filterID));

        const nextFilter: Filter = {
          ...prevFilter,
          ...filterConfig,
          group,
        };

        set(filtersByIDState, (prevFilters) => ({
          ...prevFilters,
          [nextFilter.id]: nextFilter,
        }));

        emitEvent({
          name: "FilterConfigUpdated",
          prevFilter,
          nextFilter,
        });

        return nextFilter;
      },
    [emitEvent]
  );
}

export function useUpdateFilterGroupMutation(): (
  filterID: FilterID,
  value: "and" | "or"
) => Promise<Filter> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (filterID, value) => {
        const prevFilter = await snapshot.getPromise(filterQuery(filterID));
        const prevFilters = await snapshot.getPromise(
          viewFiltersQuery(prevFilter.viewID)
        );
        const nextFilters = updateFilterGroup(prevFilter, value, prevFilters);

        set(filtersByIDState, (previousFilters) => ({
          ...previousFilters,
          ...nextFilters,
        }));

        emitEvent({
          name: "FilterGroupUpdated",
          prevFilters,
          nextFilters: Object.values(nextFilters),
        });

        return nextFilters[filterID];
      },
    [emitEvent]
  );
}

export function useDeleteFilterMutation(): (
  filterID: FilterID
) => Promise<void> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (filterID) => {
        const prevFilter = await snapshot.getPromise(filterQuery(filterID));
        const prevFilters = await snapshot.getPromise(
          viewFiltersQuery(prevFilter.viewID)
        );
        const nextFilters = deleteFilter(prevFilter, prevFilters);

        set(filtersByIDState, (_prevFilters) => {
          const clonedPreviousFilters: FiltersByIDState = {
            ..._prevFilters,
          };

          delete clonedPreviousFilters[filterID];

          return {
            ...clonedPreviousFilters,
            ...nextFilters,
          };
        });

        emitEvent({
          name: "FilterDeleted",
          filterID,
        });
      },
    [emitEvent]
  );
}

export function useCreateSortMutation(): (
  viewID: ViewID,
  sequence: number,
  sortConfig: SortConfig
) => Sort {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (viewID, sequence, sortConfig) => {
        const newSort: Sort = {
          id: generateSortID(),
          viewID,
          sequence,
          ...sortConfig,
        };

        set(sortsByIDState, (previousSorts) => ({
          ...previousSorts,
          [newSort.id]: newSort,
        }));

        emitEvent({
          name: "SortCreated",
          sort: newSort,
        });

        return newSort;
      },
    [emitEvent]
  );
}

export function useUpdateSortConfigMutation(): (
  sortID: SortID,
  sortConfig: SortConfig
) => Promise<Sort> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (sortID, sortConfig) => {
        const prevSort = await snapshot.getPromise(sortQuery(sortID));
        const nextSort: Sort = {
          ...prevSort,
          ...sortConfig,
        };

        set(sortsByIDState, (previousSortsByID) => ({
          ...previousSortsByID,
          [nextSort.id]: nextSort,
        }));

        emitEvent({
          name: "SortConfigUpdated",
          prevSort,
          nextSort,
        });

        return nextSort;
      },
    [emitEvent]
  );
}

export function useDeleteSortMutation(): (sortID: SortID) => Promise<void> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (sortID) => {
        const prevSort = await snapshot.getPromise(sortQuery(sortID));
        const prevSorts = await snapshot.getPromise(
          viewSortsQuery(prevSort.viewID)
        );
        const nextSorts = deleteSort(prevSort, prevSorts);

        set(sortsByIDState, (previousSorts) => {
          const clonedPreviousSorts: SortsByIDState = {
            ...previousSorts,
          };

          delete clonedPreviousSorts[sortID];

          return {
            ...clonedPreviousSorts,
            ...nextSorts,
          };
        });

        emitEvent({
          name: "SortDeleted",
          sortID,
        });
      },
    [emitEvent]
  );
}

export function useCreateGroupMutation(): (
  viewID: ViewID,
  sequence: number,
  sortConfig: SortConfig
) => Group {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (viewID: ViewID, sequence: number, sortConfig: SortConfig) => {
        const newGroup: Group = {
          id: generateGroupID(),
          viewID,
          sequence,
          ...sortConfig,
        };

        set(groupsByIDState, (previousGroups) => ({
          ...previousGroups,
          [newGroup.id]: newGroup,
        }));

        emitEvent({
          name: "GroupCreated",
          group: newGroup,
        });

        return newGroup;
      },
    [emitEvent]
  );
}

export function useUpdateGroupSortConfigMutation(): (
  groupID: GroupID,
  sortConfig: SortConfig
) => Promise<Group> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (groupID, sortConfig: SortConfig) => {
        const prevGroup = await snapshot.getPromise(groupQuery(groupID));
        const nextGroup: Group = {
          ...prevGroup,
          ...sortConfig,
        };

        set(groupsByIDState, (previousGroups) => ({
          ...previousGroups,
          [nextGroup.id]: nextGroup,
        }));

        emitEvent({
          name: "GroupConfigUpdated",
          prevGroup,
          nextGroup,
        });

        return nextGroup;
      },
    [emitEvent]
  );
}

export function useDeleteGroupMutation(): (groupID: GroupID) => Promise<void> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (groupID) => {
        const prevGroup = await snapshot.getPromise(groupQuery(groupID));
        const prevGroups = await snapshot.getPromise(
          viewGroupsQuery(prevGroup.viewID)
        );
        const nextGroups = deleteGroup(prevGroup, prevGroups);

        set(groupsByIDState, (previousGroups) => {
          const clonedPreviousGroups: GroupsByIDState = {
            ...previousGroups,
          };

          delete clonedPreviousGroups[groupID];

          return {
            ...clonedPreviousGroups,
            ...nextGroups,
          };
        });

        emitEvent({
          name: "GroupDeleted",
          groupID,
        });
      },
    [emitEvent]
  );
}

export function useUpdateListViewFieldConfigMutation(): (
  viewID: ViewID,
  fieldID: FieldID,
  config: Partial<ListViewFieldConfig>
) => Promise<void> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (viewID, fieldID, config) => {
        const prevView = await snapshot.getPromise(viewQuery(viewID));
        assertListView(prevView);

        const nextConfig: ListViewFieldConfig = {
          order: config.order || prevView.fieldsConfig[fieldID].order,
          width: config.width || prevView.fieldsConfig[fieldID].width,
          visible: config.visible || prevView.fieldsConfig[fieldID].visible,
        };

        const nextView: View = {
          ...prevView,
          fieldsConfig: {
            ...prevView.fieldsConfig,
            [fieldID]: nextConfig,
          },
        };

        set(viewsByIDState, (previousViews) => ({
          ...previousViews,
          [nextView.id]: nextView,
        }));

        emitEvent({
          name: "ListViewFieldConfigUpdated",
          prevView,
          nextView,
        });
      },
    [emitEvent]
  );
}

export function useCreateViewMutation(): (collectionID: CollectionID) => View {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (collectionID: CollectionID) => {
        const newView: View = {
          id: generateViewID(),
          name: "",
          type: "list",
          fixedFieldCount: 1,
          fieldsConfig: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          collectionID,
        };

        set(viewsByIDState, (previousViews) => ({
          ...previousViews,
          [newView.id]: newView,
        }));

        emitEvent({
          name: "ViewCreated",
          view: newView,
        });

        return newView;
      },
    [emitEvent]
  );
}

export function useDeleteViewMutation(): (viewID: ViewID) => void {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (viewID: ViewID) => {
        set(viewsByIDState, (previousViews) => {
          const updatedViews = { ...previousViews };

          delete updatedViews[viewID];

          return updatedViews;
        });

        emitEvent({
          name: "ViewDeleted",
          viewID,
        });
      },
    [emitEvent]
  );
}

export interface UpdateViewNameInput {
  name: string;
}

export function useUpdateViewNameMutation(): (
  viewID: ViewID,
  input: UpdateViewNameInput
) => Promise<View> {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (viewID, input) => {
        const prevView = await snapshot.getPromise(viewQuery(viewID));
        const { name } = input;

        const nextView: View = {
          ...prevView,
          name,
        };

        set(viewsByIDState, (previousViews) => ({
          ...previousViews,
          [nextView.id]: nextView,
        }));

        emitEvent({
          name: "ViewNameUpdated",
          prevView,
          nextView,
        });

        return nextView;
      },
    [emitEvent]
  );
}

export function useCreateFieldMutation(): (
  collectionID: CollectionID,
  name: string,
  description: string,
  fieldConfig: FieldConfig
) => Field {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (
        collectionID: CollectionID,
        name: string,
        description: string,
        fieldConfig: FieldConfig
      ) => {
        const newField: Field = {
          id: generateFieldID(),
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
          collectionID,
          ...fieldConfig,
        };

        set(fieldsByIDState, (previousFields) => ({
          ...previousFields,
          [newField.id]: newField,
        }));

        emitEvent({
          name: "FieldCreated",
          field: newField,
        });

        return newField;
      },
    [emitEvent]
  );
}

export function useDeleteFieldMutation(): (fieldID: FieldID) => void {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (fieldID) => {
        set(fieldsByIDState, (previousFields) => {
          const updatedFields = { ...previousFields };

          delete updatedFields[fieldID];

          return updatedFields;
        });

        emitEvent({
          name: "FieldDeleted",
          fieldID,
        });
      },
    [emitEvent]
  );
}

export function useCreateDocumentMutation(): (
  collectionID: CollectionID,
  values?: DocumentFieldValues
) => Document {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      (collectionID, values) => {
        const collectionFields = snapshot
          .getLoadable(collectionFieldsQuery(collectionID))
          .getValue();

        const newDocument: Document = {
          id: generateDocumentID(),
          fields: {
            ...getDefaultDocumentFieldValues(collectionFields),
            ...values,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          collectionID,
        };

        set(documentsByIDState, (previousDocuments) => ({
          ...previousDocuments,
          [newDocument.id]: newDocument,
        }));

        emitEvent({
          name: "DocumentCreated",
          document: newDocument,
        });

        return newDocument;
      },
    [emitEvent]
  );
}

export function useDeleteDocument(): (documentID: DocumentID) => void {
  const emitEvent = useEmitEvent();

  return useRecoilCallback(
    ({ set }) =>
      (documentID: DocumentID) => {
        set(documentsByIDState, (previousDocuments) => {
          const updatedDocuments = { ...previousDocuments };

          delete updatedDocuments[documentID];

          return updatedDocuments;
        });

        emitEvent({
          name: "DocumentDeleted",
          documentID,
        });
      },
    [emitEvent]
  );
}
