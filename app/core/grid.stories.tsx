import React from 'react';

import {
  Grid,
  RenderCellProps,
  RenderHeaderCellProps,
  RenderRowProps,
} from './grid';
import { AutoSizer } from '../lib/autosizer';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

export default {
  title: 'Grid',
  component: Grid,
};

function renderCell(props: RenderCellProps) {
  const { row, column } = props;

  return (
    <View style={styles.cell}>
      <Text>
        {row} {column}
      </Text>
    </View>
  );
}

function renderRow(props: RenderRowProps) {
  const { children } = props;

  return <View style={styles.cell}>{children}</View>;
}

function renderHeaderCell(props: RenderHeaderCellProps) {
  const { column } = props;

  return (
    <View style={styles.row}>
      <Text>{column}</Text>
    </View>
  );
}

export const Default = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          scrollViewWidth={width}
          scrollViewHeight={height}
          contentOffset={{ x: 0, y: 0 }}
          rowCount={5000}
          renderCell={renderCell}
          headerHeight={90}
          renderHeaderCell={renderHeaderCell}
          rowHeight={80}
          renderRow={renderRow}
          columns={[
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
          ]}
          fixedColumnCount={2}
        />
      )}
    </AutoSizer>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    height: '100%',
  },
  row: {
    width: '100%',
    height: '100%',
  },
});
