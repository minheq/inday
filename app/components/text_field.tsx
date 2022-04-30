import React, { useCallback, useRef } from "react";
import {
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import { Icon, IconName } from "./icon";
import { PressableHighlight } from "./pressable_highlight";
import { TextInput } from "./text_input";
import { theme } from "./theme";

import { tokens } from "./tokens";

export interface TextFieldProps {
  icon?: IconName;
  testID?: string;
  value?: string | null;
  autoFocus?: boolean;
  clearable?: boolean;
  onChange?: (value: string) => void;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  onRequestClose?: () => void;
  style?: StyleProp<TextStyle>;
}

/**
 * `TextField` is composed of smaller components to provide a wider variety of common features.
 * For lower-level customization, use `TextInput` instead.
 */
export function TextField(props: TextFieldProps): JSX.Element {
  const {
    icon,
    testID,
    autoFocus,
    clearable,
    value,
    placeholder,
    onKeyPress,
    onChange,
    onRequestClose,
    onSubmitEditing,
    style,
  } = props;
  const ref = useRef<RNTextInput>(null);

  const handleClear = useCallback(() => {
    if (ref.current !== null) {
      ref.current.focus();
    }

    if (onChange !== undefined) {
      onChange("");
    }
  }, [onChange]);

  return (
    <View style={styles.base}>
      {icon && (
        <View style={styles.icon}>
          <Icon name={icon} color="muted" />
        </View>
      )}
      <TextInput
        testID={testID}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onRequestClose={onRequestClose}
        onSubmitEditing={onSubmitEditing}
        style={[styles.input, !!icon && styles.hasIcon, style]}
      />
      {clearable && value !== undefined && value !== null && value !== "" && (
        <PressableHighlight onPress={handleClear} style={styles.clearButton}>
          <Icon name="X" />
        </PressableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    borderRadius: tokens.border.radius,
    alignItems: "center",
    backgroundColor: theme.base.default,
  },
  icon: {
    paddingHorizontal: 8,
  },
  hasIcon: {
    paddingLeft: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    position: "absolute",
    right: 8,
    top: 8,
    borderRadius: tokens.border.radius,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 40,
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral.light,
    flex: 1,
  },
});
