import React, {
  useRef,
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import { css } from '../lib/css';
import {
  useGetStatefulRows,
  useGridGetScrollToCellOffset,
  useGridTransformer,
  ContentOffset,
  RecycledColumn,
  StatefulLeafRowCell,
  LeafRowState,
  LeafRowCellState,
  GroupRowState,
  StatefulGroupRowCell,
  GroupRowCellState,
  useRowsRecycler,
  useColumnsRecycler,
} from './grid_renderer.common';
import {
  GridRendererRef,
  GridRendererProps,
  ScrollToOffsetParams,
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
  RenderGroupRowCellProps,
  RenderFooterCellProps,
  RenderLeafRowProps,
  RenderGroupRowProps,
  RenderHeaderProps,
  RenderFooterProps,
  Pane,
} from './grid_renderer';

// False positive  https://github.com/yannickcr/eslint-plugin-react/issues/2269
// eslint-disable-next-line
export const GridRenderer = memo(
  forwardRef<GridRendererRef, GridRendererProps>(function GridRenderer(
    props,
    ref,
  ) {
    const {
      activeCell = null,
      selectedRows = null,
      columns,
      fixedColumnCount,
      groups,
      spacerHeight = 0,
      groupRowHeight = 0,
      footerHeight = 0,
      headerHeight = 0,
      leafRowHeight,
      height,
      width,
      renderFooterCell,
      renderGroupRowCell,
      renderGroupRow,
      renderLeafRowCell,
      renderLeafRow,
      renderFooter,
      renderHeader,
      renderHeaderCell,
      contentOffset,
      onContentOffsetLoaded,
    } = props;
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState<ContentOffset>(
      contentOffset || { x: 0, y: 0 },
    );

    const handleScrollToOffset = useCallback(
      (params: ScrollToOffsetParams) => {
        if (
          scrollViewRef.current &&
          (params.x !== undefined || params.y !== undefined)
        ) {
          scrollViewRef.current.scrollTo({
            left: params.x,
            top: params.y,
          });
        }
      },
      [scrollViewRef],
    );

    const handleOnScroll = useCallback(
      (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollPosition({
          y: event.currentTarget.scrollTop,
          x: event.currentTarget.scrollLeft,
        });
      },
      [],
    );

    useEffect(() => {
      if (contentOffset !== undefined) {
        handleScrollToOffset({
          y: contentOffset.y,
          x: contentOffset.x,
          animated: false,
        });

        if (onContentOffsetLoaded) {
          onContentOffsetLoaded();
        }
      }
    }, [onContentOffsetLoaded, handleScrollToOffset, contentOffset]);

    const {
      contentHeight,
      contentWidth,
      leftPaneColumns,
      leftPaneContentWidth,
      rightPaneColumns,
      rightPaneContentWidth,
      rows,
    } = useGridTransformer({
      columns,
      fixedColumnCount,
      groups,
      groupRowHeight,
      leafRowHeight,
      spacerHeight,
    });

    const columnCount = columns.length;
    const totalHeight = contentHeight + headerHeight + footerHeight;
    const scrollViewHeight = height - headerHeight - footerHeight;
    const scrollViewWidth = width - leftPaneContentWidth;

    const recycledRows = useRowsRecycler({
      rows,
      scrollViewHeight,
      scrollY: scrollPosition.y,
    });
    const recycledLeftPaneColumns = useColumnsRecycler({
      columns: leftPaneColumns,
      scrollViewWidth: leftPaneContentWidth,
      scrollX: 0,
    });
    const recycledRightPaneColumns = useColumnsRecycler({
      columns: rightPaneColumns,
      scrollViewWidth,
      scrollX: scrollPosition.x,
    });
    const statefulRows = useGetStatefulRows({
      rows: recycledRows,
      activeCell,
      selectedRows,
    });
    const getScrollToCellOffset = useGridGetScrollToCellOffset({
      rows,
      fixedColumnCount,
      columns: rightPaneColumns,
      scrollViewHeight,
      scrollViewWidth,
      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y,
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          scrollToOffset: handleScrollToOffset,
          scrollToCell: (params) =>
            handleScrollToOffset(getScrollToCellOffset(params)),
        };
      },
      [handleScrollToOffset, getScrollToCellOffset],
    );

    const renderRows = useCallback(
      (_columns: RecycledColumn[], _width: number, pane: Pane) => {
        const _rows: React.ReactNode[] = [];

        statefulRows.map((row) => {
          switch (row.type) {
            case 'leaf':
              _rows.push(
                <LeafRowContainer
                  key={row.key}
                  y={row.y}
                  path={row.path}
                  row={row.row}
                  height={row.height}
                  state={row.state}
                  last={row.last}
                  activeCell={row.activeCell}
                  pane={pane}
                  width={_width}
                  columns={_columns}
                  columnCount={columnCount}
                  renderLeafRow={renderLeafRow}
                  renderLeafRowCell={renderLeafRowCell}
                />,
              );
              break;
            case 'group':
              if (
                renderGroupRowCell === undefined ||
                renderGroupRow === undefined
              ) {
                break;
              }

              _rows.push(
                <GroupRowContainer
                  key={row.key}
                  y={row.y}
                  path={row.path}
                  height={row.height}
                  collapsed={row.collapsed}
                  state={row.state}
                  pane={pane}
                  activeCell={row.activeCell}
                  width={_width}
                  columns={_columns}
                  renderGroupRow={renderGroupRow}
                  renderGroupRowCell={renderGroupRowCell}
                />,
              );
              break;
            case 'spacer':
              _rows.push(
                <SpacerRowContainer
                  key={row.key}
                  y={row.y}
                  height={row.height}
                />,
              );
              break;
          }
        });

        return _rows;
      },
      [
        renderGroupRowCell,
        renderLeafRowCell,
        renderLeafRow,
        renderGroupRow,
        statefulRows,
        columnCount,
      ],
    );

    const _renderHeader = useCallback(
      (_columns: RecycledColumn[], _width: number, pane: Pane) => {
        if (
          headerHeight === 0 ||
          renderHeaderCell === undefined ||
          renderHeader === undefined
        ) {
          return null;
        }

        return (
          <HeaderContainer
            height={headerHeight}
            width={_width}
            columns={_columns}
            columnCount={columnCount}
            pane={pane}
            renderHeader={renderHeader}
            renderHeaderCell={renderHeaderCell}
          />
        );
      },
      [headerHeight, renderHeaderCell, renderHeader, columnCount],
    );

    const _renderFooter = useCallback(
      (_columns: RecycledColumn[], _width: number, pane: Pane) => {
        if (
          footerHeight === 0 ||
          renderFooterCell === undefined ||
          renderFooter === undefined
        ) {
          return null;
        }

        return (
          <FooterContainer
            y={scrollViewHeight + headerHeight}
            height={footerHeight}
            width={_width}
            columns={_columns}
            columnCount={columnCount}
            pane={pane}
            renderFooter={renderFooter}
            renderFooterCell={renderFooterCell}
          />
        );
      },
      [
        headerHeight,
        scrollViewHeight,
        footerHeight,
        renderFooterCell,
        renderFooter,
        columnCount,
      ],
    );

    return (
      <div ref={scrollViewRef} style={styles('root')} onScroll={handleOnScroll}>
        <div
          style={styles('content', {
            width: contentWidth,
            height: totalHeight,
          })}
        >
          <div
            style={styles('leftPaneColumns', { width: leftPaneContentWidth })}
          >
            {_renderHeader(
              recycledLeftPaneColumns,
              leftPaneContentWidth,
              'left',
            )}
            <div style={styles('rowsWrapper', { top: headerHeight })}>
              {renderRows(
                recycledLeftPaneColumns,
                leftPaneContentWidth,
                'left',
              )}
            </div>
            {_renderFooter(
              recycledLeftPaneColumns,
              leftPaneContentWidth,
              'left',
            )}
          </div>
          <div style={styles('rightPaneColumns')}>
            {_renderHeader(
              recycledRightPaneColumns,
              rightPaneContentWidth,
              'right',
            )}
            <div style={styles('rowsWrapper', { top: headerHeight })}>
              {renderRows(
                recycledRightPaneColumns,
                rightPaneContentWidth,
                'right',
              )}
            </div>
            {_renderFooter(
              recycledRightPaneColumns,
              rightPaneContentWidth,
              'right',
            )}
          </div>
        </div>
      </div>
    );
  }),
);

interface HeaderContainerProps {
  height: number;
  width: number;
  pane: Pane;
  renderHeader: (props: RenderHeaderProps) => React.ReactNode;
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  columns: RecycledColumn[];
  columnCount: number;
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const {
    height,
    width,
    columns,
    columnCount,
    pane,
    renderHeader,
    renderHeaderCell,
  } = props;

  const children = useMemo(
    () => (
      <div style={styles('row', { height })}>
        {columns.map((columnData) => {
          const { width: columnWidth, column, x, key } = columnData;

          return (
            <HeaderCellContainer
              key={key}
              column={column}
              height={height}
              renderHeaderCell={renderHeaderCell}
              width={columnWidth}
              last={column === columnCount}
              x={x}
            />
          );
        })}
      </div>
    ),
    [columns, renderHeaderCell, height, columnCount],
  );

  return (
    <div style={styles('headerWrapper', { width, height })}>
      {renderHeader({ children, pane })}
    </div>
  );
});

interface FooterContainerProps {
  height: number;
  width: number;
  y: number;
  pane: Pane;
  renderFooter: (props: RenderFooterProps) => React.ReactNode;
  renderFooterCell: (props: RenderFooterCellProps) => React.ReactNode;
  columns: RecycledColumn[];
  columnCount: number;
}

const FooterContainer = memo(function FooterContainer(
  props: FooterContainerProps,
) {
  const {
    y,
    height,
    width,
    columnCount,
    pane,
    renderFooterCell,
    renderFooter,
    columns,
  } = props;

  const children = useMemo(
    () => (
      <div style={styles('row', { height })}>
        {columns.map((columnData) => {
          const { width: columnWidth, column, key, x } = columnData;

          return (
            <FooterCellContainer
              key={key}
              column={column}
              height={height}
              renderFooterCell={renderFooterCell}
              width={columnWidth}
              last={column === columnCount}
              x={x}
            />
          );
        })}
      </div>
    ),
    [columns, renderFooterCell, height, columnCount],
  );

  return (
    <div style={styles('footerWrapper', { top: y, width, height })}>
      {renderFooter({ children, pane })}
    </div>
  );
});

interface LeafRowContainerProps {
  height: number;
  width: number;
  y: number;
  path: number[];
  row: number;
  last: boolean;
  pane: Pane;
  columnCount: number;
  renderLeafRowCell: (props: RenderLeafRowCellProps) => React.ReactNode;
  renderLeafRow: (props: RenderLeafRowProps) => React.ReactNode;
  columns: RecycledColumn[];
  state: LeafRowState;
  activeCell: StatefulLeafRowCell | null;
}

const LeafRowContainer = memo(function LeafRowContainer(
  props: LeafRowContainerProps,
) {
  const {
    width,
    height,
    y,
    path,
    row,
    columns,
    activeCell,
    state,
    last,
    pane,
    columnCount,
    renderLeafRow,
    renderLeafRowCell,
  } = props;

  const children = useMemo(
    () => (
      <div style={styles('row', { height })}>
        {columns.map((columnData) => {
          const { key, width: columnWidth, column, x } = columnData;
          const cellState =
            activeCell?.column === column ? activeCell.state : 'default';

          return (
            <LeafRowCellContainer
              column={column}
              height={height}
              key={key}
              path={path}
              renderLeafRowCell={renderLeafRowCell}
              row={row}
              state={cellState}
              width={columnWidth}
              last={column === columnCount}
              x={x}
            />
          );
        })}
      </div>
    ),
    [activeCell, columns, height, path, renderLeafRowCell, row, columnCount],
  );

  return (
    <div
      style={styles(
        'rowWrapper',
        { height, width, top: y },
        activeCell !== null && 'active',
      )}
    >
      {renderLeafRow({ children, path, row, state, last, pane })}
    </div>
  );
});

interface GroupRowContainerProps {
  height: number;
  width: number;
  y: number;
  collapsed: boolean;
  path: number[];
  pane: Pane;
  renderGroupRowCell: (props: RenderGroupRowCellProps) => React.ReactNode;
  renderGroupRow: (props: RenderGroupRowProps) => React.ReactNode;
  columns: RecycledColumn[];
  state: GroupRowState;
  activeCell: StatefulGroupRowCell | null;
}

const GroupRowContainer = memo(function GroupRowContainer(
  props: GroupRowContainerProps,
) {
  const {
    width,
    height,
    y,
    collapsed,
    path,
    columns,
    activeCell,
    state,
    pane,
    renderGroupRow,
    renderGroupRowCell,
  } = props;

  const children = useMemo(
    () => (
      <div style={styles('row', { height })}>
        {columns.map((columnData) => {
          const { key, width: columnWidth, column, x } = columnData;
          const cellState =
            activeCell?.column === column ? activeCell.state : 'default';

          return (
            <GroupRowCellContainer
              column={column}
              height={height}
              key={key}
              path={path}
              renderGroupRowCell={renderGroupRowCell}
              state={cellState}
              width={columnWidth}
              x={x}
            />
          );
        })}
      </div>
    ),
    [activeCell, columns, height, path, renderGroupRowCell],
  );

  return (
    <div
      style={styles(
        'rowWrapper',
        { height, width, top: y },
        state === 'hovered' && 'active',
      )}
    >
      {renderGroupRow({ children, path, state, pane })}
    </div>
  );
});

interface SpacerRowContainerProps {
  y: number;
  height: number;
}

const SpacerRowContainer = memo(function SpacerRowContainer(
  props: SpacerRowContainerProps,
) {
  const { height, y } = props;

  return <div style={styles('spacer', { height, top: y })} />;
});

interface HeaderCellContainerProps {
  x: number;
  width: number;
  height: number;
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  column: number;
  last: boolean;
}

const HeaderCellContainer = memo(function HeaderCellContainer(
  props: HeaderCellContainerProps,
) {
  const { x, column, width, height, last, renderHeaderCell } = props;

  return (
    <div style={styles('cell', { left: x, width, height })}>
      {renderHeaderCell({ column, width, height, last })}
    </div>
  );
});

interface FooterCellContainerProps {
  x: number;
  width: number;
  height: number;
  renderFooterCell: (props: RenderFooterCellProps) => React.ReactNode;
  column: number;
  last: boolean;
}

const FooterCellContainer = memo(function FooterCellContainer(
  props: FooterCellContainerProps,
) {
  const { x, column, width, height, last, renderFooterCell } = props;

  return (
    <div style={styles('cell', { left: x, width, height })}>
      {renderFooterCell({ column, width, height, last })}
    </div>
  );
});

interface LeafRowCellContainerProps {
  x: number;
  width: number;
  height: number;
  renderLeafRowCell: (props: RenderLeafRowCellProps) => React.ReactNode;
  column: number;
  row: number;
  path: number[];
  last: boolean;
  state: LeafRowCellState;
}

const LeafRowCellContainer = memo(function LeafRowCellContainer(
  props: LeafRowCellContainerProps,
) {
  const {
    x,
    row,
    path,
    column,
    width,
    height,
    last,
    state = 'default',
    renderLeafRowCell,
  } = props;

  return (
    <div
      style={styles(
        'cell',
        { left: x, width, height },
        (state === 'editing' || state === 'focused' || state === 'hovered') &&
          'active',
      )}
    >
      {renderLeafRowCell({
        path,
        row,
        column,
        state,
        width,
        height,
        last,
        type: 'leaf',
      })}
    </div>
  );
});

interface GroupRowCellContainerProps {
  x: number;
  width: number;
  height: number;
  renderGroupRowCell: (props: RenderGroupRowCellProps) => React.ReactNode;
  column: number;
  path: number[];
  state: GroupRowCellState;
}

const GroupRowCellContainer = memo(function GroupRowCellContainer(
  props: GroupRowCellContainerProps,
) {
  const {
    x,
    path,
    column,
    width,
    height,
    state = 'default',
    renderGroupRowCell,
  } = props;

  return (
    <div
      style={styles(
        'cell',
        { left: x, width, height },
        (state === 'editing' || state === 'hovered') && 'active',
      )}
    >
      {renderGroupRowCell({ path, column, width, height, state })}
    </div>
  );
});

const styles = css.create({
  root: {
    position: 'relative',
    overflow: 'scroll',
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
  },
  rowsWrapper: {
    position: 'absolute',
  },
  rowWrapper: {
    position: 'absolute',
  },
  row: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    position: 'absolute',
  },
  headerWrapper: {
    zIndex: 2,
    position: 'sticky',
    top: 0,
  },
  footerWrapper: {
    zIndex: 2,
    position: 'sticky',
    bottom: 0,
  },
  leftPaneColumns: {
    zIndex: 3,
    position: 'sticky',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  rightPaneColumns: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  spacer: {
    position: 'absolute',
    width: '100%',
  },
  active: {
    zIndex: 1,
  },
});
