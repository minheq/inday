import React from 'react';

import { FastGrid } from './fast_grid';
import { Container, Text } from '../components';

export default {
  title: 'FastGrid',
  component: FastGrid,
};

const ROW_HEIGHT = 40;

function renderRow(section: number, row: number, column: number) {
  return (
    <Container width="100%" height={ROW_HEIGHT}>
      <Text>
        {section} {row} {column}
      </Text>
    </Container>
  );
}

export const Default = () => (
  <div style={{ height: '100vh' }}>
    <Container expanded>
      <FastGrid
        sections={[100, 100, 100, 100, 100]}
        renderCell={renderRow}
        rowHeight={ROW_HEIGHT}
        sectionHeight={ROW_HEIGHT}
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
        ]}
        frozenColumns={1}
      />
    </Container>
  </div>
);
