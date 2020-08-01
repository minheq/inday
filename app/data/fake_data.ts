import { Document } from './documents';
import { Collection } from './collections';
import { Space } from './spaces';
import { Field } from './fields';
import { View } from './views';
import { FieldType } from './constants';

export const space1: Space = {
  id: '1',
  name: 'Sales CRM',
  workspaceID: '2',
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const collection1: Collection = {
  id: '1',
  name: 'Opportunities',
  spaceID: space1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const collection2: Collection = {
  id: '2',
  name: 'Accounts',
  spaceID: space1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const field1: Field = {
  id: '1',
  name: 'Opportunity Name',
  description: '',
  type: FieldType.SingleLineText,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const field2: Field = {
  id: '2',
  name: 'Sale value',
  description: '',
  type: FieldType.Number,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const view1: View = {
  id: '1',
  name: 'All opportunities',
  type: 'list',
  collectionID: collection1.id,
  filterList: [],
  fieldsOrder: [field1.id, field2.id],
  fieldsConfig: {
    [field1.id]: {
      visible: true,
      width: 240,
    },
    [field2.id]: {
      visible: true,
      width: 180,
    },
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const view2: View = {
  id: '2',
  name: 'Grouped by owner',
  type: 'list',
  collectionID: collection1.id,
  filterList: [],
  fieldsOrder: [field1.id, field2.id],
  fieldsConfig: {
    [field1.id]: {
      visible: true,
      width: 240,
    },
    [field2.id]: {
      visible: true,
      width: 180,
    },
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const doc1: Document = {
  id: '1',
  collectionID: collection1.id,
  fields: {
    [field1.id]: {
      type: FieldType.SingleLineText,
      value: 'firstline',
    },
    [field2.id]: {
      type: FieldType.Number,
      value: 123,
    },
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const doc2: Document = {
  id: '2',
  fields: {
    [field1.id]: {
      type: FieldType.SingleLineText,
      value: 'secondline',
    },
    [field2.id]: {
      type: FieldType.Number,
      value: 321,
    },
  },
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};
