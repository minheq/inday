import React from 'react';

import {
  Grid,
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
  RenderHeaderProps,
  RenderLeafRowProps,
} from './grid';
import { AutoSizer } from '../lib/autosizer';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

export default {
  title: 'Grid',
  component: Grid,
};

function renderLeafRowCell(props: RenderLeafRowCellProps) {
  const { row, column } = props;

  return (
    <View style={styles.cell}>
      <Text>
        {row} {column}
      </Text>
    </View>
  );
}

function renderLeafRow(props: RenderLeafRowProps) {
  const { children } = props;

  return <View style={styles.row}>{children}</View>;
}

function renderHeader(props: RenderHeaderProps) {
  const { children } = props;

  return <View style={styles.header}>{children}</View>;
}

function renderHeaderCell(props: RenderHeaderCellProps) {
  const { column } = props;

  return (
    <View style={styles.row}>
      <Text>0 {column}</Text>
    </View>
  );
}

export const Default = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          width={width}
          height={height}
          contentOffset={{ x: 0, y: 0 }}
          groups={[]}
          renderLeafRowCell={renderLeafRowCell}
          headerHeight={80}
          renderHeaderCell={renderHeaderCell}
          renderHeader={renderHeader}
          leafRowHeight={40}
          renderLeafRow={renderLeafRow}
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
          fixedColumnCount={1}
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
  header: {
    width: '100%',
    height: '100%',
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
});
