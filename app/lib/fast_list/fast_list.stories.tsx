import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { FastList } from './fast_list';

export default {
  title: 'FastList',
  component: FastList,
};

const ROW_HEIGHT = 40;

function renderRow(section: number, row: number) {
  return (
    <View>
      <Text>
        {section} {row}
      </Text>
    </View>
  );
}

function renderSection(section: number) {
  return (
    <View>
      <Text>{section}</Text>
    </View>
  );
}

function renderHeader() {
  return (
    <View>
      <Text>Header</Text>
    </View>
  );
}

function renderFooter() {
  return (
    <View>
      <Text>Footer</Text>
    </View>
  );
}

function renderSectionFooter() {
  return (
    <View>
      <Text>Section Footer</Text>
    </View>
  );
}

export const Default = () => (
  <div style={{ height: '100vh' }}>
    <View style={{ height: '100%', width: '100%' }}>
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
    </View>
  </div>
);

const styles = StyleSheet.create({
  row: {
    width: '100%',
  },
});
