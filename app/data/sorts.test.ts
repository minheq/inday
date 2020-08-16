import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeDocument,
  makeSort,
  makeCollaborator,
} from './factory';
import { FieldType } from './fields';
import { sortDocuments, Sort, SortGetters } from './sorts';

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
  const collaborator = makeCollaborator({});
  const docs = [doc1, doc2];

  test('all docs', () => {
    const getters: SortGetters = {
      getField: () => textField,
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
    const result = sortDocuments([], docs, getters);
    expect(result[0].id).toBe(doc1.id);
    expect(result[1].id).toBe(doc2.id);
  });
});

describe('text sort', () => {
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
  const sort: Sort = makeSort(
    {},
    { fieldID: textField.id, order: 'ascending' },
  );
  const collaborator = makeCollaborator({});
  const docs = [doc1, doc2];
  const sorts = [sort];

  test.only('all docs', () => {
    const getters: SortGetters = {
      getField: () => textField,
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
    const result = sortDocuments(sorts, docs, getters);
    expect(result[0].id).toBe(doc2.id);
    expect(result[1].id).toBe(doc1.id);
  });
});

// function prepare(fieldType: FieldType) {
//   const collection = makeCollection({});
//   const checkboxField = makeField({ type: FieldType.Checkbox });
//   const collectionWithFields = addFieldsToCollection(collection, [checkboxField]);
// }

// describe('applyBooleanSort', () => {
//   const collection = makeCollection({});
//   const checkboxField = makeField({ type: FieldType.Checkbox });
//   const collectionWithFields = addFieldsToCollection(collection, [checkboxField]);
//   const doc1 = makeDocument(
//     { fields: { [checkboxField.id]: true } },
//     collectionWithFields,
//   );
//   const doc2 = makeDocument(
//     { fields: { [checkboxField.id]: false } },
//     collectionWithFields,
//   );
//   const doc3 = makeDocument(
//     { fields: { [checkboxField.id]: true } },
//     collectionWithFields,
//   );
//   const getField = () => checkboxField;
//   const getDocument = () => checkboxField;
//   const getCollection = () => checkboxField;
//   const getCollaborator = () => checkboxField;

//   const documents = [doc1, doc2, doc3];
//   const getters: SortGetters = {
//     getField,
//     getDocument,
//     getCollection,
//     getCollaborator,
//   }

//   test('ascending sort', () => {
//     const sort: Sort = makeSort(
//       {},
//       { fieldID: checkboxField.id, order: 'ascending' },
//     );
//     const docs = applboo
//   })
// });
