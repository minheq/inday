import { ViewID } from './views';
import {
  FieldID,
  Field,
  FieldType,
  MultiCollaboratorFieldValue,
  MultiOptionFieldValue,
  MultiRecordLinkFieldValue,
  SingleCollaboratorFieldValue,
  SingleOptionFieldValue,
  SingleRecordLinkFieldValue,
  assertTextFieldKindValue,
  assertNumberFieldKindValue,
  assertDateFieldKindValue,
  assertBooleanFieldKindValue,
  assertMultiOptionFieldValue,
  assertSingleOptionFieldValue,
  assertMultiCollaboratorFieldValue,
  assertSingleCollaboratorFieldValue,
  assertMultiRecordLinkFieldValue,
  assertSingleRecordLinkFieldValue,
  assertMultiOptionField,
  assertSingleOptionField,
  assertMultiRecordLinkField,
  assertSingleRecordLinkField,
  FieldValue,
  TextFieldKindValue,
  NumberFieldKindValue,
  DateFieldKindValue,
  BooleanFieldKindValue,
  SelectOption,
  assertPrimaryField,
  PrimaryField,
  assertPrimaryFieldValue,
} from './fields';
import { Record, RecordID } from './records';

import { Collaborator, CollaboratorID } from './collaborators';
import { CollectionID, Collection } from './collections';
import { generateID, validateID } from '../../lib/id';
import { isEmpty } from '../../lib/lang_utils';
import { first, keyedBy } from '../../lib/array_utils';
import {
  isBefore,
  isAfter,
  isISODate,
  parseISODate,
} from '../../lib/date_utils';

export const sortIDPrefix = 'srt' as const;
export type SortID = `${typeof sortIDPrefix}${string}`;

export const Sort = {
  generateID: (): SortID => {
    return generateID(sortIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(sortIDPrefix, id);
  },
};

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
  getRecord: (recordID: RecordID) => Record;
  getCollection: (collectionID: CollectionID) => Collection;
  getCollaborator: (collaboratorID: CollaboratorID) => Collaborator;
}

export function sortRecords(
  sorts: Sort[],
  records: Record[],
  getters: SortGetters,
): Record[] {
  if (isEmpty(sorts)) {
    return records;
  }
  const nodes = makeNodes(sorts, records, getters);

  return toRecords(nodes);
}

function isLeafNodes(nodes: Node[]): nodes is LeafNode[] {
  const firstNode = first(nodes);

  if (firstNode === undefined) {
    throw new Error('Nodes are empty');
  }

  return firstNode.type === 'leaf';
}

function toRecords(nodes: Node[]): Record[] {
  if (isEmpty(nodes)) {
    return [];
  }

  if (isLeafNodes(nodes)) {
    return flattenLeafNodes(nodes);
  }

  let records: Record[] = [];

  for (const node of nodes) {
    records = records.concat(toRecords(node.children as Node[]));
  }

  return records;
}

function flattenLeafNodes(leafNodes: LeafNode[]): Record[] {
  let records: Record[] = [];

  for (const node of leafNodes) {
    records = records.concat(node.children);
  }

  return records;
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
  children: Record[];
}

type Node = AncestorNode | LeafNode;

function makeNodes(
  sorts: Sort[],
  records: Record[],
  getters: SortGetters,
): Node[] {
  if (isEmpty(records)) {
    return [];
  }

  const sort = first(sorts);
  const nextSorts = sorts.slice(1);

  if (sort === undefined) {
    throw new Error(
      'Empty sorts. There should be at least one sort to make a tree',
    );
  }

  const leafNodes = makeLeafNodes(sort, records, getters);

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
  records: Record[],
  getters: SortGetters,
): LeafNode[] {
  const { getField } = getters;
  const field = getField(sort.fieldID);
  const sorted = sortBy(field, sort, records, getters);

  const firstRecord = first(sorted);

  if (firstRecord === undefined) {
    throw new Error('records empty');
  }

  let currentNode: LeafNode = {
    type: 'leaf',
    field,
    value: firstRecord.fields[field.id],
    children: [firstRecord],
  };

  const nodes: LeafNode[] = [currentNode];

  for (let i = 1; i < sorted.length; i++) {
    const record = sorted[i];

    if (
      FieldValue.areFieldValuesEqual(
        field.type,
        record.fields[field.id],
        currentNode.value,
      )
    ) {
      if (currentNode.type === 'leaf') {
        currentNode.children.push(record);
      }
    } else {
      currentNode = {
        type: 'leaf',
        field,
        value: record.fields[field.id],
        children: [record],
      };
      nodes.push(currentNode);
    }
  }

  return nodes;
}

function sortBy(
  field: Field,
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  switch (field.type) {
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return sortByTextFieldKind(sort, records, getters);
    case FieldType.Checkbox:
      return sortByBooleanFieldKind(sort, records, getters);
    case FieldType.Date:
      return sortByDateFieldKind(sort, records, getters);
    case FieldType.Number:
    case FieldType.Currency:
      return sortByNumberFieldKind(sort, records, getters);
    case FieldType.MultiCollaborator:
      return sortByMultiCollaboratorField(sort, records, getters);
    case FieldType.MultiOption:
      return sortByMultiOptionField(sort, records, getters);
    case FieldType.MultiRecordLink:
      return sortByMultiRecordLinkField(sort, records, getters);
    case FieldType.SingleCollaborator:
      return sortBySingleCollaboratorField(sort, records, getters);
    case FieldType.SingleOption:
      return sortBySingleOptionField(sort, records, getters);
    case FieldType.SingleRecordLink:
      return sortBySingleRecordLinkField(sort, records, getters);
    default:
      throw new Error(`Unrecognized field ${JSON.stringify(field)}`);
  }
}

export function sortByTextFieldKind(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return recordsClone.sort((a, b) => {
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
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return recordsClone.sort((a, b) => {
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
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return recordsClone.sort((a, b) => {
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

export function sortBySingleOptionField(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);
  assertSingleOptionField(field);

  const optionsByID = keyedBy(field.options, (item) => item.id);

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertSingleOptionFieldValue(valA);
    assertSingleOptionFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingSingleOption(optionsByID, valA, valB);
    }
    return sortByDescendingSingleOption(optionsByID, valA, valB);
  });
}

export function sortByMultiOptionField(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);
  assertMultiOptionField(field);

  const optionsByID = keyedBy(field.options, (item) => item.id);

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertMultiOptionFieldValue(valA);
    assertMultiOptionFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingMultiOption(optionsByID, valA, valB);
    }

    return sortByDescendingMultiOption(optionsByID, valA, valB);
  });
}

export function sortBySingleCollaboratorField(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getCollaborator } = getters;

  return recordsClone.sort((a, b) => {
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
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  return recordsClone.sort((a, b) => {
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

export function sortBySingleRecordLinkField(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getRecord, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertSingleRecordLinkField(field);

  const collection = getCollection(field.recordsFromCollectionID);

  const primaryField = getField(collection.primaryFieldID);
  assertPrimaryField(primaryField);

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertSingleRecordLinkFieldValue(valA);
    assertSingleRecordLinkFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingSingleRecordLink(
        primaryField,
        getRecord,
        valA,
        valB,
      );
    }

    return sortByDescendingSingleRecordLink(
      primaryField,
      getRecord,
      valA,
      valB,
    );
  });
}

export function sortByMultiRecordLinkField(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getRecord, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertMultiRecordLinkField(field);

  const collection = getCollection(field.recordsFromCollectionID);
  const primaryField = getField(collection.primaryFieldID);
  assertPrimaryField(primaryField);

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    assertMultiRecordLinkFieldValue(valA);
    assertMultiRecordLinkFieldValue(valB);

    if (sort.order === 'ascending') {
      return sortByAscendingMultiRecordLink(
        primaryField,
        getRecord,
        valA,
        valB,
      );
    }

    return sortByDescendingMultiRecordLink(primaryField, getRecord, valA, valB);
  });
}

export function sortByBooleanFieldKind(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  return recordsClone.sort((a, b) => {
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

function sortByAscendingSingleOption(
  optionsByID: { [id: string]: SelectOption },
  a: SingleOptionFieldValue,
  b: SingleOptionFieldValue,
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

function sortByDescendingSingleOption(
  optionsByID: { [id: string]: SelectOption },
  a: SingleOptionFieldValue,
  b: SingleOptionFieldValue,
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

function sortByAscendingMultiOption(
  optionsByID: { [id: string]: SelectOption },
  a: MultiOptionFieldValue,
  b: MultiOptionFieldValue,
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

function sortByDescendingMultiOption(
  optionsByID: { [id: string]: SelectOption },
  a: MultiOptionFieldValue,
  b: MultiOptionFieldValue,
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

function sortByAscendingSingleRecordLink(
  primaryField: PrimaryField,
  getRecord: (recordID: RecordID) => Record,
  a: SingleRecordLinkFieldValue,
  b: SingleRecordLinkFieldValue,
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

  const recordA = getRecord(a);
  const recordB = getRecord(b);

  const recordAPrimaryFieldValue = recordA.fields[primaryField.id];
  const recordBPrimaryFieldValue = recordB.fields[primaryField.id];

  assertPrimaryFieldValue(recordAPrimaryFieldValue);
  assertPrimaryFieldValue(recordBPrimaryFieldValue);

  return ascendingTextFieldKindValueSort(
    recordAPrimaryFieldValue,
    recordBPrimaryFieldValue,
  );
}

function sortByDescendingSingleRecordLink(
  primaryField: PrimaryField,
  getRecord: (recordID: RecordID) => Record,
  a: SingleRecordLinkFieldValue,
  b: SingleRecordLinkFieldValue,
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

  const recordA = getRecord(a);
  const recordB = getRecord(b);

  const recordAPrimaryFieldValue = recordA.fields[primaryField.id];
  const recordBPrimaryFieldValue = recordB.fields[primaryField.id];

  assertPrimaryFieldValue(recordAPrimaryFieldValue);
  assertPrimaryFieldValue(recordBPrimaryFieldValue);

  return descendingTextFieldKindValueSort(
    recordAPrimaryFieldValue,
    recordBPrimaryFieldValue,
  );
}

function sortByAscendingMultiRecordLink(
  primaryField: PrimaryField,
  getRecord: (recordID: RecordID) => Record,
  a: MultiRecordLinkFieldValue,
  b: MultiRecordLinkFieldValue,
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

  const recordA = getRecord(a[0]);
  const recordB = getRecord(b[0]);

  const recordAPrimaryFieldValue = recordA.fields[primaryField.id];
  const recordBPrimaryFieldValue = recordB.fields[primaryField.id];

  assertPrimaryFieldValue(recordAPrimaryFieldValue);
  assertPrimaryFieldValue(recordBPrimaryFieldValue);

  return ascendingTextFieldKindValueSort(
    recordAPrimaryFieldValue,
    recordBPrimaryFieldValue,
  );
}

function sortByDescendingMultiRecordLink(
  primaryField: PrimaryField,
  getRecord: (recordID: RecordID) => Record,
  a: MultiRecordLinkFieldValue,
  b: MultiRecordLinkFieldValue,
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

  const recordA = getRecord(a[0]);
  const recordB = getRecord(b[0]);

  const recordAPrimaryFieldValue = recordA.fields[primaryField.id];
  const recordBPrimaryFieldValue = recordB.fields[primaryField.id];

  assertPrimaryFieldValue(recordAPrimaryFieldValue);
  assertPrimaryFieldValue(recordBPrimaryFieldValue);

  return descendingTextFieldKindValueSort(
    recordAPrimaryFieldValue,
    recordBPrimaryFieldValue,
  );
}
