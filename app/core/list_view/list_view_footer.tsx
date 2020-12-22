import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemeStyles } from '../../components/theme';

interface ListViewFooterProps {
  children: React.ReactNode;
}

export function ListViewFooter(props: ListViewFooterProps): JSX.Element {
  const { children } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.row, themeStyles.background.content]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  row: {},
});
