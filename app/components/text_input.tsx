import React from 'react';
import { StyleSheet, TextInput as RNTextInput } from 'react-native';
import { useTheme, tokens } from './theme';

export interface TextInputProps {
  testID?: string;
  value?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextInput(props: TextInputProps) {
  const {
    testID,
    autoFocus,
    value,
    onBlur,
    onFocus,
    onChange = () => {},
    placeholder,
  } = props;
  const theme = useTheme();

  return (
    <RNTextInput
      testID={testID}
      value={value}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChangeText={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholderTextColor={theme.text.color.muted}
      style={[
        styles.input,
        tokens.text.size.md,
        // @ts-ignore
        webStyle,
      ]}
    />
  );
}

const webStyle = {
  outline: 'none',
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: tokens.radius,
    alignItems: 'center',
    borderWidth: 2,
  },
  input: {
    height: 38,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: tokens.radius,
    flex: 1,
  },
});
