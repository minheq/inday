import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '../../components/icon';

import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import { CheckboxField } from '../../data/fields';

interface CheckboxValueViewProps {
  value: boolean;
  field: CheckboxField;
}

export function CheckboxValueView(props: CheckboxValueViewProps): JSX.Element {
  const { value } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.checkbox, themeStyles.border.default]}>
      {value && <Icon name="CheckThick" color="success" />}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
