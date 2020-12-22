import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemeStyles } from '../../components/theme';

interface FooterProps {
  children: React.ReactNode;
}

export function Footer(props: FooterProps): JSX.Element {
  const { children } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.row, themeStyles.background.content]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  row: {},
});
