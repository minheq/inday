import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { atom, useRecoilState, useRecoilValue } from "recoil";

import { AutoSizer } from "../../lib/autosizer";
import { ListView, ViewID } from "../../../models/views";
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
} from "../../components/grid_renderer";
import { Document, DocumentID } from "../../../models/documents";
import { StatefulLeafRowCell } from "../../components/grid_renderer.common";
import { usePrevious } from "../../hooks/use_previous";
import { LastLeafRowCell, LeafRowCell } from "./leaf_row_cell";
import { Header, HeaderCell, LastHeaderCell } from "./header";
import { Footer } from "./footer";
import { GroupRow } from "./group_row";
import { LastLeafRow, LeafRow } from "./leaf_row";
import { GroupRowCell } from "./group_row_cell";
import {
  GROUP_ROW_HEIGHT,
  HEADER_HEIGHT,
  LEAF_ROW_HEIGHT,
  SPACER_ROW_HEIGHT,
} from "./list_view_constants";
import {
  useListViewGridColumns,
  useListViewGridGroups,
  useListViewGridSelectedRows,
} from "./list_view_grid";
import {
  defaultListViewMap,
  getDocumentID,
  getFieldID,
  getGroupRowCellData,
  isGrouped,
  ListViewMap,
  useListViewMap,
} from "./list_view_map";
import {
  useSortedFieldsWithListViewConfigQuery,
  useSortGettersQuery,
  useViewDocumentsQuery,
  useViewFiltersQuery,
  useViewGroupsQuery,
  useViewSortsQuery,
} from "../../store/queries";
import { useMemoCompare } from "../../hooks/use_memo_compare";
import {
  getListViewDocumentNodes,
  ListViewDocumentNodes,
} from "./list_view_nodes";
import { Field } from "../../../models/fields";
import {
  CollapsedGroupNode,
  CollapsedGroupsCache,
} from "./collapsed_groups_cache";
import { splitFirst } from "../../../lib/array_utils";
import { isEmpty } from "../../../lib/lang_utils";

export type ViewMode = "edit" | "select";

interface ListViewProps {
  view: ListView;
  mode: ViewMode;
  selectedDocumentIDs: DocumentID[];
  onOpenDocument: (documentID: DocumentID) => void;
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => Document;
}

type CollapsedGroupsByViewID = {
  [viewID: string]: CollapsedGroupsCache;
};

export const collapsedGroupsState = atom<CollapsedGroupsByViewID>({
  key: "ListView_CollapsedGroups",
  default: {},
});

export const activeCellState = atom<StatefulLeafRowCell | null>({
  key: "ListView_ActiveCell",
  default: null,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ListView(props: ListViewProps): JSX.Element {
  const {
    view,
    mode,
    selectedDocumentIDs,
    onOpenDocument,
    onAddDocument,
    onSelectDocument,
  } = props;
  const viewID = view.id;
  const [activeCell, setActiveCell] = useRecoilState(activeCellState);
  const fixedFieldCount = view.fixedFieldCount;
  const fields = useSortedFieldsWithListViewConfigQuery(viewID);
  const nodes = useListViewDocumentNodes(viewID);

  // Ensure these 2 functions get collapsedGroups
  const listViewMap = useListViewMap(nodes, fields);
  const gridGroups = useListViewGridGroups(nodes);

  const gridColumns = useListViewGridColumns(fields);
  const gridSelectedRows = useListViewGridSelectedRows(
    listViewMap,
    selectedDocumentIDs
  );
  const prevActiveCell = usePrevious(activeCell);
  const gridRef = useRef<GridRendererRef>(null);
  const handleToggleCollapseGroup = useToggleCollapseGroup(viewID, nodes);
  const grouped = useMemo(() => isGrouped(listViewMap), [listViewMap]);
  const context = useMemo((): ListViewContext => {
    return {
      viewID,
      listViewMap,
      mode,
      onOpenDocument,
      onSelectDocument,
      onAddDocument,
    };
  }, [
    viewID,
    listViewMap,
    mode,
    onOpenDocument,
    onSelectDocument,
    onAddDocument,
  ]);

  const renderLeafRowCell = useCallback(
    (_props: RenderLeafRowCellProps) => {
      if (_props.last) {
        return <LastLeafRowCell />;
      }

      const fieldID = getFieldID(listViewMap, _props);
      const documentID = getDocumentID(listViewMap, _props);
      const primary = _props.column === 1;
      const level = grouped ? _props.level - 1 : 0;

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
    [listViewMap, grouped]
  );

  const renderGroupRowCell = useCallback(
    (_props: RenderGroupRowCellProps) => {
      if (_props.last) {
        return <LastLeafRowCell />;
      }

      const group = getGroupRowCellData(listViewMap, _props);
      const level = grouped ? _props.level - 1 : 0;
      const primary = _props.column === 1;

      return (
        <GroupRowCell
          primary={primary}
          path={_props.path}
          column={_props.column}
          last={_props.last}
          collapsed={_props.collapsed}
          level={level}
          field={group.field}
          value={group.value}
          onToggleCollapseGroup={handleToggleCollapseGroup}
        />
      );
    },
    [listViewMap, grouped, handleToggleCollapseGroup]
  );

  const renderHeaderCell = useCallback(
    (_props: RenderHeaderCellProps) => {
      if (_props.last) {
        return <LastHeaderCell />;
      }

      const fieldID = getFieldID(listViewMap, _props);
      const primary = _props.column === 1;

      return (
        <HeaderCell fieldID={fieldID} primary={primary} width={_props.width} />
      );
    },
    [listViewMap]
  );

  const renderLeafRow = useCallback(
    (row: RenderLeafRowProps) => {
      if (row.last) {
        return row.pane === "left" ? <LastLeafRow /> : null;
      }

      const documentID = getDocumentID(listViewMap, row);

      return (
        <LeafRow documentID={documentID} state={row.state}>
          {row.children}
        </LeafRow>
      );
    },
    [listViewMap]
  );

  const renderGroupRow = useCallback(
    ({ children, state }: RenderGroupRowProps) => {
      return <GroupRow state={state}>{children}</GroupRow>;
    },
    []
  );

  const renderHeader = useCallback(({ children }: RenderHeaderProps) => {
    return <Header>{children}</Header>;
  }, []);

  const renderFooter = useCallback(({ children }: RenderFooterProps) => {
    return <Footer>{children}</Footer>;
  }, []);

  useEffect(() => {
    if (mode === "select" && activeCell) {
      setActiveCell(null);
    }
  }, [mode, activeCell, setActiveCell]);

  if (gridRef.current && activeCell && activeCell !== prevActiveCell) {
    gridRef.current.scrollToCell(activeCell);
  }

  return (
    <ListViewContext.Provider value={context}>
      <View style={styles.root}>
        <AutoSizer resizeGreaterWidthOnly>
          {({ height, width }) => (
            <GridRenderer
              ref={gridRef}
              width={width}
              height={height}
              selectedRows={gridSelectedRows}
              groups={gridGroups}
              columns={gridColumns}
              fixedColumnCount={fixedFieldCount}
              renderLeafRow={renderLeafRow}
              renderGroupRow={renderGroupRow}
              renderLeafRowCell={renderLeafRowCell}
              renderHeaderCell={renderHeaderCell}
              renderHeader={renderHeader}
              renderGroupRowCell={grouped ? renderGroupRowCell : undefined}
              renderFooter={renderFooter}
              leafRowHeight={LEAF_ROW_HEIGHT}
              groupRowHeight={grouped ? GROUP_ROW_HEIGHT : 0}
              spacerHeight={SPACER_ROW_HEIGHT}
              headerHeight={HEADER_HEIGHT}
              activeCell={activeCell}
            />
          )}
        </AutoSizer>
      </View>
    </ListViewContext.Provider>
  );
}

interface ListViewContext {
  viewID: ViewID;
  listViewMap: ListViewMap;
  mode: ViewMode;
  onOpenDocument: (documentID: DocumentID) => void;
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => void;
}

export const ListViewContext = createContext<ListViewContext>({
  viewID: "viw",
  listViewMap: defaultListViewMap,
  mode: "edit",
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

export function useListViewContext(): ListViewContext {
  return useContext(ListViewContext);
}

export function useToggleCollapseGroup(
  viewID: ViewID,
  nodes: ListViewDocumentNodes
): (path: number[], collapsed: boolean) => void {
  const [collapsedGroupsCacheByViewID, setCollapsedGroupsByViewID] =
    useRecoilState(collapsedGroupsState);

  return useCallback(
    (path: number[], collapsed: boolean) => {
      const nextCollapsedGroupsByViewID: CollapsedGroupsByViewID = {
        ...collapsedGroupsCacheByViewID,
      };

      const collapsedGroupsCache =
        nextCollapsedGroupsByViewID[viewID] ?? CollapsedGroupsCache([]);

      const node = buildCollapsedGroupNode(path, nodes, collapsed);

      nextCollapsedGroupsByViewID[viewID] = collapsedGroupsCache.set([node]);

      setCollapsedGroupsByViewID(nextCollapsedGroupsByViewID);
    },
    [setCollapsedGroupsByViewID, collapsedGroupsCacheByViewID, nodes, viewID]
  );
}

function buildCollapsedGroupNode(
  path: number[],
  nodes: ListViewDocumentNodes,
  collapsed: boolean
): CollapsedGroupNode {
  const [index, restPath] = splitFirst(path);
  const node = nodes[index];

  if (node.type === "flat") {
    throw new Error("CollapsedGroupNode is not used for flat list");
  }
  if (isEmpty(restPath) || node.type === "leaf") {
    return [node.field, node.value, collapsed];
  }

  return [
    node.field,
    node.value,
    false,
    [buildCollapsedGroupNode(restPath, node.children, collapsed)],
  ];
}

/**
 * Returns tree of document nodes.
 * If view is sorted by groups and sorts, return tree of `GroupedListViewDocumentNode`.
 * If view is a flat list, return list of `FlatListViewDocumentNode`
 */
export function useListViewDocumentNodes(
  viewID: ViewID
): ListViewDocumentNodes {
  const documents = useViewDocumentsQuery(viewID);
  const groups = useViewGroupsQuery(viewID);
  const collapsedGroupsCacheByViewID = useRecoilValue(collapsedGroupsState);
  const collapsedGroupsCache = collapsedGroupsCacheByViewID[viewID];
  const sortGetters = useSortGettersQuery();
  const documentsOrderChanged = useDocumentsOrderChanged(viewID, documents);

  return useMemoCompare(
    () =>
      getListViewDocumentNodes(
        documents,
        groups,
        sortGetters,
        collapsedGroupsCache
      ),
    documentsOrderChanged
  );
}

function useDocumentsOrderChanged(
  viewID: ViewID,
  documents: Document[]
): boolean {
  const collapsedGroupsCacheByViewID = useRecoilValue(collapsedGroupsState);
  const collapsedGroups = useMemo(
    () => collapsedGroupsCacheByViewID[viewID],
    [collapsedGroupsCacheByViewID, viewID]
  );
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

function useFieldsOrderChanged(_viewID: ViewID, fields: Field[]): boolean {
  const prevFields = usePrevious(fields);

  return useMemo(() => {
    return fields.length !== prevFields.length;
  }, [fields, prevFields]);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
