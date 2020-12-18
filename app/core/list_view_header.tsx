import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '../components/icon';

import { Row } from '../components/row';
import { Spacer } from '../components/spacer';
import { Text } from '../components/text';

import { useTheme } from '../components/theme';
import { tokens } from '../components/tokens';
import { Field } from '../data/fields';
import { getFieldIcon } from './icon_helpers';

interface ListViewHeaderProps {
  children: React.ReactNode;
}

export function ListViewHeader(props: ListViewHeaderProps): JSX.Element {
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

interface ListViewHeaderCellProps {
  field: Field;
  primary: boolean;
}

export const ListViewHeaderCell = memo(function ListViewHeaderCell(
  props: ListViewHeaderCellProps,
): JSX.Element {
  const { field, primary } = props;

  return (
    <View style={[styles.headerCell, primary && styles.primaryCell]}>
      <Row>
        <Icon name={getFieldIcon(field.type)} />
        <Spacer size={4} />
        <Text weight="bold">{field.name}</Text>
      </Row>
    </View>
  );
});

const styles = StyleSheet.create({
  rowBackgroundDark: {
    backgroundColor: tokens.colors.gray[900],
  },
  rowBackgroundLight: {
    backgroundColor: tokens.colors.base.white,
  },
  row: {},

  headerCell: {
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderColor: tokens.colors.gray[300],
    borderBottomWidth: 1,
  },
  primaryCell: {
    borderRightWidth: 2,
  },
});
