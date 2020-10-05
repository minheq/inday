import { ViewID } from './views';
import {
  FieldID,
  Field,
  FieldType,
  assertSingleOptionField,
  assertMultiOptionField,
  assertSingleCollaboratorField,
  assertMultiCollaboratorField,
  assertMultiRecordLinkField,
  assertSingleRecordLinkField,
  areFieldValuesEqual,
} from './fields';
import {
  Record,
  FieldValue,
  RecordID,
  SingleOptionValue,
  MultiOptionValue,
  SingleCollaboratorValue,
  MultiCollaboratorValue,
  SingleRecordLinkValue,
  MultiRecordLinkValue,
  assertTextFieldValue,
  assertBooleanFieldValue,
  assertNumberFieldValue,
  assertDateFieldValue,
} from './records';
import { first, isEmpty, keyedBy } from '../../lib/data_structures';
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

  if (sorts.length === 1) {
    return makeLeafNodes(sort, records, getters);
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
  [FieldType.Checkbox]: applyBooleanSort,
  [FieldType.Currency]: applyNumberSort,
  [FieldType.Date]: applyDateSort,
  [FieldType.Email]: applyTextSort,
  [FieldType.MultiCollaborator]: applyMultiCollaboratorSort,
  [FieldType.MultiRecordLink]: applyMultiRecordLinkSort,
  [FieldType.MultiLineText]: applyTextSort,
  [FieldType.MultiOption]: applyMultiOptionSort,
  [FieldType.Number]: applyNumberSort,
  [FieldType.PhoneNumber]: applyTextSort,
  [FieldType.SingleCollaborator]: applySingleCollaboratorSort,
  [FieldType.SingleRecordLink]: applySingleRecordLinkSort,
  [FieldType.SingleLineText]: applyTextSort,
  [FieldType.SingleOption]: applySingleOptionSort,
  [FieldType.URL]: applyTextSort,
};

export function applyTextSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingTextFieldValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingTextFieldValueSort(valA, valB);
  });
}

export function applyNumberSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingNumberFieldValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingNumberFieldValueSort(valA, valB);
  });
}

export function applyDateSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingDateFieldValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
    const valA = a.fields[field.id];
    const valB = b.fields[field.id];

    return descendingDateFieldValueSort(valA, valB);
  });
}

export function applySingleOptionSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  assertSingleOptionField(field);

  const optionsByValue = keyedBy(field.options, 'value');

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
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

  return recordsClone.sort((a, b) => {
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
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  assertMultiOptionField(field);

  const optionsByValue = keyedBy(field.options, 'value');

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
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

  return recordsClone.sort((a, b) => {
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
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  assertSingleCollaboratorField(field);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
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

  return recordsClone.sort((a, b) => {
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
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField, getCollaborator } = getters;

  const field = getField(sort.fieldID);

  assertMultiCollaboratorField(field);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
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

  return recordsClone.sort((a, b) => {
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

export function applySingleRecordLinkSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField, getRecord, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertSingleRecordLinkField(field);

  const collection = getCollection(field.recordsFromCollectionID);

  const mainField = getField(collection.mainFieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as SingleRecordLinkValue;
      const valB = b.fields[field.id] as SingleRecordLinkValue;

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
    const valA = a.fields[field.id] as SingleRecordLinkValue;
    const valB = b.fields[field.id] as SingleRecordLinkValue;

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

export function applyMultiRecordLinkSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField, getRecord, getCollection } = getters;

  const field = getField(sort.fieldID);
  assertMultiRecordLinkField(field);

  const collection = getCollection(field.recordsFromCollectionID);
  const mainField = getField(collection.mainFieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id] as MultiRecordLinkValue;
      const valB = b.fields[field.id] as MultiRecordLinkValue;

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
    const valA = a.fields[field.id] as MultiRecordLinkValue;
    const valB = b.fields[field.id] as MultiRecordLinkValue;

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

export function applyBooleanSort(
  sort: Sort,
  records: Record[],
  getters: SortGetters,
) {
  const recordsClone = records.slice(0);
  const { getField } = getters;

  const field = getField(sort.fieldID);

  if (sort.order === 'ascending') {
    return recordsClone.sort((a, b) => {
      const valA = a.fields[field.id];
      const valB = b.fields[field.id];

      return ascendingBooleanFieldValueSort(valA, valB);
    });
  }

  return recordsClone.sort((a, b) => {
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
