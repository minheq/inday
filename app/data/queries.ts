import { selectorFamily, selector } from 'recoil';
import {
  recordsByIDState,
  collectionsByIDState,
  fieldsByIDState,
  filtersByIDState,
  spacesByIDState,
  viewsByIDState,
  sortsByIDState,
  collaboratorsByIDState,
  groupsByIDState,
  RecordsByIDState,
} from './atoms';
import { Record, RecordID } from './records';
import { Collection, CollectionID } from './collections';
import { Field, FieldID, FieldValue } from './fields';
import {
  Filter,
  FilterGroup,
  FilterID,
  filterRecords,
  FilterGetters,
} from './filters';
import { Space, SpaceID } from './spaces';
import { View, ViewID } from './views';
import { last, isEmpty, keyedBy } from '../../lib/js_utils';
import { Sort, SortID, sortRecords, SortGetters } from './sorts';
import { Collaborator } from './collaborators';
import { Group, GroupID } from './groups';
import { UserID } from './user';

export const spaceQuery = selectorFamily<Space | null, SpaceID>({
  key: 'SpaceQuery',
  get: (spaceID: SpaceID) => ({ get }) => {
    const spacesByID = get(spacesByIDState);
    const space = spacesByID[spaceID];

    if (space === undefined) {
      return null;
    }

    return space;
  },
});

export const spaceCollectionsQuery = selectorFamily<Collection[], SpaceID>({
  key: 'SpaceCollectionsQuery',
  get: (spaceID: SpaceID) => ({ get }) => {
    const collections = get(collectionsQuery);

    return collections.filter((c) => c.spaceID === spaceID);
  },
});

export const spacesQuery = selector({
  key: 'SpacesQuery',
  get: ({ get }) => {
    const spacesByID = get(spacesByIDState);

    return Object.values(spacesByID) as Space[];
  },
});

export const recordsQuery = selector({
  key: 'RecordsQuery',
  get: ({ get }) => {
    const recordsByID = get(recordsByIDState);

    return Object.values(recordsByID) as Record[];
  },
});

export const recordQuery = selectorFamily<Record, string>({
  key: 'RecordQuery',
  get: (recordID: string) => ({ get }) => {
    const recordsByID = get(recordsByIDState);
    const record = recordsByID[recordID];

    if (record === undefined) {
      throw new Error('Record not found');
    }

    return record;
  },
});

export const collectionRecordsQuery = selectorFamily<Record[], string>({
  key: 'CollectionRecordsQuery',
  get: (collectionID: string) => ({ get }) => {
    const records = get(recordsQuery);

    return records.filter((record) => record.collectionID === collectionID);
  },
});

export const collectionsQuery = selector({
  key: 'CollectionsQuery',
  get: ({ get }) => {
    const collectionsByID = get(collectionsByIDState);

    return Object.values(collectionsByID) as Collection[];
  },
});

export const collectionQuery = selectorFamily<Collection, CollectionID>({
  key: 'CollectionQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const collectionsByID = get(collectionsByIDState);
    const collection = collectionsByID[collectionID];

    if (collection === undefined) {
      throw new Error('Collection not found');
    }

    return collection;
  },
});

export const fieldsQuery = selector({
  key: 'FieldsQuery',
  get: ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    return Object.values(fieldsByID) as Field[];
  },
});

export const fieldQuery = selectorFamily<Field, FieldID>({
  key: 'FieldQuery',
  get: (fieldID: FieldID) => ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    const field = fieldsByID[fieldID];

    if (field === undefined) {
      throw new Error('Field not found');
    }

    return field;
  },
});

export const collectionFieldsByIDQuery = selectorFamily<
  { [fieldID: string]: Field },
  string
>({
  key: 'CollectionFieldsByIDQuery',
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    const fieldsByID: { [fieldID: string]: Field } = {};

    for (const field of fields) {
      if (field.collectionID === collectionID) {
        fieldsByID[field.id] = field;
      }
    }

    return fieldsByID;
  },
});

export const collectionFieldsQuery = selectorFamily<Field[], string>({
  key: 'CollectionFieldsQuery',
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    return fields.filter((f) => f.collectionID === collectionID);
  },
});

export const filtersQuery = selector({
  key: 'FiltersQuery',
  get: ({ get }) => {
    const filtersByID = get(filtersByIDState);

    return Object.values(filtersByID) as Filter[];
  },
});

export const filterQuery = selectorFamily<Filter, FilterID>({
  key: 'FilterQuery',
  get: (filterID: FilterID) => ({ get }) => {
    const filtersByID = get(filtersByIDState);

    const filter = filtersByID[filterID];

    if (filter === undefined) {
      throw new Error('Filter not found');
    }

    return filter;
  },
});

export const sortsQuery = selector({
  key: 'SortsQuery',
  get: ({ get }) => {
    const sortsByID = get(sortsByIDState);

    return Object.values(sortsByID) as Sort[];
  },
});

export const sortQuery = selectorFamily<Sort, SortID>({
  key: 'SortQuery',
  get: (sortID: SortID) => ({ get }) => {
    const sortsByID = get(sortsByIDState);

    const sort = sortsByID[sortID];

    if (sort === undefined) {
      throw new Error('Sort not found');
    }

    return sort;
  },
});

export const groupsQuery = selector({
  key: 'GroupsQuery',
  get: ({ get }) => {
    const groupsByID = get(groupsByIDState);

    return Object.values(groupsByID) as Group[];
  },
});

export const groupQuery = selectorFamily<Group, GroupID>({
  key: 'GroupQuery',
  get: (groupID: GroupID) => ({ get }) => {
    const groupsByID = get(groupsByIDState);

    const group = groupsByID[groupID];

    if (group === undefined) {
      throw new Error('Sort not found');
    }

    return group;
  },
});

export const viewsQuery = selector({
  key: 'ViewsQuery',
  get: ({ get }) => {
    const viewsByID = get(viewsByIDState);

    return Object.values(viewsByID) as View[];
  },
});

export const viewQuery = selectorFamily<View, ViewID>({
  key: 'ViewQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const viewsByID = get(viewsByIDState);
    const view = viewsByID[viewID];

    if (view === undefined) {
      throw new Error('View not found');
    }

    return view;
  },
});

export const viewFiltersQuery = selectorFamily<Filter[], ViewID>({
  key: 'ViewFiltersQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const filters = get(filtersQuery);

    return filters
      .slice(0)
      .filter((f) => f.viewID === view.id)
      .sort((a, b) => a.group - b.group);
  },
});

export const viewSortsQuery = selectorFamily<Sort[], ViewID>({
  key: 'ViewSortsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const sorts = get(sortsQuery);

    return sorts
      .slice(0)
      .filter((f) => f.viewID === view.id)
      .sort((a, b) => a.sequence - b.sequence);
  },
});

export const viewGroupsQuery = selectorFamily<Group[], ViewID>({
  key: 'ViewGroupsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const groups = get(groupsQuery);

    return groups
      .slice(0)
      .filter((f) => f.viewID === view.id)
      .sort((a, b) => a.sequence - b.sequence);
  },
});

export const viewFilterGroupsQuery = selectorFamily<FilterGroup[], ViewID>({
  key: 'ViewFilterGroupsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const filters = get(viewFiltersQuery(viewID));

    const filterGroups: Filter[][] = [];

    let currentGroup = 1;

    for (const filter of filters) {
      if (filter.group === currentGroup && filterGroups[currentGroup - 1]) {
        filterGroups[currentGroup - 1].push(filter);
      } else {
        filterGroups.push([filter]);
        currentGroup++;
      }
    }

    return filterGroups;
  },
});

export const viewFiltersGroupMaxQuery = selectorFamily<number, ViewID>({
  key: 'ViewFiltersGroupMaxQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const filterGroups = get(viewFilterGroupsQuery(viewID));

    if (isEmpty(filterGroups)) {
      return 0;
    }

    const lastFilterGroup = last(filterGroups);

    return lastFilterGroup[0].group;
  },
});

export const viewSortsSequenceMaxQuery = selectorFamily<number, ViewID>({
  key: 'ViewSortsSequenceMaxQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const sorts = get(viewSortsQuery(viewID));

    if (isEmpty(sorts)) {
      return 0;
    }

    return Math.max(...sorts.map((s) => s.sequence));
  },
});

export const viewGroupsSequenceMaxQuery = selectorFamily<number, ViewID>({
  key: 'ViewGroupsSequenceMaxQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const group = get(viewGroupsQuery(viewID));

    if (isEmpty(group)) {
      return 0;
    }

    return Math.max(...group.map((s) => s.sequence));
  },
});

export const collectionViewsQuery = selectorFamily<View[], CollectionID>({
  key: 'CollectionViewsQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const views = get(viewsQuery);

    return views.filter((v) => v.collectionID === collectionID);
  },
});

export const collectionRecordsByIDQuery = selectorFamily<
  RecordsByIDState,
  CollectionID
>({
  key: 'CollectionRecordsByIDQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const records = get(recordsQuery);

    const collectionRecords = records.filter(
      (r) => r.collectionID === collectionID,
    );

    return keyedBy(collectionRecords, (r) => r.id);
  },
});

export const collaboratorQuery = selectorFamily<Collaborator, UserID>({
  key: 'CollaboratorQuery',
  get: (collaboratorID: UserID) => ({ get }) => {
    const collaboratorsByID = get(collaboratorsByIDState);
    const collaborator = collaboratorsByID[collaboratorID];

    if (collaborator === undefined) {
      throw new Error('Collaborator not found');
    }

    return collaborator;
  },
});

export const collaboratorsQuery = selector<Collaborator[]>({
  key: 'Collaborators',
  get: ({ get }) => {
    const collaboratorsByID = get(collaboratorsByIDState);

    return Object.values(collaboratorsByID);
  },
});

export const recordFieldValueQuery = selectorFamily<
  FieldValue,
  { recordID: RecordID; fieldID: FieldID }
>({
  key: 'RecordFieldValueQuery',
  get: ({ recordID, fieldID }) => ({ get }) => {
    const recordsByID = get(recordsByIDState);
    const record = recordsByID[recordID];

    if (record === undefined) {
      throw new Error('Record not found');
    }

    return record.fields[fieldID];
  },
});

export const viewRecordsQuery = selectorFamily<Record[], ViewID>({
  key: 'ViewRecordsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const records = get(collectionRecordsQuery(view.collectionID));
    const filterGroups = get(viewFilterGroupsQuery(viewID));
    const sorts = get(viewSortsQuery(viewID));

    const getField = (fieldID: FieldID) => get(fieldQuery(fieldID));
    const getRecord = (recordID: RecordID) => get(recordQuery(recordID));
    const getCollaborator = (collaboratorID: UserID) =>
      get(collaboratorQuery(collaboratorID));
    const getCollection = (collectionID: CollectionID) =>
      get(collectionQuery(collectionID));

    const filterGetters: FilterGetters = {
      getField,
    };

    const sortGetters: SortGetters = {
      getField,
      getRecord,
      getCollaborator,
      getCollection,
    };

    let finalRecords = records;

    finalRecords = filterRecords(filterGroups, finalRecords, filterGetters);
    finalRecords = sortRecords(sorts, finalRecords, sortGetters);

    return finalRecords;
  },
});
