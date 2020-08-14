import { ViewID } from './views';
import { FieldID, Field } from './fields';
import {
  Document,
  FieldValue,
  assertTextFieldValue,
  assertBooleanFieldValue,
  assertDateFieldValue,
  assertNumberFieldValue,
} from './documents';

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

export function sortDocuments(
  sorts: Sort[],
  documents: Document[],
  getField: (fieldID: string) => Field,
) {
  let sortedDocuments = documents;

  return sortedDocuments;
}

// const sortByFieldType: {
//   [fieldType in FieldType]: (a: FieldValue, b: FieldValue) => number;
// } = {
//   [FieldType.Checkbox]: booleanSort,
//   [FieldType.Currency]: numberSort,
//   [FieldType.Date]: dateSort,
//   [FieldType.Email]: textSort,
//   [FieldType.MultiCollaborator]: multiSelectFilter,
//   [FieldType.MultiDocumentLink]: multiSelectFilter,
//   [FieldType.MultiLineText]: textSort,
//   [FieldType.MultiOption]: multiSelectFilter,
//   [FieldType.Number]: numberSort,
//   [FieldType.PhoneNumber]: textSort,
//   [FieldType.SingleCollaborator]: singleSelectFilter,
//   [FieldType.SingleDocumentLink]: singleSelectFilter,
//   [FieldType.SingleLineText]: textSort,
//   [FieldType.SingleOption]: singleSelectFilter,
//   [FieldType.URL]: textSort,
// };

function textSort(a: FieldValue, b: FieldValue): number {
  assertTextFieldValue(a);
  assertTextFieldValue(b);

  return 0;
}

function booleanSort(a: FieldValue, b: FieldValue): number {
  assertBooleanFieldValue(a);
  assertBooleanFieldValue(b);

  return 0;
}

function dateSort(a: FieldValue, b: FieldValue): number {
  assertDateFieldValue(a);
  assertDateFieldValue(b);

  return 0;
}

function numberSort(a: FieldValue, b: FieldValue): number {
  assertNumberFieldValue(a);
  assertNumberFieldValue(b);

  return 0;
}
