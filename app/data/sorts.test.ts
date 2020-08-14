import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeDocument,
} from './factory';
import { FieldType } from './fields';
import { sortDocuments } from './sorts';

describe('no sort', () => {
  const collection = makeCollection({});
  const textField = makeField({ type: FieldType.SingleLineText });
  const collectionWithFields = addFieldsToCollection(collection, [textField]);
  const doc1 = makeDocument(
    { fields: { [textField.id]: 'Bword' } },
    collectionWithFields,
  );
  const doc2 = makeDocument(
    { fields: { [textField.id]: 'Aword' } },
    collectionWithFields,
  );
  const getField = () => textField;

  test('all docs', () => {
    const result = sortDocuments([], [doc1, doc2], getField);
    expect(result[0].id).toBe(doc1.id);
    expect(result[1].id).toBe(doc2.id);
  });
});

describe('one level sort', () => {
  const collection = makeCollection({});
  const textField = makeField({ type: FieldType.SingleLineText });
  const collectionWithFields = addFieldsToCollection(collection, [textField]);
  const doc1 = makeDocument(
    { fields: { [textField.id]: 'Bword' } },
    collectionWithFields,
  );
  const doc2 = makeDocument(
    { fields: { [textField.id]: 'Aword' } },
    collectionWithFields,
  );
  const getField = () => textField;

  test('all docs', () => {
    const result = sortDocuments([], [doc1, doc2], getField);
    expect(result[0].id).toBe(doc2.id);
    expect(result[1].id).toBe(doc1.id);
  });
});
