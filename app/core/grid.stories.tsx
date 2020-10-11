import React from 'react';

import { Grid, RenderCellProps } from './grid';
import { AutoSizer } from '../lib/autosizer';
import { StyleSheet, View, Text } from 'react-native';

export default {
  title: 'Grid',
  component: Grid,
};

const ROW_HEIGHT = 40;

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

export const Default = () => (
  <div
    style={{
      height: 'calc(100vh - 32px)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <AutoSizer>
      {({ height }) => (
        <Grid
          scrollViewHeight={height}
          // TODO
          // contentOffset={{ x: 400, y: 1000 }}
          rowsCount={100}
          renderCell={renderCell}
          rowHeight={ROW_HEIGHT}
          columns={[
            100,
            150,
            100,
            // 200,
            // 100,
            // 100,
            // 100,
            // 140,
            // 100,
            // 300,
            // 100,
            // 200,
            // 150,
            // 140,
            // 100,
            // 300,
            // 100,
            // 200,
            // 150,
          ]}
          frozenColumns={1}
        />
      )}
    </AutoSizer>
  </div>
);

const styles = StyleSheet.create({
  cell: {
    width: '100%',
  },
});
