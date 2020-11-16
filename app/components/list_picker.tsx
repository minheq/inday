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
  value?: T | null;
  options: Option<T>[];
  onChange?: (value: T) => void;
}

export function ListPicker<T>(props: ListPickerProps<T>): JSX.Element {
  const { value, options, onChange } = props;

  const handleSelect = React.useCallback(
    (newVal: T) => {
      if (isNonNullish(onChange)) {
        onChange(newVal);
      }
    },
    [onChange],
  );

  return (
    <Fragment>
      {options.map((o) => {
        const selected = value === o.value;

        return (
          <Fragment key={o.label}>
            <ListItem
              description={o.label}
              onPress={() => handleSelect(o.value)}
              actions={
                <Checkbox
                  value={selected}
                  onChange={() => handleSelect(o.value)}
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
