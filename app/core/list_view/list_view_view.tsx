import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useGetSortedFieldsWithListViewConfig,
  useGetViewFilters,
  useGetViewSorts,
  useGetViewGroups,
  useGetViewRecords,
  useGetSortGetters,
} from '../../data/store';
import { Field, FieldID, FieldValue } from '../../data/fields';
import { AutoSizer } from '../../lib/autosizer';
import { ListView, ViewID } from '../../data/views';
import {
  GridRenderer,
  GridRendererRef,
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
  RenderLeafRowProps,
  RenderGroupRowProps,
  RenderHeaderProps,
  RenderFooterProps,
} from '../../components/grid_renderer';
import { Record, RecordID } from '../../data/records';
import { atom, useRecoilState } from 'recoil';

import {
  GridGroup,
  SelectedRow,
  StatefulLeafRowCell,
} from '../../components/grid_renderer.common';
import { usePrevious } from '../../hooks/use_previous';
import { isEmpty } from '../../../lib/lang_utils';
import { last } from '../../../lib/array_utils';
import { Group } from '../../data/groups';
import { makeRecordNodes, RecordNode, SortGetters } from '../../data/sorts';
import { LeafRowCell, LEAF_ROW_HEIGHT } from './leaf_row_cell';
import { Header, HeaderCell } from './header';
import { Footer } from './footer';
import { GroupRow } from './group_row';
import { FlatObject } from '../../../lib/flat_object';
import { LeafRow } from './leaf_row';
import { StyleSheet, View } from 'react-native';

export type ViewMode = 'edit' | 'select';

interface ListViewViewProps {
  view: ListView;
  onOpenRecord: (recordID: RecordID) => void;
  mode: ViewMode;
  selectedRecords: RecordID[];
  onSelectRecord: (recordID: RecordID, selected: boolean) => void;
}

const FIELD_ROW_HEIGHT = 40;

export const activeCellState = atom<StatefulLeafRowCell | null>({
  key: 'ListViewView_ActiveCell',
  default: null,
});

// TODO:
// - Make it obvious when changing state from editing -> focus (e.g. after pressing ESC)
// - Display more information when focusing/editing cell
export function ListViewView(props: ListViewViewProps): JSX.Element {
  const { view, onOpenRecord, mode, selectedRecords, onSelectRecord } = props;
  const [activeCell, setActiveCell] = useRecoilState(activeCellState);
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);
  const groups = useGetViewGroups(view.id);
  const sortGetters = useGetSortGetters();
  const [nodes, setNodes] = useState(
    getRecordNodes(records, groups, sortGetters),
  );
  const gridRef = useRef<GridRendererRef>(null);
  const rowPaths = useMemo(() => getRowPaths(nodes, []), [nodes]);
  const [columnToFieldIDCache, setColumnToFieldIDCache] = useState(
    getColumnToFieldIDCache(fields),
  );
  const [rowToRecordIDCache, setRowToRecordIDCache] = useState(
    getRowToRecordIDCache(rowPaths),
  );
  const prevActiveCell = usePrevious(activeCell);
  const fixedFieldCount = view.fixedFieldCount;
  const lastColumn = fields.length;
  const lastRow = useMemo((): RowPath | undefined => last(rowPaths), [
    rowPaths,
  ]);
  const recordsOrderChanged = useRecordsOrderChanged(view.id, records);
  const fieldsOrderChanged = useFieldsOrderChanged(view.id, fields);

  useEffect(() => {
    if (recordsOrderChanged === true) {
      setNodes(getRecordNodes(records, groups, sortGetters));
      setRowToRecordIDCache(getRowToRecordIDCache(rowPaths));
    }
  }, [rowPaths, recordsOrderChanged, records, groups, sortGetters]);

  useEffect(() => {
    if (fieldsOrderChanged === true) {
      setColumnToFieldIDCache(getColumnToFieldIDCache(fields));
    }
  }, [fields, fieldsOrderChanged]);

  useEffect(() => {
    if (mode === 'select' && activeCell !== null) {
      setActiveCell(null);
    }
  }, [mode, activeCell, setActiveCell]);

  const context = useMemo((): ListViewViewContext => {
    return {
      rowToRecordIDCache,
      columnToFieldIDCache,
      lastColumn,
      lastRow,
      mode,
      onOpenRecord,
      onSelectRecord,
    };
  }, [
    rowToRecordIDCache,
    columnToFieldIDCache,
    lastColumn,
    lastRow,
    mode,
    onOpenRecord,
    onSelectRecord,
  ]);

  const renderLeafRowCell = useCallback(
    (c: RenderLeafRowCellProps) => {
      const fieldID = columnToFieldIDCache[c.column];
      const recordID = rowToRecordIDCache.get([...c.path, c.row]);
      const primary = c.column === 1;

      if (recordID === undefined) {
        throw new Error('No corresponding recordID found for row path.');
      }

      return (
        <LeafRowCell
          cell={c}
          recordID={recordID}
          viewID={view.id}
          fieldID={fieldID}
          primary={primary}
        />
      );
    },
    [columnToFieldIDCache, rowToRecordIDCache, view.id],
  );

  const renderHeaderCell = useCallback(
    ({ column }: RenderHeaderCellProps) => {
      const field = fields[column - 1];
      const primary = column === 1;

      return <HeaderCell field={field} primary={primary} />;
    },
    [fields],
  );

  const renderLeafRow = useCallback(
    ({ children, state, path, row }: RenderLeafRowProps) => {
      const recordID = rowToRecordIDCache.get([...path, row]);

      if (recordID === undefined) {
        throw new Error('No corresponding recordID found for row path.');
      }

      return (
        <LeafRow recordID={recordID} state={state}>
          {children}
        </LeafRow>
      );
    },
    [rowToRecordIDCache],
  );

  const renderGroupRow = useCallback(
    ({ children, state }: RenderGroupRowProps) => {
      return <GroupRow state={state}>{children}</GroupRow>;
    },
    [],
  );

  const renderHeader = useCallback(({ children }: RenderHeaderProps) => {
    return <Header>{children}</Header>;
  }, []);

  const renderFooter = useCallback(({ children }: RenderFooterProps) => {
    return <Footer>{children}</Footer>;
  }, []);

  const columns = useMemo(
    (): number[] => fields.map((field) => field.config.width),
    [fields],
  );
  const gridGroups = useMemo((): GridGroup[] => toGridGroups(nodes), [nodes]);

  const selectedRows = useMemo(
    (): SelectedRow[] => getSelectedRows(selectedRecords, rowPaths),
    [selectedRecords, rowPaths],
  );

  if (
    gridRef.current !== null &&
    activeCell !== null &&
    activeCell !== prevActiveCell
  ) {
    gridRef.current.scrollToCell(activeCell);
  }

  return (
    <ListViewViewContext.Provider value={context}>
      <View style={styles.root}>
        <AutoSizer>
          {({ height, width }) => (
            <GridRenderer
              ref={gridRef}
              width={width}
              height={height}
              selectedRows={selectedRows}
              groups={gridGroups}
              renderLeafRow={renderLeafRow}
              renderGroupRow={renderGroupRow}
              renderLeafRowCell={renderLeafRowCell}
              renderHeaderCell={renderHeaderCell}
              renderHeader={renderHeader}
              renderFooter={renderFooter}
              leafRowHeight={LEAF_ROW_HEIGHT}
              headerHeight={FIELD_ROW_HEIGHT}
              columns={columns}
              fixedColumnCount={fixedFieldCount}
              activeCell={activeCell}
            />
          )}
        </AutoSizer>
      </View>
    </ListViewViewContext.Provider>
  );
}

interface FlatRecordNode {
  type: 'leaf';
  grouped: false;
  children: Record[];
}

function getRecordNodes(
  records: Record[],
  groups: Group[],
  sortGetters: SortGetters,
): FlatRecordNode[] | GroupedRecordNode[] {
  if (isEmpty(groups)) {
    return [{ type: 'leaf', children: records, grouped: false }];
  }

  const nodes = makeRecordNodes(groups, records, sortGetters);

  return toGroupedRecordNode(nodes);
}

function toGroupedRecordNode(nodes: RecordNode[]): GroupedRecordNode[] {
  let groups: GroupedRecordNode[] = [];

  for (const node of nodes) {
    if (node.type === 'leaf') {
      groups = groups.concat({
        type: 'leaf',
        grouped: true,
        collapsed: false,
        field: node.field,
        value: node.value,
        children: node.children,
      });
    } else {
      groups = groups.concat({
        type: 'ancestor',
        collapsed: false,
        field: node.field,
        value: node.value,
        children: toGroupedRecordNode(node.children),
      });
    }
  }

  return groups;
}

interface LeafGroupedRecordNode {
  type: 'leaf';
  grouped: true;
  collapsed: boolean;
  field: Field;
  value: FieldValue;
  children: Record[];
}

interface AncestorGroupedRecordNode {
  type: 'ancestor';
  collapsed: boolean;
  field: Field;
  value: FieldValue;
  children: GroupedRecordNode[];
}

type GroupedRecordNode = LeafGroupedRecordNode | AncestorGroupedRecordNode;

function getSelectedRows(
  selectedRecords: RecordID[],
  rowPaths: RowPath[],
): SelectedRow[] {
  const selectedRows: SelectedRow[] = [];

  for (const row of rowPaths) {
    const found = selectedRecords.find((recordID) => recordID === row.recordID);

    if (found !== undefined) {
      selectedRows.push(row);
    }

    if (selectedRecords.length === selectedRows.length) {
      break;
    }
  }

  return selectedRows;
}

function getRowPaths(
  nodes: GroupedRecordNode[] | FlatRecordNode[],
  prevPath: number[],
): RowPath[] {
  let rows: RowPath[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const group = nodes[i];
    const path = [...prevPath, i];

    if (group.type === 'leaf') {
      for (let j = 0; j < group.children.length; j++) {
        const record = group.children[j];

        rows = rows.concat({ path, row: j + 1, recordID: record.id });
      }
    } else {
      const { children } = group;
      const groupRows = getRowPaths(children, path);

      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

function toGridGroups(
  nodes: GroupedRecordNode[] | FlatRecordNode[],
): GridGroup[] {
  let groups: GridGroup[] = [];

  for (const node of nodes) {
    if (node.type === 'leaf') {
      groups = groups.concat({
        type: 'leaf',
        collapsed: node.grouped === true && node.collapsed === true,
        rowCount: node.children.length,
      });
    } else {
      groups = groups.concat({
        type: 'ancestor',
        collapsed: node.collapsed,
        children: toGridGroups(node.children),
      });
    }
  }

  return groups;
}

function useRecordsOrderChanged(viewID: ViewID, records: Record[]): boolean {
  const filters = useGetViewFilters(viewID);
  const sorts = useGetViewSorts(viewID);
  const groups = useGetViewGroups(viewID);

  const prevRecords = usePrevious(records);
  const prevFilters = usePrevious(filters);
  const prevSorts = usePrevious(sorts);
  const prevGroups = usePrevious(groups);

  return useMemo(() => {
    return (
      records.length !== prevRecords.length ||
      filters !== prevFilters ||
      sorts !== prevSorts ||
      groups !== prevGroups
    );
  }, [
    records,
    prevRecords,
    filters,
    prevFilters,
    sorts,
    prevSorts,
    groups,
    prevGroups,
  ]);
}

function useFieldsOrderChanged(viewID: ViewID, fields: Field[]): boolean {
  const prevFields = usePrevious(fields);

  return useMemo(() => {
    return fields.length !== prevFields.length;
  }, [fields, prevFields]);
}

interface ListViewViewContext {
  rowToRecordIDCache: RowToRecordIDCache;
  columnToFieldIDCache: ColumnToFieldIDCache;
  lastColumn: number;
  lastRow: RowPath | undefined;
  mode: ViewMode;
  onOpenRecord: (recordID: RecordID) => void;
  onSelectRecord: (recordID: RecordID, selected: boolean) => void;
}

export const ListViewViewContext = createContext<ListViewViewContext>({
  rowToRecordIDCache: FlatObject(),
  columnToFieldIDCache: {},
  lastColumn: 0,
  lastRow: {
    recordID: 'rec',
    row: 1,
    path: [],
  },
  mode: 'edit',
  onOpenRecord: () => {
    return;
  },
  onSelectRecord: () => {
    return;
  },
});

export function useListViewViewContext(): ListViewViewContext {
  return useContext(ListViewViewContext);
}

type ColumnToFieldIDCache = {
  [column: number]: FieldID;
};

type RowToRecordIDCache = FlatObject<RecordID, number>;

function getColumnToFieldIDCache(fields: Field[]): ColumnToFieldIDCache {
  const cache: ColumnToFieldIDCache = {};

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    cache[i + 1] = field.id;
  }

  return cache;
}

interface RowPath {
  recordID: RecordID;
  path: number[];
  row: number;
}

function getRowToRecordIDCache(rows: RowPath[]): RowToRecordIDCache {
  const cache = FlatObject<RecordID, number>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    cache.set([...row.path, row.row], row.recordID);
  }

  return cache;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
