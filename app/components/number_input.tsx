import React, { useCallback } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";

import { toNumber } from "../../lib/number_utils";
import { TextInput } from "../components/text_input";

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  testID?: string;
  autoFocus?: boolean;
  placeholder?: string;
  onSubmitEditing?: () => void;
  onRequestClose?: () => void;
  style?: StyleProp<TextStyle>;
}

export function NumberInput(props: NumberInputProps): JSX.Element {
  const {
    testID,
    placeholder,
    autoFocus,
    onChange,
    value,
    onRequestClose,
    onSubmitEditing,
    style,
  } = props;

  const handleChange = useCallback(
    (nextValue: string) => {
      if (nextValue === "") {
        onChange(null);
      } else {
        onChange(toNumber(nextValue));
      }
    },
    [onChange]
  );

  return (
    <TextInput
      testID={testID}
      autoFocus={autoFocus}
      onRequestClose={onRequestClose}
      onSubmitEditing={onSubmitEditing}
      placeholder={placeholder}
      onChange={handleChange}
      value={value ? value.toString() : ""}
      style={[styles.numberInput, style]}
    />
  );
}

const styles = StyleSheet.create({
  numberInput: {
    textAlign: "right",
  },
});
