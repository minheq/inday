import React from 'react';
import { View, StyleSheet } from 'react-native';

interface RowProps {
  children?: React.ReactNode;
  justifyContent?: 'flex-start' | 'flex-end' | 'space-between' | 'center';
  alignItems?: 'flex-start' | 'flex-end' | 'center';
  expanded?: boolean;
}

/**
 * Displays its children in a vertical array.
 */
export function Row(props: RowProps) {
  const { children, justifyContent, alignItems, expanded } = props;

  return (
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
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  expanded: {
    width: '100%',
    height: '100%',
  },
});
