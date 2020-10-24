import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from './button';
import { Spacer } from './spacer';
import { Row } from './row';

interface Option<TValue = any> {
  label: string;
  value: TValue;
}

interface SegmentedControlProps<TValue = any> {
  value?: TValue;
  onChange?: (value: TValue) => void;
  options?: Option<TValue>[];
}

export function SegmentedControl<TValue = any>(
  props: SegmentedControlProps<TValue>,
) {
  const { value, onChange = () => {}, options = [] } = props;

  return (
    <Row>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Fragment key={option.label}>
            <Button
              key={option.label}
              state={selected ? 'active' : 'default'}
              style={styles.control}
              onPress={() => onChange(option.value)}
              title={option.label}
            />
            <Spacer size={4} />
          </Fragment>
        );
      })}
    </Row>
  );
}

const styles = StyleSheet.create({
  control: {
    flex: 1,
  },
});
