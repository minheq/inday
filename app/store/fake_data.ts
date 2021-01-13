import { Document } from '../../models/documents';
import { Collection } from '../../models/collections';
import { Space } from '../../models/spaces';
import { Field, FieldType } from '../../models/fields';
import { View } from '../../models/views';
import { Collaborator } from '../../models/collaborators';
import {
  makeSpace,
  makeCollaborator,
  makeCollection,
  makeField,
  makeView,
  addFieldsToCollection,
  makeManyDocuments,
  makeGroup,
} from '../../models/factory';
import { keyedBy } from '../../lib/array_utils';
import { Group } from '../../models/groups';

const space1 = makeSpace({
  id: 'spc1',
});
const collaborator1 = makeCollaborator({ spaceID: space1.id });
const collaborator2 = makeCollaborator({ spaceID: space1.id });

const collection1 = makeCollection({ spaceID: space1.id });
const collection2 = makeCollection({ spaceID: space1.id });

const col1Field1 = makeField({
  type: FieldType.SingleLineText,
  collectionID: collection1.id,
});

const col1Field2 = makeField({
  type: FieldType.Currency,
  collectionID: collection1.id,
});

const col1Field3 = makeField({
  type: FieldType.Date,
  collectionID: collection1.id,
});

const col1Field4 = makeField({
  type: FieldType.Email,
  collectionID: collection1.id,
});

const col1Field5 = makeField({
  type: FieldType.MultiCollaborator,
  collectionID: collection1.id,
});

const col1Field6 = makeField({
  type: FieldType.MultiDocumentLink,
  collectionID: collection1.id,
  documentsFromCollectionID: collection2.id,
});

const col1Field7 = makeField({
  type: FieldType.MultiLineText,
  collectionID: collection1.id,
});

const col1Field8 = makeField({
  type: FieldType.MultiSelect,
  collectionID: collection1.id,
});

const col1Field9 = makeField({
  type: FieldType.Number,
  collectionID: collection1.id,
});

const col1Field10 = makeField({
  type: FieldType.PhoneNumber,
  collectionID: collection1.id,
});

const col1Field11 = makeField({
  type: FieldType.SingleCollaborator,
  collectionID: collection1.id,
});

const col1Field12 = makeField({
  type: FieldType.SingleDocumentLink,
  collectionID: collection1.id,
  documentsFromCollectionID: collection2.id,
});

const col1Field13 = makeField({
  type: FieldType.SingleLineText,
  collectionID: collection1.id,
});

const col1Field14 = makeField({
  type: FieldType.SingleSelect,
  collectionID: collection1.id,
});

const col1Field15 = makeField({
  type: FieldType.URL,
  collectionID: collection1.id,
});

const col1Field16 = makeField({
  type: FieldType.Checkbox,
  collectionID: collection1.id,
});

const col1Fields = [
  col1Field1,
  col1Field2,
  col1Field3,
  col1Field4,
  col1Field5,
  col1Field6,
  col1Field7,
  col1Field8,
  col1Field9,
  col1Field10,
  col1Field11,
  col1Field12,
  col1Field13,
  col1Field14,
  col1Field15,
  col1Field16,
];
const collection1WithFields = addFieldsToCollection(collection1, col1Fields);

const col1View1 = makeView(
  { id: 'viw1', name: 'Flat list', collectionID: collection1.id },
  collection1WithFields,
);
const col1View2 = makeView(
  { id: 'viw2', name: 'Grouped list', collectionID: collection1.id },
  collection1WithFields,
);

const col2Field1 = makeField({
  type: FieldType.SingleLineText,
  collectionID: collection2.id,
});

const col2Field2 = makeField({
  type: FieldType.Currency,
  collectionID: collection2.id,
});

const col2Fields = [col2Field1, col2Field2];

collection1.primaryFieldID = col1Field1.id;
collection2.primaryFieldID = col2Field1.id;

const collection2WithFields = addFieldsToCollection(collection2, col2Fields);

const col2View1 = makeView({}, collection2WithFields);

const col2Documents = makeManyDocuments(2, collection2WithFields);

const col1Documents = makeManyDocuments(
  50,
  collection1WithFields,
  {
    [col1Field6.id]: col2Documents,
    [col1Field12.id]: col2Documents,
  },
  [collaborator1, collaborator2],
);

export const spacesByIDFixtures: { [spaceID: string]: Space } = {
  [space1.id]: space1,
};

export const collaboratorsByIDFixtures: {
  [collaboratorID: string]: Collaborator;
} = {
  [collaborator1.id]: collaborator1,
  [collaborator2.id]: collaborator2,
};

export const collectionsByIDFixtures: { [collectionID: string]: Collection } = {
  [collection1.id]: collection1,
  [collection2.id]: collection2,
};

export const viewsByIDFixtures: { [viewID: string]: View } = {
  [col1View1.id]: col1View1,
  [col1View2.id]: col1View2,
  [col2View1.id]: col2View1,
};

export const fieldsByIDFixtures: { [fieldID: string]: Field } = {
  ...keyedBy(col1Fields, (field) => field.id),
  ...keyedBy(col2Fields, (field) => field.id),
};

export const documentsByIDFixtures: {
  [documentID: string]: Document;
} = {
  ...keyedBy(col1Documents, (field) => field.id),
  ...keyedBy(col2Documents, (field) => field.id),
};

const col1View2Group1 = makeGroup(
  { viewID: col1View2.id },
  { fieldID: col1Field14.id, order: 'ascending' },
);

export const groupsByIDFixtures: {
  [groupID: string]: Group;
} = {
  [col1View2Group1.id]: col1View2Group1,
};
