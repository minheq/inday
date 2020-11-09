import { ViewID } from './views';
import {
  FieldID,
  Field,
  FieldType,
  FieldValue,
  MultiCollaboratorFieldValue,
  MultiOptionFieldValue,
  MultiRecordLinkFieldValue,
  SingleCollaboratorFieldValue,
  SingleOptionFieldValue,
  SingleRecordLinkFieldValue,
  assertBooleanFieldKindValue,
  assertDateFieldKindValue,
  assertMultiCollaboratorField,
  assertMultiOptionField,
  assertMultiRecordLinkField,
  assertNumberFieldKindValue,
  assertSingleCollaboratorField,
  assertSingleOptionField,
  assertSingleRecordLinkField,
  assertTextFieldKindValue,
  areFieldValuesEqual,
} from './fields';
import { Record, RecordID } from './records';
import { first, isEmpty, keyedBy } from '../../lib/js_utils';
import { CollaboratorID, Collaborator } from './collaborators';
import { isBefore, isAfter } from 'date-fns';
import { CollectionID, Collection } from './collections';

export type SortID = string;

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
) {
  if (isEmpty(sorts)) {
    return records;
  }
  const nodes = makeNodes(sorts, records, getters);

  return toRecords(nodes);
}

function isLeafNodes(nodes: Node[]): nodes is LeafNode[] {
  if (isEmpty(nodes)) {
    throw new Error('Nodes are empty');
  }

  return first(nodes).type === 'leaf';
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

  if (isEmpty(sorts)) {
    throw new Error(
      'Empty sorts. There should be at least one sort to make a tree',
    );
  }

  const sort = first(sorts);
  const nextSorts = sorts.slice(1);

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

  const applySort = applySortByFieldType[field.type];
  const sortedRecords = applySort(sort, records, getters);

  const firstRecord = first(sortedRecords);

  let currentNode: LeafNode = {
    type: 'leaf',
    field,
    value: firstRecord.fields[field.id],
    children: [firstRecord],
  };

  const nodes: LeafNode[] = [currentNode];

  for (let i = 1; i < sortedRecords.length; i++) {
    const record = sortedRecords[i];

    if (
      areFieldValuesEqual(
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

const applySortByFieldType: {
  [fieldType in FieldType]: (
    sort: Sort,
    records: Record[],
    getters: SortGetters,
  ) => Record[];
} = {
  [FieldType.Checkbox]: applyBooleanFieldKindSort,
  [FieldType.Currency]: applyNumberFieldKindSort,
  [FieldType.Date]: applyDateFieldKindSort,
  [FieldType.Email]: applyTextFieldKindSort,
  [FieldType.MultiCollaborator]: applyMultiCollaboratorFieldSort,
  [FieldType.MultiRecordLink]: applyMultiRecordLinkFieldSort,
  [FieldType.MultiLineText]: applyTextFieldKindSort,
  [FieldType.MultiOption]: applyMultiOptionFieldSort,
  [FieldType.Number]: applyNumberFieldKindSort,
  [FieldType.PhoneNumber]: applyTextFieldKindSort,
  [FieldType.SingleCollaborator]: applySingleCollaboratorFieldSort,
  [FieldType.SingleRecordLink]: applySingleRecordLinkFieldSort,
  [FieldType.SingleLineText]: applyTextFieldKindSort,
  [FieldType.SingleOption]: applySingleOptionFieldSort,
  [FieldType.URL]: applyTextFieldKindSort,
};

export function applyTextFieldKindSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingTextFieldKindValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingTextFieldKindValueSort(valA, valB);
  });
}

export function applyNumberFieldKindSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingNumberFieldKindValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingNumberFieldKindValueSort(valA, valB);
  });
}

export function applyDateFieldKindSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingDateFieldKindValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingDateFieldKindValueSort(valA, valB);
  });
}

export function applySingleOptionFieldSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  assertSingleOptionField(field);

  const optionsByValue = keyedBy(field.options, (item) => item.value);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleOptionFieldValue;
      const valB = b.fields[field.id] as SingleOptionFieldValue;

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

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id] as SingleOptionFieldValue;
    const valB = b.fields[field.id] as SingleOptionFieldValue;

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

export function applyMultiOptionFieldSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  assertMultiOptionField(field);

  const optionsByValue = keyedBy(field.options, (item) => item.value);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiOptionFieldValue;
      const valB = b.fields[field.id] as MultiOptionFieldValue;

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

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id] as MultiOptionFieldValue;
    const valB = b.fields[field.id] as MultiOptionFieldValue;

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

export function applySingleCollaboratorFieldSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  assertSingleCollaboratorField(field);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleCollaboratorFieldValue;
      const valB = b.fields[field.id] as SingleCollaboratorFieldValue;

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

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id] as SingleCollaboratorFieldValue;
    const valB = b.fields[field.id] as SingleCollaboratorFieldValue;

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

export function applyMultiCollaboratorFieldSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  assertMultiCollaboratorField(field);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiCollaboratorFieldValue;
      const valB = b.fields[field.id] as MultiCollaboratorFieldValue;

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

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id] as MultiCollaboratorFieldValue;
    const valB = b.fields[field.id] as MultiCollaboratorFieldValue;

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

export function applySingleRecordLinkFieldSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getRecord, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertSingleRecordLinkField(field);

  const collection = getCollection(field.recordsFromCollectionID);

  const mainField = getField(collection.mainFieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleRecordLinkFieldValue;
      const valB = b.fields[field.id] as SingleRecordLinkFieldValue;

      if (valA === null && valB === null) {
        return 0;
      }

      if (valA === null) {
        return -1;
      }

      if (valB === null) {
        return 1;
      }

      const recordA = getRecord(valA);
      const recordB = getRecord(valB);

      const recordAMainField = recordA.fields[mainField.id];
      const recordBMainField = recordB.fields[mainField.id];

      return ascendingFieldValueSort(
        mainField.type,
        recordAMainField,
        recordBMainField,
      );
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id] as SingleRecordLinkFieldValue;
    const valB = b.fields[field.id] as SingleRecordLinkFieldValue;

    if (valA === null && valB === null) {
      return 0;
    }

    if (valA === null) {
      return 1;
    }

    if (valB === null) {
      return -1;
    }

    const recordA = getRecord(valA);
    const recordB = getRecord(valB);

    const recordAMainField = recordA.fields[mainField.id];
    const recordBMainField = recordB.fields[mainField.id];

    return descendingFieldValueSort(
      mainField.type,
      recordAMainField,
      recordBMainField,
    );
  });
}

export function applyMultiRecordLinkFieldSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField, getRecord, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertMultiRecordLinkField(field);

  const collection = getCollection(field.recordsFromCollectionID);
  const mainField = getField(collection.mainFieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiRecordLinkFieldValue;
      const valB = b.fields[field.id] as MultiRecordLinkFieldValue;

      if (isEmpty(valA) && isEmpty(valB)) {
        return 0;
      }

      if (isEmpty(valA)) {
        return -1;
      }

      if (isEmpty(valB)) {
        return 1;
      }

      const recordA = getRecord(valA[0]);
      const recordB = getRecord(valB[0]);

      const recordAMainField = recordA.fields[mainField.id];
      const recordBMainField = recordB.fields[mainField.id];

      return ascendingFieldValueSort(
        mainField.type,
        recordAMainField,
        recordBMainField,
      );
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id] as MultiRecordLinkFieldValue;
    const valB = b.fields[field.id] as MultiRecordLinkFieldValue;

    if (isEmpty(valA) && isEmpty(valB)) {
      return 0;
    }

    if (isEmpty(valA)) {
      return 1;
    }

    if (isEmpty(valB)) {
      return -1;
    }

    const recordA = getRecord(valA[0]);
    const recordB = getRecord(valB[0]);

    const recordAMainField = recordA.fields[mainField.id];
    const recordBMainField = recordB.fields[mainField.id];

    return descendingFieldValueSort(
      mainField.type,
      recordAMainField,
      recordBMainField,
    );
  });
}

export function applyBooleanFieldKindSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
): Record[] {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingBooleanFieldKindValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingBooleanFieldKindValueSort(valA, valB);
  });
}

function ascendingBooleanFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertBooleanFieldKindValue(a);
  assertBooleanFieldKindValue(b);

  if (a === false && b === true) {
    return -1;
  } else if (a === true && b === false) {
    return 1;
  }
  return 0;
}

function ascendingTextFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertTextFieldKindValue(a);
  assertTextFieldKindValue(b);

  if (a < b) {
    return -1;
  } else if (b > a) {
    return 1;
  }
  return 0;
}

function ascendingNumberFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertNumberFieldKindValue(a);
  assertNumberFieldKindValue(b);

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

function ascendingDateFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertDateFieldKindValue(a);
  assertDateFieldKindValue(b);

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

function descendingBooleanFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertBooleanFieldKindValue(a);
  assertBooleanFieldKindValue(b);

  if (a === true && b === false) {
    return -1;
  } else if (a === false && b === true) {
    return 1;
  }

  return 0;
}

function descendingTextFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertTextFieldKindValue(a);
  assertTextFieldKindValue(b);

  if (a > b) {
    return -1;
  } else if (b < a) {
    return 1;
  }
  return 0;
}

function descendingNumberFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertNumberFieldKindValue(a);
  assertNumberFieldKindValue(b);

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

function descendingDateFieldKindValueSort(a: FieldValue, b: FieldValue) {
  assertDateFieldKindValue(a);
  assertDateFieldKindValue(b);

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
      return ascendingBooleanFieldKindValueSort(a, b);
    case FieldType.Date:
      return ascendingDateFieldKindValueSort(a, b);
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return ascendingTextFieldKindValueSort(a, b);
    case FieldType.Number:
    case FieldType.Currency:
      return ascendingNumberFieldKindValueSort(a, b);
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
      return descendingBooleanFieldKindValueSort(a, b);
    case FieldType.Date:
      return descendingDateFieldKindValueSort(a, b);
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return descendingTextFieldKindValueSort(a, b);
    case FieldType.Number:
    case FieldType.Currency:
      return descendingNumberFieldKindValueSort(a, b);
    default:
      throw new Error(`Sort not supported for main field type=${fieldType}`);
  }
}
