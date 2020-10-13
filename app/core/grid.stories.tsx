import React from 'react';

import { Grid, RenderCellProps } from './grid';
import { AutoSizer } from '../lib/autosizer';
import { StyleSheet, View, Text } from 'react-native';

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

export const Default = () => (
  <div
    style={{
      height: 'calc(100vh - 32px)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          scrollViewWidth={width}
          scrollViewHeight={height}
          // contentOffset={{ x: 400, y: 1000 }}
          rowCount={5000}
          renderCell={renderCell}
          rowHeight={40}
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
          frozenColumnCount={1}
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
