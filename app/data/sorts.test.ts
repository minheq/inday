import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeDocument,
  makeSort,
  makeCollaborator,
} from './factory';
import { FieldType } from './fields';
import { sortDocuments, SortGetters } from './sorts';
import { FieldValue, Document } from './documents';

function prepare(fieldType: FieldType, values: FieldValue[]) {
  const collection = makeCollection({});
  const field = makeField({ type: fieldType });
  const collectionWithFields = addFieldsToCollection(collection, [field]);

  const docs = values.map((value) => {
    return makeDocument(
      { fields: { [field.id]: value } },
      collectionWithFields,
    );
  });

  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: () => field,
    getDocument: (documentID) => {
      const document = docs.find((d) => d.id === documentID);

      if (document === undefined) {
        throw new Error('Document not found');
      }

      return document;
    },
    getCollection: () => collection,
    getCollaborator: () => collaborator,
  };

  const getValue = (doc: Document) => {
    return doc.fields[field.id];
  };

  return { docs, getters, field, getValue };
}

describe('no sort', () => {
  test('all docs', () => {
    const values = ['BWord', 'Aword'];
    const { getters, docs, getValue } = prepare(
      FieldType.SingleLineText,
      values,
    );

    const result = sortDocuments([], docs, getters);

    expect(getValue(result[0])).toBe(values[0]);
    expect(getValue(result[1])).toBe(values[1]);
  });
});

describe('text sort', () => {
  test('ascending', () => {
    const values = ['BWord', 'Aword'];
    const { getters, docs, field, getValue } = prepare(
      FieldType.SingleLineText,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });

  test('descending', () => {
    const values = ['AWord', 'Bword'];
    const { getters, docs, field, getValue } = prepare(
      FieldType.SingleLineText,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });
});

describe('number sort', () => {
  test('ascending', () => {
    const values = [2, 1, null];
    const { getters, docs, field, getValue } = prepare(
      FieldType.Number,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('descending', () => {
    const values = [1, 2, null];
    const { getters, docs, field, getValue } = prepare(
      FieldType.Number,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
    expect(getValue(result[2])).toBe(values[2]);
  });
});
