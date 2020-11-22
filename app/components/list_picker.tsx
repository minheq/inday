import React, { useCallback } from 'react';
import { Checkbox } from './checkbox';
import { Spacer } from './spacer';
import { isNonNullish } from '../../lib/js_utils';
import { DynamicStyleSheet } from './stylesheet';
import { Pressable, View } from 'react-native';
import { Text } from './text';

export interface ListPickerOption<T> {
  value: T;
  label: string;
}

interface ListPickerProps<T> {
  value?: T | null;
  options: ListPickerOption<T>[];
  onChange?: (value: T) => void;
  renderItem?: (value: T) => React.ReactNode;
}

export function ListPicker<T>(props: ListPickerProps<T>): JSX.Element {
  const { value, options, onChange, renderItem } = props;

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
        <ListPickerItem
          key={o.label}
          option={o}
          onSelect={handleSelect}
          selected={o.value === value}
          renderItem={renderItem}
        />
      ))}
    </View>
  );
}

interface ListPickerItemProps<T> {
  selected: boolean;
  option: ListPickerOption<T>;
  onSelect: (value: T, selected: boolean) => void;
  renderItem?: (value: T) => React.ReactNode;
}

export function ListPickerItem<T>(props: ListPickerItemProps<T>) {
  const { selected, option, onSelect, renderItem } = props;

  const handlePress = useCallback(() => {
    onSelect(option.value, selected);
  }, [onSelect, selected]);

  return (
    <Pressable style={styles.listItem} onPress={handlePress}>
      {renderItem ? (
        renderItem(option.value)
      ) : (
        <View style={styles.defaultListItem}>
          <Text>{option.label}</Text>
          <Checkbox value={selected} onChange={handlePress} />
        </View>
      )}
      <Spacer size={4} />
    </Pressable>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {},
  listItem: {},
  defaultListItem: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
