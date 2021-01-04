import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { EventConfig, Event } from '../../models/events';
import {
  Collection,
  CollectionID,
  generateCollectionID,
} from '../../models/collections';

import { generateSpaceID, Space, SpaceID } from '../../models/spaces';
import {
  View,
  ViewID,
  assertListView,
  ListViewFieldConfig,
  generateViewID,
} from '../../models/views';
import {
  Field,
  FieldConfig,
  FieldID,
  FieldValue,
  generateFieldID,
  getDefaultDocumentFieldValues,
} from '../../models/fields';
import {
  Document,
  DocumentFieldValues,
  DocumentID,
  generateDocumentID,
} from '../../models/documents';
import {
  Filter,
  FilterConfig,
  updateFilterGroup,
  FilterID,
  deleteFilter,
  generateFilterID,
} from '../../models/filters';
import { useLogger } from '../../lib/logger';
import {
  spacesByIDState,
  collectionsByIDState,
  viewsByIDState,
  filtersByIDState,
  FiltersByIDState,
  ViewsByIDState,
  fieldsByIDState,
  documentsByIDState,
  sortsByIDState,
  eventsState,
  SortsByIDState,
  groupsByIDState,
  GroupsByIDState,
} from './atoms';
import {
  SortConfig,
  Sort,
  SortID,
  deleteSort,
  generateSortID,
} from '../../models/sorts';
import {
  Group,
  GroupID,
  deleteGroup,
  generateGroupID,
} from '../../models/groups';
import { EventEmitter } from '../../lib/event_emitter';
import {
  useCollectionFieldsQuery,
  useCollectionQuery,
  useDocumentQuery,
  useFieldQuery,
  useFilterQuery,
  useGroupQuery,
  useSortQuery,
  useSpaceQuery,
  useViewFiltersQuery,
  useViewGroupsQuery,
  useViewQuery,
  useViewSortsQuery,
  useWorkspaceQuery,
} from './queries';

export const eventEmitter = new EventEmitter<Event>();

export function useEmitEvent(): (eventConfig: EventConfig) => void {
  const logger = useLogger();
  const workspace = useWorkspaceQuery();
  const setEvents = useSetRecoilState(eventsState);

  return useCallback(
    (eventConfig: EventConfig) => {
      const event: Event = {
        ...eventConfig,
        createdAt: new Date(),
        workspaceID: workspace.id,
      };

      setEvents((prevEvents) => [...prevEvents, event]);

      logger.debug('Emit event', event);

      eventEmitter.emit(event);
    },
    [workspace, setEvents, logger],
  );
}

export function useCreateSpace(): () => Space {
  const emitEvent = useEmitEvent();
  const workspace = useWorkspaceQuery();
  const setSpaces = useSetRecoilState(spacesByIDState);
  const createCollection = useCreateCollection();

  return useCallback(() => {
    const newSpace: Space = {
      id: generateSpaceID(),
      name: '',
      workspaceID: workspace.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSpaces((previousSpaces) => ({
      ...previousSpaces,
      [newSpace.id]: newSpace,
    }));

    emitEvent({
      name: 'SpaceCreated',
      space: newSpace,
    });

    createCollection(newSpace.id);

    return newSpace;
  }, [emitEvent, workspace, setSpaces, createCollection]);
}

export function useDeleteSpace(): (space: Space) => void {
  const emitEvent = useEmitEvent();
  const setSpaces = useSetRecoilState(spacesByIDState);

  return useCallback(
    (space: Space) => {
      setSpaces((previousSpaces) => {
        const updatedSpaces = { ...previousSpaces };

        delete updatedSpaces[space.id];

        return updatedSpaces;
      });

      emitEvent({
        name: 'SpaceDeleted',
        space,
      });
    },
    [emitEvent, setSpaces],
  );
}

export interface UpdateSpaceNameInput {
  name: string;
}

export function useUpdateSpaceName(
  spaceID: SpaceID,
): (input: UpdateSpaceNameInput) => void {
  const emitEvent = useEmitEvent();
  const prevSpace = useSpaceQuery(spaceID);
  const setSpaces = useSetRecoilState(spacesByIDState);

  return useCallback(
    (input: UpdateSpaceNameInput) => {
      const { name } = input;

      const nextSpace: Space = {
        ...prevSpace,
        name,
      };

      setSpaces((previousSpaces) => ({
        ...previousSpaces,
        [nextSpace.id]: nextSpace,
      }));

      emitEvent({
        name: 'SpaceNameUpdated',
        prevSpace,
        nextSpace,
      });
    },
    [emitEvent, setSpaces, prevSpace],
  );
}

export function useCreateCollection(): (spaceID: SpaceID) => Collection {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsByIDState);
  const createView = useCreateView();

  return useCallback(
    (spaceID: SpaceID) => {
      const newCollection: Collection = {
        id: generateCollectionID(),
        name: '',
        primaryFieldID: generateFieldID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        spaceID,
      };

      setCollections((previousCollections) => ({
        ...previousCollections,
        [newCollection.id]: newCollection,
      }));

      emitEvent({
        name: 'CollectionCreated',
        collection: newCollection,
      });

      createView(newCollection.id);

      return newCollection;
    },
    [emitEvent, setCollections, createView],
  );
}

export function useUpdateDocumentFieldValue<T extends FieldValue>(
  documentID: DocumentID,
): (fieldID: FieldID, nextValue: T) => void {
  const emitEvent = useEmitEvent();
  const setDocumentsByID = useSetRecoilState(documentsByIDState);
  const prevDocument = useDocumentQuery(documentID);

  return useCallback(
    (fieldID, nextValue) => {
      const prevValue = prevDocument.fields[fieldID];

      const nextDocument: Document = {
        ...prevDocument,
        fields: {
          ...prevDocument.fields,
          [fieldID]: nextValue,
        },
      };

      setDocumentsByID((previousDocumentsByID) => ({
        ...previousDocumentsByID,
        [nextDocument.id]: nextDocument,
      }));

      emitEvent({
        name: 'DocumentFieldValueUpdated',
        fieldID,
        prevValue,
        nextValue,
      });
    },
    [emitEvent, setDocumentsByID, prevDocument],
  );
}

export function useDeleteCollection(collectionID: CollectionID): () => void {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsByIDState);
  const collection = useCollectionQuery(collectionID);

  return useCallback(() => {
    setCollections((previousCollections) => {
      const updatedCollections = { ...previousCollections };

      delete updatedCollections[collectionID];

      return updatedCollections;
    });

    emitEvent({
      name: 'CollectionDeleted',
      collection,
    });
  }, [emitEvent, setCollections, collection, collectionID]);
}

export interface UpdateCollectionNameInput {
  name: string;
}

export function useUpdateCollectionName(
  collectionID: CollectionID,
): (input: UpdateCollectionNameInput) => Collection {
  const emitEvent = useEmitEvent();
  const prevCollection = useCollectionQuery(collectionID);
  const setCollections = useSetRecoilState(collectionsByIDState);

  return useCallback(
    (input: UpdateCollectionNameInput) => {
      const { name } = input;

      const nextCollection: Collection = {
        ...prevCollection,
        name,
      };

      setCollections((previousCollections) => ({
        ...previousCollections,
        [nextCollection.id]: nextCollection,
      }));

      emitEvent({
        name: 'CollectionNameUpdated',
        prevCollection,
        nextCollection,
      });

      return nextCollection;
    },
    [prevCollection, setCollections, emitEvent],
  );
}

export function useDocumentQueryPrimaryFieldValueCallback(
  documentID: DocumentID,
): [field: Field, value: FieldValue] {
  const document = useDocumentQuery(documentID);
  const collection = useCollectionQuery(document.collectionID);
  const field = useFieldQuery(collection.primaryFieldID);

  return [field, document.fields[collection.primaryFieldID]];
}

export function useCreateFilter(
  viewID: ViewID,
): (group: number, filterConfig: FilterConfig) => Filter {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);

  return useCallback(
    (group: number, filterConfig: FilterConfig) => {
      const newFilter: Filter = {
        id: generateFilterID(),
        viewID,
        group,
        ...filterConfig,
      };

      setFilters((prevFilters) => ({
        ...prevFilters,
        [newFilter.id]: newFilter,
      }));

      emitEvent({
        name: 'FilterCreated',
        filter: newFilter,
      });

      return newFilter;
    },
    [emitEvent, setFilters, viewID],
  );
}

export function useUpdateFilterConfig(
  filterID: FilterID,
): (group: number, filterConfig: FilterConfig) => void {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);
  const prevFilter = useFilterQuery(filterID);

  return useCallback(
    (group: number, filterConfig: FilterConfig) => {
      const nextFilter: Filter = {
        ...prevFilter,
        ...filterConfig,
        group,
      };
      setFilters((prevFilters) => ({
        ...prevFilters,
        [nextFilter.id]: nextFilter,
      }));

      emitEvent({
        name: 'FilterConfigUpdated',
        prevFilter,
        nextFilter,
      });

      return nextFilter;
    },
    [emitEvent, setFilters, prevFilter],
  );
}

export function useUpdateFilterGroup(
  filterID: FilterID,
): (value: 'and' | 'or') => Filter {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);
  const prevFilter = useFilterQuery(filterID);
  const prevFilters = useViewFiltersQuery(prevFilter.viewID);

  return useCallback(
    (value: 'and' | 'or') => {
      const nextFilters = updateFilterGroup(prevFilter, value, prevFilters);

      setFilters((previousFilters) => ({
        ...previousFilters,
        ...nextFilters,
      }));

      emitEvent({
        name: 'FilterGroupUpdated',
        prevFilters,
        nextFilters: Object.values(nextFilters),
      });

      return nextFilters[filterID];
    },
    [emitEvent, setFilters, prevFilter, prevFilters, filterID],
  );
}

export function useDeleteFilter(filterID: FilterID): () => void {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState<FiltersByIDState>(filtersByIDState);
  const prevFilter = useFilterQuery(filterID);
  const prevFilters = useViewFiltersQuery(prevFilter.viewID);

  return useCallback(() => {
    const nextFilters = deleteFilter(prevFilter, prevFilters);

    setFilters((_prevFilters) => {
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
      name: 'FilterDeleted',
      prevFilters,
      nextFilters: Object.values(nextFilters),
    });
  }, [emitEvent, setFilters, prevFilters, prevFilter, filterID]);
}

export function useCreateSort(
  viewID: ViewID,
): (sequence: number, sortConfig: SortConfig) => Sort {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState(sortsByIDState);

  return useCallback(
    (sequence: number, sortConfig: SortConfig) => {
      const newSort: Sort = {
        id: generateSortID(),
        viewID,
        sequence,
        ...sortConfig,
      };

      setSorts((previousSorts) => ({
        ...previousSorts,
        [newSort.id]: newSort,
      }));

      emitEvent({
        name: 'SortCreated',
        sort: newSort,
      });

      return newSort;
    },
    [emitEvent, setSorts, viewID],
  );
}

export function useUpdateSortConfig(
  sortID: SortID,
): (sortConfig: SortConfig) => Sort {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState(sortsByIDState);
  const prevSort = useSortQuery(sortID);

  return useCallback(
    (sortConfig: SortConfig) => {
      const nextSort: Sort = {
        ...prevSort,
        ...sortConfig,
      };

      setSorts((previousSorts) => ({
        ...previousSorts,
        [nextSort.id]: nextSort,
      }));

      emitEvent({
        name: 'SortConfigUpdated',
        prevSort,
        nextSort,
      });

      return nextSort;
    },
    [emitEvent, setSorts, prevSort],
  );
}

export function useDeleteSort(sortID: SortID): () => void {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState<SortsByIDState>(sortsByIDState);
  const prevSort = useSortQuery(sortID);
  const prevSorts = useViewSortsQuery(prevSort.viewID);

  return useCallback(() => {
    const nextSorts = deleteSort(prevSort, prevSorts);

    setSorts((previousSorts) => {
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
      name: 'SortDeleted',
      prevSorts,
      nextSorts: Object.values(nextSorts),
    });
  }, [emitEvent, setSorts, prevSorts, prevSort, sortID]);
}

export function useCreateGroup(): (
  viewID: ViewID,
  sequence: number,
  sortConfig: SortConfig,
) => Group {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);

  return useCallback(
    (viewID: ViewID, sequence: number, sortConfig: SortConfig) => {
      const newGroup: Group = {
        id: generateGroupID(),
        viewID,
        sequence,
        ...sortConfig,
      };

      setGroups((previousGroups) => ({
        ...previousGroups,
        [newGroup.id]: newGroup,
      }));

      emitEvent({
        name: 'GroupCreated',
        group: newGroup,
      });

      return newGroup;
    },
    [emitEvent, setGroups],
  );
}

export function useUpdateGroupSortConfig(
  groupID: GroupID,
): (sortConfig: SortConfig) => Group {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);
  const prevGroup = useGroupQuery(groupID);

  return useCallback(
    (sortConfig: SortConfig) => {
      const nextGroup: Group = {
        ...prevGroup,
        ...sortConfig,
      };

      setGroups((previousGroups) => ({
        ...previousGroups,
        [nextGroup.id]: nextGroup,
      }));

      emitEvent({
        name: 'GroupConfigUpdated',
        prevGroup,
        nextGroup,
      });

      return nextGroup;
    },
    [emitEvent, setGroups, prevGroup],
  );
}

export function useDeleteGroup(groupID: GroupID): () => void {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState<GroupsByIDState>(groupsByIDState);
  const prevGroup = useGroupQuery(groupID);
  const prevGroups = useViewGroupsQuery(prevGroup.viewID);

  return useCallback(() => {
    const nextGroups = deleteGroup(prevGroup, prevGroups);

    setGroups((previousGroups) => {
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
      name: 'GroupDeleted',
      prevGroups,
      nextGroups: Object.values(nextGroups),
    });
  }, [emitEvent, setGroups, prevGroup, prevGroups, groupID]);
}

export function useUpdateListViewFieldConfig(
  viewID: ViewID,
): (fieldID: FieldID, config: Partial<ListViewFieldConfig>) => void {
  const emitEvent = useEmitEvent();
  const prevView = useViewQuery(viewID);
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);
  assertListView(prevView);

  return useCallback(
    (fieldID: FieldID, config: Partial<ListViewFieldConfig>) => {
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

      setViews((previousViews) => ({
        ...previousViews,
        [nextView.id]: nextView,
      }));

      emitEvent({
        name: 'ListViewFieldConfigUpdated',
        prevView,
        nextView,
      });
    },
    [emitEvent, setViews, prevView],
  );
}

export function useCreateView(): (collectionID: CollectionID) => View {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  return useCallback(
    (collectionID: CollectionID) => {
      const newView: View = {
        id: generateViewID(),
        name: '',
        type: 'list',
        fixedFieldCount: 1,
        fieldsConfig: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        collectionID,
      };

      setViews((previousViews) => ({
        ...previousViews,
        [newView.id]: newView,
      }));

      emitEvent({
        name: 'ViewCreated',
        view: newView,
      });

      return newView;
    },
    [emitEvent, setViews],
  );
}

export function useDeleteView(viewID: ViewID): () => void {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState(viewsByIDState);

  return useCallback(() => {
    setViews((previousViews) => {
      const updatedViews = { ...previousViews };

      delete updatedViews[viewID];

      return updatedViews;
    });

    emitEvent({
      name: 'ViewDeleted',
      viewID,
    });
  }, [emitEvent, setViews, viewID]);
}

export interface UpdateViewNameInput {
  name: string;
}

export function useUpdateViewName(
  viewID: ViewID,
): (input: UpdateViewNameInput) => View {
  const emitEvent = useEmitEvent();
  const prevView = useViewQuery(viewID);
  const setViews = useSetRecoilState(viewsByIDState);

  return useCallback(
    (input: UpdateViewNameInput) => {
      const { name } = input;

      const nextView: View = {
        ...prevView,
        name,
      };

      setViews((previousViews) => ({
        ...previousViews,
        [nextView.id]: nextView,
      }));

      emitEvent({
        name: 'ViewNameUpdated',
        prevView,
        nextView,
      });

      return nextView;
    },
    [prevView, setViews, emitEvent],
  );
}

export function useGetFieldCallback(): (fieldID: FieldID) => Field {
  const fields = useRecoilValue(fieldsByIDState);

  return useCallback(
    (fieldID: FieldID) => {
      const field = fields[fieldID];

      if (field === undefined) {
        throw new Error('Field not found');
      }

      return field;
    },
    [fields],
  );
}

export function useCreateField(): (
  collectionID: CollectionID,
  name: string,
  description: string,
  fieldConfig: FieldConfig,
) => Field {
  const emitEvent = useEmitEvent();
  const setFields = useSetRecoilState(fieldsByIDState);

  return useCallback(
    (
      collectionID: CollectionID,
      name: string,
      description: string,
      fieldConfig: FieldConfig,
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

      setFields((previousFields) => ({
        ...previousFields,
        [newField.id]: newField,
      }));

      emitEvent({
        name: 'FieldCreated',
        field: newField,
      });

      return newField;
    },
    [emitEvent, setFields],
  );
}

export function useDeleteField(fieldID: FieldID): () => void {
  const emitEvent = useEmitEvent();
  const setFields = useSetRecoilState(fieldsByIDState);

  return useCallback(() => {
    setFields((previousFields) => {
      const updatedFields = { ...previousFields };

      delete updatedFields[fieldID];

      return updatedFields;
    });

    emitEvent({
      name: 'FieldDeleted',
      fieldID,
    });
  }, [emitEvent, setFields, fieldID]);
}

export interface UpdateFieldNameInput {
  name: string;
}

export function useUpdateFieldName(
  fieldID: FieldID,
): (input: UpdateFieldNameInput) => Field {
  const emitEvent = useEmitEvent();
  const getField = useGetFieldCallback();
  const setFields = useSetRecoilState(fieldsByIDState);

  return useCallback(
    (input: UpdateFieldNameInput) => {
      const { name } = input;
      const prevField = getField(fieldID);

      const nextField: Field = {
        ...prevField,
        name,
      };

      setFields((previousFields) => ({
        ...previousFields,
        [nextField.id]: nextField,
      }));

      emitEvent({
        name: 'FieldNameUpdated',
        prevField,
        nextField,
      });

      return nextField;
    },
    [getField, setFields, emitEvent, fieldID],
  );
}

export function useCreateDocument(
  collectionID: CollectionID,
): (values?: DocumentFieldValues) => Document {
  const emitEvent = useEmitEvent();
  const setDocuments = useSetRecoilState(documentsByIDState);
  const collectionFields = useCollectionFieldsQuery(collectionID);

  return useCallback(
    (values?: DocumentFieldValues) => {
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

      setDocuments((previousDocuments) => ({
        ...previousDocuments,
        [newDocument.id]: newDocument,
      }));

      emitEvent({
        name: 'DocumentCreated',
        document: newDocument,
      });

      return newDocument;
    },
    [emitEvent, setDocuments, collectionFields, collectionID],
  );
}

export function useDeleteDocument(): (documentID: DocumentID) => void {
  const emitEvent = useEmitEvent();
  const setDocuments = useSetRecoilState(documentsByIDState);

  return useCallback(
    (documentID: DocumentID) => {
      setDocuments((previousDocuments) => {
        const updatedDocuments = { ...previousDocuments };

        delete updatedDocuments[documentID];

        return updatedDocuments;
      });

      emitEvent({
        name: 'DocumentDeleted',
        documentID,
      });
    },
    [emitEvent, setDocuments],
  );
}
