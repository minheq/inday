import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '../../components/icon';

import { Row } from '../../components/row';
import { Text } from '../../components/text';

import { useThemeStyles } from '../../components/theme';
import { FieldID } from '../../data/fields';
import { useGetField } from '../../data/store';
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
  fieldID: FieldID;
  primary: boolean;
}

export const HeaderCell = memo(function HeaderCell(
  props: HeaderCellProps,
): JSX.Element {
  const { fieldID, primary } = props;
  const field = useGetField(fieldID);
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

export const LastHeaderCell = memo(function LastHeaderCell(): JSX.Element {
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.headerCell, themeStyles.border.default]}>
      <Text>Add field</Text>
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
