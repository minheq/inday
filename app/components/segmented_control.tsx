import React, { Fragment, useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Spacer } from "./spacer";
import { Row } from "./row";
import { Text } from "./text";
import { tokens } from "./tokens";
import { theme } from "./theme";

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
  props: SegmentedControlProps<T>
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
    if (onPress !== undefined) {
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

const styles = StyleSheet.create({
  control: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.border.radius,
  },
  selected: {
    backgroundColor: theme.primary.light,
  },
});
