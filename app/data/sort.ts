import { ViewID } from './views';
import { FieldID, Field } from './fields';
import { Document } from './documents';

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
