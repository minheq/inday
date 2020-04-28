import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

interface ScreenProps {
  children?: React.ReactNode;
}

export function Screen(props: ScreenProps) {
  const { children } = props;

  return <SafeAreaView style={style.root}>{children}</SafeAreaView>;
}

const style = StyleSheet.create({
  root: {
    flex: 1,
  },
});
