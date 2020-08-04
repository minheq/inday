import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from './text';
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
          <>
            <Button
              key={option.label}
              state={selected ? 'active' : 'default'}
              style={styles.control}
              onPress={() => onChange(option.value)}
            >
              <Text>{option.label}</Text>
            </Button>
            <Spacer size={4} />
          </>
        );
      })}
    </Row>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 40,
  },
});
