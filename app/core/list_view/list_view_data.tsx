import { useCallback, useMemo } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { isNotEmpty, last, removeBy } from '../../../lib/array_utils';
import { FlatObject } from '../../../lib/flat_object';
import { isEmpty } from '../../../lib/lang_utils';
import { GridGroup, SelectedRow } from '../../components/grid_renderer.common';
import { Document, DocumentID } from '../../../models/documents';
import {
  areFieldValuesEqual,
  Field,
  FieldID,
  FieldValue,
} from '../../../models/fields';
import { Group } from '../../../models/groups';
import {
  DocumentNode,
  makeDocumentNodes,
  SortGetters,
} from '../../../models/sorts';
import {
  useSortedFieldsWithListViewConfigQuery,
  useSortGettersQuery,
  useViewQuery,
  useViewDocumentsQuery,
  useViewFiltersQuery,
  useViewGroupsQuery,
  useViewSortsQuery,
} from '../../store/queries';
import { assertListView, ViewID } from '../../../models/views';
import { usePrevious } from '../../hooks/use_previous';
import { ADD_FIELD_COLUMN_WIDTH } from './list_view_constants';
import { useMemoCompare } from '../../hooks/use_memo_compare';
import { useWhatChanged } from '../../hooks/use_what_changed';

interface UseListViewGridProps {
  viewID: ViewID;
  selectedDocuments: DocumentID[];
}

interface ListViewGrid {
  fixedFieldCount: number;
  columns: number[];
  gridGroups: GridGroup[];
  selectedRows: SelectedRow[];
  lastFocusableColumn: number;
  lastFocusableRow: LeafRowPath | undefined;
  grouped: boolean;
  pathToGroupCache: FlatObject<GroupData, number>;
  rowToDocumentIDCache: FlatObject<`doc${string}`, number>;
  columnToFieldIDCache: ColumnToFieldIDCache;
}

export function useListViewGrid(props: UseListViewGridProps): ListViewGrid {
  const { viewID, selectedDocuments } = props;
  const view = useViewQuery(viewID);
  assertListView(view);

  const {
    grouped,
    nodes,
    leafRowPaths,
    rowToDocumentIDCache,
    columnToFieldIDCache,
    pathToGroupCache,
  } = useListViewData(viewID);
  const fields = useSortedFieldsWithListViewConfigQuery(viewID);
  const fixedFieldCount = view.fixedFieldCount;
  const columns = useMemo(
    (): number[] =>
      fields.map((field) => field.config.width).concat(ADD_FIELD_COLUMN_WIDTH),
    [fields],
  );
  const gridGroups = useMemo((): GridGroup[] => {
    if (isGroupedDocumentNodes(nodes, grouped)) {
      return toGroupedGridGroups(nodes);
    }

    return toFlatGridGroups(nodes);
  }, [nodes, grouped]);
  const selectedRows = useMemo(
    (): SelectedRow[] => getSelectedRows(selectedDocuments, leafRowPaths),
    [selectedDocuments, leafRowPaths],
  );
  const lastFocusableColumn = useMemo(() => fields.length, [fields]);
  const lastFocusableRow = useMemo(
    (): LeafRowPath | undefined => last(leafRowPaths),
    [leafRowPaths],
  );

  return {
    fixedFieldCount,
    columns,
    gridGroups,
    selectedRows,

    grouped,

    rowToDocumentIDCache,
    columnToFieldIDCache,
    pathToGroupCache,

    lastFocusableColumn,
    lastFocusableRow,
  };
}

function toGroupedGridGroups(nodes: GroupedDocumentNode[]): GridGroup[] {
  let groups: GridGroup[] = [];

  for (const node of nodes) {
    if (node.type === 'leaf') {
      groups = groups.concat({
        type: 'leaf',
        collapsed: node.collapsed,
        rowCount: node.children.length + 1, // + 1 adds a row for `Add document`
      });
    } else {
      groups = groups.concat({
        type: 'ancestor',
        collapsed: node.collapsed,
        children: toGroupedGridGroups(node.children),
      });
    }
  }

  return groups;
}

function toFlatGridGroups(nodes: FlatDocumentNode[]): GridGroup[] {
  let groups: GridGroup[] = [];

  for (const node of nodes) {
    groups = groups.concat({
      type: 'leaf',
      collapsed: false,
      rowCount: node.children.length + 1, // + 1 adds a row for `Add document`
    });
  }

  return groups;
}

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

type CollapsedGroupsByFieldID = {
  [fieldID: string]: FieldValue[] | undefined;
};

type CollapsedGroupsByViewID = {
  [viewID: string]: CollapsedGroupsByFieldID | undefined;
};

const collapsedGroupsState = atom<CollapsedGroupsByViewID>({
  key: 'ListViewData_CollapsedGroups',
  default: {},
});

interface ListViewData {
  grouped: boolean;
  nodes: GroupedDocumentNode[] | FlatDocumentNode[];
  pathToGroupCache: FlatObject<GroupData, number>;
  rowToDocumentIDCache: FlatObject<`doc${string}`, number>;
  columnToFieldIDCache: ColumnToFieldIDCache;
  leafRowPaths: LeafRowPath[];
}

function useListViewData(viewID: ViewID): ListViewData {
  const collapsedGroupsByViewID = useRecoilValue(collapsedGroupsState);
  const collapsedGroupsByFieldID = useMemo(
    () => collapsedGroupsByViewID[viewID],
    [collapsedGroupsByViewID, viewID],
  );
  const documents = useViewDocumentsQuery(viewID);
  const fields = useSortedFieldsWithListViewConfigQuery(viewID);
  const groups = useViewGroupsQuery(viewID);
  const grouped = isNotEmpty(groups);
  const sortGetters = useSortGettersQuery();
  const documentsOrderChanged = useDocumentsOrderChanged(viewID, documents);
  const fieldsOrderChanged = useFieldsOrderChanged(viewID, fields);

  const nodes = useMemoCompare(
    () =>
      grouped
        ? getGroupedDocumentNodes(
            documents,
            groups,
            sortGetters,
            collapsedGroupsByFieldID,
          )
        : getFlatDocumentNodes(documents),
    documentsOrderChanged,
  );
  const columnToFieldIDCache = useMemoCompare(
    () => getColumnToFieldIDCache(fields),
    fieldsOrderChanged,
  );

  const leafRowPaths = useMemo(
    (): LeafRowPath[] => getLeafRowPaths(nodes, []),
    [nodes],
  );
  const rowToDocumentIDCache = useMemo(
    (): RowToDocumentIDCache => getRowToDocumentIDCache(leafRowPaths),
    [leafRowPaths],
  );
  const pathToGroupCache = useMemo((): PathToGroupCache => {
    if (isGroupedDocumentNodes(nodes, grouped)) {
      return getPathToGroupCache(nodes);
    }

    return FlatObject();
  }, [nodes, grouped]);

  return {
    grouped,
    nodes,
    pathToGroupCache,
    rowToDocumentIDCache,
    columnToFieldIDCache,
    leafRowPaths,
  };
}

export function useToggleCollapseGroup(
  viewID: ViewID,
): (field: Field, value: FieldValue, collapsed: boolean) => void {
  const [collapsedGroupsByViewID, setCollapsedGroupsByViewID] = useRecoilState(
    collapsedGroupsState,
  );

  return useCallback(
    (field: Field, value: FieldValue, collapsed: boolean) => {
      const nextCollapsedGroupsByViewID: CollapsedGroupsByViewID = {
        ...collapsedGroupsByViewID,
      };
      const collapsedGroupsByFieldID = {
        ...nextCollapsedGroupsByViewID[viewID],
      };
      let collapsedValues = collapsedGroupsByFieldID[field.id];

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

      collapsedGroupsByFieldID[field.id] = collapsedValues;
      nextCollapsedGroupsByViewID[viewID] = collapsedGroupsByFieldID;

      setCollapsedGroupsByViewID(nextCollapsedGroupsByViewID);
    },
    [setCollapsedGroupsByViewID, collapsedGroupsByViewID, viewID],
  );
}

export interface FlatDocumentNode {
  type: 'leaf';
  children: Document[];
}

function getFlatDocumentNodes(documents: Document[]): FlatDocumentNode[] {
  return [{ type: 'leaf', children: documents }];
}

interface LeafGroupedDocumentNode {
  type: 'leaf';
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

export type GroupedDocumentNode =
  | LeafGroupedDocumentNode
  | AncestorGroupedDocumentNode;

function getGroupedDocumentNodes(
  documents: Document[],
  groups: Group[],
  sortGetters: SortGetters,
  collapsedGroups?: CollapsedGroupsByFieldID,
): GroupedDocumentNode[] {
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

export interface LeafRowPath {
  documentID: DocumentID;
  path: number[];
  row: number;
}

function isGroupedDocumentNodes(
  nodes: GroupedDocumentNode[] | FlatDocumentNode[],
  grouped: boolean,
): nodes is GroupedDocumentNode[] {
  return grouped;
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
  const filters = useViewFiltersQuery(viewID);
  const sorts = useViewSortsQuery(viewID);
  const groups = useViewGroupsQuery(viewID);

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

export type ColumnToFieldIDCache = {
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

export type RowToDocumentIDCache = FlatObject<DocumentID, number>;

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

export type PathToGroupCache = FlatObject<GroupData, number>;
interface GroupRowPath {
  field: Field;
  value: FieldValue;
  path: number[];
}

function getPathToGroupCache(nodes: GroupedDocumentNode[]): PathToGroupCache {
  const cache = FlatObject<GroupData, number>();
  const rows = getGroupRowPaths(nodes, []);

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

function getGroupRowPaths(
  nodes: GroupedDocumentNode[],
  prevPath: number[],
): GroupRowPath[] {
  let rows: GroupRowPath[] = [];

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
