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
  Column,
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
      (_columns: RecycledColumn[], _width: number) => {
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
                  activeCell={row.activeCell}
                  width={_width}
                  columns={_columns}
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
      ],
    );

    const _renderHeader = useCallback(
      (_columns: Column[], _width: number) => {
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
            renderHeader={renderHeader}
            renderHeaderCell={renderHeaderCell}
          />
        );
      },
      [headerHeight, renderHeaderCell, renderHeader],
    );

    const _renderFooter = useCallback(
      (_columns: Column[], _width: number) => {
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
            {_renderHeader(leftPaneColumns, leftPaneContentWidth)}
            <div style={styles('rowsWrapper', { top: headerHeight })}>
              {renderRows(recycledLeftPaneColumns, leftPaneContentWidth)}
            </div>
            {_renderFooter(leftPaneColumns, leftPaneContentWidth)}
          </div>
          <div style={styles('rightPaneColumns')}>
            {_renderHeader(rightPaneColumns, rightPaneContentWidth)}
            <div style={styles('rowsWrapper', { top: headerHeight })}>
              {renderRows(recycledRightPaneColumns, rightPaneContentWidth)}
            </div>
            {_renderFooter(rightPaneColumns, rightPaneContentWidth)}
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
  columns: Column[];
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const { height, width, columns, renderHeader, renderHeaderCell } = props;

  const children = useMemo(
    () => (
      <div style={styles('header', { height })}>
        {columns.map((columnData) => {
          const { width: columnWidth, column } = columnData;

          return (
            <div key={column} style={{ width: columnWidth }}>
              {renderHeaderCell({ column })}
            </div>
          );
        })}
      </div>
    ),
    [columns, renderHeaderCell, height],
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
  columns: Column[];
}

const FooterContainer = memo(function FooterContainer(
  props: FooterContainerProps,
) {
  const { y, height, width, renderFooterCell, renderFooter, columns } = props;

  const children = useMemo(
    () => (
      <div style={styles('footer', { height })}>
        {columns.map((columnData) => {
          const { width: columnWidth, column } = columnData;

          return (
            <div key={column} style={{ width: columnWidth }}>
              {renderFooterCell({ column })}
            </div>
          );
        })}
      </div>
    ),
    [columns, renderFooterCell, height],
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
              x={x}
            />
          );
        })}
      </div>
    ),
    [activeCell, columns, height, path, renderLeafRowCell, row],
  );

  return (
    <div
      style={styles(
        'rowWrapper',
        { height, width, top: y },
        (state === 'hovered' || state === 'selected') && 'selected',
      )}
    >
      {renderLeafRow({ children, path, row, state })}
    </div>
  );
});

interface GroupRowContainerProps {
  height: number;
  width: number;
  y: number;
  collapsed: boolean;
  path: number[];
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
        state === 'hovered' && 'selected',
      )}
    >
      {renderGroupRow({ children, path, state })}
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
      {renderLeafRowCell({
        path,
        row,
        column,
        state,
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
  selected: {
    zIndex: 1,
  },
});
