import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { atom, useRecoilState } from "recoil";

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
  useListViewNodes,
  useToggleCollapseGroup,
} from "./use_list_view_nodes";
import {
  defaultListViewMap,
  getDocumentID,
  getFieldID,
  getGroupRowCellData,
  isGrouped,
  ListViewMap,
  useListViewMap,
} from "./list_view_map";
import { useSortedFieldsWithListViewConfigQuery } from "../../store/queries";

export type ViewMode = "edit" | "select";

interface ListViewViewProps {
  view: ListView;
  mode: ViewMode;
  selectedDocumentIDs: DocumentID[];
  onOpenDocument: (documentID: DocumentID) => void;
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => Document;
}

export const activeCellState = atom<StatefulLeafRowCell | null>({
  key: "ListViewView_ActiveCell",
  default: null,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ListViewView(props: ListViewViewProps): JSX.Element {
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
  const nodes = useListViewNodes(viewID);
  const listViewMap = useListViewMap(nodes, fields);
  const gridGroups = useListViewGridGroups(nodes);
  const gridColumns = useListViewGridColumns(fields);
  const gridSelectedRows = useListViewGridSelectedRows(
    listViewMap,
    selectedDocumentIDs
  );
  const prevActiveCell = usePrevious(activeCell);
  const gridRef = useRef<GridRendererRef>(null);
  const handleToggleCollapseGroup = useToggleCollapseGroup(viewID);
  const grouped = useMemo(() => isGrouped(listViewMap), [listViewMap]);
  const context = useMemo((): ListViewViewContext => {
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

      const fieldID = getFieldID(listViewMap, _props);
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
          columnFieldID={fieldID}
          level={level}
          field={group.field}
          value={group.value}
          onToggleCollapseGroup={handleToggleCollapseGroup}
        />
      );
    },
    [listViewMap, handleToggleCollapseGroup]
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
    <ListViewViewContext.Provider value={context}>
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
    </ListViewViewContext.Provider>
  );
}

interface ListViewViewContext {
  viewID: ViewID;
  listViewMap: ListViewMap;
  mode: ViewMode;
  onOpenDocument: (documentID: DocumentID) => void;
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => void;
}

export const ListViewViewContext = createContext<ListViewViewContext>({
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

export function useListViewViewContext(): ListViewViewContext {
  return useContext(ListViewViewContext);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
