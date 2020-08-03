import { Document } from './documents';
import { Collection } from './collections';
import { Space } from './spaces';
import {
  NumberField,
  SingleLineTextField,
  MultiLineTextField,
  SingleSelectField,
  MultiSelectField,
  SingleCollaboratorField,
  MultiCollaboratorField,
  SingleDocumentLinkField,
  MultiDocumentLinkField,
  DateField,
  PhoneNumberField,
  EmailField,
  URLField,
  CurrencyField,
  CheckboxField,
  Field,
} from './fields';
import { View } from './views';
import { FieldType } from './constants';
import { Collaborator } from './collaborators';

export const space1: Space = {
  id: '1',
  name: 'Sales CRM',
  workspaceID: '2',
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const collaborator1: Collaborator = {
  id: '1',
  name: 'Bill Gates',
  email: 'bill@gates.com',
  spaceID: space1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const collaborator2: Collaborator = {
  id: '2',
  name: 'Elon Musk',
  email: 'elon@musk.com',
  spaceID: space1.id,
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

export const col2Field1: SingleLineTextField = {
  id: '21',
  name: 'Name',
  description: '',
  default: null,
  type: FieldType.SingleLineText,
  collectionID: collection2.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col2Field2: URLField = {
  id: '22',
  name: 'Company website',
  description: '',
  type: FieldType.URL,
  collectionID: collection2.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field1: SingleLineTextField = {
  id: '11',
  name: 'SingleLineTextField',
  description: '',
  default: null,
  type: FieldType.SingleLineText,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field2: MultiLineTextField = {
  id: '12',
  name: 'MultiLineTextField',
  description: '',
  richText: false,
  type: FieldType.MultiLineText,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field3: SingleSelectField = {
  id: '13',
  name: 'SingleSelectField',
  description: '',
  options: [
    { value: 'Qualification', color: 'black' },
    { value: 'Proposal', color: 'black' },
    { value: 'Evaluation', color: 'black' },
  ],
  order: ['Qualification', 'Proposal', 'Evaluation'],
  type: FieldType.SingleSelect,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field4: MultiSelectField = {
  id: '14',
  name: 'MultiSelectField',
  description: '',
  options: [
    { value: 'Qualification', color: 'black' },
    { value: 'Proposal', color: 'black' },
    { value: 'Evaluation', color: 'black' },
  ],
  order: ['Qualification', 'Proposal', 'Evaluation'],
  type: FieldType.MultiSelect,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field5: SingleCollaboratorField = {
  id: '15',
  name: 'SingleCollaboratorField',
  description: '',
  type: FieldType.SingleCollaborator,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field6: MultiCollaboratorField = {
  id: '16',
  name: 'MultiCollaboratorField',
  description: '',
  type: FieldType.MultiCollaborator,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field7: SingleDocumentLinkField = {
  id: '17',
  name: 'SingleDocumentLinkField',
  description: '',
  documentsFromCollectionID: collection2.id,
  type: FieldType.SingleDocumentLink,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field8: MultiDocumentLinkField = {
  id: '18',
  name: 'MultiDocumentLinkField',
  description: '',
  documentsFromCollectionID: collection2.id,
  type: FieldType.MultiDocumentLink,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field9: DateField = {
  id: '19',
  name: 'DateField',
  description: '',
  format: 'yyyy-MM-dd',
  includeTime: false,
  timeFormat: '12hour',
  type: FieldType.Date,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field10: PhoneNumberField = {
  id: '110',
  name: 'PhoneNumberField',
  description: '',
  type: FieldType.PhoneNumber,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field11: EmailField = {
  id: '111',
  name: 'EmailField',
  description: '',
  type: FieldType.Email,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field12: URLField = {
  id: '112',
  name: 'URLField',
  description: '',
  type: FieldType.URL,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field13: NumberField = {
  id: '113',
  name: 'NumberField',
  description: '',
  default: null,
  format: 'integer',
  type: FieldType.Number,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field14: CurrencyField = {
  id: '114',
  name: 'CurrencyField',
  description: '',
  currency: '$',
  precision: 2,
  allowNegative: true,
  type: FieldType.Currency,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Field15: CheckboxField = {
  id: '115',
  name: 'CheckboxField',
  description: '',
  emoji: ':thumbsup:',
  type: FieldType.Checkbox,
  collectionID: collection1.id,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1View1: View = {
  id: '1',
  name: 'All opportunities',
  type: 'list',
  collectionID: collection1.id,
  filters: [],
  fieldsOrder: [col1Field1.id, col1Field2.id],
  fieldsConfig: {
    [col1Field1.id]: {
      visible: true,
      width: 240,
    },
    [col1Field2.id]: {
      visible: true,
      width: 180,
    },
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1View2: View = {
  id: '2',
  name: 'Grouped by owner',
  type: 'list',
  collectionID: collection1.id,
  filters: [],
  fieldsOrder: [col1Field1.id, col1Field2.id],
  fieldsConfig: {
    [col1Field1.id]: {
      visible: true,
      width: 240,
    },
    [col1Field2.id]: {
      visible: true,
      width: 180,
    },
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col2Doc1: Document = {
  id: '21',
  collectionID: collection2.id,
  fields: {
    [col2Field1.id]: 'Acepoly',
    [col2Field2.id]: 'https://www.example.com',
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col2Doc2: Document = {
  id: '22',
  collectionID: collection2.id,
  fields: {
    [col2Field1.id]: 'Elek-Tek',
    [col2Field2.id]: 'https://www.example.com',
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Doc1: Document = {
  id: '11',
  collectionID: collection1.id,
  fields: {
    [col1Field1.id]: 'col1Doc1',
    [col1Field2.id]: 'buenos',
    [col1Field3.id]: 'Qualification',
    [col1Field4.id]: ['Proposal', 'Evaluation'],
    [col1Field5.id]: collaborator1.id,
    [col1Field6.id]: [collaborator1.id, collaborator2.id],
    [col1Field7.id]: col2Doc1.id,
    [col1Field8.id]: [col2Doc1.id, col2Doc2.id],
    [col1Field9.id]: new Date(2019, 4, 18),
    [col1Field10.id]: '+84 909 909 909',
    [col1Field11.id]: 'email1@example.com',
    [col1Field12.id]: 'https://www.inday.com',
    [col1Field13.id]: 123,
    [col1Field14.id]: 321,
    [col1Field15.id]: true,
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Doc2: Document = {
  id: '12',
  collectionID: collection1.id,
  fields: {
    [col1Field1.id]: 'col1Doc2',
    [col1Field2.id]: 'buenos',
    [col1Field3.id]: 'Qualification',
    [col1Field4.id]: ['Proposal', 'Evaluation'],
    [col1Field5.id]: collaborator1.id,
    [col1Field6.id]: [collaborator1.id, collaborator2.id],
    [col1Field7.id]: col2Doc1.id,
    [col1Field8.id]: [col2Doc1.id, col2Doc2.id],
    [col1Field9.id]: new Date(2019, 4, 18),
    [col1Field10.id]: '+84 909 909 909',
    [col1Field11.id]: 'email1@example.com',
    [col1Field12.id]: 'https://www.inday.com',
    [col1Field13.id]: 123,
    [col1Field14.id]: 321,
    [col1Field15.id]: true,
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const col1Doc3: Document = {
  id: '13',
  collectionID: collection1.id,
  fields: {
    [col1Field1.id]: 'col1Doc3',
    [col1Field2.id]: 'buenos',
    [col1Field3.id]: 'Qualification',
    [col1Field4.id]: ['Proposal', 'Evaluation'],
    [col1Field5.id]: collaborator1.id,
    [col1Field6.id]: [collaborator1.id, collaborator2.id],
    [col1Field7.id]: col2Doc1.id,
    [col1Field8.id]: [col2Doc1.id, col2Doc2.id],
    [col1Field9.id]: new Date(2019, 4, 18),
    [col1Field10.id]: '+84 909 909 909',
    [col1Field11.id]: 'email1@example.com',
    [col1Field12.id]: 'https://www.inday.com',
    [col1Field13.id]: 123,
    [col1Field14.id]: 321,
    [col1Field15.id]: true,
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const spacesByIDFixtures: { [spaceID: string]: Space } = {
  [space1.id]: space1,
};

export const collaboratorsByIDFixtures: {
  [collaboratorID: string]: Collaborator;
} = {
  [collaborator1.id]: collaborator1,
  [collaborator2.id]: collaborator2,
};

export const collectionsByIDFixtures: { [collectionID: string]: View } = {
  [col1View1.id]: col1View1,
  [col1View2.id]: col1View2,
};

export const viewsByIDFixtures: { [viewID: string]: View } = {
  [col1View1.id]: col1View1,
  [col1View2.id]: col1View2,
};

export const fieldsByIDFixtures: { [fieldID: string]: Field } = {
  [col1Field1.id]: col1Field1,
  [col1Field2.id]: col1Field2,
  [col1Field3.id]: col1Field3,
  [col1Field4.id]: col1Field4,
  [col1Field5.id]: col1Field5,
  [col1Field6.id]: col1Field6,
  [col1Field7.id]: col1Field7,
  [col1Field8.id]: col1Field8,
  [col1Field9.id]: col1Field9,
  [col1Field10.id]: col1Field10,
  [col1Field11.id]: col1Field11,
  [col1Field12.id]: col1Field12,
  [col1Field13.id]: col1Field13,
  [col1Field14.id]: col1Field14,
  [col1Field15.id]: col1Field15,
  [col2Field1.id]: col2Field1,
  [col2Field2.id]: col2Field2,
};

export const documentsByIDFixtures: { [documentID: string]: Document } = {
  [col1Doc1.id]: col1Doc1,
  [col1Doc2.id]: col1Doc2,
  [col1Doc3.id]: col1Doc3,
  [col2Doc1.id]: col2Doc1,
  [col2Doc2.id]: col2Doc2,
};
