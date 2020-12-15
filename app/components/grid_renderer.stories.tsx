import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';

import {
  GridRenderer,
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
  RenderGroupRowCellProps,
  GridRendererRef,
  RenderFooterCellProps,
} from './grid_renderer';
import { AutoSizer } from '../lib/autosizer';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { FlatButton } from './flat_button';
import { Picker } from './picker';
import { GridGroup, getRows, LeafRow } from './grid_renderer.common';
import { splitLast } from '../../lib/array_utils';
import { Container } from './container';
import { tokens } from './tokens';

function renderLeafRowCell(props: RenderLeafRowCellProps) {
  const { row, column } = props;

  return (
    <View style={styles.leafRowCell}>
      <Text>
        {row} {column}
      </Text>
    </View>
  );
}

function renderGroupRowCell(props: RenderGroupRowCellProps) {
  const { column } = props;

  return (
    <View style={styles.groupRowCell}>
      <Text>{column}</Text>
    </View>
  );
}

function renderHeaderCell(props: RenderHeaderCellProps) {
  const { column } = props;

  return (
    <View style={styles.headerCell}>
      <Text>0 {column}</Text>
    </View>
  );
}

function renderFooterCell(props: RenderFooterCellProps) {
  const { column } = props;

  return (
    <View style={styles.footerCell}>
      <Text>{column}</Text>
    </View>
  );
}

function Flat(): JSX.Element {
  const gridRef = useRef<GridRendererRef>(null);

  const handleScrollToCell = useScrollToCell(gridRef);

  const groups: GridGroup[] = [
    {
      type: 'leaf',
      collapsed: false,
      rowCount: 100,
    },
  ];

  const columns = [
    100,
    150,
    100,
    200,
    100,
    100,
    100,
    140,
    100,
    300,
    100,
    200,
    150,
    140,
    100,
    300,
    100,
    200,
    150,
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <AutoSizer>
        {({ height, width }) => (
          <Fragment>
            <GridRenderer
              ref={gridRef}
              width={width}
              height={height}
              contentOffset={{ x: 0, y: 0 }}
              groups={groups}
              renderLeafRowCell={renderLeafRowCell}
              headerHeight={80}
              renderHeaderCell={renderHeaderCell}
              leafRowHeight={40}
              renderFooterCell={renderFooterCell}
              footerHeight={40}
              columns={columns}
              fixedColumnCount={1}
            />
            <ScrollToCell
              onScrollToCell={handleScrollToCell}
              groups={groups}
              columns={columns}
            />
          </Fragment>
        )}
      </AutoSizer>
    </SafeAreaView>
  );
}

function Grouped(): JSX.Element {
  const gridRef = useRef<GridRendererRef>(null);

  const handleScrollToCell = useScrollToCell(gridRef);

  const groups: GridGroup[] = [
    {
      type: 'ancestor',
      collapsed: false,
      children: [
        {
          type: 'leaf',
          collapsed: false,
          rowCount: 50,
        },
      ],
    },
    {
      type: 'ancestor',
      collapsed: false,
      children: [
        {
          type: 'leaf',
          collapsed: false,
          rowCount: 25,
        },
        {
          type: 'leaf',
          collapsed: false,
          rowCount: 25,
        },
      ],
    },
  ];

  const columns = [
    100,
    150,
    100,
    200,
    100,
    100,
    100,
    140,
    100,
    300,
    100,
    200,
    150,
    140,
    100,
    300,
    100,
    200,
    150,
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <AutoSizer>
        {({ height, width }) => (
          <Fragment>
            <GridRenderer
              ref={gridRef}
              width={width}
              height={height}
              contentOffset={{ x: 0, y: 0 }}
              groups={groups}
              renderLeafRowCell={renderLeafRowCell}
              headerHeight={80}
              renderHeaderCell={renderHeaderCell}
              leafRowHeight={40}
              renderGroupRowCell={renderGroupRowCell}
              groupRowHeight={56}
              renderFooterCell={renderFooterCell}
              footerHeight={40}
              spacerHeight={80}
              columns={columns}
              fixedColumnCount={1}
            />
            <ScrollToCell
              onScrollToCell={handleScrollToCell}
              groups={groups}
              columns={columns}
            />
          </Fragment>
        )}
      </AutoSizer>
    </SafeAreaView>
  );
}

export function GridStories(): JSX.Element {
  return (
    <Container>
      <Grouped />
    </Container>
  );
}

function useScrollToCell(gridRef: React.RefObject<GridRendererRef>) {
  return useCallback(
    (path?: number[], row?: number, column?: number) => {
      if (gridRef.current) {
        gridRef.current.scrollToCell({
          path,
          row,
          column,
        });
      }
    },
    [gridRef],
  );
}

interface ScrollToCellProps {
  groups: GridGroup[];
  columns: number[];
  onScrollToCell: (path?: number[], row?: number, column?: number) => void;
}

function ScrollToCell(props: ScrollToCellProps) {
  const { groups, columns, onScrollToCell } = props;
  const [leafRow, setLeafRow] = useState<{ path: number[]; row: number }>();
  const [column, setColumn] = useState<number>();

  const rowOptions = useMemo(() => {
    return (getRows(groups, 0, 0, 0, [], 0).filter(
      (r) => r.type === 'leaf',
    ) as LeafRow[]).map((row) => ({
      value: [...row.path, row.row].join(','),
      label: `Row (${row.path.join(',')} - ${row.row})`,
    }));
  }, [groups]);

  const handlePress = useCallback(() => {
    onScrollToCell(leafRow?.path, leafRow?.row, column);
  }, [onScrollToCell, leafRow?.path, leafRow?.row, column]);

  return (
    <View style={styles.scrollToCell}>
      <Picker<string>
        value={leafRow ? [...leafRow.path, leafRow.row].join(',') : undefined}
        options={rowOptions}
        onChange={(p1) => {
          const [path, row] = splitLast(p1.split(',').map((p2) => Number(p2)));

          setLeafRow({ path, row });
        }}
      />
      <Picker
        value={column}
        options={columns.map((_columnWidth, index) => ({
          value: index + 1,
          label: `Column ${index + 1}`,
        }))}
        onChange={setColumn}
      />
      <FlatButton onPress={handlePress} title="Scroll" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  leafRowCell: {
    width: '100%',
    height: '100%',
  },
  groupRowCell: {
    width: '100%',
    height: '100%',
    backgroundColor: tokens.colors.red[50],
  },
  headerCell: {
    width: '100%',
    height: '100%',
    borderBottomWidth: 1,
    backgroundColor: tokens.colors.green[50],
  },
  footerCell: {
    width: '100%',
    height: '100%',
    backgroundColor: tokens.colors.blue[50],
  },
  scrollToCell: {
    backgroundColor: tokens.colors.base.white,
    borderRadius: 8,
    width: 200,
    position: 'absolute',
    bottom: 64,
    right: 16,
  },
});
