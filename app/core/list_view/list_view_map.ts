import { useMemo } from "react";
import { first, last, splitLast } from "../../../lib/array_utils";
import { FlatObject } from "../../../lib/flat_object";
import { isEmpty } from "../../../lib/lang_utils";
import { DocumentID } from "../../../models/documents";
import { Field, FieldID, FieldValue } from "../../../models/fields";
import { FieldWithListViewConfig } from "../../../models/views";
import {
  Column,
  GroupRowCell,
  LeafRow,
  LeafRowCell,
} from "../../components/grid_renderer.common";
import {
  FlatListViewDocumentNode,
  GroupedListViewDocumentNode,
  isGroupedListViewDocumentNodes,
} from "./list_view_nodes";

export interface ListViewMap {
  grouped: boolean;
  leafRows: ListViewLeafRow[];
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[];
  fields: FieldWithListViewConfig[];
  groupRowCellCache: GroupRowCellCache;
  groupRowCache: GroupRowCache;
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
  groupRowCellCache: FlatObject(),
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
  fields: FieldWithListViewConfig[]
): ListViewMap {
  const grouped = useMemo((): boolean => {
    return isGroupedListViewDocumentNodes(nodes);
  }, [nodes]);
  const groupRows = useMemo((): ListViewGroupRow[] => {
    if (isGroupedListViewDocumentNodes(nodes)) {
      return getListViewGroupRows(nodes);
    }
    return [];
  }, [nodes]);
  const groupRowCache = useMemo((): GroupRowCache => {
    return getGroupRowCache(groupRows);
  }, [groupRows]);
  const groupRowCellCache = useMemo((): GroupRowCellCache => {
    return getGroupRowCellCache(groupRows);
  }, [groupRows]);
  const leafRows = useMemo(
    (): ListViewLeafRow[] => getListViewLeafRows(nodes, 0),
    [nodes]
  );
  const leafRowCache = useMemo(
    (): LeafRowCache => getLeafRowCache(leafRows),
    [leafRows]
  );
  const columnToFieldID = useMemo(
    (): ColumnToFieldIDCache => getColumnToFieldIDCache(fields),
    [fields]
  );
  const documentIDToLeafRow = useMemo(
    (): DocumentIDToLeafRowCache => getDocumentIDToLeafRowCache(leafRowCache),
    [leafRowCache]
  );
  const fieldIDToColumn = useMemo(
    (): FieldIDToColumnCache => getFieldIDToColumnCache(columnToFieldID),
    [columnToFieldID]
  );

  return useMemo(
    (): ListViewMap => ({
      grouped,
      leafRows,
      nodes,
      fields,
      groupRowCellCache,
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
      groupRowCellCache,
      groupRowCache,
      leafRowCache,
      columnToFieldID,
      documentIDToLeafRow,
      fieldIDToColumn,
    ]
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
  index: number;
}

export function getListViewLeafRows(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[],
  prevIndex: number
): ListViewLeafRow[] {
  let rows: ListViewLeafRow[] = [];
  let currentIndex = prevIndex;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type !== "flat" && node.collapsed) {
      continue;
    }

    if (node.type === "leaf" || node.type === "flat") {
      for (let j = 0; j < node.children.length; j++) {
        const document = node.children[j];

        rows = rows.concat({
          path: node.path,
          row: j + 1,
          documentID: document.id,
          index: currentIndex,
        });

        currentIndex++;
      }
    } else {
      const { children } = node;
      const groupRows = getListViewLeafRows(children, currentIndex);

      if (last(groupRows)) {
        currentIndex = last(groupRows).index + 1;
      }

      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

interface LeafRowData {
  documentID: DocumentID;
  /** Helps with finding next/prev index of visible leaf row */
  index: number;
}

type LeafRowCache = FlatObject<number, LeafRowData>;

function getLeafRowCache(rows: ListViewLeafRow[]): LeafRowCache {
  const cache = FlatObject<number, LeafRowData>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const data: LeafRowData = {
      documentID: row.documentID,
      index: row.index,
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

export function getGroupRowCellCache(
  rows: ListViewGroupRow[]
): GroupRowCellCache {
  const cache = FlatObject<number, GroupRowCellData>();

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

interface GroupRowData {
  path: number[];
  collapsed: boolean;
}

type GroupRowCache = FlatObject<number, GroupRowData>;

function getGroupRowCache(rows: ListViewGroupRow[]): GroupRowCache {
  const cache = FlatObject<number, GroupRowData>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const data: GroupRowData = {
      path: row.path,
      collapsed: row.collapsed,
    };
    cache.set(row.path, data);
  }

  return cache;
}

interface ListViewGroupRow {
  field: Field;
  value: FieldValue;
  path: number[];
  collapsed: boolean;
}

/**
 * Gets grouped document tree node and transforms into grid rows data
 *
 * REVIEW: is this function necessary? Might as well use nodes
 */
export function getListViewGroupRows(
  nodes: GroupedListViewDocumentNode[]
): ListViewGroupRow[] {
  let rows: ListViewGroupRow[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "leaf") {
      rows = rows.concat({
        path: node.path,
        field: node.field,
        value: node.value,
        collapsed: node.collapsed,
      });
    } else {
      const { children } = node;
      const groupRows = getListViewGroupRows(children);

      rows = rows.concat({
        path: node.path,
        field: node.field,
        value: node.value,
        collapsed: node.collapsed,
      });
      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

type DocumentIDToLeafRowCache = FlatObject<DocumentID, LeafRow>;

function getDocumentIDToLeafRowCache(
  leafRowCache: LeafRowCache
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
  columnToFieldIDCache: ColumnToFieldIDCache
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
  row: LeafRow
): DocumentID {
  const data = listViewMap.leafRowCache.get([...row.path, row.row]);

  return data.documentID;
}

export function getFieldID(listViewMap: ListViewMap, column: Column): FieldID {
  return listViewMap.columnToFieldID.get([column.column]);
}

export function getLeafRow(
  listViewMap: ListViewMap,
  documentID: DocumentID
): LeafRow {
  return listViewMap.documentIDToLeafRow.get([documentID]);
}

export function getLeafRows(
  listViewMap: ListViewMap,
  documentIDs: DocumentID[]
): LeafRow[] {
  const rows: LeafRow[] = [];

  for (const row of listViewMap.leafRows) {
    const found = documentIDs.find(
      (documentID) => documentID === row.documentID
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
  groupRowCell: GroupRowCell
): GroupRowCellData {
  return listViewMap.groupRowCellCache.get(groupRowCell.path);
}

export function getColumn(listViewMap: ListViewMap, fieldID: FieldID): Column {
  return listViewMap.fieldIDToColumn.get([fieldID]);
}

export function getLeafRowCellTopMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell {
  const firstLeafRow = first(listViewMap.leafRows);
  if (!firstLeafRow) {
    throw new Error("Leaf row does not exist");
  }

  return {
    column: cell.column,
    path: firstLeafRow.path,
    row: firstLeafRow.row,
  };
}

export function getLeafRowCellBottomMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell {
  const lastLeafRow = last(listViewMap.leafRows);
  if (!lastLeafRow) {
    throw new Error("Leaf row does not exist");
  }

  return { column: cell.column, path: lastLeafRow.path, row: lastLeafRow.row };
}

export function getLeafRowCellLeftMost(
  _listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell {
  return { column: 1, path: cell.path, row: cell.row };
}

export function getLeafRowCellRightMost(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell {
  return { column: listViewMap.fields.length, path: cell.path, row: cell.row };
}

export function getLeafRowCellBottom(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell | false {
  const leafRowData = listViewMap.leafRowCache.get([...cell.path, cell.row]);

  const nextIndex = leafRowData.index + 1;
  const nextRow = listViewMap.leafRows[nextIndex];

  if (!nextRow) {
    return false;
  }

  return {
    row: nextRow.row,
    path: nextRow.path,
    column: cell.column,
  };
}

export function getLeafRowCellTop(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell | false {
  const leafRowData = listViewMap.leafRowCache.get([...cell.path, cell.row]);

  const prevIndex = leafRowData.index - 1;
  const prevRow = listViewMap.leafRows[prevIndex];

  if (!prevRow) {
    return false;
  }

  return {
    row: prevRow.row,
    path: prevRow.path,
    column: cell.column,
  };
}

export function getLeafRowCellRight(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell | false {
  const hasNextColumn = listViewMap.fields[cell.column];
  if (!hasNextColumn) {
    return false;
  }

  return { column: cell.column + 1, path: cell.path, row: cell.row };
}

export function getLeafRowCellLeft(
  listViewMap: ListViewMap,
  cell: LeafRowCell
): LeafRowCell | false {
  const hasColumnLeft = listViewMap.fields[cell.column - 2];
  if (!hasColumnLeft) {
    return false;
  }

  return { column: cell.column - 1, path: cell.path, row: cell.row };
}
