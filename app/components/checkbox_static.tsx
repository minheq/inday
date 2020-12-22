import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from './icon';
import { useThemeStyles } from './theme';

interface CheckboxStaticProps {
  value: boolean;
}

export const CheckboxStatic = memo(function CheckboxStatic(
  props: CheckboxStaticProps,
) {
  const { value } = props;
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.selectCheckbox,
        themeStyles.border.default,
        value && themeStyles.background.primary,
        value && themeStyles.border.primary,
      ]}
    >
      {value && <Icon name="Check" color="contrast" />}
    </View>
  );
});

const styles = StyleSheet.create({
  selectCheckbox: {
    borderRadius: 999,
    width: 24,
    height: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
