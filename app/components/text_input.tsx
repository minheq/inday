import React, { useCallback, useRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  StyleSheet,
} from 'react-native';
import { Button } from './button';
import { IconName, Icon } from './icon';
import { useTheme, useThemeStyles } from './theme';
import { tokens } from './tokens';

export interface TextInputProps {
  icon?: IconName;
  testID?: string;
  value?: string | null;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  clearable?: boolean;
  placeholder?: string;
}

export function TextInput(props: TextInputProps): JSX.Element {
  const {
    testID,
    autoFocus,
    icon,
    value,
    clearable,
    onChange,
    onKeyPress,
    onSubmitEditing,
    placeholder,
  } = props;
  const ref = useRef<RNTextInput>(null);
  const theme = useTheme();
  const themeStyles = useThemeStyles();

  const handleClear = useCallback(() => {
    if (ref.current !== null) {
      ref.current.focus();
    }

    if (onChange !== undefined) {
      onChange('');
    }
  }, [onChange]);

  return (
    <Animated.View style={[styles.base, themeStyles.background.content]}>
      {icon && (
        <View style={styles.icon}>
          <Icon name={icon} color="muted" />
        </View>
      )}
      <RNTextInput
        ref={ref}
        testID={testID}
        value={value !== null ? value : undefined}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChangeText={onChange}
        onKeyPress={onKeyPress}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={theme.text.muted}
        style={[
          styles.input,
          themeStyles.border.default,
          tokens.text.size.md,
          !!icon && styles.hasIcon,
        ]}
      />
      {clearable && value !== undefined && value !== null && value !== '' && (
        <Button
          onPress={handleClear}
          style={styles.clearButton}
          containerStyle={styles.clearButtonContainer}
        >
          <Icon name="X" />
        </Button>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: tokens.border.radius,
    alignItems: 'center',
  },
  icon: {
    paddingHorizontal: 8,
  },
  hasIcon: {
    paddingLeft: 0,
  },
  clearButtonContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 8,
    top: 8,
    borderRadius: tokens.border.radius,
  },
  clearButton: {
    borderRadius: tokens.border.radius,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 40,
    borderRadius: tokens.border.radius,
    flex: 1,
  },
});
