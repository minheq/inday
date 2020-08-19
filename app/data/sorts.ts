import { ViewID } from './views';
import {
  FieldID,
  Field,
  FieldType,
  assertSingleOptionField,
  assertMultiOptionField,
  assertSingleCollaboratorField,
  assertMultiCollaboratorField,
  assertMultiDocumentLinkField,
  assertSingleDocumentLinkField,
  areFieldValuesEqual,
} from './fields';
import {
  Document,
  FieldValue,
  DocumentID,
  SingleOptionValue,
  MultiOptionValue,
  SingleCollaboratorValue,
  MultiCollaboratorValue,
  SingleDocumentLinkValue,
  MultiDocumentLinkValue,
  assertTextFieldValue,
  assertBooleanFieldValue,
  assertNumberFieldValue,
  assertDateFieldValue,
} from './documents';
import { isEmpty, first, keyedBy } from '../../lib/data_structures/arrays';
import { CollaboratorID, Collaborator } from './collaborators';
import { isBefore, isAfter } from 'date-fns';
import { CollectionID, Collection } from './collections';

export type SortID = string;

export type SortOrder = 'ascending' | 'descending';

export interface BaseSort {
  viewID: ViewID;
  sequence: number;
}

export interface SortConfig {
  fieldID: FieldID;
  order: SortOrder;
}

export interface Sort extends BaseSort, SortConfig {
  id: SortID;
}

export interface SortGetters {
  getField: (fieldID: FieldID) => Field;
  getDocument: (documentID: DocumentID) => Document;
  getCollection: (collectionID: CollectionID) => Collection;
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator;
}

export function sortDocuments(
  sorts: Sort[],
  documents: Document[],
  getters: SortGetters,
) {
  if (isEmpty(sorts)) {
    return documents;
  }
  const nodes = makeNodes(sorts, documents, getters);

  return toDocuments(nodes);
}

function isLeafNodes(nodes: Node[]): nodes is LeafNode[] {
  if (isEmpty(nodes)) {
    throw new Error('Nodes are empty');
  }

  return first(nodes).type === 'leaf';
}

function toDocuments(nodes: Node[]): Document[] {
  if (isEmpty(nodes)) {
    return [];
  }

  if (isLeafNodes(nodes)) {
    return flattenLeafNodes(nodes);
  }

  let docs: Document[] = [];

  for (const node of nodes) {
    docs = docs.concat(toDocuments(node.children as Node[]));
  }

  return docs;
}

function flattenLeafNodes(leafNodes: LeafNode[]): Document[] {
  let docs: Document[] = [];

  for (const node of leafNodes) {
    docs = docs.concat(node.children);
  }

  return docs;
}

interface AncestorNode {
  type: 'node';
  field: Field;
  value: FieldValue;
  children: Node[];
}

interface LeafNode {
  type: 'leaf';
  field: Field;
  value: FieldValue;
  children: Document[];
}

type Node = AncestorNode | LeafNode;

function makeNodes(
  sorts: Sort[],
  documents: Document[],
  getters: SortGetters,
): Node[] {
  if (isEmpty(documents)) {
    return [];
  }

  if (isEmpty(sorts)) {
    throw new Error(
      'Empty sorts. There should be at least one sort to make a tree',
    );
  }

  const sort = first(sorts);
  const nextSorts = sorts.slice(1);

  if (sorts.length === 1) {
    return makeLeafNodes(sort, documents, getters);
  }

  const leafNodes = makeLeafNodes(sort, documents, getters);

  if (sorts.length === 1) {
    return leafNodes;
  }

  const nodes: AncestorNode[] = [];

  for (const leafNode of leafNodes) {
    nodes.push({
      type: 'node',
      field: leafNode.field,
      value: leafNode.value,
      children: makeNodes(nextSorts, leafNode.children, getters),
    });
  }

  return nodes;
}

export function deleteSort(
  sort: Sort,
  sorts: Sort[],
): { [sortID: string]: Sort } {
  const updatedSorts: { [sortID: string]: Sort } = {};
  const sortIndex = sorts.findIndex((f) => f.id === sort.id);

  const nextSorts = sorts.slice(sortIndex + 1);

  for (const nextSort of nextSorts) {
    updatedSorts[nextSort.id] = {
      ...nextSort,
      sequence: nextSort.sequence - 1,
    };
  }

  delete updatedSorts[sort.id];

  return updatedSorts;
}

function makeLeafNodes(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
): LeafNode[] {
  const { getField } = getters;

  const field = getField(sort.fieldID);

  const applySort = applySortByFieldType[field.type];
  const sortedDocuments = applySort(sort, documents, getters);

  const firstDocument = first(sortedDocuments);

  let currentNode: LeafNode = {
    type: 'leaf',
    field,
    value: firstDocument.fields[field.id],
    children: [firstDocument],
  };

  const nodes: LeafNode[] = [currentNode];

  for (let i = 1; i < sortedDocuments.length; i++) {
    const document = sortedDocuments[i];

    if (
      areFieldValuesEqual(
        field.type,
        document.fields[field.id],
        currentNode.value,
      )
    ) {
      if (currentNode.type === 'leaf') {
        currentNode.children.push(document);
      }
    } else {
      currentNode = {
        type: 'leaf',
        field,
        value: document.fields[field.id],
        children: [document],
      };
      nodes.push(currentNode);
    }
  }

  return nodes;
}

const applySortByFieldType: {
  [fieldType in FieldType]: (
    sort: Sort,
    documents: Document[],
    getters: SortGetters,
  ) => Document[];
} = {
  [FieldType.Checkbox]: applyBooleanSort,
  [FieldType.Currency]: applyNumberSort,
  [FieldType.Date]: applyDateSort,
  [FieldType.Email]: applyTextSort,
  [FieldType.MultiCollaborator]: applyMultiCollaboratorSort,
  [FieldType.MultiDocumentLink]: applyMultiDocumentLinkSort,
  [FieldType.MultiLineText]: applyTextSort,
  [FieldType.MultiOption]: applyMultiOptionSort,
  [FieldType.Number]: applyNumberSort,
  [FieldType.PhoneNumber]: applyTextSort,
  [FieldType.SingleCollaborator]: applySingleCollaboratorSort,
  [FieldType.SingleDocumentLink]: applySingleDocumentLinkSort,
  [FieldType.SingleLineText]: applyTextSort,
  [FieldType.SingleOption]: applySingleOptionSort,
  [FieldType.URL]: applyTextSort,
};

export function applyTextSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingTextFieldValueSort(valA, valB);
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingTextFieldValueSort(valA, valB);
  });
}

export function applyNumberSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingNumberFieldValueSort(valA, valB);
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingNumberFieldValueSort(valA, valB);
  });
}

export function applyDateSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingDateFieldValueSort(valA, valB);
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingDateFieldValueSort(valA, valB);
  });
}

export function applySingleOptionSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  assertSingleOptionField(field);

  const optionsByValue = keyedBy(field.options, 'value');

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleOptionValue;
      const valB = b.fields[field.id] as SingleOptionValue;

      if (valA === null && valB === null) {
        return 0;
      }

      if (valA === null) {
        return -1;
      }

      if (valB === null) {
        return 1;
      }

      const optionA = optionsByValue[valA];
      const optionB = optionsByValue[valB];

      if (optionA.order > optionB.order) {
        return -1;
      } else if (optionA.order < optionB.order) {
        return 1;
      }
      return 0;
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id] as SingleOptionValue;
    const valB = b.fields[field.id] as SingleOptionValue;

    if (valA === null && valB === null) {
      return 0;
    }

    if (valA === null) {
      return 1;
    }

    if (valB === null) {
      return -1;
    }

    const optionA = optionsByValue[valA];
    const optionB = optionsByValue[valB];

    if (optionA.order < optionB.order) {
      return -1;
    } else if (optionA.order > optionB.order) {
      return 1;
    }
    return 0;
  });
}

export function applyMultiOptionSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  assertMultiOptionField(field);

  const optionsByValue = keyedBy(field.options, 'value');

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiOptionValue;
      const valB = b.fields[field.id] as MultiOptionValue;

      if (isEmpty(valA) && isEmpty(valB)) {
        return 0;
      }

      if (isEmpty(valA)) {
        return -1;
      }

      if (isEmpty(valB)) {
        return 1;
      }

      const optionA = optionsByValue[valA[0]];
      const optionB = optionsByValue[valB[0]];

      if (optionA.order > optionB.order) {
        return -1;
      } else if (optionA.order < optionB.order) {
        return 1;
      }
      return 0;
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id] as MultiOptionValue;
    const valB = b.fields[field.id] as MultiOptionValue;

    if (isEmpty(valA) && isEmpty(valB)) {
      return 0;
    }

    if (isEmpty(valA)) {
      return 1;
    }

    if (isEmpty(valB)) {
      return -1;
    }

    const optionA = optionsByValue[valA[0]];
    const optionB = optionsByValue[valB[0]];

    if (optionA.order < optionB.order) {
      return -1;
    } else if (optionA.order > optionB.order) {
      return 1;
    }
    return 0;
  });
}

export function applySingleCollaboratorSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  assertSingleCollaboratorField(field);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleCollaboratorValue;
      const valB = b.fields[field.id] as SingleCollaboratorValue;

      if (valA === null && valB === null) {
        return 0;
      }

      if (valA === null) {
        return -1;
      }

      if (valB === null) {
        return 1;
      }

      const collaboratorA = getCollaborator(valA);
      const collaboratorB = getCollaborator(valB);

      if (collaboratorA.name < collaboratorB.name) {
        return -1;
      } else if (collaboratorA.name > collaboratorB.name) {
        return 1;
      }
      return 0;
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id] as SingleCollaboratorValue;
    const valB = b.fields[field.id] as SingleCollaboratorValue;

    if (valA === null && valB === null) {
      return 0;
    }

    if (valA === null) {
      return 1;
    }

    if (valB === null) {
      return -1;
    }

    const collaboratorA = getCollaborator(valA);
    const collaboratorB = getCollaborator(valB);

    if (collaboratorA.name > collaboratorB.name) {
      return -1;
    } else if (collaboratorA.name < collaboratorB.name) {
      return 1;
    }
    return 0;
  });
}

export function applyMultiCollaboratorSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  assertMultiCollaboratorField(field);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiCollaboratorValue;
      const valB = b.fields[field.id] as MultiCollaboratorValue;

      if (isEmpty(valA) && isEmpty(valB)) {
        return 0;
      }

      if (isEmpty(valA)) {
        return -1;
      }

      if (isEmpty(valB)) {
        return 1;
      }

      const collaboratorA = getCollaborator(valA[0]);
      const collaboratorB = getCollaborator(valB[0]);

      if (collaboratorA.name < collaboratorB.name) {
        return -1;
      } else if (collaboratorA.name > collaboratorB.name) {
        return 1;
      }
      return 0;
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id] as MultiCollaboratorValue;
    const valB = b.fields[field.id] as MultiCollaboratorValue;

    if (isEmpty(valA) && isEmpty(valB)) {
      return 0;
    }

    if (isEmpty(valA)) {
      return 1;
    }

    if (isEmpty(valB)) {
      return -1;
    }

    const collaboratorA = getCollaborator(valA[0]);
    const collaboratorB = getCollaborator(valB[0]);

    if (collaboratorA.name > collaboratorB.name) {
      return -1;
    } else if (collaboratorA.name < collaboratorB.name) {
      return 1;
    }
    return 0;
  });
}

export function applySingleDocumentLinkSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField, getDocument, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertSingleDocumentLinkField(field);

  const collection = getCollection(field.documentsFromCollectionID);

  const mainField = getField(collection.mainFieldID);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleDocumentLinkValue;
      const valB = b.fields[field.id] as SingleDocumentLinkValue;

      if (valA === null && valB === null) {
        return 0;
      }

      if (valA === null) {
        return -1;
      }

      if (valB === null) {
        return 1;
      }

      const docA = getDocument(valA);
      const docB = getDocument(valB);

      const docAMainField = docA.fields[mainField.id];
      const docBMainField = docB.fields[mainField.id];

      return ascendingFieldValueSort(
        mainField.type,
        docAMainField,
        docBMainField,
      );
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id] as SingleDocumentLinkValue;
    const valB = b.fields[field.id] as SingleDocumentLinkValue;

    if (valA === null && valB === null) {
      return 0;
    }

    if (valA === null) {
      return 1;
    }

    if (valB === null) {
      return -1;
    }

    const docA = getDocument(valA);
    const docB = getDocument(valB);

    const docAMainField = docA.fields[mainField.id];
    const docBMainField = docB.fields[mainField.id];

    return descendingFieldValueSort(
      mainField.type,
      docAMainField,
      docBMainField,
    );
  });
}

export function applyMultiDocumentLinkSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField, getDocument, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertMultiDocumentLinkField(field);

  const collection = getCollection(field.documentsFromCollectionID);
  const mainField = getField(collection.mainFieldID);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiDocumentLinkValue;
      const valB = b.fields[field.id] as MultiDocumentLinkValue;

      if (isEmpty(valA) && isEmpty(valB)) {
        return 0;
      }

      if (isEmpty(valA)) {
        return -1;
      }

      if (isEmpty(valB)) {
        return 1;
      }

      const docA = getDocument(valA[0]);
      const docB = getDocument(valB[0]);

      const docAMainField = docA.fields[mainField.id];
      const docBMainField = docB.fields[mainField.id];

      return ascendingFieldValueSort(
        mainField.type,
        docAMainField,
        docBMainField,
      );
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id] as MultiDocumentLinkValue;
    const valB = b.fields[field.id] as MultiDocumentLinkValue;

    if (isEmpty(valA) && isEmpty(valB)) {
      return 0;
    }

    if (isEmpty(valA)) {
      return 1;
    }

    if (isEmpty(valB)) {
      return -1;
    }

    const docA = getDocument(valA[0]);
    const docB = getDocument(valB[0]);

    const docAMainField = docA.fields[mainField.id];
    const docBMainField = docB.fields[mainField.id];

    return descendingFieldValueSort(
      mainField.type,
      docAMainField,
      docBMainField,
    );
  });
}

export function applyBooleanSort(
  sort: Sort,
  documents: Document[],
  getters: SortGetters,
) {
  const docsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return docsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingBooleanFieldValueSort(valA, valB);
    });
  }

  return docsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingBooleanFieldValueSort(valA, valB);
  });
}

function ascendingBooleanFieldValueSort(a: FieldValue, b: FieldValue) {
  assertBooleanFieldValue(a);
  assertBooleanFieldValue(b);

  if (a === false && b === true) {
    return -1;
  } else if (a === true && b === false) {
    return 1;
  }
  return 0;
}

function ascendingTextFieldValueSort(a: FieldValue, b: FieldValue) {
  assertTextFieldValue(a);
  assertTextFieldValue(b);

  if (a < b) {
    return -1;
  } else if (b > a) {
    return 1;
  }
  return 0;
}

function ascendingNumberFieldValueSort(a: FieldValue, b: FieldValue) {
  assertNumberFieldValue(a);
  assertNumberFieldValue(b);

  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return -1;
  }

  if (b === null) {
    return 1;
  }

  if (a < b) {
    return -1;
  } else if (b > a) {
    return 1;
  }
  return 0;
}

function ascendingDateFieldValueSort(a: FieldValue, b: FieldValue) {
  assertDateFieldValue(a);
  assertDateFieldValue(b);

  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return -1;
  }

  if (b === null) {
    return 1;
  }

  if (isBefore(a, b)) {
    return -1;
  } else if (isAfter(a, b)) {
    return 1;
  }
  return 0;
}

function descendingBooleanFieldValueSort(a: FieldValue, b: FieldValue) {
  assertBooleanFieldValue(a);
  assertBooleanFieldValue(b);

  if (a === true && b === false) {
    return -1;
  } else if (a === false && b === true) {
    return 1;
  }

  return 0;
}

function descendingTextFieldValueSort(a: FieldValue, b: FieldValue) {
  assertTextFieldValue(a);
  assertTextFieldValue(b);

  if (a > b) {
    return -1;
  } else if (b < a) {
    return 1;
  }
  return 0;
}

function descendingNumberFieldValueSort(a: FieldValue, b: FieldValue) {
  assertNumberFieldValue(a);
  assertNumberFieldValue(b);

  if (a === null && b === null) {
    return 0;
  }

  if (b === null) {
    return -1;
  }

  if (a === null) {
    return 1;
  }

  if (a > b) {
    return -1;
  } else if (b < a) {
    return 1;
  }
  return 0;
}

function descendingDateFieldValueSort(a: FieldValue, b: FieldValue) {
  assertDateFieldValue(a);
  assertDateFieldValue(b);

  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  if (isAfter(a, b)) {
    return -1;
  } else if (isBefore(a, b)) {
    return 1;
  }
  return 0;
}

function ascendingFieldValueSort(
  fieldType: FieldType,
  a: FieldValue,
  b: FieldValue,
) {
  switch (fieldType) {
    case FieldType.Checkbox:
      return ascendingBooleanFieldValueSort(a, b);
    case FieldType.Date:
      return ascendingDateFieldValueSort(a, b);
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return ascendingTextFieldValueSort(a, b);
    case FieldType.Number:
    case FieldType.Currency:
      return ascendingNumberFieldValueSort(a, b);
    default:
      throw new Error(`Sort not supported for main field type=${fieldType}`);
  }
}

function descendingFieldValueSort(
  fieldType: FieldType,
  a: FieldValue,
  b: FieldValue,
) {
  switch (fieldType) {
    case FieldType.Checkbox:
      return descendingBooleanFieldValueSort(a, b);
    case FieldType.Date:
      return descendingDateFieldValueSort(a, b);
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return descendingTextFieldValueSort(a, b);
    case FieldType.Number:
    case FieldType.Currency:
      return descendingNumberFieldValueSort(a, b);
    default:
      throw new Error(`Sort not supported for main field type=${fieldType}`);
  }
}
