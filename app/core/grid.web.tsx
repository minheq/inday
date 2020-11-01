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
import { Item, RecycleItem, useGrid } from './grid.common';
import {
  GridRef,
  GridProps,
  ScrollToParams,
  RenderCellProps,
  RenderHeaderCellProps,
  RenderRowProps,
  FocusedCell,
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
      scrollViewHeight,
      scrollViewWidth,
      renderCell,
      renderHeaderCell,
      contentOffset,
      onContentOffsetLoaded,
    } = props;
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState<{
      x: number;
      y: number;
    }>(contentOffset || { x: 0, y: 0 });

    const handleScrollTo = useCallback(
      (params: ScrollToParams) => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            left: params.x,
            top: params.y,
          });
        }
      },
      [scrollViewRef],
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          scrollTo: handleScrollTo,
        };
      },
      [handleScrollTo],
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
        handleScrollTo({
          y: contentOffset.y,
          x: contentOffset.x,
          animated: false,
        });

        if (onContentOffsetLoaded) {
          onContentOffsetLoaded();
        }
      }
    }, [onContentOffsetLoaded, handleScrollTo, contentOffset]);

    const {
      rows,
      contentWidth,
      contentHeight,
      leftPaneColumns,
      rightPaneColumns,
      bodyLeftPaneColumns,
      bodyRightPaneColumns,
      leftPaneContentWidth,
    } = useGrid({
      focusedCell,
      selectedRows,
      columns,
      fixedColumnCount,
      rowCount,
      rowHeight,
      scrollViewHeight,
      scrollViewWidth,

      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y,
    });

    return (
      <div style={styles('root')} onScroll={handleOnScroll}>
        <div
          style={styles('content', {
            width: contentWidth,
            height: contentHeight,
          })}
        >
          {headerHeight !== 0 && renderHeaderCell && (
            <HeaderContainer
              height={headerHeight}
              leftPaneColumns={leftPaneColumns}
              rightPaneColumns={rightPaneColumns}
              renderHeaderCell={renderHeaderCell}
            />
          )}
          {rows.map(({ key, height, y, row, selected, focusedCell }) => (
            <RowContainer
              key={key}
              leftPaneContentWidth={leftPaneContentWidth}
              width={contentWidth}
              leftPaneColumns={bodyLeftPaneColumns}
              rightPaneColumns={bodyRightPaneColumns}
              renderCell={renderCell}
              y={y + headerHeight}
              row={row}
              height={height}
              renderRow={renderRow}
              selected={selected}
              focusedCell={focusedCell}
            />
          ))}
        </div>
      </div>
    );
  }),
);

interface HeaderContainerProps {
  height: number;
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  leftPaneColumns: Item[];
  rightPaneColumns: Item[];
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const { height, leftPaneColumns, rightPaneColumns, renderHeaderCell } = props;

  return (
    <div style={styles('header', { height })}>
      <div style={styles('leftPaneColumns')}>
        {leftPaneColumns.map((columnData) => {
          const { size: width, num: column } = columnData;

          return (
            <div key={column} style={{ width }}>
              {renderHeaderCell({ column })}
            </div>
          );
        })}
      </div>
      <div style={styles('rightPaneColumns')}>
        {rightPaneColumns.map((columnData) => {
          const { size: width, num: column } = columnData;

          return (
            <div key={column} style={{ width }}>
              {renderHeaderCell({ column })}
            </div>
          );
        })}
      </div>
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
  leftPaneColumns: RecycleItem[];
  rightPaneColumns: RecycleItem[];
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
  header: {
    zIndex: 1,
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'row',
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
