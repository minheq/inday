import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeDocument,
  makeSort,
  makeCollaborator,
} from './factory';
import {
  FieldType,
  assertMultiOptionField,
  assertSingleOptionField,
} from './fields';
import { sortDocuments, SortGetters } from './sorts';
import { FieldValue, Document, DocumentID } from './documents';
import { CollaboratorID } from './collaborators';

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

describe('checkbox', () => {
  test('ascending', () => {
    const values = [true, false];
    const { getters, docs, field, getValue } = prepare(
      FieldType.Checkbox,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });

  test('descending', () => {
    const values = [false, true];
    const { getters, docs, field, getValue } = prepare(
      FieldType.Checkbox,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });
});

describe('date', () => {
  test('ascending', () => {
    const values = [new Date(2020, 1, 2), new Date(2020, 1, 1), null];
    const { getters, docs, field, getValue } = prepare(FieldType.Date, values);
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('descending', () => {
    const values = [null, new Date(2020, 1, 1), new Date(2020, 1, 2)];
    const { getters, docs, field, getValue } = prepare(FieldType.Date, values);
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, getters);

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });
});

describe('multi options', () => {
  const { getters, field } = prepare(FieldType.MultiOption, []);
  assertMultiOptionField(field);
  const opt1 = field.options[0];
  const opt2 = field.options[1];

  const doc1 = makeDocument({ fields: { [field.id]: [opt1.value] } });
  const doc2 = makeDocument({ fields: { [field.id]: [opt2.value] } });
  const doc3 = makeDocument({ fields: { [field.id]: [] } });
  const docs = [doc1, doc2, doc3];

  test('ascending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });
    const result = sortDocuments([sort], docs, getters);

    expect(result[0].id).toBe(doc3.id);
    expect(result[1].id).toBe(doc2.id);
    expect(result[2].id).toBe(doc1.id);
  });

  test('descending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });
    const result = sortDocuments([sort], docs, getters);

    expect(result[0].id).toBe(doc1.id);
    expect(result[1].id).toBe(doc2.id);
    expect(result[2].id).toBe(doc3.id);
  });
});

describe('single options', () => {
  const { getters, field } = prepare(FieldType.SingleOption, []);
  assertSingleOptionField(field);
  const opt1 = field.options[0];
  const opt2 = field.options[1];

  const doc1 = makeDocument({ fields: { [field.id]: opt1.value } });
  const doc2 = makeDocument({ fields: { [field.id]: opt2.value } });
  const doc3 = makeDocument({ fields: { [field.id]: null } });
  const docs = [doc1, doc2, doc3];

  test('ascending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });
    const result = sortDocuments([sort], docs, getters);

    expect(result[0].id).toBe(doc3.id);
    expect(result[1].id).toBe(doc2.id);
    expect(result[2].id).toBe(doc1.id);
  });

  test('descending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });
    const result = sortDocuments([sort], docs, getters);

    expect(result[0].id).toBe(doc1.id);
    expect(result[1].id).toBe(doc2.id);
    expect(result[2].id).toBe(doc3.id);
  });
});

describe('collaborator', () => {
  const collaborator1 = makeCollaborator({ name: 'BName' });
  const collaborator2 = makeCollaborator({ name: 'AName' });

  const getCollaborator = (collaboratorID: CollaboratorID) => {
    if (collaboratorID === collaborator1.id) {
      return collaborator1;
    }

    return collaborator2;
  };

  test('multi ascending', () => {
    const values = [[collaborator1.id], [collaborator2.id], []];
    const { getters, docs, field, getValue } = prepare(
      FieldType.MultiCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, { ...getters, getCollaborator });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('multi descending', () => {
    const values = [[], [collaborator2.id], [collaborator1.id]];
    const { getters, docs, field, getValue } = prepare(
      FieldType.MultiCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, { ...getters, getCollaborator });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single ascending', () => {
    const values = [collaborator1.id, collaborator2.id, null];
    const { getters, docs, field, getValue } = prepare(
      FieldType.SingleCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, { ...getters, getCollaborator });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single descending', () => {
    const values = [null, collaborator2.id, collaborator1.id];
    const { getters, docs, field, getValue } = prepare(
      FieldType.SingleCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, { ...getters, getCollaborator });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });
});

describe('documents', () => {
  const otherCollection = makeCollection({
    name: 'other collection',
  });
  const otherField = makeField({
    type: FieldType.SingleLineText,
    collectionID: otherCollection.id,
  });
  otherCollection.mainFieldID = otherField.id;
  const collectionWithFields = addFieldsToCollection(otherCollection, [
    otherField,
  ]);
  const doc1 = makeDocument(
    { fields: { [otherField.id]: 'BName' } },
    collectionWithFields,
  );
  const doc2 = makeDocument(
    { fields: { [otherField.id]: 'AName' } },
    collectionWithFields,
  );

  const getDocument = (docID: DocumentID) => {
    if (docID === doc1.id) {
      return doc1;
    }

    return doc2;
  };

  const getCollection = () => {
    return otherCollection;
  };

  test('multi ascending', () => {
    const values = [[doc1.id], [doc2.id], []];
    const { getters, docs, field, getValue } = prepare(
      FieldType.MultiDocumentLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, {
      ...getters,
      getDocument,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('multi descending', () => {
    const values = [[], [doc2.id], [doc1.id]];
    const { getters, docs, field, getValue } = prepare(
      FieldType.MultiDocumentLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, {
      ...getters,
      getDocument,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single ascending', () => {
    const values = [doc1.id, doc2.id, null];
    const { getters, docs, field, getValue } = prepare(
      FieldType.SingleDocumentLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortDocuments([sort], docs, {
      ...getters,
      getDocument,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single descending', () => {
    const values = [null, doc2.id, doc1.id];
    const { getters, docs, field, getValue } = prepare(
      FieldType.SingleDocumentLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortDocuments([sort], docs, {
      ...getters,
      getDocument,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });
});

describe('multiple sorts', () => {
  const collection = makeCollection({});
  const numberField = makeField({
    type: FieldType.Number,
    collectionID: collection.id,
  });
  const textField = makeField({
    type: FieldType.SingleLineText,
    collectionID: collection.id,
  });
  const collectionWithFields = addFieldsToCollection(collection, [
    numberField,
    textField,
  ]);

  const doc1 = makeDocument(
    { fields: { [numberField.id]: 2, [textField.id]: 'AWord' } },
    collectionWithFields,
  );
  const doc2 = makeDocument(
    { fields: { [numberField.id]: 2, [textField.id]: 'BWord' } },
    collectionWithFields,
  );
  const doc3 = makeDocument(
    { fields: { [numberField.id]: 1, [textField.id]: 'BWord' } },
    collectionWithFields,
  );
  const doc4 = makeDocument(
    { fields: { [numberField.id]: 1, [textField.id]: 'AWord' } },
    collectionWithFields,
  );
  const fields = [numberField, textField];
  const docs = [doc1, doc2, doc3, doc4];

  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: (fieldID) => {
      const field = fields.find((d) => d.id === fieldID);

      if (field === undefined) {
        throw new Error('Document not found');
      }

      return field;
    },
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

  test('ascending number then descending text sort', () => {
    const numberSort = makeSort(
      {},
      { fieldID: numberField.id, order: 'ascending' },
    );
    const textSort = makeSort(
      {},
      { fieldID: textField.id, order: 'descending' },
    );

    const result = sortDocuments([numberSort, textSort], docs, getters);

    expect(result[0].id).toBe(doc3.id);
    expect(result[1].id).toBe(doc4.id);
    expect(result[2].id).toBe(doc2.id);
    expect(result[3].id).toBe(doc1.id);
  });
});

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
