import { DocumentID } from '../../../models/documents';
import { Field, FieldID, FieldValue } from '../../../models/fields';
import { FieldWithListViewConfig } from '../../../models/views';
import {
  Column,
  GroupRowCell,
  LeafRow,
  LeafRowCell,
} from '../../components/grid_renderer.common';
import {
  FlatListViewDocumentNode,
  GroupedListViewDocumentNode,
} from './list_view_nodes';

export interface ListViewMap {}

/**
 * Provides mapping between cells, rows and columns to fields and documents
 */
export function useListViewMap(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[],
  fields: FieldWithListViewConfig[],
): ListViewMap {
  return listViewMap;
}

export interface GroupRowCellData {
  field: Field;
  value: FieldValue;
}

export function isGrouped(listViewMap: ListViewMap): boolean {}

export function getDocumentID(
  listViewMap: ListViewMap,
  row: LeafRow,
): DocumentID {}
export function getFieldID(listViewMap: ListViewMap, column: Column): FieldID {}
export function getLeafRow(
  listViewMap: ListViewMap,
  documentID: DocumentID,
): LeafRow {}
export function getLeafRows(
  listViewMap: ListViewMap,
  documentID: DocumentID[],
): LeafRow[] {}
export function getGroupRowCellData(
  listViewMap: ListViewMap,
  groupRowCell: GroupRowCell,
): GroupRowCellData {}
export function getColumn(listViewMap: ListViewMap, fieldID: FieldID): Column {}

export function getLeafRowCellTopMost(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellBottomMost(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellLeftMost(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellRightMost(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellBelow(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellAbove(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellRight(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}
export function getLeafRowCellLeft(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRowCell {}

export function getNextLeafRow(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRow {}
export function getPreviousLeafRow(
  listViewMap: ListViewMap,
  row: LeafRow,
): LeafRow {}
export function getFirstLeafRow(listViewMap: ListViewMap): LeafRow {}
export function getLastLeafRow(listViewMap: ListViewMap): LeafRow {}

export function getNextColumn(
  listViewMap: ListViewMap,
  column: Column,
): Column {}
export function getPreviousColumn(
  listViewMap: ListViewMap,
  column: Column,
): Column {}
export function getFirstColumn(listViewMap: ListViewMap): Column {}
export function getLastColumn(listViewMap: ListViewMap): Column {}
