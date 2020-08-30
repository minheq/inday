import { Record } from './records';
import { Collection } from './collections';
import { Space } from './spaces';
import { Field, FieldType } from './fields';
import { View } from './views';
import { Collaborator } from './collaborators';
import {
  makeSpace,
  makeCollaborator,
  makeCollection,
  makeField,
  makeView,
  addFieldsToCollection,
  makeManyRecords,
} from './factory';
import { keyedBy } from '../../lib/data_structures/arrays';

const space1 = makeSpace({
  id: '1',
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
  type: FieldType.MultiRecordLink,
  collectionID: collection1.id,
});

const col1Field7 = makeField({
  type: FieldType.MultiLineText,
  collectionID: collection1.id,
});

const col1Field8 = makeField({
  type: FieldType.MultiOption,
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
  type: FieldType.SingleRecordLink,
  collectionID: collection1.id,
});

const col1Field13 = makeField({
  type: FieldType.SingleLineText,
  collectionID: collection1.id,
});

const col1Field14 = makeField({
  type: FieldType.SingleOption,
  collectionID: collection1.id,
});

const col1Field15 = makeField({
  type: FieldType.URL,
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
];
const collection1WithFields = addFieldsToCollection(collection1, col1Fields);

const col1View1 = makeView(
  { id: '1', collectionID: collection1.id },
  collection1WithFields,
);
const col1View2 = makeView(
  { id: '2', collectionID: collection1.id },
  collection1WithFields,
);

const col1Records = makeManyRecords(
  20,
  collection1WithFields,
  {
    [col1Field6.id]: [],
    [col1Field12.id]: [],
  },
  [collaborator1, collaborator2],
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
const collection2WithFields = addFieldsToCollection(collection1, col2Fields);

const col2View1 = makeView({}, collection2WithFields);

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
  ...keyedBy(col1Fields, 'id'),
  ...keyedBy(col2Fields, 'id'),
};

export const recordsByIDFixtures: {
  [recordID: string]: Record;
} = keyedBy(col1Records, 'id');
