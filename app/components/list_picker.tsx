import React, { useCallback } from 'react';
import { View } from 'react-native';

import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { Button } from './button';
import { tokens } from './tokens';

import { isNonNullish } from '../../lib/js_utils';
import { Icon } from './icon';

export interface ListPickerOption<T> {
  value: T;
  label: string;
}

interface ListPickerProps<T> {
  value?: T | null;
  options: ListPickerOption<T>[];
  onChange?: (value: T) => void;
  renderLabel?: (value: T, selected: boolean) => React.ReactNode;
}

export function ListPicker<T>(props: ListPickerProps<T>): JSX.Element {
  const { value, options, onChange, renderLabel } = props;

  const handleSelect = React.useCallback(
    (newVal: T) => {
      if (isNonNullish(onChange)) {
        onChange(newVal);
      }
    },
    [onChange],
  );

  return (
    <View style={styles.base}>
      {options.map((o) => (
        <View style={styles.listItemWrapper}>
          <ListPickerItem
            key={o.label}
            option={o}
            onSelect={handleSelect}
            selected={o.value === value}
            renderLabel={renderLabel}
          />
        </View>
      ))}
    </View>
  );
}

export interface ListPickerItemProps<T> {
  selected: boolean;
  option: ListPickerOption<T>;
  onSelect: (value: T) => void;
  renderLabel?: (value: T, selected: boolean) => React.ReactNode;
}

export function ListPickerItem<T>(props: ListPickerItemProps<T>) {
  const { selected, option, onSelect, renderLabel } = props;

  const handlePress = useCallback(() => {
    onSelect(option.value);
  }, [onSelect]);

  return (
    <Button style={styles.listItem} onPress={handlePress}>
      {renderLabel ? (
        renderLabel(option.value, selected)
      ) : (
        <Text>{option.label}</Text>
      )}
      {selected && <Icon name="CheckThick" color="primary" />}
    </Button>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {},
  listItemWrapper: {
    paddingBottom: 4,
  },
  listItem: {
    height: 40,
    borderRadius: tokens.radius,
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
