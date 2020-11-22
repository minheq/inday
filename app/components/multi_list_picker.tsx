import React, { Fragment } from 'react';
import { isNonNullish } from '../../lib/js_utils';
import { ListPickerItem, ListPickerOption } from './list_picker';

interface MultiListPickerProps<T> {
  value?: T[] | null;
  options: ListPickerOption<T>[];
  onChange?: (value: T[]) => void;
  renderItem?: (value: T) => React.ReactNode;
}

export function MultiListPicker<T>(
  props: MultiListPickerProps<T>,
): JSX.Element {
  const { value, options, onChange, renderItem } = props;

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
        <ListPickerItem
          key={o.label}
          option={o}
          selected={value ? value.some((selVal) => selVal === o.value) : false}
          onSelect={handleSelect}
          renderItem={renderItem}
        />
      ))}
    </Fragment>
  );
}
