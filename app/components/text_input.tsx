import React, { useRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { Button } from './button';
import { IconName, Icon } from './icon';
import { DynamicStyleSheet } from './stylesheet';
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

  const handleClear = React.useCallback(() => {
    if (ref.current !== null) {
      ref.current.focus();
    }

    if (onChange !== undefined) {
      onChange('');
    }
  }, [onChange]);

  return (
    <Animated.View style={styles.base}>
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
        placeholderTextColor={tokens.colors.gray[700]}
        style={[styles.input, tokens.text.size.md, !!icon && styles.hasIcon]}
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

const styles = DynamicStyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: tokens.border.radius.default,
    backgroundColor: tokens.colors.base.white,
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
    borderRadius: tokens.border.radius.default,
  },
  clearButton: {
    borderRadius: tokens.border.radius.default,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
    paddingLeft: 8,
    paddingRight: 40,
    borderRadius: tokens.border.radius.default,
    flex: 1,
  },
});
