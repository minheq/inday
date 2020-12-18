import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../components/theme';
import { tokens } from '../components/tokens';

interface ListViewFooterProps {
  children: React.ReactNode;
}

export function ListViewFooter(props: ListViewFooterProps): JSX.Element {
  const { children } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        theme === 'dark' ? styles.rowBackgroundDark : styles.rowBackgroundLight,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  rowBackgroundDark: {
    backgroundColor: tokens.colors.gray[900],
  },
  rowBackgroundLight: {
    backgroundColor: tokens.colors.base.white,
  },
  row: {},
});
