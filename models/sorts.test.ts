import { test } from "../lib/testing";
import {
  addFieldsToCollection,
  makeCollection,
  makeField,
  makeDocument,
  makeSort,
  makeCollaborator,
} from "./factory";
import {
  FieldType,
  FieldValue,
  assertMultiSelectField,
  assertSingleSelectField,
} from "./fields";
import { sortDocuments, SortGetters } from "./sorts";
import { Document, DocumentID } from "./documents";
import { CollaboratorID } from "./collaborators";

test("no sort", (t) => {
  const values = ["BWord", "Aword"];
  const { getters, documents, getValue } = prepare(
    FieldType.SingleLineText,
    values
  );

  const result = sortDocuments([], documents, getters);

  t.deepEqual(getValue(result[0]), values[0]);
  t.deepEqual(getValue(result[1]), values[1]);
});

test("text sort - ascending", (t) => {
  const values = ["BWord", "Aword"];
  const { getters, documents, field, getValue } = prepare(
    FieldType.SingleLineText,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[1]);
  t.deepEqual(getValue(result[1]), values[0]);
});

test("text sort - descending", (t) => {
  const values = ["AWord", "Bword"];
  const { getters, documents, field, getValue } = prepare(
    FieldType.SingleLineText,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[1]);
  t.deepEqual(getValue(result[1]), values[0]);
});

test("number sort - ascending", (t) => {
  const values = [2, 1, null];
  const { getters, documents, field, getValue } = prepare(
    FieldType.Number,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("number sort - descending", (t) => {
  const values = [1, 2, null];
  const { getters, documents, field, getValue } = prepare(
    FieldType.Number,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[1]);
  t.deepEqual(getValue(result[1]), values[0]);
  t.deepEqual(getValue(result[2]), values[2]);
});

test("boolean sort - ascending", (t) => {
  const values = [true, false];
  const { getters, documents, field, getValue } = prepare(
    FieldType.Checkbox,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[1]);
  t.deepEqual(getValue(result[1]), values[0]);
});

test("boolean sort - descending", (t) => {
  const values = [false, true];
  const { getters, documents, field, getValue } = prepare(
    FieldType.Checkbox,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[1]);
  t.deepEqual(getValue(result[1]), values[0]);
});

test("date sort - ascending", (t) => {
  const values = ["2020-1-2", "2020-1-1", null];
  const { getters, documents, field, getValue } = prepare(
    FieldType.Date,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("date sort - descending", (t) => {
  const values = [null, "2020-1-1", "2020-1-2"];
  const { getters, documents, field, getValue } = prepare(
    FieldType.Date,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

function prepareMultiSelectsSort() {
  const { getters, field } = prepare(FieldType.MultiSelect, []);
  assertMultiSelectField(field);
  const opt1 = field.options[0];
  const opt2 = field.options[1];

  const document1 = makeDocument({ fields: { [field.id]: [opt1.id] } });
  const document2 = makeDocument({ fields: { [field.id]: [opt2.id] } });
  const document3 = makeDocument({ fields: { [field.id]: [] } });
  const documents = [document1, document2, document3];

  return { getters, documents, field };
}

test("multi options sort - ascending", (t) => {
  const { documents, field, getters } = prepareMultiSelectsSort();
  const [document1, document2, document3] = documents;
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });
  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(result[0].id, document3.id);
  t.deepEqual(result[1].id, document2.id);
  t.deepEqual(result[2].id, document1.id);
});

test("multi options sort - descending", (t) => {
  const { documents, field, getters } = prepareMultiSelectsSort();
  const [document1, document2, document3] = documents;

  const sort = makeSort({}, { fieldID: field.id, order: "descending" });
  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(result[0].id, document1.id);
  t.deepEqual(result[1].id, document2.id);
  t.deepEqual(result[2].id, document3.id);
});

function prepareSingleSelectsSort() {
  const { getters, field } = prepare(FieldType.SingleSelect, []);
  assertSingleSelectField(field);
  const opt1 = field.options[0];
  const opt2 = field.options[1];

  const document1 = makeDocument({ fields: { [field.id]: opt1.id } });
  const document2 = makeDocument({ fields: { [field.id]: opt2.id } });
  const document3 = makeDocument({ fields: { [field.id]: null } });
  const documents = [document1, document2, document3];

  return { documents, getters, field };
}

test("single option sort - ascending", (t) => {
  const { documents, field, getters } = prepareSingleSelectsSort();
  const [document1, document2, document3] = documents;
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });
  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(result[0].id, document3.id);
  t.deepEqual(result[1].id, document2.id);
  t.deepEqual(result[2].id, document1.id);
});

test("single option sort - descending", (t) => {
  const { documents, field, getters } = prepareSingleSelectsSort();
  const [document1, document2, document3] = documents;

  const sort = makeSort({}, { fieldID: field.id, order: "descending" });
  const result = sortDocuments([sort], documents, getters);

  t.deepEqual(result[0].id, document1.id);
  t.deepEqual(result[1].id, document2.id);
  t.deepEqual(result[2].id, document3.id);
});

function prepareCollaboratorSort() {
  const collaborator1 = makeCollaborator({ name: "BName" });
  const collaborator2 = makeCollaborator({ name: "AName" });

  const getCollaborator = (collaboratorID: CollaboratorID) => {
    if (collaboratorID === collaborator1.id) {
      return collaborator1;
    }

    return collaborator2;
  };

  const collaborators = [collaborator1, collaborator2];

  return { collaborators, getCollaborator };
}

test("multi collaborator sort - ascending", (t) => {
  const { collaborators, getCollaborator } = prepareCollaboratorSort();
  const [collaborator1, collaborator2] = collaborators;

  const values = [[collaborator1.id], [collaborator2.id], []];
  const { getters, documents, field, getValue } = prepare(
    FieldType.MultiCollaborator,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, {
    ...getters,
    getCollaborator,
  });

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("multi collaborator sort - descending", (t) => {
  const { collaborators, getCollaborator } = prepareCollaboratorSort();
  const [collaborator1, collaborator2] = collaborators;

  const values = [[], [collaborator2.id], [collaborator1.id]];
  const { getters, documents, field, getValue } = prepare(
    FieldType.MultiCollaborator,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, {
    ...getters,
    getCollaborator,
  });

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("single collaborator sort - ascending", (t) => {
  const { collaborators, getCollaborator } = prepareCollaboratorSort();
  const [collaborator1, collaborator2] = collaborators;

  const values = [collaborator1.id, collaborator2.id, null];
  const { getters, documents, field, getValue } = prepare(
    FieldType.SingleCollaborator,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, {
    ...getters,
    getCollaborator,
  });

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("single collaborator sort - descending", (t) => {
  const { collaborators, getCollaborator } = prepareCollaboratorSort();
  const [collaborator1, collaborator2] = collaborators;

  const values = [null, collaborator2.id, collaborator1.id];
  const { getters, documents, field, getValue } = prepare(
    FieldType.SingleCollaborator,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, {
    ...getters,
    getCollaborator,
  });

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

function prepareDocumentsSort() {
  const otherCollection = makeCollection({
    name: "other collection",
  });
  const otherField = makeField({
    type: FieldType.SingleLineText,
    collectionID: otherCollection.id,
  });
  otherCollection.primaryFieldID = otherField.id;
  const collectionWithFields = addFieldsToCollection(otherCollection, [
    otherField,
  ]);
  const document1 = makeDocument(
    { fields: { [otherField.id]: "BName" } },
    collectionWithFields
  );
  const document2 = makeDocument(
    { fields: { [otherField.id]: "AName" } },
    collectionWithFields
  );

  const getDocument = (documentID: DocumentID) => {
    if (documentID === document1.id) {
      return document1;
    }

    return document2;
  };

  const getCollection = () => {
    return otherCollection;
  };

  const documents = [document1, document2];

  return { documents, otherField, getCollection, getDocument };
}

test("multi document sort - ascending", (t) => {
  const {
    otherField,
    documents: outerDocuments,
    getDocument,
    getCollection,
  } = prepareDocumentsSort();
  const [document1, document2] = outerDocuments;

  const values = [[document1.id], [document2.id], []];
  const { getters, documents, field, getValue } = prepare(
    FieldType.MultiDocumentLink,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, {
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

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("multi document sort - descending", (t) => {
  const {
    otherField,
    documents: outerDocuments,
    getDocument,
    getCollection,
  } = prepareDocumentsSort();
  const [document1, document2] = outerDocuments;

  const values = [[], [document2.id], [document1.id]];
  const { getters, documents, field, getValue } = prepare(
    FieldType.MultiDocumentLink,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, {
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

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("single document sort - ascending", (t) => {
  const {
    otherField,
    documents: outerDocuments,
    getDocument,
    getCollection,
  } = prepareDocumentsSort();
  const [document1, document2] = outerDocuments;

  const values = [document1.id, document2.id, null];
  const { getters, documents, field, getValue } = prepare(
    FieldType.SingleDocumentLink,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "ascending" });

  const result = sortDocuments([sort], documents, {
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

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("single document sort - descending", (t) => {
  const {
    otherField,
    documents: outerDocuments,
    getDocument,
    getCollection,
  } = prepareDocumentsSort();
  const [document1, document2] = outerDocuments;

  const values = [null, document2.id, document1.id];
  const { getters, documents, field, getValue } = prepare(
    FieldType.SingleDocumentLink,
    values
  );
  const sort = makeSort({}, { fieldID: field.id, order: "descending" });

  const result = sortDocuments([sort], documents, {
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

  t.deepEqual(getValue(result[0]), values[2]);
  t.deepEqual(getValue(result[1]), values[1]);
  t.deepEqual(getValue(result[2]), values[0]);
});

test("ascending number then descending text sort", (t) => {
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

  const document1 = makeDocument(
    { fields: { [numberField.id]: 2, [textField.id]: "AWord" } },
    collectionWithFields
  );
  const document2 = makeDocument(
    { fields: { [numberField.id]: 2, [textField.id]: "BWord" } },
    collectionWithFields
  );
  const document3 = makeDocument(
    { fields: { [numberField.id]: 1, [textField.id]: "BWord" } },
    collectionWithFields
  );
  const document4 = makeDocument(
    { fields: { [numberField.id]: 1, [textField.id]: "AWord" } },
    collectionWithFields
  );
  const fields = [numberField, textField];
  const documents = [document1, document2, document3, document4];

  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: (fieldID) => {
      const field = fields.find((d) => d.id === fieldID);

      if (field === undefined) {
        throw new Error("Document not found");
      }

      return field;
    },
    getDocument: (documentID) => {
      const document = documents.find((d) => d.id === documentID);

      if (document === undefined) {
        throw new Error("Document not found");
      }

      return document;
    },
    getCollection: () => collection,
    getCollaborator: () => collaborator,
  };

  const numberSort = makeSort(
    {},
    { fieldID: numberField.id, order: "ascending" }
  );
  const textSort = makeSort({}, { fieldID: textField.id, order: "descending" });

  const result = sortDocuments([numberSort, textSort], documents, getters);

  t.deepEqual(result[0].id, document3.id);
  t.deepEqual(result[1].id, document4.id);
  t.deepEqual(result[2].id, document2.id);
  t.deepEqual(result[3].id, document1.id);
});

function prepare(fieldType: FieldType, values: FieldValue[]) {
  const collection = makeCollection({});
  const field = makeField({ type: fieldType });
  const collectionWithFields = addFieldsToCollection(collection, [field]);

  const documents = values.map((value) => {
    return makeDocument(
      { fields: { [field.id]: value } },
      collectionWithFields
    );
  });

  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: () => field,
    getDocument: (documentID) => {
      const document = documents.find((d) => d.id === documentID);

      if (document === undefined) {
        throw new Error("Document not found");
      }

      return document;
    },
    getCollection: () => collection,
    getCollaborator: () => collaborator,
  };

  const getValue = (document: Document) => {
    return document.fields[field.id];
  };

  return { documents, getters, field, getValue };
}
