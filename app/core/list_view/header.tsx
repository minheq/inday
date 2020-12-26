import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '../../components/icon';

import { Row } from '../../components/row';
import { Spacer } from '../../components/spacer';
import { Text } from '../../components/text';

import { useThemeStyles } from '../../components/theme';
import { Field } from '../../data/fields';
import { getFieldIcon } from '../views/icon_helpers';

interface HeaderProps {
  children: React.ReactNode;
}

export function Header(props: HeaderProps): JSX.Element {
  const { children } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.row, themeStyles.background.content]}>{children}</View>
  );
}

interface HeaderCellProps {
  field: Field;
  primary: boolean;
}

export const HeaderCell = memo(function HeaderCell(
  props: HeaderCellProps,
): JSX.Element {
  const { field, primary } = props;
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.headerCell,
        themeStyles.border.default,
        primary && styles.primaryCell,
      ]}
    >
      <Row spacing={4}>
        <Icon name={getFieldIcon(field.type)} />
        <Text weight="bold">{field.name}</Text>
      </Row>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {},

  headerCell: {
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  primaryCell: {
    borderRightWidth: 2,
  },
});
