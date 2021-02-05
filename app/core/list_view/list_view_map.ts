import { useMemo } from 'react';
import { splitLast } from '../../../lib/array_utils';
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
  groupRowToGroupRowCellData: GroupRowToGroupRowCellDataCache;
  leafRowToDocumentID: LeafRowToDocumentIDCache;
  columnToFieldID: ColumnToFieldIDCache;
  documentIDToLeafRow: DocumentIDToLeafRowCache;
  fieldIDToColumn: FieldIDToColumnCache;
}

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
  const groupRowToGroupRowCellData = useMemo((): GroupRowToGroupRowCellDataCache => {
    if (isGroupedListViewDocumentNodes(nodes)) {
      return getGroupRowToGroupRowCellDataCache(nodes);
    }

    return FlatObject();
  }, [nodes]);
  const leafRows = useMemo(
    (): ListViewLeafRow[] => getListViewLeafRows(nodes, []),
    [nodes],
  );
  const leafRowToDocumentID = useMemo(
    (): LeafRowToDocumentIDCache => getLeafRowToDocumentIDCache(leafRows),
    [leafRows],
  );
  const columnToFieldID = useMemo(
    (): ColumnToFieldIDCache => getColumnToFieldIDCache(fields),
    [fields],
  );
  const documentIDToLeafRow = useMemo(
    (): DocumentIDToLeafRowCache =>
      getDocumentIDToLeafRowCache(leafRowToDocumentID),
    [leafRowToDocumentID],
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
      groupRowToGroupRowCellData,
      leafRowToDocumentID,
      columnToFieldID,
      documentIDToLeafRow,
      fieldIDToColumn,
    }),
    [
      grouped,
      leafRows,
      nodes,
      fields,
      groupRowToGroupRowCellData,
      leafRowToDocumentID,
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

type LeafRowToDocumentIDCache = FlatObject<number, DocumentID>;

function getLeafRowToDocumentIDCache(
  rows: ListViewLeafRow[],
): LeafRowToDocumentIDCache {
  const cache = FlatObject<number, DocumentID>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    cache.set([...row.path, row.row], row.documentID);
  }

  return cache;
}

interface GroupRowCellData {
  field: Field;
  value: FieldValue;
}

type GroupRowToGroupRowCellDataCache = FlatObject<number, GroupRowCellData>;

interface ListViewGroupRow {
  field: Field;
  value: FieldValue;
  path: number[];
}

function getGroupRowToGroupRowCellDataCache(
  nodes: GroupedListViewDocumentNode[],
): GroupRowToGroupRowCellDataCache {
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
  leafRowToDocumentIDCache: LeafRowToDocumentIDCache,
): DocumentIDToLeafRowCache {
  const cache = FlatObject<DocumentID, LeafRow>();

  for (const [leafRow, documentID] of leafRowToDocumentIDCache.entries()) {
    const [path, row] = splitLast(leafRow);
    cache.set([documentID], { path, row });
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
  return listViewMap.leafRowToDocumentID.get([...row.path, row.row]);
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
  return listViewMap.groupRowToGroupRowCellData.get(groupRowCell.path);
}

export function getColumn(listViewMap: ListViewMap, fieldID: FieldID): Column {
  return listViewMap.fieldIDToColumn.get([fieldID]);
}

export function getLeafRowCellTopMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellBottomMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellLeftMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellRightMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellBelow(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellAbove(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellRight(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
): LeafRowCell {}

export function getLeafRowCellLeft(
  listViewMap: ListViewMap,
  cell: LeafRowCell,
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

export function getFirstColumn(listViewMap: ListViewMap): Column {
  if (isEmpty(listViewMap.fields)) {
    throw new Error('Fields cannot be empty');
  }

  return { column: 1 };
}
export function getLastColumn(listViewMap: ListViewMap): Column {
  return { column: listViewMap.fields.length };
}
