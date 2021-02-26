import { useMemo } from 'react';
import { first, last, splitLast } from '../../../lib/array_utils';
import { FlatObject } from '../../../lib/flat_object';
import { isEmpty } from '../../../lib/lang_utils';
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
  isGroupedListViewDocumentNodes,
} from './list_view_nodes';

export interface ListViewMap {
  grouped: boolean;
  leafRows: ListViewLeafRow[];
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[];
  fields: FieldWithListViewConfig[];
  groupRowCache: GroupRowCellCache;
  leafRowCache: LeafRowCache;
  columnToFieldID: ColumnToFieldIDCache;
  documentIDToLeafRow: DocumentIDToLeafRowCache;
  fieldIDToColumn: FieldIDToColumnCache;
}

export const defaultListViewMap: ListViewMap = {
  grouped: false,
  leafRows: [],
  nodes: [],
  fields: [],
  groupRowCache: FlatObject(),
  leafRowCache: FlatObject(),
  columnToFieldID: FlatObject(),
  documentIDToLeafRow: FlatObject(),
  fieldIDToColumn: FlatObject(),
};

/**
 * Provides mapping between cells, rows and columns to fields and documents
 */
export function useListViewMap(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[],
  fields: FieldWithListViewConfig[],
): ListViewMap {
  const grouped = useMemo((): boolean => {
    return isGroupedListViewDocumentNodes(nodes);
  }, [nodes]);
  const groupRowCache = useMemo((): GroupRowCellCache => {
    if (isGroupedListViewDocumentNodes(nodes)) {
      return getGroupRowToGroupRowCellDataCache(nodes);
    }

    return FlatObject();
  }, [nodes]);
  const leafRows = useMemo(
    (): ListViewLeafRow[] => getListViewLeafRows(nodes, []),
    [nodes],
  );
  const leafRowCache = useMemo((): LeafRowCache => getLeafRowCache(leafRows), [
    leafRows,
  ]);
  const columnToFieldID = useMemo(
    (): ColumnToFieldIDCache => getColumnToFieldIDCache(fields),
    [fields],
  );
  const documentIDToLeafRow = useMemo(
    (): DocumentIDToLeafRowCache => getDocumentIDToLeafRowCache(leafRowCache),
    [leafRowCache],
  );
  const fieldIDToColumn = useMemo(
    (): FieldIDToColumnCache => getFieldIDToColumnCache(columnToFieldID),
    [columnToFieldID],
  );

  return useMemo(
    (): ListViewMap => ({
      grouped,
      leafRows,
      nodes,
      fields,
      groupRowCache,
      leafRowCache,
      columnToFieldID,
      documentIDToLeafRow,
      fieldIDToColumn,
    }),
    [
      grouped,
      leafRows,
      nodes,
      fields,
      groupRowCache,
      leafRowCache,
      columnToFieldID,
      documentIDToLeafRow,
      fieldIDToColumn,
    ],
  );
}

type ColumnToFieldIDCache = FlatObject<number, FieldID>;

function getColumnToFieldIDCache(fields: Field[]): ColumnToFieldIDCache {
  const cache = FlatObject<number, FieldID>();

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    cache.set([i + 1], field.id);
  }

  return cache;
}

interface ListViewLeafRow extends LeafRow {
  documentID: DocumentID;
}

function getListViewLeafRows(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[],
  prevPath: number[],
): ListViewLeafRow[] {
  let rows: ListViewLeafRow[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const group = nodes[i];
    const path = [...prevPath, i];

    if (group.type === 'leaf' || group.type === 'flat') {
      for (let j = 0; j < group.children.length; j++) {
        const document = group.children[j];

        rows = rows.concat({
          path,
          row: j + 1,
          documentID: document.id,
        });
      }
    } else {
      const { children } = group;
      const groupRows = getListViewLeafRows(children, path);

      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

interface LeafRowData {
  documentID: DocumentID;
  prev: LeafRow | null;
  next: LeafRow | null;
}

type LeafRowCache = FlatObject<number, LeafRowData>;

function getLeafRowCache(rows: ListViewLeafRow[]): LeafRowCache {
  const cache = FlatObject<number, LeafRowData>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const prevRow = rows[i - 1];
    const nextRow = rows[i + 1];

    const data: LeafRowData = {
      documentID: row.documentID,
      prev: prevRow || null,
      next: nextRow || null,
    };

    cache.set([...row.path, row.row], data);
  }

  return cache;
}

interface GroupRowCellData {
  field: Field;
  value: FieldValue;
}

type GroupRowCellCache = FlatObject<number, GroupRowCellData>;

interface ListViewGroupRow {
  field: Field;
  value: FieldValue;
  path: number[];
}

function getGroupRowToGroupRowCellDataCache(
  nodes: GroupedListViewDocumentNode[],
): GroupRowCellCache {
  const cache = FlatObject<number, GroupRowCellData>();
  const rows = getGroupRowPaths(nodes, []);

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const data: GroupRowCellData = {
      field: row.field,
      value: row.value,
    };
    cache.set(row.path, data);
  }

  return cache;
}

function getGroupRowPaths(
  nodes: GroupedListViewDocumentNode[],
  prevPath: number[],
): ListViewGroupRow[] {
  let rows: ListViewGroupRow[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const group = nodes[i];
    const path = [...prevPath, i];

    if (group.type === 'leaf') {
      rows = rows.concat({
        path,
        field: group.field,
        value: group.value,
      });
    } else {
      const { children } = group;
      const groupRows = getGroupRowPaths(children, path);

      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

type DocumentIDToLeafRowCache = FlatObject<DocumentID, LeafRow>;

function getDocumentIDToLeafRowCache(
  leafRowCache: LeafRowCache,
): DocumentIDToLeafRowCache {
  const cache = FlatObject<DocumentID, LeafRow>();

  for (const [leafRow, data] of leafRowCache.entries()) {
    const [path, row] = splitLast(leafRow);
    cache.set([data.documentID], { path, row });
  }

  return cache;
}

type FieldIDToColumnCache = FlatObject<FieldID, Column>;

function getFieldIDToColumnCache(
  columnToFieldIDCache: ColumnToFieldIDCache,
): FieldIDToColumnCache {
  const cache = FlatObject<FieldID, Column>();

  for (const [column, fieldID] of columnToFieldIDCache.entries()) {
    cache.set([fieldID], { column: column[0] });
  }

  return cache;
}

export function isGrouped(listViewMap: ListViewMap): boolean {
  return listViewMap.grouped;
}

export function getDocumentID(
  listViewMap: ListViewMap,
  row: LeafRow,
): DocumentID {
  const data = listViewMap.leafRowCache.get([...row.path, row.row]);

  return data.documentID;
}

export function getFieldID(listViewMap: ListViewMap, column: Column): FieldID {
  return listViewMap.columnToFieldID.get([column.column]);
}

export function getLeafRow(
  listViewMap: ListViewMap,
  documentID: DocumentID,
): LeafRow {
  return listViewMap.documentIDToLeafRow.get([documentID]);
}

export function getLeafRows(
  listViewMap: ListViewMap,
  documentIDs: DocumentID[],
): LeafRow[] {
  const rows: LeafRow[] = [];

  for (const row of listViewMap.leafRows) {
    const found = documentIDs.find(
      (documentID) => documentID === row.documentID,
    );

    if (found !== undefined) {
      rows.push(row);
    }

    if (documentIDs.length === rows.length) {
      break;
    }
  }

  return rows;
}

export function getGroupRowCellData(
  listViewMap: ListViewMap,
  groupRowCell: GroupRowCell,
): GroupRowCellData {
  return listViewMap.groupRowCache.get(groupRowCell.path);
}

export function getColumn(listViewMap: ListViewMap, fieldID: FieldID): Column {
  return listViewMap.fieldIDToColumn.get([fieldID]);
}

export function getLeafRowCellTopMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {
  const firstLeafRow = first(listViewMap.leafRows);
  if (!firstLeafRow) {
    throw new Error('Leaf row does not exist');
  }

  return {
    column: cell.column,
    path: firstLeafRow.path,
    row: firstLeafRow.row,
  };
}

export function getLeafRowCellBottomMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {
  const lastLeafRow = last(listViewMap.leafRows);
  if (!lastLeafRow) {
    throw new Error('Leaf row does not exist');
  }

  return { column: cell.column, path: lastLeafRow.path, row: lastLeafRow.row };
}

export function getLeafRowCellLeftMost(
  _listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {
  return { column: 1, path: cell.path, row: cell.row };
}

export function getLeafRowCellRightMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {
  return { column: listViewMap.fields.length, path: cell.path, row: cell.row };
}

export function getLeafRowCellBottom(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell | false {
  const leafRowData = listViewMap.leafRowCache.get([...cell.path, cell.row]);

  if (leafRowData.next) {
    return {
      row: leafRowData.next.row,
      path: leafRowData.next.path,
      column: cell.column,
    };
  }

  return false;
}

export function getLeafRowCellTop(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell | false {
  const leafRowData = listViewMap.leafRowCache.get([...cell.path, cell.row]);

  if (leafRowData.prev) {
    return {
      row: leafRowData.prev.row,
      path: leafRowData.prev.path,
      column: cell.column,
    };
  }

  return false;
}

export function getLeafRowCellRight(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell | false {
  const hasNextColumn = listViewMap.fields[cell.column];
  if (!hasNextColumn) {
    return false;
  }

  return { column: cell.column + 1, path: cell.path, row: cell.row };
}

export function getLeafRowCellLeft(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell | false {
  const hasColumnLeft = listViewMap.fields[cell.column - 2];
  if (!hasColumnLeft) {
    return false;
  }

  return { column: cell.column - 1, path: cell.path, row: cell.row };
}
