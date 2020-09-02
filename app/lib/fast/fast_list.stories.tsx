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

function renderHeader() {
  return (
    <Container color="primary" width="100%" height={ROW_HEIGHT}>
      <Text>Header</Text>
    </Container>
  );
}

function renderFooter() {
  return (
    <Container color="primary" width="100%" height={ROW_HEIGHT}>
      <Text>Footer</Text>
    </Container>
  );
}

function renderSectionFooter() {
  return (
    <Container color="primary" width="100%" height={ROW_HEIGHT}>
      <Text>Section Footer</Text>
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
        renderHeader={renderHeader}
        renderFooter={renderFooter}
        renderSectionFooter={renderSectionFooter}
        rowHeight={ROW_HEIGHT}
        headerHeight={ROW_HEIGHT}
        footerHeight={ROW_HEIGHT}
        sectionFooterHeight={ROW_HEIGHT}
        sectionHeight={ROW_HEIGHT}
      />
    </Container>
  </div>
);
