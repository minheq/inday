import React, { Fragment, useCallback } from 'react';
import { View } from 'react-native';
import { isNonNullish } from '../../lib/js_utils';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { ListPickerItemProps, ListPickerOption } from './list_picker';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { tokens } from './tokens';

interface MultiListPickerProps<T> {
  value?: T[] | null;
  options: ListPickerOption<T>[];
  onChange?: (value: T[]) => void;
  renderLabel?: (value: T, selected: boolean) => React.ReactNode;
}

export function MultiListPicker<T>(
  props: MultiListPickerProps<T>,
): JSX.Element {
  const { value, options, onChange, renderLabel } = props;

  const handleSelect = React.useCallback(
    (newVal: T, selected: boolean) => {
      if (isNonNullish(onChange)) {
        if (selected) {
          if (isNonNullish(value)) {
            onChange(value.filter((val) => val !== newVal));
          }
        } else {
          if (value) {
            onChange(value.concat(newVal));
          } else {
            onChange([newVal]);
          }
        }
      }
    },
    [value, onChange],
  );

  return (
    <Fragment>
      {options.map((o) => (
        <View style={styles.listItemWrapper}>
          <MultiListPickerItem
            key={o.label}
            option={o}
            selected={
              value ? value.some((selVal) => selVal === o.value) : false
            }
            onSelect={handleSelect}
            renderLabel={renderLabel}
          />
        </View>
      ))}
    </Fragment>
  );
}

export interface MultiListPickerItemProps<T> {
  selected: boolean;
  option: ListPickerOption<T>;
  onSelect: (value: T, selected: boolean) => void;
  renderLabel?: (value: T, selected: boolean) => React.ReactNode;
}

export function MultiListPickerItem<T>(props: MultiListPickerItemProps<T>) {
  const { selected, option, onSelect, renderLabel } = props;

  const handlePress = useCallback(() => {
    onSelect(option.value, selected);
  }, [onSelect, selected]);

  return (
    <Button style={styles.listItem} onPress={handlePress}>
      <View style={styles.checkboxWrapper}>
        <Checkbox value={selected} onChange={handlePress} />
      </View>
      {renderLabel ? (
        renderLabel(option.value, selected)
      ) : (
        <Text>{option.label}</Text>
      )}
    </Button>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {},
  listItemWrapper: {
    paddingBottom: 4,
  },
  checkboxWrapper: {
    paddingRight: 8,
  },
  listItem: {
    height: 40,
    borderRadius: tokens.radius,
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
}));
