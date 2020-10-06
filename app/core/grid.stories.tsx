import React from 'react';

import { Grid } from './grid';
import { Container, Text } from '../components';
import { AutoSizer } from '../lib/autosizer';

export default {
  title: 'Grid',
  component: Grid,
};

const ROW_HEIGHT = 40;

function renderCell(row: number, column: number) {
  return (
    <Container width="100%" height={ROW_HEIGHT}>
      <Text>
        {row} {column}
      </Text>
    </Container>
  );
}

export const Default = () => (
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <AutoSizer>
      {({ height }) => (
        <Grid
          scrollViewHeight={height}
          rowsCount={500}
          renderCell={renderCell}
          rowHeight={ROW_HEIGHT}
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
          frozenColumns={1}
        />
      )}
    </AutoSizer>
  </div>
);
