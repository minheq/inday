import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import {
  useGetSortedFieldsWithListViewConfig,
  useGetViewFilters,
  useGetViewSorts,
  useGetViewGroups,
  useGetViewDocuments,
  useGetSortGetters,
} from '../../data/store';
import {
  areFieldValuesEqual,
  Field,
  FieldID,
  FieldValue,
} from '../../data/fields';
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
  RenderGroupRowCellProps,
} from '../../components/grid_renderer';
import { Document, DocumentID } from '../../data/documents';
import {
  GridGroup,
  SelectedRow,
  StatefulLeafRowCell,
} from '../../components/grid_renderer.common';
import { usePrevious } from '../../hooks/use_previous';
import { isEmpty } from '../../../lib/lang_utils';
import { filterBy, isNotEmpty, last, removeBy } from '../../../lib/array_utils';
import { Group } from '../../data/groups';
import { makeDocumentNodes, DocumentNode, SortGetters } from '../../data/sorts';
import { LastLeafRowCell, LeafRowCell } from './leaf_row_cell';
import { Header, HeaderCell, LastHeaderCell } from './header';
import { Footer } from './footer';
import { GroupRow } from './group_row';
import { FlatObject } from '../../../lib/flat_object';
import { LastLeafRow, LeafRow } from './leaf_row';
import { GroupRowCell } from './group_row_cell';
import {
  ADD_FIELD_COLUMN_WIDTH,
  GROUP_ROW_HEIGHT,
  HEADER_HEIGHT,
  LEAF_ROW_HEIGHT,
  SPACER_ROW_HEIGHT,
} from './layout_constants';

export type ViewMode = 'edit' | 'select';

interface ListViewViewProps {
  view: ListView;
  onOpenDocument: (documentID: DocumentID) => void;
  mode: ViewMode;
  selectedDocuments: DocumentID[];
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => Document;
}

export const activeCellState = atom<StatefulLeafRowCell | null>({
  key: 'ListViewView_ActiveCell',
  default: null,
});

type CollapsedGroupsByFieldID = {
  [fieldID: string]: FieldValue[] | undefined;
};

type CollapsedGroupsByViewID = {
  [viewID: string]: CollapsedGroupsByFieldID | undefined;
};

export const collapsedGroupsState = atom<CollapsedGroupsByViewID>({
  key: 'ListViewView_CollapsedGroups',
  default: {},
});

// TODO:
// - Display more information when focusing/editing cell
export function ListViewView(props: ListViewViewProps): JSX.Element {
  const {
    view,
    onOpenDocument,
    onAddDocument,
    mode,
    selectedDocuments,
    onSelectDocument,
  } = props;
  const viewID = view.id;
  const [collapsedGroupsByViewID, setCollapsedGroupsByViewID] = useRecoilState(
    collapsedGroupsState,
  );
  const [activeCell, setActiveCell] = useRecoilState(activeCellState);
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const documents = useGetViewDocuments(view.id);
  const groups = useGetViewGroups(view.id);
  const sortGetters = useGetSortGetters();
  const collapsedGroupsByFieldID = useMemo(
    () => collapsedGroupsByViewID[viewID],
    [collapsedGroupsByViewID, viewID],
  );
  const [nodes, setNodes] = useState(
    getDocumentNodes(documents, groups, sortGetters, collapsedGroupsByFieldID),
  );
  const gridRef = useRef<GridRendererRef>(null);
  const leafRowPaths = useMemo(() => getLeafRowPaths(nodes, []), [nodes]);
  const groupRowPaths = useMemo(() => getGroupRowPaths(nodes, []), [nodes]);
  const [columnToFieldIDCache, setColumnToFieldIDCache] = useState(
    getColumnToFieldIDCache(fields),
  );
  const rowToDocumentIDCache = useMemo(
    (): RowToDocumentIDCache => getRowToDocumentIDCache(leafRowPaths),
    [leafRowPaths],
  );
  const pathToGroupCache = useMemo(
    (): PathToGroupCache => getPathToGroupCache(groupRowPaths),
    [groupRowPaths],
  );
  const grouped = isNotEmpty(groups);
  const prevActiveCell = usePrevious(activeCell);
  const fixedFieldCount = view.fixedFieldCount;
  const documentsOrderChanged = useDocumentsOrderChanged(view.id, documents);
  const fieldsOrderChanged = useFieldsOrderChanged(view.id, fields);
  const newDocumentAdded = useNewDocumentAdded(documents);
  const columns = useMemo(
    (): number[] =>
      fields.map((field) => field.config.width).concat(ADD_FIELD_COLUMN_WIDTH),
    [fields],
  );
  const gridGroups = useMemo((): GridGroup[] => toGridGroups(nodes), [nodes]);
  const selectedRows = useMemo(
    (): SelectedRow[] => getSelectedRows(selectedDocuments, leafRowPaths),
    [selectedDocuments, leafRowPaths],
  );
  const lastFocusableColumn = useMemo(() => fields.length, [fields]);
  const lastFocusableRow = useMemo(
    (): LeafRowPath | undefined => last(leafRowPaths),
    [leafRowPaths],
  );

  useEffect(() => {
    if (documentsOrderChanged) {
      setNodes(
        getDocumentNodes(
          documents,
          groups,
          sortGetters,
          collapsedGroupsByFieldID,
        ),
      );
    }
  }, [
    leafRowPaths,
    groupRowPaths,
    documentsOrderChanged,
    documents,
    groups,
    sortGetters,
    collapsedGroupsByFieldID,
  ]);

  useEffect(() => {
    if (fieldsOrderChanged) {
      setColumnToFieldIDCache(getColumnToFieldIDCache(fields));
    }
  }, [fields, fieldsOrderChanged]);

  useEffect(() => {
    if (mode === 'select' && activeCell !== null) {
      setActiveCell(null);
    }
  }, [mode, activeCell, setActiveCell]);

  useEffect(() => {
    if (newDocumentAdded && lastFocusableRow) {
      setActiveCell({
        type: 'leaf',
        row: lastFocusableRow.row,
        column: 1,
        path: lastFocusableRow.path,
        state: 'focused',
        last: true,
      });
    }
  }, [setActiveCell, newDocumentAdded, lastFocusableRow]);

  const context = useMemo((): ListViewViewContext => {
    return {
      viewID,
      rowToDocumentIDCache,
      columnToFieldIDCache,
      lastFocusableColumn,
      lastFocusableRow,
      mode,
      onOpenDocument,
      onSelectDocument,
      onAddDocument,
    };
  }, [
    viewID,
    rowToDocumentIDCache,
    columnToFieldIDCache,
    lastFocusableColumn,
    lastFocusableRow,
    mode,
    onOpenDocument,
    onSelectDocument,
    onAddDocument,
  ]);

  const handleToggleCollapseGroup = useCallback(
    (field: Field, value: FieldValue, collapsed: boolean) => {
      setCollapsedGroupsByViewID((prevCollapsedGroupsByViewID) => {
        const nextCollapsedGroupsByViewID: CollapsedGroupsByViewID = {
          ...prevCollapsedGroupsByViewID,
        };
        const collapsedGroups = {
          ...nextCollapsedGroupsByViewID[viewID],
        };
        let collapsedValues = collapsedGroups[field.id];

        if (collapsed) {
          if (collapsedValues) {
            collapsedValues = collapsedValues.concat(value);
          } else {
            collapsedValues = [value];
          }
        } else {
          if (collapsedValues) {
            collapsedValues = removeBy(collapsedValues, (v) =>
              areFieldValuesEqual(field, v, value),
            );
          }
        }

        collapsedGroups[field.id] = collapsedValues;
        nextCollapsedGroupsByViewID[viewID] = collapsedGroups;

        return nextCollapsedGroupsByViewID;
      });
    },
    [setCollapsedGroupsByViewID, viewID],
  );

  const renderLeafRowCell = useCallback(
    (_props: RenderLeafRowCellProps) => {
      if (_props.last) {
        return <LastLeafRowCell />;
      }

      const fieldID = columnToFieldIDCache[_props.column];
      const documentID = rowToDocumentIDCache.get([..._props.path, _props.row]);
      const primary = _props.column === 1;
      const level = isEmpty(groups) ? 0 : _props.level;

      if (documentID === undefined) {
        throw new Error('No corresponding documentID found for row path.');
      }

      return (
        <LeafRowCell
          primary={primary}
          path={_props.path}
          row={_props.row}
          column={_props.column}
          last={_props.last}
          state={_props.state}
          level={level}
          documentID={documentID}
          fieldID={fieldID}
        />
      );
    },
    [columnToFieldIDCache, rowToDocumentIDCache, groups],
  );

  const renderGroupRowCell = useCallback(
    (_props: RenderGroupRowCellProps) => {
      if (_props.last) {
        return <LastLeafRowCell />;
      }

      const fieldID = columnToFieldIDCache[_props.column];
      const group = pathToGroupCache.get(_props.path);
      const primary = _props.column === 1;

      if (group === undefined) {
        throw new Error('No corresponding value found for path.');
      }

      return (
        <GroupRowCell
          primary={primary}
          path={_props.path}
          column={_props.column}
          last={_props.last}
          state={_props.state}
          collapsed={_props.collapsed}
          columnFieldID={fieldID}
          field={group.field}
          value={group.value}
          onToggleCollapseGroup={handleToggleCollapseGroup}
        />
      );
    },
    [columnToFieldIDCache, pathToGroupCache, handleToggleCollapseGroup],
  );

  const renderHeaderCell = useCallback(
    (_props: RenderHeaderCellProps) => {
      if (_props.last) {
        return <LastHeaderCell />;
      }

      const fieldID = columnToFieldIDCache[_props.column];
      const primary = _props.column === 1;

      return (
        <HeaderCell fieldID={fieldID} primary={primary} width={_props.width} />
      );
    },
    [columnToFieldIDCache],
  );

  const renderLeafRow = useCallback(
    (row: RenderLeafRowProps) => {
      if (row.last) {
        if (row.pane === 'left') {
          return <LastLeafRow />;
        } else {
          return null;
        }
      }

      const documentID = rowToDocumentIDCache.get([...row.path, row.row]);

      if (documentID === undefined) {
        throw new Error('No corresponding documentID found for row path.');
      }

      return (
        <LeafRow documentID={documentID} state={row.state}>
          {row.children}
        </LeafRow>
      );
    },
    [rowToDocumentIDCache],
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
        <AutoSizer resizeGreaterWidthOnly>
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
              renderGroupRowCell={renderGroupRowCell}
              renderFooter={renderFooter}
              leafRowHeight={LEAF_ROW_HEIGHT}
              groupRowHeight={GROUP_ROW_HEIGHT}
              spacerHeight={SPACER_ROW_HEIGHT}
              headerHeight={HEADER_HEIGHT}
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

interface FlatDocumentNode {
  type: 'leaf';
  grouped: false;
  children: Document[];
}

function getDocumentNodes(
  documents: Document[],
  groups: Group[],
  sortGetters: SortGetters,
  collapsedGroups?: CollapsedGroupsByFieldID,
): FlatDocumentNode[] | GroupedDocumentNode[] {
  if (isEmpty(groups)) {
    return [{ type: 'leaf', children: documents, grouped: false }];
  }

  const nodes = makeDocumentNodes(groups, documents, sortGetters);

  return toGroupedDocumentNode(nodes, collapsedGroups);
}

function toGroupedDocumentNode(
  nodes: DocumentNode[],
  collapsedGroups?: CollapsedGroupsByFieldID,
): GroupedDocumentNode[] {
  let groups: GroupedDocumentNode[] = [];

  for (const node of nodes) {
    const collapsedValues = collapsedGroups && collapsedGroups[node.field.id];
    const collapsed = !!(
      collapsedValues &&
      collapsedValues.some((v) =>
        areFieldValuesEqual(node.field, v, node.value),
      )
    );

    if (node.type === 'leaf') {
      groups = groups.concat({
        type: 'leaf',
        grouped: true,
        collapsed,
        field: node.field,
        value: node.value,
        children: node.children,
      });
    } else {
      groups = groups.concat({
        type: 'ancestor',
        collapsed,
        field: node.field,
        value: node.value,
        children: toGroupedDocumentNode(node.children, collapsedGroups),
      });
    }
  }

  return groups;
}

interface LeafGroupedDocumentNode {
  type: 'leaf';
  grouped: true;
  collapsed: boolean;
  field: Field;
  value: FieldValue;
  children: Document[];
}

interface AncestorGroupedDocumentNode {
  type: 'ancestor';
  collapsed: boolean;
  field: Field;
  value: FieldValue;
  children: GroupedDocumentNode[];
}

type GroupedDocumentNode =
  | LeafGroupedDocumentNode
  | AncestorGroupedDocumentNode;

function getSelectedRows(
  selectedDocuments: DocumentID[],
  leafRowPaths: LeafRowPath[],
): SelectedRow[] {
  const selectedRows: SelectedRow[] = [];

  for (const row of leafRowPaths) {
    const found = selectedDocuments.find(
      (documentID) => documentID === row.documentID,
    );

    if (found !== undefined) {
      selectedRows.push(row);
    }

    if (selectedDocuments.length === selectedRows.length) {
      break;
    }
  }

  return selectedRows;
}

interface GroupRowPath {
  field: Field;
  value: FieldValue;
  path: number[];
}

function getGroupRowPaths(
  nodes: GroupedDocumentNode[] | FlatDocumentNode[],
  prevPath: number[],
): GroupRowPath[] {
  let rows: GroupRowPath[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const group = nodes[i];
    const path = [...prevPath, i];

    if (group.type === 'leaf') {
      if (group.grouped) {
        rows = rows.concat({
          path,
          field: group.field,
          value: group.value,
        });
      }
    } else {
      const { children } = group;
      const groupRows = getGroupRowPaths(children, path);

      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

interface LeafRowPath {
  documentID: DocumentID;
  path: number[];
  row: number;
}

function getLeafRowPaths(
  nodes: GroupedDocumentNode[] | FlatDocumentNode[],
  prevPath: number[],
): LeafRowPath[] {
  let rows: LeafRowPath[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const group = nodes[i];
    const path = [...prevPath, i];

    if (group.type === 'leaf') {
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
      const groupRows = getLeafRowPaths(children, path);

      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

function toGridGroups(
  nodes: GroupedDocumentNode[] | FlatDocumentNode[],
): GridGroup[] {
  let groups: GridGroup[] = [];

  for (const node of nodes) {
    if (node.type === 'leaf') {
      groups = groups.concat({
        type: 'leaf',
        collapsed: node.grouped && node.collapsed,
        rowCount: node.children.length + 1, // + 1 adds a row for `Add document`
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

function useNewDocumentAdded(documents: Document[]): boolean {
  const documentsLength = documents.length;
  const prevDocumentsLength = usePrevious(documents.length);

  return documentsLength - prevDocumentsLength === 1;
}

function useDocumentsOrderChanged(
  viewID: ViewID,
  documents: Document[],
): boolean {
  const collapsedGroupsByViewID = useRecoilValue(collapsedGroupsState);
  const collapsedGroups = useMemo(() => collapsedGroupsByViewID[viewID], [
    collapsedGroupsByViewID,
    viewID,
  ]);
  const documentsLength = documents.length;
  const filters = useGetViewFilters(viewID);
  const sorts = useGetViewSorts(viewID);
  const groups = useGetViewGroups(viewID);

  const prevCollapsedGroups = usePrevious(collapsedGroups);
  const prevDocumentsLength = usePrevious(documents.length);
  const prevFilters = usePrevious(filters);
  const prevSorts = usePrevious(sorts);
  const prevGroups = usePrevious(groups);

  return useMemo(() => {
    return (
      documentsLength !== prevDocumentsLength ||
      filters !== prevFilters ||
      sorts !== prevSorts ||
      groups !== prevGroups ||
      collapsedGroups !== prevCollapsedGroups
    );
  }, [
    documentsLength,
    prevDocumentsLength,
    filters,
    prevFilters,
    sorts,
    prevSorts,
    groups,
    prevGroups,
    collapsedGroups,
    prevCollapsedGroups,
  ]);
}

function useFieldsOrderChanged(viewID: ViewID, fields: Field[]): boolean {
  const prevFields = usePrevious(fields);

  return useMemo(() => {
    return fields.length !== prevFields.length;
  }, [fields, prevFields]);
}

interface ListViewViewContext {
  viewID: ViewID;
  rowToDocumentIDCache: RowToDocumentIDCache;
  columnToFieldIDCache: ColumnToFieldIDCache;
  lastFocusableColumn: number;
  lastFocusableRow: LeafRowPath | undefined;
  mode: ViewMode;
  onOpenDocument: (documentID: DocumentID) => void;
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => void;
}

export const ListViewViewContext = createContext<ListViewViewContext>({
  viewID: 'viw',
  rowToDocumentIDCache: FlatObject(),
  columnToFieldIDCache: {},
  lastFocusableColumn: 0,
  lastFocusableRow: {
    documentID: 'doc',
    row: 1,
    path: [],
  },
  mode: 'edit',
  onOpenDocument: () => {
    return;
  },
  onSelectDocument: () => {
    return;
  },
  onAddDocument: () => {
    return;
  },
});

export function useListViewViewContext(): ListViewViewContext {
  return useContext(ListViewViewContext);
}

type ColumnToFieldIDCache = {
  [column: number]: FieldID;
};

function getColumnToFieldIDCache(fields: Field[]): ColumnToFieldIDCache {
  const cache: ColumnToFieldIDCache = {};

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    cache[i + 1] = field.id;
  }

  return cache;
}

type RowToDocumentIDCache = FlatObject<DocumentID, number>;

function getRowToDocumentIDCache(rows: LeafRowPath[]): RowToDocumentIDCache {
  const cache = FlatObject<DocumentID, number>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    cache.set([...row.path, row.row], row.documentID);
  }

  return cache;
}

interface GroupData {
  field: Field;
  value: FieldValue;
}
type PathToGroupCache = FlatObject<GroupData, number>;

function getPathToGroupCache(rows: GroupRowPath[]): PathToGroupCache {
  const cache = FlatObject<GroupData, number>();

  if (isEmpty(rows)) {
    return cache;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const data: GroupData = {
      field: row.field,
      value: row.value,
    };
    cache.set(row.path, data);
  }

  return cache;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
