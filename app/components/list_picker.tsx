import React from 'react';
import { Container } from './container';
import { ListItem } from './list_item';
import { Text } from './text';
import { Checkbox } from './checkbox';
import { Spacer } from './spacer';

type Value<
  TValue extends any,
  TMulti extends boolean = false
> = TMulti extends true ? TValue[] : TValue;

interface Option<TValue = any> {
  value: TValue;
  label: string;
}

interface ListPickerProps<TValue = any, TMulti extends boolean = false> {
  value?: Value<TValue, TMulti> | null;
  options: Option<TValue>[];
  onChange?: (value: Value<TValue, TMulti>) => void;
  label?: string;
  multi?: TMulti;
}

export function ListPicker<TValue = any, TMulti extends boolean = false>(
  props: ListPickerProps<TValue, TMulti>,
) {
  const { value, multi, options, onChange = () => {}, label } = props;

  const handleSelect = React.useCallback(
    (itemVal: TValue, selected: boolean) => {
      if (multi) {
        if (selected) {
          onChange(
            // @ts-ignore: just types
            value.filter((val) => val !== itemVal),
          );
        } else {
          if (value) {
            // @ts-ignore: just types
            onChange(value.concat(itemVal));
          } else {
            // @ts-ignore: just types
            onChange([itemVal]);
          }
        }
      } else {
        // @ts-ignore: just types
        onChange(itemVal);
      }
    },
    [value, multi, onChange],
  );

  return (
    <Container>
      <Container paddingHorizontal={16}>
        <Text bold size="xs">
          {label}
        </Text>
      </Container>
      {options.map((o) => {
        const selected = value
          ? multi
            ? //
              // @ts-ignore: just types
              value.some((selVal) => selVal === o.value)
            : value === o.value
          : false;

        return (
          <>
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
          </>
        );
      })}
    </Container>
  );
}
