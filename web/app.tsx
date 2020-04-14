import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

import FastList from '../components/fast_list';

const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 40;
const SECTION_HEIGHT = 40;
const SECTION_FOOTER_HEIGHT = 40;
const ROW_HEIGHT = 40;

export function App() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FastList
          renderHeader={Header}
          renderFooter={Footer}
          renderSection={Section}
          renderRow={Row}
          renderSectionFooter={SectionFooter}
          headerHeight={HEADER_HEIGHT}
          footerHeight={FOOTER_HEIGHT}
          sectionHeight={SECTION_HEIGHT}
          sectionFooterHeight={SECTION_FOOTER_HEIGHT}
          rowHeight={ROW_HEIGHT}
          sections={[100, 100, 100]}
          insetTop={0}
          insetBottom={0}
          contentInset={{}}
        />
      </SafeAreaView>
    </View>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Text>Header</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text>Footer</Text>
    </View>
  );
}

function Section() {
  return (
    <View style={styles.section}>
      <Text>Section</Text>
    </View>
  );
}

function SectionFooter() {
  return (
    <View style={styles.sectionFooter}>
      <Text>SectionFooter</Text>
    </View>
  );
}

function Row() {
  return (
    <View style={styles.row}>
      <Text>Row</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    height: HEADER_HEIGHT,
  },
  footer: {
    backgroundColor: 'red',
    height: FOOTER_HEIGHT,
  },
  section: {
    backgroundColor: 'green',
    height: SECTION_HEIGHT,
  },
  row: {
    backgroundColor: 'yellow',
    height: ROW_HEIGHT,
  },
  sectionFooter: {
    backgroundColor: 'teal',
    height: SECTION_FOOTER_HEIGHT,
  },
});
