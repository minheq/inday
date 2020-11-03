import React, {
  useRef,
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { css } from '../lib/css';
import {
  Item,
  RecycledItem,
  useGetEnhancedRecycledRows,
  useGridGetScrollToCellOffset,
  useGridMeasurer,
  useGridRecycler,
} from './grid.common';
import {
  GridRef,
  GridProps,
  ScrollToOffsetParams,
  RenderRowProps,
  RenderCellProps,
  RenderHeaderProps,
  RenderHeaderCellProps,
  FocusedCell,
  ContentOffset,
} from './grid';

export const Grid = memo(
  forwardRef<GridRef, GridProps>(function Grid(props, ref) {
    const {
      focusedCell,
      renderRow,
      selectedRows,
      columns,
      fixedColumnCount,
      rowCount,
      rowHeight,
      headerHeight = 0,
      height,
      width,
      renderCell,
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
    } = useGridMeasurer({
      columns,
      fixedColumnCount,
      rowCount,
      rowHeight,
    });
    const { recycledRows, recycledColumns } = useGridRecycler({
      rows,
      columns: rightPaneColumns,
      scrollViewHeight: height - headerHeight,
      scrollViewWidth: width - leftPaneContentWidth,
      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y,
    });
    const enhancedRecycledRows = useGetEnhancedRecycledRows({
      recycledRows,
      focusedCell,
      selectedRows,
    });
    const getScrollToCellOffset = useGridGetScrollToCellOffset({
      rows,
      fixedColumnCount,
      columns: rightPaneColumns,
      scrollViewHeight: height,
      scrollViewWidth: width,
      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y,
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          scrollToOffset: handleScrollToOffset,
          scrollToCell: (cell) =>
            handleScrollToOffset(getScrollToCellOffset(cell)),
        };
      },
      [handleScrollToOffset, getScrollToCellOffset],
    );

    return (
      <div ref={scrollViewRef} style={styles('root')} onScroll={handleOnScroll}>
        <div
          style={styles('content', {
            width: contentWidth,
            height: contentHeight + headerHeight,
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
          <div style={styles('rowsWrapper', { top: headerHeight })}>
            {enhancedRecycledRows.map(
              ({ key, size, offset, num, selected, focusedCell }) => (
                <RowContainer
                  key={key}
                  leftPaneContentWidth={leftPaneContentWidth}
                  width={contentWidth}
                  leftPaneColumns={leftPaneColumns}
                  rightPaneColumns={recycledColumns}
                  renderCell={renderCell}
                  y={offset}
                  row={num}
                  height={size}
                  renderRow={renderRow}
                  selected={selected}
                  focusedCell={focusedCell}
                />
              ),
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
  renderHeader: (props: RenderHeaderProps) => React.ReactNode;
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  leftPaneColumns: Item[];
  rightPaneColumns: Item[];
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

  const children = (
    <div style={styles('header')}>
      <div style={styles('leftPaneColumns')}>
        {leftPaneColumns.map((columnData) => {
          const { size, num: column } = columnData;

          return (
            <div key={column} style={{ width: size }}>
              {renderHeaderCell({ column })}
            </div>
          );
        })}
      </div>
      <div style={styles('rightPaneColumns')}>
        {rightPaneColumns.map((columnData) => {
          const { size, num: column } = columnData;

          return (
            <div key={column} style={{ width: size }}>
              {renderHeaderCell({ column })}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={styles('headerWrapper', { width, height })}>
      {renderHeader({ children })}
    </div>
  );
});

interface RowContainerProps {
  height: number;
  width: number;
  y: number;
  row: number;
  leftPaneContentWidth: number;
  renderRow: (props: RenderRowProps) => React.ReactNode;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  leftPaneColumns: Item[];
  rightPaneColumns: RecycledItem[];
  selected: boolean;
  focusedCell: FocusedCell | null;
}

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const {
    width,
    height,
    y,
    row,
    leftPaneContentWidth,
    leftPaneColumns,
    rightPaneColumns,
    focusedCell,
    selected,
    renderCell,
    renderRow,
  } = props;

  const children = (
    <div style={styles('row')}>
      <div style={styles('leftPaneColumns')}>
        {leftPaneColumns.map((columnData) => {
          const { size, num: column, offset } = columnData;
          const focused = !!(focusedCell?.column === column);
          const editing = !!(focused && focusedCell?.editing);

          return (
            <CellContainer
              key={column}
              width={size}
              row={row}
              height={height}
              column={column}
              x={offset}
              focused={focused}
              editing={editing}
              selected={selected}
              renderCell={renderCell}
            />
          );
        })}
      </div>
      <div style={styles('rightPaneColumns', { left: leftPaneContentWidth })}>
        {rightPaneColumns.map((columnData) => {
          const { key, size, num: column, offset } = columnData;
          const focused = !!(focusedCell?.column === column);
          const editing = !!(focused && focusedCell?.editing);

          return (
            <CellContainer
              key={key}
              width={size}
              row={row}
              height={height}
              column={column}
              x={offset}
              focused={focused}
              editing={editing}
              selected={selected}
              renderCell={renderCell}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={styles(
        'rowWrapper',
        { height, width, top: y },
        selected && 'selected',
      )}
    >
      {renderRow({ row, selected, children })}
    </div>
  );
});

interface CellContainerProps {
  x: number;
  width: number;
  height: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  column: number;
  row: number;
  focused: boolean;
  editing: boolean;
  selected: boolean;
}

const CellContainer = memo(function CellContainer(props: CellContainerProps) {
  const {
    x,
    row,
    column,
    width,
    height,
    focused,
    editing,
    selected,
    renderCell,
  } = props;

  return (
    <div
      style={styles('cell', { left: x, width, height }, focused && 'selected')}
    >
      {renderCell({ row, column, focused, editing, selected })}
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
  header: {
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
  selected: {
    zIndex: 1,
  },
});
