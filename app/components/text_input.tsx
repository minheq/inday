import React, { forwardRef, useCallback } from "react";
import {
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleProp,
  TextStyle,
  StyleSheet,
} from "react-native";

import { tokens } from "./tokens";
import { UIKey } from "../lib/keyboard";
import { theme } from "./theme";

export interface TextInputProps {
  value?: string | null;
  onChange?: (value: string) => void;
  testID?: string;
  autoFocus?: boolean;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => void;
  placeholder?: string;
  numberOfLines?: number;
  onSubmitEditing?: () => void;
  onRequestClose?: () => void;
  style?: StyleProp<TextStyle>;
}

/**
 * `TextInput` is low-level component for keyboard input.
 */
export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  function TextInput(props, forwardedRef): JSX.Element {
    const {
      testID,
      numberOfLines,
      autoFocus,
      value,
      placeholder,
      onKeyPress,
      onChange,
      onRequestClose,
      onSubmitEditing,
      style,
    } = props;

    const handleKeyPress = useCallback(
      (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = event.nativeEvent.key;

        if (onKeyPress) {
          onKeyPress(event);
        }

        if (onRequestClose && key === UIKey.Escape) {
          onRequestClose();
        }
      },
      [onRequestClose, onKeyPress]
    );

    const height =
      numberOfLines && numberOfLines > 1 ? numberOfLines * 18 : undefined;

    return (
      <RNTextInput
        multiline={numberOfLines ? numberOfLines > 1 : false}
        ref={forwardedRef}
        testID={testID}
        value={value || ""}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChangeText={onChange}
        onKeyPress={handleKeyPress}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={theme.neutral[100]}
        style={[{ height }, styles.input, style]}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    ...tokens.text.size.md,
    color: theme.neutral[700],
  },
});
