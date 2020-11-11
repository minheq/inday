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
  useGridRecycler,
  ContentOffset,
  Column,
  RecycledColumn,
  StatefulLeafRowCell,
  LeafRowState,
  LeafRowCellState,
  GroupRowState,
  StatefulGroupRowCell,
  GroupRowCellState,
} from './grid.common';
import {
  GridRef,
  GridProps,
  ScrollToOffsetParams,
  RenderLeafRowProps,
  RenderLeafRowCellProps,
  RenderHeaderProps,
  RenderHeaderCellProps,
  RenderGroupRowProps,
  RenderGroupRowCellProps,
  RenderFooterProps,
  RenderFooterCellProps,
} from './grid';

export const Grid = memo(
  forwardRef<GridRef, GridProps>(function Grid(props, ref) {
    const {
      cell = null,
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
      renderFooter,
      renderFooterCell,
      renderGroupRow,
      renderGroupRowCell,
      renderLeafRow,
      renderLeafRowCell,
      renderHeaderCell,
      renderHeader,
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
      rows,
    } = useGridTransformer({
      columns,
      fixedColumnCount,
      groups,
      groupRowHeight,
      leafRowHeight,
      spacerHeight,
    });

    const totalHeight = contentHeight + headerHeight + footerHeight;
    const scrollViewHeight = height - headerHeight - footerHeight;
    const scrollViewWidth = width - leftPaneContentWidth;

    const { recycledRows, recycledColumns } = useGridRecycler({
      rows,
      columns: rightPaneColumns,
      scrollViewHeight,
      scrollViewWidth,
      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y,
    });
    const statefulRows = useGetStatefulRows({
      rows: recycledRows,
      cell,
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

    return (
      <div ref={scrollViewRef} style={styles('root')} onScroll={handleOnScroll}>
        <div
          style={styles('content', {
            width: contentWidth,
            height: totalHeight,
          })}
        >
          {headerHeight !== 0 &&
            renderHeaderCell !== undefined &&
            renderHeader !== undefined && (
              <HeaderContainer
                height={headerHeight}
                width={contentWidth}
                leftPaneColumns={leftPaneColumns}
                rightPaneColumns={rightPaneColumns}
                renderHeader={renderHeader}
                renderHeaderCell={renderHeaderCell}
              />
            )}
          {footerHeight !== 0 &&
            renderFooterCell !== undefined &&
            renderFooter !== undefined && (
              <FooterContainer
                y={scrollViewHeight + headerHeight}
                height={footerHeight}
                width={contentWidth}
                leftPaneColumns={leftPaneColumns}
                rightPaneColumns={rightPaneColumns}
                renderFooter={renderFooter}
                renderFooterCell={renderFooterCell}
              />
            )}
          <div style={styles('rowsWrapper', { top: headerHeight })}>
            {statefulRows.map((row) => {
              switch (row.type) {
                case 'leaf':
                  return (
                    <LeafRowContainer
                      key={row.key}
                      y={row.y}
                      path={row.path}
                      row={row.row}
                      height={row.height}
                      state={row.state}
                      cell={row.cell}
                      leftPaneContentWidth={leftPaneContentWidth}
                      width={contentWidth}
                      leftPaneColumns={leftPaneColumns}
                      rightPaneColumns={recycledColumns}
                      renderLeafRow={renderLeafRow}
                      renderLeafRowCell={renderLeafRowCell}
                    />
                  );
                case 'group':
                  if (
                    renderGroupRow === undefined ||
                    renderGroupRowCell === undefined
                  ) {
                    return null;
                  }
                  return (
                    <GroupRowContainer
                      key={row.key}
                      y={row.y}
                      path={row.path}
                      height={row.height}
                      collapsed={row.collapsed}
                      state={row.state}
                      cell={row.cell}
                      leftPaneContentWidth={leftPaneContentWidth}
                      width={contentWidth}
                      leftPaneColumns={leftPaneColumns}
                      rightPaneColumns={recycledColumns}
                      renderGroupRow={renderGroupRow}
                      renderGroupRowCell={renderGroupRowCell}
                    />
                  );
                case 'spacer':
                  return (
                    <SpacerRowContainer
                      key={row.key}
                      y={row.y}
                      height={row.height}
                    />
                  );
              }
            })}
          </div>
        </div>
      </div>
    );
  }),
);

interface HeaderContainerProps {
  height: number;
  width: number;
  renderHeader: (props: RenderHeaderProps) => React.ReactNode;
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  leftPaneColumns: Column[];
  rightPaneColumns: Column[];
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const {
    height,
    width,
    leftPaneColumns,
    rightPaneColumns,
    renderHeader,
    renderHeaderCell,
  } = props;

  const renderCells = useCallback(
    (columns: Column[]) => {
      return columns.map((columnData) => {
        const { width: columnWidth, column } = columnData;

        return (
          <div key={column} style={{ width: columnWidth }}>
            {renderHeaderCell({ column })}
          </div>
        );
      });
    },
    [renderHeaderCell],
  );

  const children = useMemo(
    () => (
      <div style={styles('header')}>
        <div style={styles('leftPaneColumns')}>
          {renderCells(leftPaneColumns)}
        </div>
        <div style={styles('rightPaneColumns')}>
          {renderCells(rightPaneColumns)}
        </div>
      </div>
    ),
    [renderCells, leftPaneColumns, rightPaneColumns],
  );

  return (
    <div style={styles('headerWrapper', { width, height })}>
      {renderHeader({ children })}
    </div>
  );
});

interface FooterContainerProps {
  height: number;
  width: number;
  y: number;
  renderFooter: (props: RenderFooterProps) => React.ReactNode;
  renderFooterCell: (props: RenderFooterCellProps) => React.ReactNode;
  leftPaneColumns: Column[];
  rightPaneColumns: Column[];
}

const FooterContainer = memo(function FooterContainer(
  props: FooterContainerProps,
) {
  const {
    y,
    height,
    width,
    leftPaneColumns,
    rightPaneColumns,
    renderFooter,
    renderFooterCell,
  } = props;

  const renderCells = useCallback(
    (columns: Column[]) => {
      return columns.map((columnData) => {
        const { width: columnWidth, column } = columnData;

        return (
          <div key={column} style={{ width: columnWidth }}>
            {renderFooterCell({ column })}
          </div>
        );
      });
    },
    [renderFooterCell],
  );

  const children = useMemo(
    () => (
      <div style={styles('footer')}>
        <div style={styles('leftPaneColumns')}>
          {renderCells(leftPaneColumns)}
        </div>
        <div style={styles('rightPaneColumns')}>
          {renderCells(rightPaneColumns)}
        </div>
      </div>
    ),
    [renderCells, leftPaneColumns, rightPaneColumns],
  );

  return (
    <div style={styles('footerWrapper', { top: y, width, height })}>
      {renderFooter({ children })}
    </div>
  );
});

interface LeafRowContainerProps {
  height: number;
  width: number;
  y: number;
  path: number[];
  row: number;
  leftPaneContentWidth: number;
  renderLeafRow: (props: RenderLeafRowProps) => React.ReactNode;
  renderLeafRowCell: (props: RenderLeafRowCellProps) => React.ReactNode;
  leftPaneColumns: Column[];
  rightPaneColumns: RecycledColumn[];
  state: LeafRowState;
  cell: StatefulLeafRowCell | null;
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
    leftPaneContentWidth,
    leftPaneColumns,
    rightPaneColumns,
    cell,
    state,
    renderLeafRowCell,
    renderLeafRow,
  } = props;

  const children = useMemo(
    () => (
      <div style={styles('row')}>
        <div style={styles('leftPaneColumns')}>
          {leftPaneColumns.map((columnData) => {
            const { width: columnWidth, column, x } = columnData;
            const cellState = cell?.column === column ? cell.state : 'default';

            return (
              <LeafRowCellContainer
                column={column}
                height={height}
                key={column}
                path={path}
                renderLeafRowCell={renderLeafRowCell}
                row={row}
                state={cellState}
                width={columnWidth}
                x={x}
              />
            );
          })}
        </div>
        <div style={styles('rightPaneColumns', { left: leftPaneContentWidth })}>
          {rightPaneColumns.map((columnData) => {
            const { key, width: columnWidth, column, x } = columnData;
            const cellState = cell?.column === column ? cell.state : 'default';

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
                x={x}
              />
            );
          })}
        </div>
      </div>
    ),
    [
      cell,
      height,
      leftPaneColumns,
      leftPaneContentWidth,
      path,
      renderLeafRowCell,
      rightPaneColumns,
      row,
    ],
  );

  return (
    <div
      style={styles(
        'rowWrapper',
        { height, width, top: y },
        (state === 'hovered' || state === 'selected') && 'selected',
      )}
    >
      {renderLeafRow({ path, row, state, children })}
    </div>
  );
});

interface GroupRowContainerProps {
  height: number;
  width: number;
  y: number;
  collapsed: boolean;
  path: number[];
  leftPaneContentWidth: number;
  renderGroupRow: (props: RenderGroupRowProps) => React.ReactNode;
  renderGroupRowCell: (props: RenderGroupRowCellProps) => React.ReactNode;
  leftPaneColumns: Column[];
  rightPaneColumns: RecycledColumn[];
  state: GroupRowState;
  cell: StatefulGroupRowCell | null;
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
    leftPaneContentWidth,
    leftPaneColumns,
    rightPaneColumns,
    cell,
    state,
    renderGroupRowCell,
    renderGroupRow,
  } = props;

  const children = useMemo(
    () => (
      <div style={styles('row')}>
        <div style={styles('leftPaneColumns')}>
          {leftPaneColumns.map((columnData) => {
            const { width: columnWidth, column, x } = columnData;
            const cellState = cell?.column === column ? cell.state : 'default';

            return (
              <GroupRowCellContainer
                column={column}
                height={height}
                key={column}
                path={path}
                renderGroupRowCell={renderGroupRowCell}
                state={cellState}
                width={columnWidth}
                x={x}
              />
            );
          })}
        </div>
        <div style={styles('rightPaneColumns', { left: leftPaneContentWidth })}>
          {rightPaneColumns.map((columnData) => {
            const { key, width: columnWidth, column, x } = columnData;
            const cellState = cell?.column === column ? cell.state : 'default';

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
      </div>
    ),
    [
      cell,
      height,
      leftPaneColumns,
      leftPaneContentWidth,
      path,
      renderGroupRowCell,
      rightPaneColumns,
    ],
  );

  return (
    <div
      style={styles(
        'rowWrapper',
        { height, width, top: y },
        state === 'hovered' && 'selected',
      )}
    >
      {renderGroupRow({ path, collapsed, state, children })}
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

interface LeafRowCellContainerProps {
  x: number;
  width: number;
  height: number;
  renderLeafRowCell: (props: RenderLeafRowCellProps) => React.ReactNode;
  column: number;
  row: number;
  path: number[];
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
    state = 'default',
    renderLeafRowCell,
  } = props;

  return (
    <div
      style={styles(
        'cell',
        { left: x, width, height },
        (state === 'editing' || state === 'focused' || state === 'hovered') &&
          'selected',
      )}
    >
      {renderLeafRowCell({ path, row, column, state })}
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
        (state === 'editing' || state === 'hovered') && 'selected',
      )}
    >
      {renderGroupRowCell({ path, column, state })}
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
    zIndex: 1,
    position: 'sticky',
    top: 0,
  },
  footerWrapper: {
    zIndex: 1,
    position: 'sticky',
    bottom: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftPaneColumns: {
    zIndex: 1,
    position: 'sticky',
    left: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  rightPaneColumns: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
  },
  spacer: {
    position: 'absolute',
    width: '100%',
  },
  selected: {
    zIndex: 1,
  },
});
