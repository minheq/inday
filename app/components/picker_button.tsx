import React from 'react';
import { Container } from './container';
import { Button } from './button';
import { Column } from './column';
import { Text } from './text';
import { StyleSheet } from 'react-native';
import { Icon } from './icon';

interface PickerButtonProps {
  onPress?: () => void;
  onClear?: () => void;
  label?: string;
  description?: string;
  placeholder?: string;
  open?: boolean;
  clearable?: boolean;
  disabled?: boolean;
}

export function PickerButton(props: PickerButtonProps) {
  const {
    open,
    clearable,
    onClear,
    description,
    placeholder,
    label,
    onPress,
  } = props;

  return (
    <Container>
      <Button onPress={onPress} style={styles.button}>
        <Container
          paddingVertical={8}
          paddingLeft={16}
          paddingRight={40}
          shape="rounded"
          height={56}
        >
          <Column expanded justifyContent="center">
            <Text bold size="xs">
              {label}
            </Text>
            <Text
              color={description ? (open ? 'primary' : 'default') : 'muted'}
            >
              {description || placeholder}
            </Text>
          </Column>
        </Container>
      </Button>
      {clearable && (
        <Button onPress={onClear} style={styles.clearButton}>
          <Icon name="x" size="lg" />
        </Button>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
