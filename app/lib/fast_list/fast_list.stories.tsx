import React from 'react';

import { FastList } from './fast_list';
import { Container, Text } from '../../components';

export default {
  title: 'FastList',
  component: FastList,
};

const ROW_HEIGHT = 40;

function renderRow(section: number, row: number) {
  return (
    <Container width="100%" height={ROW_HEIGHT}>
      <Text>
        {section} {row}
      </Text>
    </Container>
  );
}

function renderSection(section: number) {
  return (
    <Container color="primary" width="100%" height={ROW_HEIGHT}>
      <Text>{section}</Text>
    </Container>
  );
}

export const Default = () => (
  <div style={{ height: '100vh' }}>
    <Container expanded>
      <FastList
        sections={[100, 100, 100, 100, 100]}
        renderRow={renderRow}
        renderSection={renderSection}
        rowHeight={ROW_HEIGHT}
        sectionHeight={ROW_HEIGHT}
      />
    </Container>
  </div>
);
