import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ContainerProvider } from './container';

interface ColumnProps {
  children?: React.ReactNode;
  justifyContent?: 'flex-start' | 'flex-end' | 'space-between' | 'center';
  alignItems?: 'flex-start' | 'flex-end' | 'center';
  expanded?: boolean;
}

/**
 * Displays its children in a vertical array.
 */
export function Column(props: ColumnProps) {
  const { children, justifyContent, alignItems, expanded } = props;

  return (
    <ContainerProvider direction="column">
      <View
        style={[
          styles.root,
          expanded && styles.expanded,
          {
            justifyContent,
            alignItems,
          },
        ]}
      >
        {children}
      </View>
    </ContainerProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  expanded: {
    width: '100%',
    height: '100%',
  },
});
