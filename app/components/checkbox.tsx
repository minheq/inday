import React, { memo, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { Icon } from './icon';
import { useThemeStyles } from './theme';

interface CheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const { value, onChange } = props;

  const handlePress = useCallback(() => {
    if (onChange !== undefined) {
      onChange(!value);
    }
  }, [value, onChange]);

  return (
    <Pressable onPress={handlePress}>
      <CheckboxView value={value} />
    </Pressable>
  );
}

interface CheckboxViewProps {
  value?: boolean;
}

export const CheckboxView = memo(function CheckboxView(
  props: CheckboxViewProps,
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
