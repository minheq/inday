import React, { Fragment, useCallback } from 'react';
import { Pressable } from 'react-native';

import { Spacer } from './spacer';
import { Row } from './row';
import { Text } from './text';
import { isNonNullish } from '../../lib/js_utils';
import { DynamicStyleSheet } from './stylesheet';
import { tokens } from './tokens';

interface Option<T> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  options?: Option<T>[];
}

export function SegmentedControl<T>(
  props: SegmentedControlProps<T>,
): JSX.Element {
  const { value, onChange, options = [] } = props;

  return (
    <Row>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Fragment key={option.label}>
            <SegmentedControlButton
              selected={selected}
              option={option}
              onPress={onChange}
            />
            <Spacer size={4} />
          </Fragment>
        );
      })}
    </Row>
  );
}

interface SegmentedControlButtonProps<T> {
  selected: boolean;
  option: Option<T>;
  onPress?: (value: T) => void;
}

function SegmentedControlButton<T>(props: SegmentedControlButtonProps<T>) {
  const { selected, option, onPress } = props;

  const handlePress = useCallback(() => {
    if (isNonNullish(onPress)) {
      onPress(option.value);
    }
  }, [option, onPress]);

  return (
    <Pressable
      key={option.label}
      style={[styles.control, selected && styles.selected]}
      onPress={handlePress}
    >
      <Text>{option.label}</Text>
    </Pressable>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  control: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
  selected: {
    backgroundColor: theme.background.tint,
  },
}));
