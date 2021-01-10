import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { atom, useRecoilState } from 'recoil';

import { AutoSizer } from '../../lib/autosizer';
import { ListView, ViewID } from '../../../models/views';
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
import { Document, DocumentID } from '../../../models/documents';
import { StatefulLeafRowCell } from '../../components/grid_renderer.common';
import { usePrevious } from '../../hooks/use_previous';
import { LastLeafRowCell, LeafRowCell } from './leaf_row_cell';
import { Header, HeaderCell, LastHeaderCell } from './header';
import { Footer } from './footer';
import { GroupRow } from './group_row';
import { FlatObject } from '../../../lib/flat_object';
import { LastLeafRow, LeafRow } from './leaf_row';
import { GroupRowCell } from './group_row_cell';
import {
  GROUP_ROW_HEIGHT,
  HEADER_HEIGHT,
  LEAF_ROW_HEIGHT,
  SPACER_ROW_HEIGHT,
} from './list_view_constants';
import {
  ColumnToFieldIDCache,
  LeafRowPath,
  RowToDocumentIDCache,
  useToggleCollapseGroup,
  useListViewGrid,
} from './list_view_data';

export type ViewMode = 'edit' | 'select';

interface ListViewViewProps {
  view: ListView;
  mode: ViewMode;
  selectedDocuments: DocumentID[];
  onOpenDocument: (documentID: DocumentID) => void;
  onSelectDocument: (documentID: DocumentID, selected: boolean) => void;
  onAddDocument: () => Document;
}

export const activeCellState = atom<StatefulLeafRowCell | null>({
  key: 'ListViewView_ActiveCell',
  default: null,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ListViewView(props: ListViewViewProps): JSX.Element {
  const {
    view,
    mode,
    selectedDocuments,
    onOpenDocument,
    onAddDocument,
    onSelectDocument,
  } = props;
  const viewID = view.id;
  const [activeCell, setActiveCell] = useRecoilState(activeCellState);
  const {
    grouped,
    lastFocusableColumn,
    lastFocusableRow,
    rowToDocumentIDCache,
    columnToFieldIDCache,
    pathToGroupCache,
    fixedFieldCount,
    columns,
    gridGroups,
    selectedRows,
  } = useListViewGrid({ viewID, selectedDocuments });
  const prevActiveCell = usePrevious(activeCell);
  const gridRef = useRef<GridRendererRef>(null);
  const handleToggleCollapseGroup = useToggleCollapseGroup(viewID);

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

  const renderLeafRowCell = useCallback(
    (_props: RenderLeafRowCellProps) => {
      if (_props.last) {
        return <LastLeafRowCell />;
      }

      const fieldID = columnToFieldIDCache[_props.column];
      const documentID = rowToDocumentIDCache.get([..._props.path, _props.row]);
      const primary = _props.column === 1;
      const level = _props.level;

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
    [columnToFieldIDCache, rowToDocumentIDCache],
  );

  const renderGroupRowCell = useCallback(
    (_props: RenderGroupRowCellProps) => {
      if (_props.last) {
        return <LastLeafRowCell />;
      }

      const fieldID = columnToFieldIDCache[_props.column];
      const group = pathToGroupCache.get(_props.path);
      const primary = _props.column === 1;

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
        return row.pane === 'left' ? <LastLeafRow /> : null;
      }

      const documentID = rowToDocumentIDCache.get([...row.path, row.row]);

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

  useEffect(() => {
    if (mode === 'select' && activeCell !== null) {
      setActiveCell(null);
    }
  }, [mode, activeCell, setActiveCell]);

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
              columns={columns}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
