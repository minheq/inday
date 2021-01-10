import React, { forwardRef, useCallback } from 'react';
import {
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleProp,
  TextStyle,
} from 'react-native';

import { useTheme, useThemeStyles } from './theme';
import { tokens } from './tokens';
import { UIKey } from '../lib/keyboard';

export interface TextInputProps {
  testID?: string;
  value?: string | null;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
  placeholder?: string;
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
      autoFocus,
      value,
      placeholder,
      onKeyPress,
      onChange,
      onRequestClose,
      onSubmitEditing,
      style,
    } = props;
    const theme = useTheme();
    const themeStyles = useThemeStyles();

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
      [onRequestClose, onKeyPress],
    );

    return (
      <RNTextInput
        ref={forwardedRef}
        testID={testID}
        value={value !== null ? value : undefined}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChangeText={onChange}
        onKeyPress={handleKeyPress}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={theme.text.muted}
        style={[tokens.text.size.md, themeStyles.text.default, style]}
      />
    );
  },
);
