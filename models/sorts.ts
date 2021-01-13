import { ViewID } from './views';
import {
  FieldID,
  Field,
  FieldType,
  MultiCollaboratorFieldValue,
  MultiSelectFieldValue,
  MultiDocumentLinkFieldValue,
  SingleCollaboratorFieldValue,
  SingleSelectFieldValue,
  SingleDocumentLinkFieldValue,
  assertTextFieldKindValue,
  assertNumberFieldKindValue,
  assertDateFieldKindValue,
  assertBooleanFieldKindValue,
  assertMultiSelectFieldValue,
  assertSingleSelectFieldValue,
  assertMultiCollaboratorFieldValue,
  assertSingleCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertMultiSelectField,
  assertSingleSelectField,
  assertMultiDocumentLinkField,
  assertSingleDocumentLinkField,
  FieldValue,
  areFieldValuesEqual,
  TextFieldKindValue,
  NumberFieldKindValue,
  DateFieldKindValue,
  BooleanFieldKindValue,
  SelectOption,
  assertPrimaryField,
  PrimaryField,
  assertPrimaryFieldValue,
} from './fields';
import { Document, DocumentID } from './documents';

import { Collaborator, CollaboratorID } from './collaborators';
import { CollectionID, Collection } from './collections';
import { generateID, validateID } from '../lib/id';
import { isEmpty } from '../lib/lang_utils';
import { first, keyedBy } from '../lib/array_utils';
import { isBefore, isAfter, isISODate, parseISODate } from '../lib/date_utils';

export const sortIDPrefix = 'srt' as const;
export type SortID = `${typeof sortIDPrefix}${string}`;

export function generateSortID(): SortID {
  return generateID(sortIDPrefix);
}

export function validateSortID(id: string): void {
  return validateID(sortIDPrefix, id);
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

export type SortOrder = 'ascending' | 'descending';

export interface BaseSort {
  id: SortID;
  viewID: ViewID;
  sequence: number;
}

export interface SortConfig {
  fieldID: FieldID;
  order: SortOrder;
}

export interface Sort extends BaseSort, SortConfig {}

export interface SortGetters {
  getField: (fieldID: FieldID) => Field;
  getDocument: (documentID: DocumentID) => Document;
  getCollection: (collectionID: CollectionID) => Collection;
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator;
}

export function sortDocuments(
  sorts: SortConfig[],
  documents: Document[],
  getters: SortGetters,
): Document[] {
  if (isEmpty(sorts)) {
    return documents;
  }
  const nodes = makeDocumentNodes(sorts, documents, getters);

  return toDocuments(nodes);
}

function isLeafDocumentNode(
  nodes: DocumentNode[],
): nodes is LeafDocumentNode[] {
  const firstNode = first(nodes);

  if (firstNode === undefined) {
    throw new Error('Nodes are empty');
  }

  return firstNode.type === 'leaf';
}

function toDocuments(nodes: DocumentNode[]): Document[] {
  if (isEmpty(nodes)) {
    return [];
  }

  if (isLeafDocumentNode(nodes)) {
    return flattenLeafDocumentNode(nodes);
  }

  let documents: Document[] = [];

  for (const node of nodes) {
    documents = documents.concat(toDocuments(node.children as DocumentNode[]));
  }

  return documents;
}

function flattenLeafDocumentNode(leafNodes: LeafDocumentNode[]): Document[] {
  let documents: Document[] = [];

  for (const node of leafNodes) {
    documents = documents.concat(node.children);
  }

  return documents;
}

interface AncestorDocumentNode {
  type: 'ancestor';
  field: Field;
  value: FieldValue;
  children: DocumentNode[];
}

interface LeafDocumentNode {
  type: 'leaf';
  field: Field;
  value: FieldValue;
  children: Document[];
}

export type DocumentNode = AncestorDocumentNode | LeafDocumentNode;

export function makeDocumentNodes(
  sorts: SortConfig[],
  documents: Document[],
  getters: SortGetters,
): DocumentNode[] {
  if (isEmpty(documents)) {
    return [];
  }

  const sort = first(sorts);
  const nextSorts = sorts.slice(1);

  if (sort === undefined) {
    throw new Error(
      'Empty sorts. There should be at least one sort to make a tree',
    );
  }

  const leafNodes = makeLeafNodes(sort, documents, getters);

  if (sorts.length === 1) {
    return leafNodes;
  }

  const nodes: AncestorDocumentNode[] = [];

  for (const leafNode of leafNodes) {
    nodes.push({
      type: 'ancestor',
      field: leafNode.field,
      value: leafNode.value,
      children: makeDocumentNodes(nextSorts, leafNode.children, getters),
    });
  }

  return nodes;
}

function makeLeafNodes(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): LeafDocumentNode[] {
  const { getField } = getters;
  const field = getField(sort.fieldID);
  const sorted = sortBy(field, sort, documents, getters);

  const firstDocument = first(sorted);

  if (firstDocument === undefined) {
    throw new Error('documents empty');
  }

  let currentNode: LeafDocumentNode = {
    type: 'leaf',
    field,
    value: firstDocument.fields[field.id],
    children: [firstDocument],
  };

  const nodes: LeafDocumentNode[] = [currentNode];

  for (let i = 1; i < sorted.length; i++) {
    const document = sorted[i];

    if (
      areFieldValuesEqual(field, document.fields[field.id], currentNode.value)
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

function sortBy(
  field: Field,
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  switch (field.type) {
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return sortByTextFieldKind(sort, documents, getters);
    case FieldType.Checkbox:
      return sortByBooleanFieldKind(sort, documents, getters);
    case FieldType.Date:
      return sortByDateFieldKind(sort, documents, getters);
    case FieldType.Number:
    case FieldType.Currency:
      return sortByNumberFieldKind(sort, documents, getters);
    case FieldType.MultiCollaborator:
      return sortByMultiCollaboratorField(sort, documents, getters);
    case FieldType.MultiSelect:
      return sortByMultiSelectField(sort, documents, getters);
    case FieldType.MultiDocumentLink:
      return sortByMultiDocumentLinkField(sort, documents, getters);
    case FieldType.SingleCollaborator:
      return sortBySingleCollaboratorField(sort, documents, getters);
    case FieldType.SingleSelect:
      return sortBySingleSelectField(sort, documents, getters);
    case FieldType.SingleDocumentLink:
      return sortBySingleDocumentLinkField(sort, documents, getters);
  }
}

export function sortByTextFieldKind(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertTextFieldKindValue(valA);
    assertTextFieldKindValue(valB);

    if (sort.order === 'ascending') {
      return ascendingTextFieldKindValueSort(valA, valB);
    }

    return descendingTextFieldKindValueSort(valA, valB);
  });
}

export function sortByNumberFieldKind(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertNumberFieldKindValue(valA);
    assertNumberFieldKindValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingNumberFieldKindValue(valA, valB);
    }

    return sortByDescendingNumberFieldKindValue(valA, valB);
  });
}

export function sortByDateFieldKind(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertDateFieldKindValue(valA);
    assertDateFieldKindValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingDateFieldKindValue(valA, valB);
    }

    return sortByDescendingDateFieldKindValue(valA, valB);
  });
}

export function sortBySingleSelectField(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);
  assertSingleSelectField(field);

  const optionsByID = keyedBy(field.options, (item) => item.id);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertSingleSelectFieldValue(valA);
    assertSingleSelectFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingSingleSelect(optionsByID, valA, valB);
    }
    return sortByDescendingSingleSelect(optionsByID, valA, valB);
  });
}

export function sortByMultiSelectField(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);
  assertMultiSelectField(field);

  const optionsByID = keyedBy(field.options, (item) => item.id);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertMultiSelectFieldValue(valA);
    assertMultiSelectFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingMultiSelect(optionsByID, valA, valB);
    }

    return sortByDescendingMultiSelect(optionsByID, valA, valB);
  });
}

export function sortBySingleCollaboratorField(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getCollaborator } = getters;

  return documentsClone.sort((a, b) => {
    const valA = a.fields[sort.fieldID];
    const valB = b.fields[sort.fieldID];

    assertSingleCollaboratorFieldValue(valA);
    assertSingleCollaboratorFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingSingleCollaborator(getCollaborator, valA, valB);
    }

    return sortByDescendingSingleCollaborator(getCollaborator, valA, valB);
  });
}

export function sortByMultiCollaboratorField(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertMultiCollaboratorFieldValue(valA);
    assertMultiCollaboratorFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingMultiCollaborator(getCollaborator, valA, valB);
    }

    return sortByDescendingMultiCollaborator(getCollaborator, valA, valB);
  });
}

export function sortBySingleDocumentLinkField(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField, getDocument, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertSingleDocumentLinkField(field);

  const collection = getCollection(field.documentsFromCollectionID);

  const primaryField = getField(collection.primaryFieldID);
  assertPrimaryField(primaryField);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertSingleDocumentLinkFieldValue(valA);
    assertSingleDocumentLinkFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingSingleDocumentLink(
        primaryField,
        getDocument,
        valA,
        valB,
      );
    }

    return sortByDescendingSingleDocumentLink(
      primaryField,
      getDocument,
      valA,
      valB,
    );
  });
}

export function sortByMultiDocumentLinkField(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField, getDocument, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertMultiDocumentLinkField(field);

  const collection = getCollection(field.documentsFromCollectionID);
  const primaryField = getField(collection.primaryFieldID);
  assertPrimaryField(primaryField);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertMultiDocumentLinkFieldValue(valA);
    assertMultiDocumentLinkFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingMultiDocumentLink(
        primaryField,
        getDocument,
        valA,
        valB,
      );
    }

    return sortByDescendingMultiDocumentLink(
      primaryField,
      getDocument,
      valA,
      valB,
    );
  });
}

export function sortByBooleanFieldKind(
  sort: SortConfig,
  documents: Document[],
  getters: SortGetters,
): Document[] {
  const documentsClone = documents.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return documentsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertBooleanFieldKindValue(valA);
    assertBooleanFieldKindValue(valB);

    if (sort.order === 'ascending') {
      return ascendingBooleanFieldKindValueSort(valA, valB);
    }
    return descendingBooleanFieldKindValueSort(valA, valB);
  });
}

function ascendingBooleanFieldKindValueSort(a: FieldValue, b: FieldValue) {
  if (a === false && b === true) {
    return -1;
  } else if (a === true && b === false) {
    return 1;
  }
  return 0;
}

function ascendingTextFieldKindValueSort(
  a: TextFieldKindValue,
  b: TextFieldKindValue,
) {
  if (a < b) {
    return -1;
  } else if (b > a) {
    return 1;
  }
  return 0;
}

function sortByAscendingNumberFieldKindValue(
  a: NumberFieldKindValue,
  b: NumberFieldKindValue,
) {
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

function sortByAscendingDateFieldKindValue(
  a: DateFieldKindValue,
  b: DateFieldKindValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return -1;
  }

  if (!isISODate(a)) {
    return -1;
  }

  if (b === null) {
    return 1;
  }

  if (!isISODate(b)) {
    return 1;
  }

  if (isBefore(parseISODate(a), parseISODate(b))) {
    return -1;
  } else if (isAfter(parseISODate(a), parseISODate(b))) {
    return 1;
  }
  return 0;
}

function descendingBooleanFieldKindValueSort(
  a: BooleanFieldKindValue,
  b: BooleanFieldKindValue,
) {
  if (a === true && b === false) {
    return -1;
  } else if (a === false && b === true) {
    return 1;
  }

  return 0;
}

function descendingTextFieldKindValueSort(
  a: TextFieldKindValue,
  b: TextFieldKindValue,
) {
  if (a > b) {
    return -1;
  } else if (b < a) {
    return 1;
  }
  return 0;
}

function sortByDescendingNumberFieldKindValue(
  a: NumberFieldKindValue,
  b: NumberFieldKindValue,
) {
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

function sortByDescendingDateFieldKindValue(
  a: DateFieldKindValue,
  b: DateFieldKindValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (!isISODate(a)) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  if (!isISODate(b)) {
    return -1;
  }

  if (isAfter(parseISODate(a), parseISODate(b))) {
    return -1;
  } else if (isBefore(parseISODate(a), parseISODate(b))) {
    return 1;
  }
  return 0;
}

function sortByAscendingSingleSelect(
  optionsByID: { [id: string]: SelectOption },
  a: SingleSelectFieldValue,
  b: SingleSelectFieldValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return -1;
  }

  if (b === null) {
    return 1;
  }

  const optionA = optionsByID[a];
  const optionB = optionsByID[b];

  if (optionA.order > optionB.order) {
    return -1;
  } else if (optionA.order < optionB.order) {
    return 1;
  }
  return 0;
}

function sortByDescendingSingleSelect(
  optionsByID: { [id: string]: SelectOption },
  a: SingleSelectFieldValue,
  b: SingleSelectFieldValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  const optionA = optionsByID[a];
  const optionB = optionsByID[b];

  if (optionA.order < optionB.order) {
    return -1;
  } else if (optionA.order > optionB.order) {
    return 1;
  }
  return 0;
}

function sortByAscendingMultiSelect(
  optionsByID: { [id: string]: SelectOption },
  a: MultiSelectFieldValue,
  b: MultiSelectFieldValue,
) {
  if (isEmpty(a) && isEmpty(b)) {
    return 0;
  }

  if (isEmpty(a)) {
    return -1;
  }

  if (isEmpty(b)) {
    return 1;
  }

  const optionA = optionsByID[a[0]];
  const optionB = optionsByID[b[0]];

  if (optionA.order > optionB.order) {
    return -1;
  } else if (optionA.order < optionB.order) {
    return 1;
  }
  return 0;
}

function sortByDescendingMultiSelect(
  optionsByID: { [id: string]: SelectOption },
  a: MultiSelectFieldValue,
  b: MultiSelectFieldValue,
) {
  if (isEmpty(a) && isEmpty(b)) {
    return 0;
  }

  if (isEmpty(a)) {
    return 1;
  }

  if (isEmpty(b)) {
    return -1;
  }

  const optionA = optionsByID[a[0]];
  const optionB = optionsByID[b[0]];

  if (optionA.order < optionB.order) {
    return -1;
  } else if (optionA.order > optionB.order) {
    return 1;
  }
  return 0;
}

function sortByAscendingSingleCollaborator(
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator,
  a: SingleCollaboratorFieldValue,
  b: SingleCollaboratorFieldValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return -1;
  }

  if (b === null) {
    return 1;
  }

  const collaboratorA = getCollaborator(a);
  const collaboratorB = getCollaborator(b);

  if (collaboratorA.name < collaboratorB.name) {
    return -1;
  } else if (collaboratorA.name > collaboratorB.name) {
    return 1;
  }
  return 0;
}

function sortByDescendingSingleCollaborator(
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator,
  a: SingleCollaboratorFieldValue,
  b: SingleCollaboratorFieldValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  const collaboratorA = getCollaborator(a);
  const collaboratorB = getCollaborator(b);

  if (collaboratorA.name > collaboratorB.name) {
    return -1;
  } else if (collaboratorA.name < collaboratorB.name) {
    return 1;
  }
  return 0;
}

function sortByAscendingMultiCollaborator(
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator,
  a: MultiCollaboratorFieldValue,
  b: MultiCollaboratorFieldValue,
) {
  if (isEmpty(a) && isEmpty(b)) {
    return 0;
  }

  if (isEmpty(a)) {
    return -1;
  }

  if (isEmpty(b)) {
    return 1;
  }

  const collaboratorA = getCollaborator(a[0]);
  const collaboratorB = getCollaborator(b[0]);

  if (collaboratorA.name < collaboratorB.name) {
    return -1;
  } else if (collaboratorA.name > collaboratorB.name) {
    return 1;
  }
  return 0;
}

function sortByDescendingMultiCollaborator(
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator,
  a: MultiCollaboratorFieldValue,
  b: MultiCollaboratorFieldValue,
) {
  if (isEmpty(a) && isEmpty(b)) {
    return 0;
  }

  if (isEmpty(a)) {
    return 1;
  }

  if (isEmpty(b)) {
    return -1;
  }

  const collaboratorA = getCollaborator(a[0]);
  const collaboratorB = getCollaborator(b[0]);

  if (collaboratorA.name > collaboratorB.name) {
    return -1;
  } else if (collaboratorA.name < collaboratorB.name) {
    return 1;
  }
  return 0;
}

function sortByAscendingSingleDocumentLink(
  primaryField: PrimaryField,
  getDocument: (documentID: DocumentID) => Document,
  a: SingleDocumentLinkFieldValue,
  b: SingleDocumentLinkFieldValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return -1;
  }

  if (b === null) {
    return 1;
  }

  const documentA = getDocument(a);
  const documentB = getDocument(b);

  const documentAPrimaryFieldValue = documentA.fields[primaryField.id];
  const documentBPrimaryFieldValue = documentB.fields[primaryField.id];

  assertPrimaryFieldValue(documentAPrimaryFieldValue);
  assertPrimaryFieldValue(documentBPrimaryFieldValue);

  return ascendingTextFieldKindValueSort(
    documentAPrimaryFieldValue,
    documentBPrimaryFieldValue,
  );
}

function sortByDescendingSingleDocumentLink(
  primaryField: PrimaryField,
  getDocument: (documentID: DocumentID) => Document,
  a: SingleDocumentLinkFieldValue,
  b: SingleDocumentLinkFieldValue,
) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  const documentA = getDocument(a);
  const documentB = getDocument(b);

  const documentAPrimaryFieldValue = documentA.fields[primaryField.id];
  const documentBPrimaryFieldValue = documentB.fields[primaryField.id];

  assertPrimaryFieldValue(documentAPrimaryFieldValue);
  assertPrimaryFieldValue(documentBPrimaryFieldValue);

  return descendingTextFieldKindValueSort(
    documentAPrimaryFieldValue,
    documentBPrimaryFieldValue,
  );
}

function sortByAscendingMultiDocumentLink(
  primaryField: PrimaryField,
  getDocument: (documentID: DocumentID) => Document,
  a: MultiDocumentLinkFieldValue,
  b: MultiDocumentLinkFieldValue,
) {
  if (isEmpty(a) && isEmpty(b)) {
    return 0;
  }

  if (isEmpty(a)) {
    return -1;
  }

  if (isEmpty(b)) {
    return 1;
  }

  const documentA = getDocument(a[0]);
  const documentB = getDocument(b[0]);

  const documentAPrimaryFieldValue = documentA.fields[primaryField.id];
  const documentBPrimaryFieldValue = documentB.fields[primaryField.id];

  assertPrimaryFieldValue(documentAPrimaryFieldValue);
  assertPrimaryFieldValue(documentBPrimaryFieldValue);

  return ascendingTextFieldKindValueSort(
    documentAPrimaryFieldValue,
    documentBPrimaryFieldValue,
  );
}

function sortByDescendingMultiDocumentLink(
  primaryField: PrimaryField,
  getDocument: (documentID: DocumentID) => Document,
  a: MultiDocumentLinkFieldValue,
  b: MultiDocumentLinkFieldValue,
) {
  if (isEmpty(a) && isEmpty(b)) {
    return 0;
  }

  if (isEmpty(a)) {
    return 1;
  }

  if (isEmpty(b)) {
    return -1;
  }

  const documentA = getDocument(a[0]);
  const documentB = getDocument(b[0]);

  const documentAPrimaryFieldValue = documentA.fields[primaryField.id];
  const documentBPrimaryFieldValue = documentB.fields[primaryField.id];

  assertPrimaryFieldValue(documentAPrimaryFieldValue);
  assertPrimaryFieldValue(documentBPrimaryFieldValue);

  return descendingTextFieldKindValueSort(
    documentAPrimaryFieldValue,
    documentBPrimaryFieldValue,
  );
}
