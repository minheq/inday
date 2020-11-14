import React, { Fragment } from 'react';
import { ListItem } from './list_item';
import { Checkbox } from './checkbox';
import { Spacer } from './spacer';
import { isNonNullish } from '../../lib/js_utils';

interface Option<T> {
  value: T;
  label: string;
}

interface ListPickerProps<T> {
  value?: T[] | null;
  options: Option<T>[];
  onChange?: (value: T[]) => void;
}

export function ListPicker<T>(props: ListPickerProps<T>): JSX.Element {
  const { value, options, onChange } = props;

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
      {options.map((o) => {
        const selected = value
          ? value.some((selVal) => selVal === o.value)
          : false;

        return (
          <Fragment>
            <ListItem
              description={o.label}
              onPress={() => handleSelect(o.value, selected)}
              actions={
                <Checkbox
                  value={selected}
                  onChange={() => handleSelect(o.value, selected)}
                />
              }
            />
            <Spacer size={4} />
          </Fragment>
        );
      })}
    </Fragment>
  );
}
