import React, { useRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  Platform,
} from 'react-native';
import { isNonNullish } from '../../lib/js_utils';
import { Button } from './button';
import { IconName, Icon } from './icon';
import { DynamicStyleSheet } from './stylesheet';
import { tokens } from './tokens';

export interface TextInputProps {
  icon?: IconName;
  testID?: string;
  value?: string;
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
  const [focused, setFocused] = React.useState(false);
  const borderColor = React.useRef(new Animated.Value(0)).current;
  const ref = useRef<RNTextInput>(null);
  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleClear = React.useCallback(() => {
    if (ref.current !== null) {
      ref.current.focus();
    }

    if (isNonNullish(onChange)) {
      onChange('');
    }
  }, [onChange]);

  React.useEffect(() => {
    if (focused) {
      Animated.spring(borderColor, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.spring(borderColor, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [borderColor, focused]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          borderColor: borderColor.interpolate({
            inputRange: [0, 1],
            outputRange: [tokens.colors.gray[300], tokens.colors.gray[600]],
          }),
        },
      ]}
    >
      {icon && (
        <View style={styles.icon}>
          <Icon name={icon} color="muted" />
        </View>
      )}
      <RNTextInput
        ref={ref}
        testID={testID}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChangeText={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={onKeyPress}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={tokens.colors.gray[700]}
        style={[styles.input, tokens.text.size.md, !!icon && styles.hasIcon]}
      />
      {clearable && value !== undefined && value !== '' && (
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
    borderWidth: 1,
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
    height: 38,
    paddingLeft: 8,
    paddingRight: 40,
    borderRadius: tokens.border.radius.default,
    flex: 1,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
