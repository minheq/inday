import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from './text';
import { Button } from './button';
import { Spacer } from './spacer';
import { Row } from './row';
import { Container } from './container';

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
              <Container height={40} center>
                <Text>{option.label}</Text>
              </Container>
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
    flex: 1,
  },
});
