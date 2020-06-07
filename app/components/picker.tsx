import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from './text';
import { Button } from './button';
import { Container } from './container';
import { Row } from './row';
import { Icon } from './icon';
import { Column } from './column';

export interface Option<TValue = any> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface PickerProps<TValue = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value: TValue) => void;
  display?: (value: TValue) => string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  onClear?: () => void;
}

export function Picker<TValue = any>(props: PickerProps<TValue>) {
  const {
    value,
    options,
    onChange = () => {},
    label,
    onClear,
    placeholder,
  } = props;

  const selected = value && options.find((o) => o.value === value);

  return (
    <Row>
      <Button style={styles.button}>
        <Container
          paddingVertical={8}
          paddingLeft={16}
          paddingRight={40}
          shape="rounded"
          // borderWidth={1}
          height={56}
        >
          {selected ? (
            <Column expanded justifyContent="center">
              <Text bold size="xs">
                {label}
              </Text>
              <Text>{selected.label}</Text>
            </Column>
          ) : (
            <Row expanded alignItems="center">
              <Text>{placeholder || label}</Text>
            </Row>
          )}
        </Container>
      </Button>
      {value && (
        <Button style={styles.closeButton}>
          <Icon name="x" size="lg" />
        </Button>
      )}
    </Row>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 2,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
});
